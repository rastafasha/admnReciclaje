import { HttpClient, HttpHeaders } from "@angular/common/http"; // 🚀 CORREGIDO: Ambos en la misma línea oficial
import { inject, Injectable } from "@angular/core";
import {  Observable} from "rxjs";
import { environment } from 'src/environments/environment';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {

  private http = inject(HttpClient);

  constructor() { }

  /**
   * 🛡️ Cabecera con token de seguridad para el CRM Admin
   */
  get headers() {
    return {
      headers: new HttpHeaders({
        'x-token': localStorage.getItem('token') || ''
      })
    };
  }

  /**
   * 🤖 GET: Obtiene las últimas 20 entregas con populate de usuario e info de la IA
   */
  getEstadisticasGlobales(): Observable<any> {
    const url = `${base_url}/materiales/estadisticas`; // Ajusta si la ruta difiere en tu router de Node
    return this.http.get<any>(url, this.headers);
  }
}
