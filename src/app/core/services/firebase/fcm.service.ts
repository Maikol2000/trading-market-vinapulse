import { inject, Injectable } from '@angular/core';
import { Messaging } from '@angular/fire/messaging';
import { environment } from '@env/environment';
import { getToken, onMessage } from 'firebase/messaging';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  private messages = new BehaviorSubject<any>(null);
  message$ = this.messages.asObservable();
  messaging = inject(Messaging);

  constructor() {}

  requestPermission(): Observable<string> {
    return from(
      getToken(this.messaging, { vapidKey: environment.firebase.apiKey })
    );
  }

  listenForMessages() {
    onMessage(this.messaging, (payload) => {
      this.messages.next(payload);
    });
  }
}
