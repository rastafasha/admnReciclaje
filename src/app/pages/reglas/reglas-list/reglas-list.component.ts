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

  info_dashboard = `
  <p>En esta sección :</p>
          <ul>
            <li><strong>Consultar Días Requeridos:</strong> Verifica el número mínimo de días de participación consecutiva u objetivos que los usuarios deben cumplir para calificar al sorteo (ej. 21 días).</li>
  <li><strong>Revisar Premio de 1° Lugar:</strong> Consulta la descripción del premio mayor asignado al primer puesto del tablero o sorteo dinámico (ej. Patinete eléctrico Eco-Tech).</li>
  <li><strong>Revisar Premio de 2° Lugar:</strong> Supervisa el detalle del incentivo correspondiente al segundo lugar de la competencia (ej. Set premium de reciclaje inteligente).</li>
  <li><strong>Revisar Premio de 3° Lugar:</strong> Administra el beneficio o recompensa establecida para el tercer lugar del período (ej. Tarjeta de regalo ecológica).</li>
  <li><strong>Editar Reglas y Premios:</strong> Haz clic en el ícono del lápiz azul en la columna de acciones para modificar los días requeridos o actualizar las descripciones de los premios vigentes.</li>
  <li><strong>Eliminar Configuración:</strong> Utiliza el ícono del bote de basura rojo para dar de baja o remover una regla de premiación del sistema cuando sea necesario.</li>
          </ul>`;

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
