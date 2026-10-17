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
