import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Comunicado } from '../models/comunicado';

@Injectable({
  providedIn: 'root'
})
export class ComunicadoService {

  private http = inject(HttpClient);
  // Concatena directo al prefijo modular de tu nuevo enrutador en Express
  private apiUrl = `${environment.apiUrl}/comunicados`;
  
  public comunicado!: Comunicado;

  constructor() { }

  /**
   * 🔐 Extrae de forma segura el token del almacenamiento local para el interceptor
   */
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
   * 🚀 CREAR Y DISPARAR COMUNICADO AMBIENTAL GLOBAL
   * POST: /api/comunicados/enviar-global
   */
  crearComunicado(comunicado: Comunicado): Observable<any> {
    const url = `${this.apiUrl}/enviar-global`;
    return this.http.post<any>(url, comunicado, this.headers);
  }

  /**
   * 📊 OBTENER HISTORIAL DE COMUNICADOS EXPEDIDOS (Para la Pestaña 3 del Modal)
   * GET: /api/comunicados/mis-comunicados?page=X
   */
  obtenerMisComunicados(pagina: number = 1): Observable<any> {
    const url = `${this.apiUrl}/mis-comunicados?page=${pagina}`;
    return this.http.get<any>(url, this.headers); 
  }

  /**
   * 🧹 ELIMINAR REGISTRO DE LA CARTELERA CENTRAL
   * DELETE: /api/comunicados/delete/:id
   */
  deleteComunicado(id: string): Observable<any> {
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete<any>(url, this.headers);
  }


  
}
