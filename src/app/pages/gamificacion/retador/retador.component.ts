import { Component, Input } from '@angular/core';
import { Retador } from 'src/app/models/retador';
import { User } from 'src/app/models/user';
import { BusquedasService } from 'src/app/services/busqueda.service';
import { GamificacionService } from 'src/app/services/gamificacion.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;
@Component({
  selector: 'app-retador',
  standalone:false,
  templateUrl: './retador.component.html',
  styleUrl: './retador.component.css'
})
export class RetadorComponent {
  @Input() displaycomponent: string = 'block';
  @Input() userprofile!: User;

  title: string = 'Tabla de Liderazgo - Retadores';
  retadores: Retador[] = [];
  query: string = '';
  p: number = 1;
  count: number = 6;
  loading: boolean = false;
  
  // Guardará el retador seleccionado para enviarlo al componente hijo modal
  selectedRetador!: Retador | null; 
  usuario: any;

  public ejecutandoSorteo: boolean = false;
public ganadoresSorteo: any = null; // Guardará el objeto de respuesta { sorteoId, ganadores, etc }
public pushNotificado: boolean = false;

  constructor(
    private participantesService: GamificacionService,
    private busquedasService: BusquedasService,
  ) {
    let USER = localStorage.getItem('user');
    this.usuario = JSON.parse(USER ? USER : '');
  }

  ngOnInit(): void {
    this.getRetadores();
  }

  /**
   * Carga inicial de los participantes de gamificación
   */
  getRetadores() {
    this.loading = true;
    this.participantesService.obtenerTablaLiderazgo().subscribe({
      next: (data) => {
        this.retadores = data;
        this.loading = false;
        console.log(`Se cargaron ${data.length} retadores en la tabla de liderazgo.`);
      },
      error: (err) => {
        console.error('Error al conectar con la API de gamificación', err);
        this.loading = false;
      }
    });
  }

  /**
   * Abre el modal del hijo inyectándole el retador seleccionado en caliente
   */
  onViewRetador(retador: Retador) {
    this.selectedRetador = retador;

    setTimeout(() => {
      // Usamos el identificador del modal que estará en tu componente hijo
      const modalElement = document.getElementById('viewRetadorModal');
      if (modalElement) {
        const modalInstance = new bootstrap.Modal(modalElement, {
          keyboard: true,
          backdrop: true
        });
        modalInstance.show();
        console.log('🚀 [MODAL GAMIFICACIÓN]: Desplegado con éxito para:', retador.username);
      } else {
        console.error('❌ Error: No se encontró el ID "viewRetadorModal" en el HTML.');
      }
    }, 100);
  }

  /**
   * Helper visual para validar los puntos físicos en la tabla de la interna
   */
  esClasificado(retador: Retador): boolean {
    return (retador.profile?.puntos_actuales ?? 0) >= 55;
  }

  onCloseModal(): void {
    this.selectedRetador = null;
  }

  search(): void {
  // CASO 1: Si el administrador borra el texto de la barra de búsqueda
  if (!this.query || this.query.trim() === '') {
    this.loading = true;
    
    // Restauramos el ranking original ordenado por puntaje de mayor a menor
    this.participantesService.obtenerTablaLiderazgo().subscribe({
      next: (data) => {
        this.retadores = data; 
        this.loading = false;
        console.log('🔄 [BUSCADOR]: Barra limpia. Ranking de liderazgo restaurado.');
      },
      error: (err) => {
        console.error('❌ Error al restaurar liderazgo:', err);
        this.loading = false;
      }
    });
    return;
  }

  // CASO 2: Sí hay un término escrito en el input de texto
  this.loading = true;

  // 🟢 CONEXIÓN DIRECTA: Apunta a tu método unificado 'buscar' pasándole el tipo 'participantes'
  this.busquedasService.buscar('participantes', this.query.trim()).subscribe({
    next: (resultados: Retador[]) => {
      // Tu .pipe(map) ya transformó la respuesta directamente en el arreglo limpio
      this.retadores = resultados || [];
      this.loading = false;
      console.log(`🔍 [BUSCADOR]: Se filtraron ${this.retadores.length} retadores con el término: "${this.query}"`);
    },
    error: (err) => {
      console.error('❌ Error en la petición analítica de búsqueda:', err);
      this.loading = false;
    }
  });
}


  PageSize() {
    this.query = '';
    this.ngOnInit();

  }

  /**
 * 🎲 Ejecuta la lógica matemática de la ruleta de Coggle (1 de cada 5)
 */
lanzarSorteo() {
  Swal.fire({
    title: '¿Deseas iniciar el sorteo?',
    text: "El sistema barajará de forma aleatoria pura a los participantes clasificados.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2ecc71',
    cancelButtonColor: '#858796',
    confirmButtonText: '¡Sí, girar ruleta!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.ejecutandoSorteo = true;
      this.ganadoresSorteo = null;
      this.pushNotificado = false;

      this.participantesService.ejecutarSorteoProporcional().subscribe({
        next: (resp) => {
          if (resp.ok) {
            this.ganadoresSorteo = resp.data;
            this.ejecutandoSorteo = false;
            
            Swal.fire({
              icon: 'success',
              title: '¡Sorteo Completado! 🏆',
              text: `Se han seleccionado ${resp.data.cantidadGanadores} ganadores de ${resp.data.totalElegibles} elegibles.`,
              timer: 3000,
              showConfirmButton: false
            });
          }
        },
        error: (err) => {
          console.error(err);
          this.ejecutandoSorteo = false;
          Swal.fire('Error', err.error?.msg || 'No se pudo procesar el sorteo. Verifica que existan usuarios clasificados (≥ 55 pts).', 'error');
        }
      });
    }
  });
}

/**
 * 🎁 Botón CTA para notificar exclusivamente a los ganadores mediante WebPush
 */
notificarGanadoresPush() {
  if (!this.ganadoresSorteo?.sorteoId) return;

  Swal.fire({
    title: 'Enviando alertas...',
    didOpen: () => { Swal.showLoading(); }
  });

  this.participantesService.notificarGanadores(this.ganadoresSorteo.sorteoId).subscribe({
    next: (resp) => {
      if (resp.ok) {
        this.pushNotificado = true;
        Swal.fire('¡Notificados! ⚡', 'Los banners push flotantes han sido enviados a las pantallas de los ganadores.', 'success');
      }
    },
    error: (err) => {
      console.error(err);
      Swal.fire('Error de despacho', 'No se pudieron enviar las notificaciones push.', 'error');
    }
  });
}

  

}
