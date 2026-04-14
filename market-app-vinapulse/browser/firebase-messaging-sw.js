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

// Prevent duplicate notifications
const processedMessages = new Map();

messaging.onBackgroundMessage((payload) => {
  const messageId =
    payload.messageId || payload.data?.messageId || Date.now().toString();
  if (processedMessages.has(messageId)) {
    console.log("Skipping duplicate message:", messageId);
    return;
  }

  processedMessages.set(messageId, true);

  const notificationTitle = payload.notification.title;
  const data = payload.data || {};

  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification,
    data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

  setTimeout(() => processedMessages.delete(messageId), 5 * 60 * 1000);
});
