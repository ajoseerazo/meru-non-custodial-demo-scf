import CryptoJS from "crypto-js";

const ENCRYPTATION_KEY = "123456"; // Only for test purposes. This should be the password of the account

export const encryptSecretKey = (secretKey: string, key?: string) => {
  const encryptedSecretKey = CryptoJS.AES.encrypt(
    secretKey,
    ENCRYPTATION_KEY
  ).toString();

  localStorage.setItem(key ?? "encryptedSecretKey", encryptedSecretKey);

  return encryptedSecretKey;
};

export const getSecretKey = (key?: string) => {
  const encryptedSecretKey = localStorage.getItem(key ?? "encryptedSecretKey");

  const decryptedSecretKey = CryptoJS.AES.decrypt(
    encryptedSecretKey!,
    ENCRYPTATION_KEY
  ).toString(CryptoJS.enc.Utf8);

  return decryptedSecretKey;
};

export const getPublicKey = () => {
  return localStorage.getItem("publicKey");
};
