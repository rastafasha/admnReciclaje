import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipEcologico } from 'src/app/models/consejos';
import { TipsService } from 'src/app/services/tips.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;
@Component({
  selector: 'app-tips-edit',
  standalone:false,
  templateUrl: './tips-edit.component.html',
  styleUrl: './tips-edit.component.css'
})
export class TipsEditComponent {

  // / 📥 Entradas y Salidas clonadas de tu patrón de Proyectos
  @Input() tipSeleccionado;
  @Output() refreshTipList: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  tipForm!: FormGroup;
  title: string = 'Creando Consejo';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tipsService: TipsService
  ) {}

  ngOnInit(): void {
    this.validarFormulario();
  }

  /**
   * 🕵️‍♂️ REHIDRATACIÓN DINÁMICA: Ahora patchValue funcionará sobre seguro
   */
  ngOnChanges(changes: SimpleChanges): void {
  if (!this.tipForm) {
    this.validarFormulario();
  }

  if (changes['tipSeleccionado'] && changes['tipSeleccionado'].currentValue) {
    const tip = changes['tipSeleccionado'].currentValue;
    this.title = 'Editando Consejo';
    this.tipSeleccionado = tip;


    // 🎯 SOLUCIÓN ASÍNCRONA: Esperamos un ciclo del DOM para inyectar el valor de forma segura
    setTimeout(() => {
      this.tipForm.patchValue({
        id: tip._id,
        titulo: tip.titulo || '',
        descripcion: tip.descripcion || '',
        activo: tip.activo !== undefined ? tip.activo : true
      });
    }, 50); // 50 milisegundos son suficientes para ganarle a la animación de Bootstrap

  } else {
    this.title = 'Creando Consejo';
  }
}

  /**
   * 📋 DECLARACIÓN DE CONTROLES REACTIVOS
   */
  validarFormulario() {
    this.tipForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      activo: [true],
      id: ['']
    });
  }

  /**
   * 💾 ACCIONADOR DE PERSISTENCIA: Almacena o edita en Atlas
   */
  handleSubmit() {
    if (!this.tipForm.valid) {
      this.tipForm.markAllAsTouched(); // Activa las validaciones visuales en rojo
      return;
    }

    this.isLoading = true;
    const dataToSend = { ...this.tipForm.value };

    if (this.tipSeleccionado && this.tipSeleccionado._id) {
      // ✏️ ACCIÓN ACTUALIZAR (PUT)
      this.tipsService.updateTipEcologico(dataToSend).subscribe({
        next: (resp) => {
          this.isLoading = false;
          Swal.fire('Actualizado', 'La píldora ambiental fue actualizada con éxito en Atlas.', 'success')
            .then(() => this.onClose());
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire('Error', 'No se pudo actualizar el consejo.', 'error');
        }
      });
    } else {
      // ➕ ACCIÓN CREAR (POST)
      this.tipsService.createTipEcologico(dataToSend).subscribe({
        next: (resp) => {
          this.isLoading = false;
          Swal.fire('¡Creado!', 'El tip ecológico ha sido publicado con éxito y se notificó a la PWA.', 'success')
            .then(() => this.onClose());
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire('Error', 'No se pudo guardar el registro.', 'error');
        }
      });
    }
  }

  /**
   * 🧼 LIMPIEZA TOTAL Y DESMONTADO: Copia exacta de tu función onClose de Klyntic
   */
  onClose() {
    this.tipSeleccionado = null;
    this.tipForm.reset();
    this.title = 'Creando Consejo';
    
    // Devolvemos el formulario a sus estados booleanos base
    this.tipForm.patchValue({
      titulo: null,
      descripcion: null,
      activo: true,
      id: null
    });

    // Ocultamos el modal de Bootstrap programáticamente usando el ID de tu vista de consejos
    const modalElement = document.getElementById('editTipModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }

    // Emitimos los eventos de sincronización hacia el componente padre
    this.refreshTipList.emit();
    this.closeModal.emit();
    this.ngOnInit();
  }

  /**
   * 🎛️ CAPTURA ASÍNCRONA PARA EL INTERRUPTOR DESLIZANTE
   */
  alternarEstadoActivo(event: any) {
    this.tipForm.patchValue({
      activo: event.target.checked
    });
  }

}
