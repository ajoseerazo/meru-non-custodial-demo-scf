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
}

export default StellarCoreAPI;
