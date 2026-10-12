import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIResponseLeaderboard, Retador } from '../models/retador';


@Injectable({
  providedIn: 'root'
})
export class GamificacionService {
  // Asumiendo una estructura base de URL de tu API
  private apiUrl = `${environment.apiUrl}/gamificacion`;

  constructor(private http: HttpClient) { }

  // 🔐 Extraemos el token del almacenamiento local tal como en Clientes
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  /**
   * 🔵 OBTENER PARTICIPANTES PARA LA TABLA DE LIDERAZGO
   * GET: /api/gamificacion/participantes-liderazgo
   */
  obtenerTablaLiderazgo(): Observable<Retador[]> {
    return this.http.get<APIResponseLeaderboard>(`${this.apiUrl}/participantes-liderazgo`, this.headers).pipe(
      map(response => response.data) // Extrae el array de retadores directamente
    );
  }

  /**
 * 🟢 OBTENER MÉTRICAS GLOBALES DEL DASHBOARD ECOLÓGICO
 * GET: /api/gamificacion/dashboard-metricas
 */
  obtenerMetricasDashboard(): Observable<{
    totalParticipantes: number;
    totalHabitosCompletados: number;
    puntosTotalesGlobales: number;
    puntosActualesGlobales: number;
    clasificadosSorteo: number;
  }> {
    return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/dashboard-metricas`, this.headers).pipe(
      map(response => response.data)
    );
  }

  /**
   * Gatilla el algoritmo del sorteo en el backend para extraer los ganadores aleatorios
   */
  ejecutarSorteo(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sorteo`, {});
  }

  /**
 * 🎲 GATILLO DEL SORTEO PROPORCIONAL AUTOMÁTICO
 * POST: /api/gamificacion/ejecutar-sorteo
 */
  ejecutarSorteoProporcional(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ejecutar-sorteo`, {}, this.headers);
  }

  /**
   * 🎁 BOTÓN CTA: DISPARAR NOTIFICACIÓN PUSH EXCLUSIVA A LOS GANADORES SENSORIZADOS
   * POST: /api/gamificacion/notificar-ganadores
   */
  notificarGanadores(sorteoId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/notificar-ganadores`, { sorteoId }, this.headers);
  }
}
