import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificacionService } from '../../services/notificacion.service';
import { NotificacionCampana } from 'src/app/models/notificacion';

@Component({
  selector: 'app-notificaciones',
  standalone: false,
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.css'
})
export class NotificacionesComponent implements OnInit {

  title = 'Historial de Notificaciones';

  historialAlertas: NotificacionCampana[] = [];
  alertaSeleccionada: any | null = null; // 🟢 Tipado flexible para capturar campos de reciclaje embebidos
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private notiService: NotificacionService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0,0);
    this.cargarHistorialCompleto();
  }

  cargarHistorialCompleto(): void {
    this.isLoading = true;
    this.notiService.obtenerHistorialCompleto().subscribe({
      next: (res) => {
          this.historialAlertas = res || [];
          this.isLoading = false;

          this.route.queryParams.subscribe(params => {
            if (params['id']) {
              const encontrada = this.historialAlertas.find(a => a._id === params['id']);
              if (encontrada) this.seleccionarAlerta(encontrada);
            }
          });
        },
        error: (err) => {
          console.error('Error cargando el historial masivo:', err);
          this.isLoading = false;
        }
    });
  }

  seleccionarAlerta(alerta: NotificacionCampana): void {
    this.alertaSeleccionada = alerta;

    if (!alerta.leido && alerta._id) {
      this.notiService.marcarComoLeida(alerta._id).subscribe({
        next: () => {
          alerta.leido = true;
        },
        error: (err) => console.error('Error al actualizar estado en el servidor:', err)
      });
    }
  }

  /**
   * 🚀 ACCIÓN ADAPTADA: Salta directo al módulo de gamificación con el participante pre-seleccionado
   */
  irAlRequerimiento(): void {
    // 🟢 CORRECCIÓN: Apunta a referenciaId (el ID del usuario/material del modelo Notificacion)
    if (this.alertaSeleccionada && this.alertaSeleccionada.referenciaId) {
      this.router.navigate(['/gamificacion/participantes'], { 
        queryParams: { retadorId: this.alertaSeleccionada.referenciaId } 
      });
    } else if (this.alertaSeleccionada && this.alertaSeleccionada.usuario) {
      // Si no hay referenciaId pero sí usuario, saltamos directo a su ficha
      this.router.navigate(['/gamificacion/participantes'], { 
        queryParams: { retadorId: this.alertaSeleccionada.usuario } 
      });
    }
  }
}