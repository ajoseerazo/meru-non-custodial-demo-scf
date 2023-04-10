import CryptoJS from "crypto-js";

const SECRET_KEY = "123456";

export const encryptSecretKey = (secretKey: string) => {
  const encryptedSecretKey = CryptoJS.AES.encrypt(
    secretKey,
    SECRET_KEY
  ).toString();

  localStorage.setItem("encryptedSecretKey", encryptedSecretKey);

  return encryptedSecretKey;
};

export const getSecretKey = () => {
  const encryptedSecretKey = localStorage.getItem("encryptedSecretKey");

  // Decrypt the secret key using the password '123456'
  const decryptedSecretKey = CryptoJS.AES.decrypt(
    encryptedSecretKey!,
    SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);

  return decryptedSecretKey;
};
