import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Retador } from 'src/app/models/retador';

@Component({
  selector: 'app-retador-detalle',
  standalone:false,
  templateUrl: './retador-detalle.component.html',
  styleUrl: './retador-detalle.component.css'
})
export class RetadorDetalleComponent {

  // Recibe la información del retador seleccionado desde el padre
  @Input() retador!: Retador | null;

  // Notifica al padre cuando el modal se ha cerrado para limpiar el estado
  @Output() onClose = new EventEmitter<void>();

  constructor() { }

  /**
   * Helper para validar la clasificación del retador actual dentro del modal
   */
  get esClasificado(): boolean {
    return (this.retador?.profile?.puntos_actuales ?? 0) >= 55;
  }

  /**
   * Ejecuta el cierre seguro notificando al componente padre
   */
  cerrarModal(): void {
    this.onClose.emit();
  }

}
