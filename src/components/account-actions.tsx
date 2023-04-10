import { useCallback, useState } from "react";
import StellarService from "../services/stellar";
import StellarCoreAPI from "../api/stellar-core";

const AccountActions = (props: any) => {
  const [isLoadingTrustline, setIsLoadingTrustline] = useState<boolean>();
  const [usdcAmount, setUsdcAmount] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [isSendingPayment, setIsSendingPayment] = useState<boolean>();

  const createTrustlineWithUSDC = useCallback(async () => {
    try {
      setIsLoadingTrustline(true);

      const { jwtToken } = await StellarCoreAPI.getAuthTokenFromPublicKey(
        props.publicKey
      );

      await StellarCoreAPI.createTrustlineWithAsset(
        "USDC",
        "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
        props.publicKey,
        jwtToken
      );

      if (props.onTrustlineCreated) {
        props.onTrustlineCreated();
      }
    } catch (err) {
      alert(err);
    } finally {
      setIsLoadingTrustline(false);
    }
  }, []);

  const onChangeAddressInput = useCallback((event: any) => {
    setAddress(event.target.value);
  }, []);

  const onChangeAmountInput = useCallback((event: any) => {
    setUsdcAmount(event.target.value);
  }, []);

  const sendUSDCPayment = useCallback(async () => {
    try {
      setIsSendingPayment(true);

      const { jwtToken } = await StellarCoreAPI.getAuthTokenFromPublicKey(
        props.publicKey
      );

      console.log(jwtToken);

      await StellarCoreAPI.sendPaymentToAccount(
        usdcAmount!,
        "USDC",
        "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
        props.publicKey,
        address!,
        jwtToken
      );

      alert("Payment sent successfuly");

      if (props.onTrustlineCreated) {
        props.onTrustlineCreated();
      }
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
      {!props.hasUDCTrustline && (
        <button
          className="bg-blue-600 rounded-lg text-white px-6 py-2 shadow-lg mb-4"
          onClick={createTrustlineWithUSDC}
        >
          {isLoadingTrustline ? "Loading..." : "Create trustline with USDC"}
        </button>
      )}

      {props.hasUDCTrustline && (
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
      )}

      <button
        className="bg-blue-600 rounded-lg text-white px-6 py-2 shadow-lg mt-12"
        onClick={logout}
      >
        Exit
      </button>
    </div>
  );
};

export default AccountActions;
