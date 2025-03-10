import {
  AptosWalletErrorResult,
  NetworkName,
  PluginProvider,
} from "@aptos-labs/wallet-adapter-core";
import type {
  AccountInfo,
  AdapterPlugin,
  NetworkInfo,
  SignMessagePayload,
  SignMessageResponse,
  WalletName,
} from "@aptos-labs/wallet-adapter-core";
import { Types } from "aptos";

interface TokenPocketProvider extends PluginProvider {
  signTransaction(
    transaction: any,
    options?: any
  ): Promise<Uint8Array | AptosWalletErrorResult>;
}

interface TokenPocketInterface {
  aptos?: TokenPocketProvider
}

interface TokenPocketWindow extends Window {
  tokenpocket?: TokenPocketInterface
}

declare const window: TokenPocketWindow;

export const TokenPocketWalletName = "TokenPocket" as WalletName<"TokenPocket">;

export class TokenPocketWallet implements AdapterPlugin {
  readonly name = TokenPocketWalletName;
  readonly url =
    "https://tokenpocket.pro";
  readonly providerName = 'tokenpocket';
  readonly icon =
    "data:image/png;base64,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";

  provider: TokenPocketInterface | undefined =
    typeof window !== "undefined" ? window.tokenpocket : undefined;

  async connect(): Promise<AccountInfo> {
    try {
      const accountInfo = await this.provider?.aptos?.connect();
      if (!accountInfo) throw `${TokenPocketWalletName} Address Info Error`;
      return accountInfo;
    } catch (error: any) {
      throw error;
    }
  }

  async account(): Promise<AccountInfo> {
    const response = await this.provider?.aptos?.account();
    if (!response) throw `${TokenPocketWalletName} Account Error`;
    return response;
  }

  async disconnect(): Promise<void> {
    try {
      await this.provider?.aptos?.disconnect();
    } catch (error: any) {
      throw error;
    }
  }

  async signTransaction(
    transaction: any,
    options?: any
  ): Promise<Uint8Array | AptosWalletErrorResult> {
    try {
      const response = await this.provider?.aptos?.signTransaction(transaction, options);

      if (!response) {
        throw new Error("signTransaction Error") as AptosWalletErrorResult;
      }

      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    options?: any
  ): Promise<{ hash: Types.HexEncodedBytes }> {
    try {
      const response = await this.provider?.aptos?.signAndSubmitTransaction(
        transaction,
        options
      );
      if (response) {
        return response as { hash: Types.HexEncodedBytes };
      }
      else {
        throw `${TokenPocketWalletName} Sign and submit Transaction failed`;
      }
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    try {
      if (typeof message !== "object" || !message.nonce) {
        `${TokenPocketWalletName} Invalid signMessage Payload`;
      }
      const response = await this.provider?.aptos?.signMessage(message);
      if (response) {
        return response;
      } else {
        throw `${TokenPocketWalletName} Sign Message failed`;
      }
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async network(): Promise<NetworkInfo> {
    try {
      const response = await this.provider?.aptos?.network();
      if (!response) throw `${TokenPocketWalletName} Network Error`;
      return {
        name: response as NetworkName,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async onNetworkChange(callback: any): Promise<void> {

  }

  async onAccountChange(callback: any): Promise<void> {

  }
}
