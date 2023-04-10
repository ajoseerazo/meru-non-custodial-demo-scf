import { useCallback, useEffect, useState } from "react";
import StellarSdk from "stellar-sdk";
import { encryptSecretKey } from "../utils/crypto";
import StellarCoreAPI from "../api/stellar-core";
import StellarService from "../services/stellar";
import Sep30API from "../api/sep-30";

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

      const transaction = StellarService.signRawTransacton(transactionString);

      console.log(transaction);

      await StellarService.submitTransaction(transaction);

      const jwt = await StellarService.getAuthToken();

      const { signers } = await Sep30API.registerAccount(
        publicKey,
        "ajose.erazo@gmail.com",
        jwt
      );

      console.log(signers);

      const changeSignersTransaction = await StellarService.changeSigners(
        signers[0].key
      );

      const jwt2 = await StellarService.getAuthToken();

      const { transaction: transactionBumpedString } =
        await StellarCoreAPI.getTransactionBumped(
          changeSignersTransaction,
          jwt2
        );

      console.log(transactionBumpedString);

      const transactionBumped = StellarService.buildTransactionFromString(
        transactionBumpedString
      );

      console.log(transactionBumped);

      await StellarService.submitTransaction(transactionBumped);

      console.log("Signers Changed");

      console.log(changeSignersTransaction);

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
      {isLoading ? "Creating" : "Create Stellar Account"}
    </button>
  );
};

export default CreateAccount;
