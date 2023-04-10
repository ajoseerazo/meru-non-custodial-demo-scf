import fetch from "isomorphic-fetch";
import { STELLAR_CORE } from "../utils/constants";

class StellarCoreAPI {
  static async createStellarAccount(publicKey: string) {
    const result = await fetch(
      `${STELLAR_CORE}/core/accounts/non-custodial/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          publicKey,
        }),
      }
    ).then((res) => res.json());

    console.log(result);

    if (result.error) {
      throw new Error(result.message);
    }

    return result;
  }

  static async createCustodialStellarAccount(userId: string) {
    const result = await fetch(`${STELLAR_CORE}/core/accounts/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    }).then((res) => res.json());

    console.log(result);

    if (result.error) {
      throw new Error(result.message);
    }

    return result;
  }

  static async createTrustlineWithAsset(
    assetCode: string,
    assetIssuer: string,
    publicKey: string,
    jwtToken: string
  ) {
    const result = await fetch(
      `${STELLAR_CORE}/core/accounts/create-trustline`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          assetCode,
          assetIssuer,
          source: publicKey,
        }),
      }
    ).then((res) => res.json());

    console.log(result);

    if (result.error) {
      throw new Error(result.message);
    }

    return result;
  }

  static async getTransactionBumped(transaction: string, jwt: string) {
    const result = await fetch(
      `${STELLAR_CORE}/transactions/bump-transaction/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          transaction,
        }),
      }
    ).then((res) => res.json());

    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  }

  static async getAuthTokenFromPublicKey(publicKey: string) {
    const result = await fetch(
      `${STELLAR_CORE}/auth/get-jwt-token?publicKey=${publicKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    ).then((res) => res.json());

    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  }

  static async sendPaymentToAccount(
    amount: string,
    assetCode: string,
    assetIssuer: string,

    publicKey: string,
    destination: string,
    jwt: string
  ) {
    const result = await fetch(
      `${STELLAR_CORE}/core/payments/send-payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          amount: amount,
          assetCode,
          assetIssuer,
          source: publicKey,
          destination: destination,
        }),
      }
    ).then((res) => res.json());

    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  }
}

export default StellarCoreAPI;
