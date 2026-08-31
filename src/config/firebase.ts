import { getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

import { env } from "@/config/env";

const firebaseApp =
  getApps()[0] ??
  initializeApp({
    apiKey: env.firebase.apiKey,
    authDomain: env.firebase.authDomain,
    projectId: env.firebase.projectId,
    storageBucket: env.firebase.storageBucket,
    messagingSenderId: env.firebase.messagingSenderId,
    appId: env.firebase.appId,
  });

export const storage = getStorage(firebaseApp);
