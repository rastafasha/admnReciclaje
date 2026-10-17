import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { TerminosService } from 'src/app/services/terminos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-terminos-edit',
  standalone:false,
  templateUrl: './terminos-edit.component.html',
  styleUrl: './terminos-edit.component.css'
})
export class TerminosEditComponent {
  @Input() terminosDatos: any = null; // Recibe el objeto único global de Atlas
  @Output() refreshTerminos: EventEmitter<void> = new EventEmitter<void>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  terminosForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private terminosService: TerminosService
  ) {}

  ngOnInit(): void {
    this.validarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.terminosForm) {
      this.validarFormulario();
    }

    if (changes['terminosDatos'] && changes['terminosDatos'].currentValue) {
      const terminos = changes['terminosDatos'].currentValue;
      
      setTimeout(() => {
        this.terminosForm.patchValue({
          id: terminos._id,
          tituloGlobal: terminos.tituloGlobal,
          introduccion: terminos.introduccion,
          version: terminos.version
        });

        // Rehidratamos el FormArray de secciones limpiando las anteriores
        this.secciones.clear();
        if (terminos.secciones && terminos.secciones.length > 0) {
          terminos.secciones.forEach((sec: any) => {
            this.secciones.push(this.crearSeccionFormGroup(sec._id, sec.subtitulo, sec.contenido));
          });
        }
      }, 50);
    }
  }

  validarFormulario() {
    this.terminosForm = this.fb.group({
      id: [''],
      tituloGlobal: ['', [Validators.required, Validators.minLength(5)]],
      introduccion: ['', [Validators.required, Validators.minLength(10)]],
      version: ['', [Validators.required]],
      secciones: this.fb.array([]) // 👈 Nuestro contenedor dinámico de sub-bloques
    });
  }

  // Helper para obtener el FormArray de forma limpia en el HTML
  get secciones(): FormArray {
    return this.terminosForm.get('secciones') as FormArray;
  }

  // Generador de bloques dinámicos para el arreglo
  crearSeccionFormGroup(id: string = '', subtitulo: string = '', contenido: string = ''): FormGroup {
    return this.fb.group({
      _id: [id],
      subtitulo: [subtitulo, [Validators.required, Validators.minLength(5)]],
      contenido: [contenido, [Validators.required, Validators.minLength(10)]]
    });
  }

  // Permite al Administrador añadir una nueva cláusula legal en caliente
  agregarSeccion() {
    this.secciones.push(this.crearSeccionFormGroup());
  }

  // Permite remover una cláusula si ya no aplica en las políticas
  removerSeccion(index: number) {
    this.secciones.removeAt(index);
  }

  handleSubmit() {
    if (!this.terminosForm.valid) {
      this.terminosForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const dataToSend = { ...this.terminosForm.value };

    // Disparamos la actualización al documento único usando tu servicio
    this.terminosService.updateTermino(dataToSend).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire('¡Actualizado!', 'Los estatutos legales y políticas de la PWA se actualizaron con éxito.', 'success')
          .then(() => this.onClose());
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error', 'No se pudieron inyectar las modificaciones legales.', 'error');
      }
    });
  }

  onClose() {
    this.terminosForm.reset();
    this.refreshTerminos.emit();
    this.closeModal.emit();
  }

}
