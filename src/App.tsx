import { useCallback, useEffect, useState } from "react";
import CreateAccount from "./components/create-account";
import StellarAccount from "./components/stellar-account";
import AccountBalances from "./components/account-balances";
import AccountActions from "./components/account-actions";

export default function App() {
  const [publicKey, setPublicKey] = useState<string | undefined>();
  const [isLoadingBalances, setIsLoadingBalances] = useState<boolean>(false);
  const [hasUSDCBalance, setHasUSDCBalance] = useState<boolean>(false);

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

  const onPaymentSuccess = useCallback(() => {
    setIsLoadingBalances(true);

    setTimeout(() => {
      setIsLoadingBalances(false);
    }, 2000);
  }, []);

  const onBalancesLoaded = useCallback((balances: Array<any>) => {
    console.log(balances);

    const hasUSDC = balances.find((balance) => {
      return (
        balance.assetCode === "USDC" &&
        balance.assetIssuer ===
          "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
      );
    });

    setHasUSDCBalance(hasUSDC ? true : false);
  }, []);

  return (
    <div className="flex flex-row items-center justify-center h-screen p-8">
      {publicKey ? (
        <div className="flex flex-col">
          <StellarAccount publicKey={publicKey} />
          {isLoadingBalances ? (
            "Refreshing"
          ) : (
            <AccountBalances
              publicKey={publicKey}
              onLoadBalances={onBalancesLoaded}
            />
          )}
          <div className="mt-8 flex flex-row justify-center">
            <AccountActions
              publicKey={publicKey}
              onExit={onExit}
              onPaymentSuccess={onPaymentSuccess}
            />
          </div>
        </div>
      ) : (
        <CreateAccount onAccountCreated={onAccountCreated} />
      )}
    </div>
  );
}
