import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Regla } from 'src/app/models/regla';
import { ReglasService } from 'src/app/services/reglas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reglas-list',
  standalone: false,
  templateUrl: './reglas-list.component.html',
  styleUrl: './reglas-list.component.css'
})
export class ReglasListComponent {
  title = 'Reglas';
  private reglaService = inject(ReglasService);

  // 🎯 ASIGNACIÓN EN ESPEJO EXISTA: Mapeados directo a los Observables del servicio
  public reglas$: Observable<Regla[]> = this.reglaService.regla$;
  public isLoading$: Observable<boolean> = this.reglaService.isLoading$;

  public reglaSeleccionado: Regla | null = null;
  public modalAbierto: boolean = false;

  ngOnInit(): void {
    // 🚀 CRÍTICO: Ejecutamos y abrimos la tubería HTTP suscribiéndonos en el arranque
    this.reglaService.obtenerReglas().subscribe({
      error: (err) => console.error('❌ Error al conectar el listado con Express:', err)
    });
  }

  onDeleteProject(regla: Regla) {
    this.reglaSeleccionado = regla;

    Swal.fire({
      title: 'Estas Seguro?',
      text: "No podras recuperarlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reglaService.deleteRegla(regla._id).subscribe((resp: any) => {
          this.ngOnInit();
        })
        Swal.fire(
          'Borrado!',
          'El Archivo fue borrado.',
          'success'
        )
        this.ngOnInit();
      }
    });

  }

  abrirModalCrear() {
    this.reglaSeleccionado = null;
    this.modalAbierto = true;
  }

  abrirModalEditar(regla: Regla) {
    this.reglaSeleccionado = regla;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.reglaSeleccionado = null;
  }

}
