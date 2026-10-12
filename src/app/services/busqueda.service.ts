import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Retador } from '../models/retador';
import { Comunicado } from '../models/comunicado';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class BusquedasService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  private trasnformarUsuarios(resultados: any[]): User[] {
    return resultados.map(
      (user) =>
        new User(
          user.username,
          user.email,
          user.img,
          user.google,
          user.role,
          user.uid,
          user.profile,
        )
    );
  }

  
  
  private trasnformarParticipantes(resultados: any[]): Retador[] {
    return resultados;
  }
  
  private trasnformarComunicados(resultados: any[]): Comunicado[] {
    return resultados;
  }
  
 
  

  buscar(tipo: 'usuarios'|'participantes'| 'comunicados' , termino: string) {
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers).pipe(
      map((resp: any) => {
        switch (tipo) {
          case 'usuarios':
            return this.trasnformarUsuarios(resp.resultados);
          case 'participantes':
            return this.trasnformarParticipantes(resp.resultados);
          case 'comunicados':
            return this.trasnformarComunicados(resp.resultados);

          default:
            return [];
        }
      })
    );
  }

  searchGlobal(termino: string,) {
    const url = `${base_url}/todo/${termino}`;
    
    // Configuramos los parámetros de la URL de forma limpia
    let params = new HttpParams();
    

    // Pasamos los params dentro del objeto de configuración junto a los headers
    return this.http.get<any[]>(url, {
        ...this.headers,
        params
    });
}


}
