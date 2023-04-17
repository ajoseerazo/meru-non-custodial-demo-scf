import { useCallback, useEffect, useState } from "react";
import StellarSdk from "stellar-sdk";
import { encryptSecretKey, getSecretKey } from "../utils/crypto";
import StellarCoreAPI from "../api/stellar-core";
import StellarService from "../services/stellar";
import Sep30API from "../api/sep-30";
import Loading from "./loading";

const CreateAccount = ({
  onAccountCreated,
}: {
  onAccountCreated: Function;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>();

  const createStellarAccount = useCallback(async () => {
    try {
      setIsLoading(true);

      const keypair = StellarSdk.Keypair.random();

      const publicKey = keypair.publicKey();

      encryptSecretKey(keypair.secret());

      const { transaction: transactionString } =
        await StellarCoreAPI.createStellarAccount(publicKey);

      const secretKey = getSecretKey();

      const transaction = StellarService.signRawTransacton(
        transactionString,
        secretKey
      );

      // console.log(transaction);

      await StellarService.submitTransaction(transaction);

      const deviceKeypair = StellarSdk.Keypair.random();

      encryptSecretKey(deviceKeypair.secret(), "deviceEncryptedKey");

      const { transaction: transactionDeviceString } =
        await StellarCoreAPI.createStellarAccount(deviceKeypair.publicKey());

      // console.log(transactionDeviceString);

      const transactionDevice = StellarService.signRawTransacton(
        transactionDeviceString,
        deviceKeypair.secret()
      );

      await StellarService.submitTransaction(transactionDevice);

      const jwt = await StellarService.getAuthToken(secretKey);

      const { transaction: changeSignerToDeviceKeyTransactionStr } =
        await StellarCoreAPI.changeSigner(
          publicKey,
          deviceKeypair.publicKey(),
          true,
          jwt
        );

      // console.log(changeSignerToDeviceKeyTransactionStr);

      const changeSignerToDeviceKeyTransactionSigned =
        StellarService.signRawTransacton(
          changeSignerToDeviceKeyTransactionStr,
          secretKey
        );

      await StellarService.submitTransaction(
        changeSignerToDeviceKeyTransactionSigned
      );

      const jwt2 = await StellarService.getAuthToken(deviceKeypair.secret());

      const { signers } = await Sep30API.registerAccount(
        publicKey,
        "exmaple@gmail.com", // Only for test purposes
        jwt2
      );

      const keyServerSigner = signers[0].key;

      const { transaction: changeSignerToKeyRecoveryServerKeyTransactionStr } =
        await StellarCoreAPI.changeSigner(
          publicKey,
          keyServerSigner,
          false,
          jwt2
        );

      // console.log(changeSignerToKeyRecoveryServerKeyTransactionStr);

      const changeSignerToKeyRecoveryServerTransactionSigned =
        StellarService.signRawTransacton(
          changeSignerToKeyRecoveryServerKeyTransactionStr,
          deviceKeypair.secret()
        );

      await StellarService.submitTransaction(
        changeSignerToKeyRecoveryServerTransactionSigned
      );

      const { transaction: transactionTrustTransactionStr } =
        await StellarCoreAPI.getCreateTrustlineWithAssetEnvelop(
          "USDC",
          "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
          publicKey,
          jwt2
        );

      const changeTrustlineTransactionSigned = StellarService.signRawTransacton(
        transactionTrustTransactionStr,
        deviceKeypair.secret()
      );

      await StellarService.submitTransaction(changeTrustlineTransactionSigned);

      localStorage.setItem("publicKey", publicKey);

      onAccountCreated(publicKey);
    } catch (err: any) {
      console.error(err);

      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <button
      className="bg-blue-600 rounded-lg text-white px-6 py-2 shadow-lg"
      onClick={createStellarAccount}
    >
      {isLoading ? <Loading text={"Creating"} /> : "Create Stellar Account"}
    </button>
  );
};

export default CreateAccount;
