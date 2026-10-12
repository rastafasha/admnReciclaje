import { inject, Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

const claveVapidApi = environment.VAPI_KEY_PUBLIC;
// 🟢 ALINEADO: Apunta dinámicamente al módulo de notificaciones push de tu API unificada
const urlBackend = `${environment.apiUrl}/notificaciones/notipush/save-subscription`;

@Injectable({
  providedIn: 'root'
})
export class NotificacionPushService {
  readonly VAPID_PUBLIC_KEY = claveVapidApi;

  private swPush = inject(SwPush);
  private http = inject(HttpClient);
  public router = inject(Router);

  public isSubscribed$ = new BehaviorSubject<boolean>(false);
  public isProcessing$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.checkSubscriptionStatus();
  }

  setSubscriptionStatus(status: boolean) {
    this.isSubscribed$.next(status);
  }

  async checkSubscriptionStatus() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      this.isSubscribed$.next(!!sub);
    } catch (err) {
      this.isSubscribed$.next(false);
    }
  }

  /**
   * 🔥 GATILLO DEL SWITCH PRINCIPAL EN EL DASHBOARD
   */
  subscribeToNotifications() {
    this.isProcessing$.next(true);
    
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => {
      const miToken = localStorage.getItem('token') || '';

      // 🟢 CORRECCIÓN CRÍTICA: Enviamos el JSON plano directo de la suscripción al backend
      // tal como lo requiere el destructurador de tu controlador en Node
      const payloadBody = sub.toJSON();

      const headers = {
        'x-token': miToken, // El middleware validarJWT capturará el uid desde aquí
      };
      
      console.log('📡 [WEBPUSH]: Sincronizando credenciales de dispositivo en MongoDB...');

      this.http.post(urlBackend, payloadBody, { headers }).subscribe({
        next: (res: any) => {
          console.log('✅ ¡Canal push enlazado con éxito en Atlas!');
          this.isSubscribed$.next(true);
          this.isProcessing$.next(false);
          Swal.fire('¡Notificaciones Activas!', 'Recibirás alertas en tiempo real sobre posiciones, sorteos y nuevos hábitos.', 'success');

          // Despacho del globo de bienvenida ecológico nativo adaptado
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
              
              const opcionesNotificacion: any = {
                body: 'Recibirás avisos instantáneos cada vez que clasifiques a un sorteo o acumules puntos.',
                icon: 'assets/icons/icon-72x72.png',
                badge: 'assets/icons/icon-72x72.png',
                vibrate:[200, 100, 200],
                tag: 'bienvenida-gamificacion'
              };

              registration.showNotification('🔔 Canal Eco-Tech Conectado', opcionesNotificacion);
            }).catch(swErr => console.log('Aviso: Service Worker no listo para el globo inmediato:', swErr));
          }
        },
        error: err => {
          console.error('❌ Error al guardar la suscripción en Node:', err);
          this.isSubscribed$.next(false);
          this.isProcessing$.next(false);
          Swal.fire('Error de enlace', 'El servidor no pudo registrar el dispositivo. Inténtalo más tarde.', 'error');
        }
      });
    })
    .catch(err => {
      console.error('❌ Permiso denegado por el usuario o error VAPID:', err);
      this.isSubscribed$.next(false);
      this.isProcessing$.next(false);
      Swal.fire('Permisos requeridos', 'Debes habilitar las notificaciones en el candado del navegador para encender el canal.', 'info');
    });
  }
}