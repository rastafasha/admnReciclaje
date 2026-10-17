import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Regla } from 'src/app/models/regla';
import { ReglasService } from 'src/app/services/reglas.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-regla-edit',
  standalone:false,
  templateUrl: './regla-edit.component.html',
  styleUrl: './regla-edit.component.css'
})
export class ReglaEditComponent {
  // 📥 Entradas y Salidas adaptadas de tu patrón de Tips
  @Input() reglaSeleccionada: Regla | null = null;
  @Output() refreshReglaList: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  reglaForm!: FormGroup;
  title: string = 'Creando Regla';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private reglasService: ReglasService
  ) {}

  ngOnInit(): void {
    this.validarFormulario();
  }

  /**
   * 🕵️‍♂️ REHIDRATACIÓN DINÁMICA: Adaptada con tu parche asíncrono para las Reglas
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.reglaForm) {
      this.validarFormulario();
    }

    if (changes['reglaSeleccionada'] && changes['reglaSeleccionada'].currentValue) {
      const regla = changes['reglaSeleccionada'].currentValue;
      this.title = 'Editando Regla';
      this.reglaSeleccionada = regla;

      // 🎯 SOLUCIÓN ASÍNCRONA: Sincroniza el patchValue con los campos del concurso
      setTimeout(() => {
        this.reglaForm.patchValue({
          id: regla._id,
          diasRequeridos: regla.diasRequeridos || '',
          primerLugar: regla.primerLugar || '',
          segundoLugar: regla.segundoLugar || '',
          tercerLugar: regla.tercerLugar || ''
        });
      }, 50);

    } else {
      this.title = 'Creando Regla';
    }
  }

  /**
   * 📋 DECLARACIÓN DE CONTROLES REACTIVOS PARA CONCURSOS
   */
  validarFormulario() {
    this.reglaForm = this.fb.group({
      id: [''],
      diasRequeridos: ['', [Validators.required, Validators.min(1)]],
      primerLugar: ['', [Validators.required, Validators.minLength(10)]],
      segundoLugar: ['', [Validators.required, Validators.minLength(10)]],
      tercerLugar: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  /**
   * 💾 ACCIONADOR DE PERSISTENCIA: Guarda o edita en Atlas por ID
   */
  handleSubmit() {
    if (!this.reglaForm.valid) {
      this.reglaForm.markAllAsTouched(); // Enciende alertas visuales rojas
      return;
    }

    this.isLoading = true;
    const dataToSend = { ...this.reglaForm.value };

    if (this.reglaSeleccionada && this.reglaSeleccionada._id) {
      // ✏️ ACCIÓN ACTUALIZAR (PUT)
      this.reglasService.updateRegla(dataToSend).subscribe({
        next: (resp) => {
          this.isLoading = false;
          Swal.fire('Actualizado', 'La configuración del concurso fue actualizada en Atlas con éxito.', 'success')
            .then(() => this.onClose());
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire('Error', 'No se pudieron actualizar las reglas.', 'error');
        }
      });
    } else {
      // ➕ ACCIÓN CREAR (POST)
      this.reglasService.createRegla(dataToSend).subscribe({
        next: (resp) => {
          this.isLoading = false;
          Swal.fire('¡Creado!', 'La nueva regla del concurso ha sido publicada con éxito.', 'success')
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
   * 🧼 LIMPIEZA TOTAL Y DESMONTADO: Réplica exacta de tu cierre de Klyntic
   */
  onClose() {
    this.reglaSeleccionada = null;
    this.reglaForm.reset();
    this.title = 'Creando Regla';
    
    // Reseteamos el formulario a estados limpios base
    this.reglaForm.patchValue({
      id: null,
      diasRequeridos: null,
      primerLugar: null,
      segundoLugar: null,
      tercerLugar: null
    });

    // Oculta el modal dinámico usando el ID asignado a tu vista de reglas
    const modalElement = document.getElementById('editReglaModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }

    // Emitimos los eventos espejo hacia el componente padre
    this.refreshReglaList.emit();
    this.closeModal.emit();
    this.ngOnInit();
  }

}
