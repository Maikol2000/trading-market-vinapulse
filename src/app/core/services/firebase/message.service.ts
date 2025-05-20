import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { initializeApp, setLogLevel } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messaging;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.messaging = getMessaging(app);
    setLogLevel('debug');
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        await this.getToken();
      } else {
        console.log('Notification permission denied.');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  }

  async getToken() {
    try {
      if (!('serviceWorker' in navigator)) {
        console.error('Service workers are not supported');
        return null;
      }

      // First check for existing registration
      let registration = await navigator.serviceWorker.getRegistration();

      if (!registration) {
        // Register service worker if not already registered
        registration = await navigator.serviceWorker.register(
          '/firebase-messaging-sw.js',
          {
            scope: '/',
          }
        );

        // Wait for the service worker to be ready
        await registration;
      }

      // Ensure service worker is active
      if (registration.active) {
        const currentToken = await getToken(this.messaging, {
          vapidKey: environment.firebase.vapidKey,
          serviceWorkerRegistration: registration,
        });

        if (currentToken) {
          // console.log('FCM Token:', currentToken);
          return currentToken;
        }
      } else {
        console.error('Service worker is not active');
      }

      return null;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  onMessageNotification() {
    onMessage(this.messaging, (payload) => {
      console.log('Foreground message received:', payload);
      // Handle foreground notifications (e.g., show a toast)
    });
  }
}
