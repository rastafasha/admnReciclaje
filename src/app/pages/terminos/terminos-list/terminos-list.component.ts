import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Terminos } from 'src/app/models/terminos';
import { TerminosService } from 'src/app/services/terminos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-terminos-list',
  standalone:false,
  templateUrl: './terminos-list.component.html',
  styleUrl: './terminos-list.component.css'
})
export class TerminosListComponent {
  title = 'Términos y Condiciones';
private terminosService = inject(TerminosService);

  // 🎯 ASIGNACIÓN EN ESPEJO: Conectamos los hilos reactivos del servicio
  public terminos$: Observable<any> = this.terminosService.terminos$; 
  public isLoading$: Observable<boolean> = this.terminosService.isLoading$;

  public terminosSeleccionados: any = null;
  public modalAbierto: boolean = false;

  ngOnInit(): void {
    this.cargarTerminosDesdeAtlas();
  }

  cargarTerminosDesdeAtlas() {
    // 🚀 Llama al GET de Express para rehidratar la vista
    this.terminosService.obtenerTerminos().subscribe({
      error: (err) => console.error('❌ Error al conectar acuerdos legales con Express:', err)
    });
  }

  abrirModalEditar(terminos: any) {
    this.terminosSeleccionados = terminos;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.terminosSeleccionados = null;
    this.cargarTerminosDesdeAtlas(); // Refrescamos los datos en pantalla al cerrar
  }
}
