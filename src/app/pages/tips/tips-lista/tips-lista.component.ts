import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TipEcologico } from 'src/app/models/consejos';
import {  TipsService } from 'src/app/services/tips.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tips-lista',
  standalone:false,
  templateUrl: './tips-lista.component.html',
  styleUrl: './tips-lista.component.css'
})
export class TipsListaComponent {

  private tipsService = inject(TipsService);
  title = 'Consejos';

  // 🎯 ASIGNACIÓN EN ESPEJO EXISTA: Mapeados directo a los Observables del servicio
  public tips$: Observable<TipEcologico[]> = this.tipsService.tips$;
  public isLoading$: Observable<boolean> = this.tipsService.isLoading$;

  public tipSeleccionado: TipEcologico | null = null;
  public modalAbierto: boolean = false;

  info_dashboard = `
  <p>En esta sección :</p>
          <ul>
            <li><strong>Administrar Tips Ambientales:</strong> Supervisa el listado completo de consejos de reciclaje y píldoras ecológicas distribuidas a los usuarios de Mercadona / UCC.</li>
  <li><strong>Crear Nuevas Recomendaciones:</strong> Haz clic en el botón verde "+ Añadir Tip" superior para redactar e incorporar una nueva píldora informativa al sistema.</li>
  <li><strong>Visualizar Contenido del Tip:</strong> Revisa el título llamativo y la descripción introductoria con emojis que se mostrará en los dispositivos de los participantes.</li>
  <li><strong>Monitorear el Estado del Tip:</strong> Comprueba si el consejo se encuentra <span style="color:#28a745; font-weight:bold;">● Activo</span> y visible en la app móvil, o si está pausado de manera temporal.</li>
  <li><strong>Editar Píldoras Existentes:</strong> Presiona el ícono del lápiz azul en la columna de acciones para corregir el texto, cambiar los emojis o actualizar la información del consejo.</li>
  <li><strong>Eliminar Consejos obsoletos:</strong> Utiliza el ícono del bote de basura rojo para remover permanentemente una píldora ecológica que ya no sea relevante para la campaña.</li>
          </ul>`;

  ngOnInit(): void {
    // 🚀 CRÍTICO: Ejecutamos y abrimos la tubería HTTP suscribiéndonos en el arranque
    this.tipsService.obtenerTips().subscribe({
      error: (err) => console.error('❌ Error al conectar el listado con Express:', err)
    });
  }

  onDeleteProject(tip: TipEcologico) {
    this.tipSeleccionado = tip;

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
        this.tipsService.deleteTipEcologico(tip._id).subscribe((resp: any) => {
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
    this.tipSeleccionado = null; 
    this.modalAbierto = true;
  }

  abrirModalEditar(tip: TipEcologico) {
    this.tipSeleccionado = tip; 
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.tipSeleccionado = null;
  }

}
