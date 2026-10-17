import { HttpClient, HttpHeaders } from "@angular/common/http"; // 🚀 CORREGIDO: Ambos en la misma línea oficial
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { environment } from 'src/environments/environment';
import { Regla } from "../models/regla";

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ReglasService {
 regla!: Regla;
  private http = inject(HttpClient);

  // 🚦 EL PATRÓN KLYNTIC: Sostiene el array de la cartelera en memoria RAM
  public reglasSubject = new BehaviorSubject<Regla[]>([]);
  
  // 🚀 EXPOSICIÓN DE FLUJOS CORREGIDA: Uno para los datos y otro para los loaders
  public regla$: Observable<Regla[]> = this.reglasSubject.asObservable();
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
 obtenerReglas(): Observable<Regla[]> {
    this.isLoading$.next(true);
    const url = `${baseUrl}/reglas/`;
    
    return this.http.get<Regla[]>(url, this.headers).pipe(
      // Al devolver el array directo en el JSON, pasa limpio hacia el componente
      map((resp: any) => resp || []),
      tap((reglas) => {
        this.reglasSubject.next(reglas);
        this.isLoading$.next(false);
      })
    );
}

  getRegla(_id: string) {
    const url = `${baseUrl}/reglas/${_id}`;
    return this.http.get<any>(url, this.headers).pipe(
      map((resp: { ok: boolean, Regla: Regla }) => resp.Regla)
    );
  }

  createRegla(Regla: Regla) {
    const url = `${baseUrl}/reglas/store`;
    return this.http.post(url, Regla, this.headers).pipe(
      tap(() => this.obtenerReglas().subscribe()) // Re-sincroniza en segundo plano tras crear
    );
  }

  updateRegla(Regla: Regla) {
    const url = `${baseUrl}/reglas/update/${Regla._id}`;
    return this.http.put(url, Regla, this.headers).pipe(
      tap(() => this.obtenerReglas().subscribe()) // Re-sincroniza en segundo plano tras editar
    );
  }

  deleteRegla(_id: string) {
    const url = `${baseUrl}/reglas/delete/${_id}`;
    return this.http.delete(url, this.headers).pipe(
      tap(() => this.obtenerReglas().subscribe()) // Re-sincroniza en segundo plano tras borrar
    );
  }

  emitFilteredDoctors(Reglas: Regla[]) {
    this.reglasSubject.next(Reglas);
  }
}
