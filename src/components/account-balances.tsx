import React, { useEffect, useState } from "react";
import { Server, Account, StrKey } from "stellar-sdk";

function AccountBalances(props: any) {
  const [balances, setBalances] = useState<Array<any>>([]);
  const server = new Server("https://horizon-testnet.stellar.org");

  useEffect(() => {
    async function fetchAccountBalance() {
      try {
        const publicKey = props.publicKey;
        if (!StrKey.isValidEd25519PublicKey(publicKey)) {
          throw new Error("Invalid public key");
        }

        const account = await server.loadAccount(publicKey);
        const newBalances = account.balances.map((balance: any) => ({
          assetCode: balance.asset_code,
          assetIssuer: balance.asset_issuer,
          balance: balance.balance,
          assetType: balance.asset_type,
        }));

        setBalances(newBalances);
      } catch (error) {
        console.error(error);
      }
    }
    fetchAccountBalance();
  }, [props.publicKey]);

  return (
    <div className="flex flex-col">
      <h3>Account Balances</h3>
      <ul>
        {balances.map((balance, index) => (
          <li key={index}>
            {balance.balance}{" "}
            {balance.assetType === "native"
              ? `XLM`
              : `${balance.assetCode} (${balance.assetIssuer})`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AccountBalances;
