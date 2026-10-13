import { HttpClient, HttpHeaders } from '@angular/common/http';
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
   * 🔐 Extrae de forma segura el token del almacenamiento local
   */
  get token(): string {
    return localStorage.getItem('token') || '';
  }

   /**
   * 🎯 CORRECCIÓN BIEN ESTRUCTURADA DE CABECERAS PARA ANGULAR
   */
  private getOpcionesHttp() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': this.token // 🛡️ Sincroniza al 100% con tu validarJWT del backend
      })
    };
  }

  /**
   * 🚀 CREAR Y DISPARAR COMUNICADO AMBIENTAL GLOBAL
   * POST: /api/comunicados/enviar-global
   */
  crearComunicado(comunicado: Comunicado): Observable<any> {
    const url = `${this.apiUrl}/enviar-global`;
    // Pasamos el método generador de opciones corregido en el tercer parámetro
    return this.http.post<any>(url, comunicado, this.getOpcionesHttp());
  }

   /**
   * 📊 OBTENER HISTORIAL DE COMUNICADOS EXPEDIDOS
   * GET: /api/comunicados/mis-comunicados?page=X
   */
  obtenerMisComunicados(pagina: number = 1): Observable<any> {
    const url = `${this.apiUrl}/mis-comunicados?page=${pagina}`;
    return this.http.get<any>(url, this.getOpcionesHttp()); 
  }

  /**
   * 🧹 ELIMINAR REGISTRO DE LA CARTELERA CENTRAL
   * DELETE: /api/comunicados/delete/:id
   */
  deleteComunicado(id: string): Observable<any> {
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete<any>(url, this.getOpcionesHttp());
  }


  
}
