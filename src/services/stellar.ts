import StellarSdk, { Keypair, Networks } from "stellar-sdk";
import {
  SEP_10_SIGNING_KEY,
  SEP_10_WEB_AUTH_SERVER,
  STELLAR_NETWORK_PASSPHRASE,
} from "../utils/constants";
import { getSecretKey } from "../utils/crypto";
import { authenticate } from "@satoshipay/stellar-sep-10";

const FEE = 100000;
const TX_TIMEOUT = 40000; // In milliseconds
const TIME_TO_RETRY = 5;
const MAX_RETRIES = TX_TIMEOUT / (TIME_TO_RETRY * 1000); // 8 times

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class StellarService {
  static server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

  private static isNonRetryErrorCase(err: any) {
    return err.status !== 504;
  }

  static submitTransaction = async (
    tx: any,
    timeout: number = TIME_TO_RETRY,
    retry = 1
  ): Promise<any> => {
    try {
      const transaction = await this.server.submitTransaction(tx);

      return transaction;
    } catch (error) {
      // Workaround
      const errorJSON = JSON.parse(JSON.stringify(error));

      if (this.isNonRetryErrorCase(errorJSON)) {
        throw error;
      }

      if (retry > MAX_RETRIES) {
        throw error;
      }

      await sleep(timeout);

      return this.submitTransaction(tx, timeout + 5, retry + 1);
    }
  };

  static signRawTransacton(transactionString: string) {
    console.log(transactionString);

    const transaction = StellarSdk.TransactionBuilder.fromXDR(
      transactionString,
      STELLAR_NETWORK_PASSPHRASE
    );

    const secretKey = getSecretKey();

    const keypair = Keypair.fromSecret(secretKey);

    transaction.sign(keypair);

    return transaction;
  }

  static getAuthToken = async () => {
    const secretKey = getSecretKey();

    const keyPair = Keypair.fromSecret(secretKey);

    const jwt: string = await authenticate(
      SEP_10_WEB_AUTH_SERVER,
      SEP_10_SIGNING_KEY,
      keyPair,
      Networks.TESTNET
    );

    console.log(`JWT Token: ${jwt}`);

    return jwt;
  };

  static changeSigners = async (signer: string) => {
    const secretKey = getSecretKey();

    const keyPair = Keypair.fromSecret(secretKey);

    const publicKey = keyPair.publicKey();

    const account = await this.server.loadAccount(publicKey);

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.setOptions({
          masterWeight: 0,
          lowThreshold: 1,
          medThreshold: 1,
          highThreshold: 1,
          signer: {
            ed25519PublicKey: signer,
            weight: 1,
          },
          source: publicKey,
        })
      )
      .setTimeout(TX_TIMEOUT)
      .build();

    transaction.sign(keyPair);

    const transactionString = transaction.toXDR();

    return transactionString;
  };

  static buildTransactionFromString(transactionString: string) {
    const transaction = StellarSdk.TransactionBuilder.fromXDR(
      transactionString,
      STELLAR_NETWORK_PASSPHRASE
    );

    return transaction;
  }
}

export default StellarService;
