import { useCallback, useEffect, useState } from "react";
import StellarSdk from "stellar-sdk";
import { encryptSecretKey } from "../utils/crypto";
import StellarCoreAPI from "../api/stellar-core";
import StellarService from "../services/stellar";
import Sep30API from "../api/sep-30";
import { v4 as uuid } from "uuid";

const CreateAccount = ({
  onAccountCreated,
}: {
  onAccountCreated: Function;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>();

  const createStellarAccount = useCallback(async () => {
    try {
      setIsLoading(true);

      const { account } = await StellarCoreAPI.createCustodialStellarAccount(
        uuid()
      );

      localStorage.setItem("publicKey", account.publicKey);

      onAccountCreated(account.publicKey);
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
