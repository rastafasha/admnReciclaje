import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/cliente';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { GamificacionService } from 'src/app/services/gamificacion.service';

declare var bootstrap: any;

@Component({
    selector: 'app-dashboard-admin',
    templateUrl: './dashboard-admin.component.html',
    styleUrls: ['./dashboard-admin.component.css'],
    standalone: false
})
export class DashboardAdminComponent implements OnInit {
  @Input() clientes: Cliente[] = [];

  title = 'Panel Administrativo Ecológico';
  public user: any;
  public profile: User;
  displaycomponent: string = 'none';
  limit = 3;

  error: string;
  uid: string;
  loadingMetricas: boolean = true;

  // 📊 Objeto unificado conectado a tu backend de MongoDB Atlas
  public stats: any = {
  totalParticipantes: 0,
  totalHabitosCompletados: 0,
  puntosTotalesGlobales: 0,
  puntosActualesGlobales: 0,
  clasificadosSorteo: 0,
  distribucionSorteo: { clasificados: 0, pendientes: 0 }, // 📊 Para el Doughnut
  evolucionMensualHabitos: []                             // 📈 Para el Line Chart
};

public comunicadoActivo: any = null;

  constructor(
    private authService: AuthService,
    private participantesService: GamificacionService // 👈 Declarado en constructor
  ) {
    this.user = this.authService.getLocalStorage();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.authService.closeMenu();
    this.uid = this.user.uid;
    
    // Disparamos la carga asíncrona global del módulo Eco-Tech
    this.cargarMetricasEco();
  }

  /**
   * Captura en caliente los totales del concurso de reciclaje
   */
  cargarMetricasEco(): void {
    this.loadingMetricas = true;
    this.participantesService.obtenerMetricasDashboard().subscribe({
      next: (data) => {
        this.stats = data;
        this.loadingMetricas = false;
        console.log('📈 Métricas ecológicas sincronizadas con éxito:', data);
      },
      error: (err) => {
        console.error('❌ Error cargando contadores en dashboard:', err);
        this.loadingMetricas = false;
      }
    });
  }

  /**
 * Prepara el cascarón limpio del formulario antes de abrir la vista
 */
abrirModalAviso(): void {
  this.comunicadoActivo = null;
  console.log('📣 [CARTELERA]: Desplegando modal por inicializador lógico.');

  // Forzar levantamiento manual por JS si falla el data-bs-target
  const modalElement = document.getElementById('notificacionesModal');
  if (modalElement) {
    const modalInstance = new bootstrap.Modal(modalElement, {
      keyboard: true,
      backdrop: true
    });
    modalInstance.show();
  }
}

/**
 * Limpia el estado de selección al cerrar la ventana
 */
cerrarModalAviso(): void {
  this.comunicadoActivo = null;
  console.log('🧹 [CARTELERA]: Forzando limpieza absoluta de backdrops.');

  // Ejecutamos una limpieza profunda en el DOM
  setTimeout(() => {
    // 1. Remover TODOS los backdrops grises que existan en la pantalla
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());

    // 2. Desbloquear el scroll del body quitando las clases de Bootstrap
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // 3. Remover estilos sueltos que a veces inyecta Bootstrap 5
    const modalOpenElements = document.querySelectorAll('.modal-open');
    modalOpenElements.forEach(el => el.classList.remove('modal-open'));
  }, 150); // 150ms asegura que la animación de Angular haya terminado
}
/**
 * Callback automático para refrescar tus contadores globales si el aviso alteró estadísticas
 */
onComunicadoDespachado(): void {
  this.cargarMetricasEco(); // Recarga tus tarjetas en vivo para ver reflejado el cambio
}
  
}
