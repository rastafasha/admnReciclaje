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

  info_dashboard = `
  <p>En esta sección :</p>
          <ul>
           <li><strong>Monitorear Auditoría por IA:</strong> Supervisa las validaciones automáticas realizadas por Gemini sobre las imágenes y registros que suben los usuarios.</li>
  <li><strong>Forzar Sincronización de Datos:</strong> Utiliza el botón morado superior para actualizar manualmente el listado y traer los últimos registros cargados en el historial de Atlas.</li>
  <li><strong>Identificar Participantes:</strong> Revisa el nombre y perfil del usuario que envió el reporte en la columna de participantes.</li>
  <li><strong>Verificar el Bloque / Categoría:</strong> Clasifica y audita el tipo de hábito, tarea o categoría ecológica bajo la cual se registró el reporte.</li>
  <li><strong>Evaluar el Detalle del Plato / Evidencia:</strong> Analiza la descripción, ingredientes o detalles técnicos capturados en el registro del usuario.</li>
  <li><strong>Validar el Estado de IA y Veredicto Gemini:</strong> Consulta la evaluación automática del modelo de IA para saber si el reporte cumple con las normativas ecológicas del sistema.</li>
  <li><strong>Gestionar Acciones de Auditoría:</strong> Utiliza los botones de la última columna para aprobar, rechazar o corregir manualmente el veredicto emitido por la IA.</li>
          </ul>`;

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
