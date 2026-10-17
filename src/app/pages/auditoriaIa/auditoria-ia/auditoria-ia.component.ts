import { Component, inject, signal } from '@angular/core';
import { MaterialesService } from 'src/app/services/materiales.service';

@Component({
  selector: 'app-auditoria-ia',
  standalone:false,
  templateUrl: './auditoria-ia.component.html',
  styleUrl: './auditoria-ia.component.css'
})
export class AuditoriaIaComponent {

  private materialesService = inject(MaterialesService);

  // 🚦 Angular 19 Signals para un renderizado óptimo y reactivo
  public registros = signal<any[]>([]);
  public cargando = signal<boolean>(true);
  
  public registroSeleccionado = signal<any | null>(null);
  public modalAbierto = signal<boolean>(false);

  title = 'Auditoria iA'

  ngOnInit(): void {
    this.cargarHistorialIA();
  }

  cargarHistorialIA() {
    this.cargando.set(true);
    this.materialesService.getEstadisticasGlobales().subscribe({
      next: (resp) => {
        if (resp.ok && resp.registros) {
          this.registros.set(resp.registros);
        }
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('❌ Error al conectar con el endpoint de estadísticas:', err);
        this.cargando.set(false);
      }
    });
  }

  abrirEvidencia(reg: any) {
    this.registroSeleccionado.set(reg);
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
    this.registroSeleccionado.set(null);
  }

}
