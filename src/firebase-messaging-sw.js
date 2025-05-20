// import { initializeApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging";
importScripts(
  "https://www.gstatic.com/firebasejs/11.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.7.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyADTPsPJBsul0wv0suCa1j1oc6WczLFEIc",
  authDomain: "crystaltoken-402d3.firebaseapp.com",
  projectId: "crystaltoken-402d3",
  storageBucket: "crystaltoken-402d3.firebasestorage.app",
  messagingSenderId: "647968733634",
  appId: "1:647968733634:web:3597dad280399b6514fe5b",
  measurementId: "G-2NK8WC100D",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "../public/icons/icon-72x72.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
