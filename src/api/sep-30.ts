import { SEP30_URL } from "../utils/constants";

class Sep30API {
  static async registerAccount(
    publicKey: string,
    email: string,
    jwtToken: string
  ) {
    const response = await fetch(`${SEP30_URL}/accounts/${publicKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        identities: [
          {
            role: "owner",
            auth_methods: [
              {
                type: "email",
                value: email,
              },
            ],
          },
        ],
      }),
    }).then((res) => res.json());

    return response;
  }

  static async signTransaction(
    publicKey: string,
    signerKey: string,
    transaction: string,
    jwtToken: string
  ) {
    const response = await fetch(
      `${SEP30_URL}/accounts/${publicKey}/sign/${signerKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          transaction,
        }),
      }
    ).then((res) => res.json());

    return response;
  }
}

export default Sep30API;
