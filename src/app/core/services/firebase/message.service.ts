import { Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { getMessaging, getToken, onMessage } from '@angular/fire/messaging';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messaging;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.messaging = getMessaging(app);
  }

  async requestPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        getToken(this.messaging, {
          vapidKey: environment.firebase.vapidKey,
        })
          .then((currentToken: string) => {
            if (currentToken) {
              console.log(currentToken);
            } else {
              console.log(
                'No registration token available. Request permission to generate one.'
              );
            }
          })
          .catch((err: any) => {
            console.log(err);
          });
      }
    });
  }

  ngMessageNotification() {
    onMessage(this.messaging, (payload) => {
      console.log('Foreground message received:', payload);
    });
  }
}
