import { useCallback, useState } from "react";
import StellarService from "../services/stellar";
import StellarCoreAPI from "../api/stellar-core";
import { getPublicKey, getSecretKey } from "../utils/crypto";

const AccountActions = (props: any) => {
  const [isLoadingTrustline, setIsLoadingTrustline] = useState<boolean>();
  const [usdcAmount, setUsdcAmount] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [isSendingPayment, setIsSendingPayment] = useState<boolean>();

  const onChangeAddressInput = useCallback((event: any) => {
    setAddress(event.target.value);
  }, []);

  const onChangeAmountInput = useCallback((event: any) => {
    setUsdcAmount(event.target.value);
  }, []);

  const sendUSDCPayment = useCallback(async () => {
    try {
      setIsSendingPayment(true);

      const publicKey = getPublicKey();

      console.log(publicKey);

      const secretKey = getSecretKey("deviceEncryptedKey");

      console.log(secretKey);

      const paymentTransactionEnvelope =
        await StellarService.sendPaymentEnvelope(
          usdcAmount!,
          address!,
          publicKey!,
          secretKey,
          "USDC",
          "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
        );

      console.log(paymentTransactionEnvelope);

      const jwt = await StellarService.getAuthToken(secretKey);

      const { transaction } = await StellarCoreAPI.getTransactionBumped(
        paymentTransactionEnvelope,
        jwt
      );

      const transactionBumped =
        StellarService.buildTransactionFromString(transaction);

      await StellarService.submitTransaction(transactionBumped);

      alert("Payment sent successfuly");
    } catch (err) {
      alert(err);
    } finally {
      setIsSendingPayment(false);
    }
  }, [usdcAmount, address]);

  const logout = useCallback(() => {
    localStorage.clear();

    if (props.onExit) {
      props.onExit();
    }
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col mb-4">
        <input
          placeholder="Address"
          className="border rounded-lg px-4 py-2 mb-4"
          onChange={onChangeAddressInput}
        />

        <input
          placeholder="Amount"
          className="border rounded-lg px-4 py-2 mb-4"
          onChange={onChangeAmountInput}
        />

        <button
          className={`${
            !usdcAmount || !address ? "bg-blue-200" : "bg-blue-600"
          }  rounded-lg text-white px-6 py-2 shadow-lg`}
          disabled={!usdcAmount || !address}
          onClick={sendUSDCPayment}
        >
          {isSendingPayment ? "Sending..." : "Send USDC Payment"}
        </button>
      </div>

      <button
        className="bg-blue-600 rounded-lg text-white px-6 py-2 shadow-lg mt-12"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default AccountActions;
