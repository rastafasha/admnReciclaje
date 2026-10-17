import { HttpClient, HttpHeaders } from "@angular/common/http"; // 🚀 CORREGIDO: Ambos en la misma línea oficial
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { TipEcologico } from '../models/consejos';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class TipsService {
  TipEcologico!: TipEcologico;
  private http = inject(HttpClient);

  // 🚦 EL PATRÓN KLYNTIC: Sostiene el array de la cartelera en memoria RAM
  public tipsSubject = new BehaviorSubject<TipEcologico[]>([]);
  
  // 🚀 EXPOSICIÓN DE FLUJOS CORREGIDA: Uno para los datos y otro para los loaders
  public tips$: Observable<TipEcologico[]> = this.tipsSubject.asObservable();
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
  obtenerTips(): Observable<TipEcologico[]> {
    this.isLoading$.next(true);
    const url = `${baseUrl}/consejos/`;
    
    return this.http.get<any>(url, this.headers).pipe(
      map((resp: { ok: boolean, data: TipEcologico[] }) => resp.data || []),
      tap((tips) => {
        // Alimentamos el Observer maestro para que todas las pantallas suscritas se enteren
        this.tipsSubject.next(tips);
        this.isLoading$.next(false);
      })
    );
  }

  getTipEcologico(_id: string) {
    const url = `${baseUrl}/consejos/${_id}`;
    return this.http.get<any>(url, this.headers).pipe(
      map((resp: { ok: boolean, TipEcologico: TipEcologico }) => resp.TipEcologico)
    );
  }

  createTipEcologico(TipEcologico: TipEcologico) {
    const url = `${baseUrl}/consejos/store`;
    return this.http.post(url, TipEcologico, this.headers).pipe(
      tap(() => this.obtenerTips().subscribe()) // Re-sincroniza en segundo plano tras crear
    );
  }

  updateTipEcologico(TipEcologico: TipEcologico) {
    const url = `${baseUrl}/consejos/update/${TipEcologico._id}`;
    return this.http.put(url, TipEcologico, this.headers).pipe(
      tap(() => this.obtenerTips().subscribe()) // Re-sincroniza en segundo plano tras editar
    );
  }

  deleteTipEcologico(_id: string) {
    const url = `${baseUrl}/consejos/delete/${_id}`;
    return this.http.delete(url, this.headers).pipe(
      tap(() => this.obtenerTips().subscribe()) // Re-sincroniza en segundo plano tras borrar
    );
  }

  emitFilteredDoctors(TipEcologicos: TipEcologico[]) {
    this.tipsSubject.next(TipEcologicos);
  }
}
