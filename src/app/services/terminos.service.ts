import { HttpClient, HttpHeaders } from "@angular/common/http"; // 🚀 CORREGIDO: Ambos en la misma línea oficial
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { Terminos } from '../models/terminos';
import { environment } from 'src/environments/environment';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class TerminosService {
termino!: Terminos;
  private http = inject(HttpClient);

  // 🚦 EL PATRÓN KLYNTIC: Sostiene el array de la cartelera en memoria RAM
  public terminosSubject = new BehaviorSubject<Terminos[]>([]);
  
  // 🚀 EXPOSICIÓN DE FLUJOS CORREGIDA: Uno para los datos y otro para los loaders
  public terminos$: Observable<Terminos[]> = this.terminosSubject.asObservable();
  public isLoading$ = new BehaviorSubject<boolean>(false);

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': this.token
      })
    };
  }

  /**
   * 📡 OBTENER CONSEJOS DESDE ATLAS
   * Ejecuta la petición y actualiza el Subject interno en caliente
   */
 obtenerTerminos(): Observable<Terminos[]> {
    this.isLoading$.next(true);
    const url = `${baseUrl}/terminos/`;
    
    return this.http.get<Terminos[]>(url, this.headers).pipe(
      // Al devolver el array directo en el JSON, pasa limpio hacia el componente
      map((resp: any) => resp || []),
      tap((terminos) => {
        this.terminosSubject.next(terminos);
        this.isLoading$.next(false);
      })
    );
}

  getTermino(_id: string) {
    const url = `${baseUrl}/terminos/${_id}`;
    return this.http.get<any>(url, this.headers).pipe(
      map((resp: { ok: boolean, Regla: Terminos }) => resp.Regla)
    );
  }

  createTermino(Regla: Terminos) {
    const url = `${baseUrl}/terminos/store`;
    return this.http.post(url, Regla, this.headers).pipe(
      tap(() => this.obtenerTerminos().subscribe()) // Re-sincroniza en segundo plano tras crear
    );
  }

  updateTermino(Regla: Terminos) {
    const url = `${baseUrl}/terminos/update/${Regla._id}`;
    return this.http.put(url, Regla, this.headers).pipe(
      tap(() => this.obtenerTerminos().subscribe()) // Re-sincroniza en segundo plano tras editar
    );
  }

  deleteTermino(_id: string) {
    const url = `${baseUrl}/terminos/delete/${_id}`;
    return this.http.delete(url, this.headers).pipe(
      tap(() => this.obtenerTerminos().subscribe()) // Re-sincroniza en segundo plano tras borrar
    );
  }

  emitFilteredDoctors(terminos: Terminos[]) {
    this.terminosSubject.next(terminos);
  }
}
