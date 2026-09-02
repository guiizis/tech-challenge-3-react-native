import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { storage } from "@/config/firebase";

export async function uploadFile(path: string, fileUri: string) {
  const response = await fetch(fileUri);
  const blob = await response.blob();

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);

  return getDownloadURL(storageRef);
}

export async function getFileUrl(path: string) {
  return getDownloadURL(ref(storage, path));
}

export async function deleteFile(path: string) {
  await deleteObject(ref(storage, path));
}
