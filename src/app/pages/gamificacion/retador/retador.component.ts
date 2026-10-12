import { Component, Input } from '@angular/core';
import { Retador } from 'src/app/models/retador';
import { User } from 'src/app/models/user';
import { GamificacionService } from 'src/app/services/gamificacion.service';
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

  constructor(private participantesService: GamificacionService) {
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

  search() {
    // CASO 1: No hay término de búsqueda escrito en el input
    // if (!this.query || this.query.trim() === '') {



    //   // NUEVO Subcaso B: Seleccionó Tipo de Clínica Y Estado al mismo tiempo
    //   // (Asegúrate de que tu servicio 'searchByCollection' acepte un 4to parámetro para tipoClinica)
    //   if (this.selectedEstado && this.selectedtipoClinica) {
    //     this.loading = true;
    //     return this.busquedasService.searchByCollection('clientes', '', this.selectedEstado, this.selectedtipoClinica)
    //       .subscribe((resp: any) => {
    //         this.clientes = resp.resultados || [];
    //         this.clienteService.emitFilteredClientes(this.clientes);
    //         this.loading = false;
    //       });
    //   }

    //   // Subcaso C: SÓLO hay tipo de clínica
    //   else if (this.selectedtipoClinica) {
    //     // OJO: Si el 3er parámetro es el estado, envía null/vacío antes de la clínica
    //     this.loading = true;
    //     return this.busquedasService.searchByCollection('clientes', '', null, this.selectedtipoClinica)
    //       .subscribe((resp: any) => {
    //         this.clientes = resp.resultados || [];
    //         this.clienteService.emitFilteredClientes(this.clientes);
    //         this.loading = false;
    //       });
    //   }

    //   // Subcaso D: SÓLO hay un estado seleccionado
    //   else if (this.selectedEstado) {
    //     this.loading = true;
    //     return this.busquedasService.searchByCollection('clientes', '', this.selectedEstado)
    //       .subscribe((resp: any) => {
    //         this.clientes = resp.resultados || [];
    //         this.clienteService.emitFilteredClientes(this.clientes);
    //         this.loading = false;
    //       });
    //   }

    //   // Subcaso E: Sin filtros seleccionados
    //   else {
    //     this.ngOnInit();
    //     return;
    //   }
    // }

    // // CASO 2: Sí hay un término de búsqueda en el input de texto
    // else {
    //   this.loading = true; // Buena práctica activar el loading aquí también

    //   // CORRECCIÓN: Pasamos this.query, luego el estado (si existe) y por último el tipo de clínica
    //   return this.busquedasService.searchGlobal(this.query, this.selectedEstado, this.selectedtipoClinica)
    //     .subscribe((resp: any) => {
    //       // Ajusta 'resp.resultados' o 'resp.projects' según lo que devuelva tu backend en searchGlobal
    //       let filteredProjects = resp.resultados || resp.clientes || [];

    //       // Si además tenías el filtro de categoría (selectedType) en el frontend:
    //       if (this.selectedType) {
    //         filteredProjects = filteredProjects.filter(
    //           (project: any) => project.category?.nombre === this.selectedType
    //         );
    //       }

    //       this.clientes = filteredProjects;
    //       this.clienteService.emitFilteredClientes(filteredProjects);
    //       this.loading = false;
    //     }, (error) => {
    //       this.loading = false;
    //       console.error(error);
    //     });
    // }

  }







  PageSize() {
    this.query = '';
    this.ngOnInit();

  }

  

}
