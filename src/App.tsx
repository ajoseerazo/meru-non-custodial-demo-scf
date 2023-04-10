import { useCallback, useEffect, useState } from "react";
import CreateAccount from "./components/create-account";
import StellarAccount from "./components/stellar-account";
import AccountBalances from "./components/account-balances";
import AccountActions from "./components/account-actions";

export default function App() {
  const [publicKey, setPublicKey] = useState<string | undefined>();

  useEffect(() => {
    const storedValue = localStorage.getItem("publicKey");

    if (storedValue !== null) {
      setPublicKey(storedValue);
    }
  }, []);

  const onAccountCreated = useCallback((publicKey: string) => {
    setPublicKey(publicKey);
  }, []);

  const onExit = useCallback(() => {
    setPublicKey(undefined);
  }, []);

  return (
    <div className="flex flex-row items-center justify-center h-screen p-8">
      {publicKey ? (
        <div className="flex flex-col">
          <StellarAccount publicKey={publicKey} />
          <AccountBalances publicKey={publicKey} />
          <div className="mt-4 flex flex-row justify-center">
            <AccountActions publicKey={publicKey} onExit={onExit} />
          </div>
        </div>
      ) : (
        <CreateAccount onAccountCreated={onAccountCreated} />
      )}
    </div>
  );
}
