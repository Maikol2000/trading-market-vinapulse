import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBe6YHTwjq7mV1uMS8DrgS4xDqOeYz-eQE",
  authDomain: "e-library-c5aed.firebaseapp.com",
  projectId: "e-library-c5aed",
  storageBucket: "e-library-c5aed.appspot.com",
  messagingSenderId: "688190313961",
  appId: "1:688190313961:web:4c04b577609914c512e778",
  measurementId: "G-71NQ1SCVTY",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/assets/icon.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
