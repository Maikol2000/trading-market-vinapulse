import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyADTPsPJBsul0wv0suCa1j1oc6WczLFEIc",
  authDomain: "crystaltoken-402d3.firebaseapp.com",
  projectId: "crystaltoken-402d3",
  storageBucket: "crystaltoken-402d3.firebasestorage.app",
  messagingSenderId: "647968733634",
  appId: "1:647968733634:web:3597dad280399b6514fe5b",
  measurementId: "G-2NK8WC100D",
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
