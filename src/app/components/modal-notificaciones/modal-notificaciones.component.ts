import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComunicadoService } from '../../services/comunicado.service';
import { Comunicado } from '../../models/comunicado';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-notificaciones',
  standalone: false,
  templateUrl: './modal-notificaciones.component.html',
  styleUrl: './modal-notificaciones.component.css'
})
export class ModalNotificacionesComponent implements OnChanges {

  @Input() notificacionSeleccionado: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() comunicadoCreado = new EventEmitter<void>();

  option_selectedd: number = 1;
  historial: Comunicado[] = [];
  totalComunicados: number = 0;

  private fb = inject(FormBuilder);
  private comunicadoService = inject(ComunicadoService);

  // 🟢 Formulario adaptado estéticamente a la gamificación ambiental
  notificacionForm: FormGroup = this.fb.group({
    titulo: ['', [Validators.required]],
    mensaje: ['', [Validators.required]],
    tipo_eco: ['AVISO_GENERAL', [Validators.required]], // Mapea directo a los nuevos tipos
    notificado_push: [false]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notificacionSeleccionado'] && this.notificacionSeleccionado) {
      this.notificacionForm.patchValue(this.notificacionSeleccionado);
    } else {
      this.notificacionForm.reset({ tipo_eco: 'AVISO_GENERAL', notificado_push: false });
    }
    this.actualizarHistorial();
  }

  /**
   * 🚀 PUBLICAR Y NOTIFICAR EN CALIENTE DESDE EL PANEL DE CONTROL
   */
  guardar() {
    if (this.notificacionForm.invalid) return;

    Swal.fire({
      title: 'Publicando comunicado ambiental...',
      didOpen: () => { Swal.showLoading(); }
    });

    const formValues = this.notificacionForm.value;

    // 🟢 TRANSFORMACIÓN COMPATIBLE: Moldeamos el objeto para cumplir estrictamente
    // con el esquema del backend sin alterar tus enums base de la base de datos
    const payload: Comunicado = {
      titulo: formValues.titulo,
      mensaje: formValues.mensaje,
      tipo: formValues.tipo_eco, // Viaja limpio ('SORTEO', 'URGENTE', etc.)
      notificado_push: formValues.notificado_push
    };
    this.comunicadoService.crearComunicado(payload).subscribe({
      next: (resp) => {
        Swal.fire({
          icon: 'success',
          title: '¡Publicado con Éxito!',
          text: formValues.notificado_push
            ? 'El comunicado se guardó en Atlas y los smartphones recibieron el globo push.'
            : 'El aviso ha sido fijado con éxito en la cartelera digital de los participantes.',
          timer: 2500,
          showConfirmButton: false
        });

        this.notificacionForm.reset({ tipo_eco: 'AVISO_GENERAL', notificado_push: false });
        this.comunicadoCreado.emit();
        this.cerrar();
      },
      error: (err) => {
        console.error('❌ Error enviando el comunicado:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al enviar',
          text: 'No se pudo despachar el aviso. Revisa las cabeceras del servidor.'
        });
      }
    });
  }

  cerrar() {
    this.closeModal.emit();
    this.notificacionForm.reset({ tipo_eco: 'AVISO_GENERAL', notificado_push: false });
    this.option_selectedd = 1;

    // 1. Gatillo de cierre nativo de Bootstrap
    document.getElementById('btnCloseModal')?.click();

    // 2. 🧹 LIMPIEZA DEL BACKEND VISUAL (Remueve el fondo gris colgado)
    setTimeout(() => {
      // Buscamos el backdrop intruso que deja Bootstrap en el body
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove(); // Lo eliminamos por completo del DOM
      }

      // Le devolvemos el scroll normal a la página quitando la clase de Bootstrap
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, 100); // 100ms da tiempo perfecto a que termine la animación de desvanecimiento
  }

  actualizarHistorial() {
    this.comunicadoService.obtenerMisComunicados(1).subscribe((resp: any) => {
      this.historial = resp.comunicados || resp || [];
      this.totalComunicados = resp.total || this.historial.length;
    });
  }

  optionSelected(value: number) {
    this.option_selectedd = value;
    if (this.option_selectedd === 3) {
      this.actualizarHistorial();
    }
  }

  eliminarComunicado(item: Comunicado) {
    if (!item._id) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: "El comunicado se borrará permanentemente de las apps móviles.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ecc71',
      cancelButtonColor: '#e74c3c',
      confirmButtonText: '¡Sí, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.comunicadoService.deleteComunicado(item._id).subscribe(() => {
          this.actualizarHistorial();
          Swal.fire('¡Eliminado!', 'El registro fue removido de la base de datos.', 'success');
        });
      }
    });
  }
}