import {
  IExecDataProtector,
  IExecDataProtectorCore,
} from '@iexec/dataprotector';
import { Eip1193Provider } from 'iexec';

let iExecDataProtectorCore: IExecDataProtectorCore | null = null;
let currentChainId: number | null = null;

export function cleanDataProtectorClient() {
  iExecDataProtectorCore = null;
  currentChainId = null;
}

export async function initDataProtectorClient({
  provider,
  chainId,
}: {
  provider?: unknown;
  chainId?: number;
}) {
  if (!provider) {
    cleanDataProtectorClient();
    return;
  }

  // Only reinitialize if chain has changed
  if (currentChainId !== chainId) {
    try {
      const dataProtectorParent = new IExecDataProtector(
        provider as Eip1193Provider
      );
      iExecDataProtectorCore = dataProtectorParent.core;
      currentChainId = chainId || null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to initialize DataProtector client:', error);
      throw error;
    }
  }
}

export async function getDataProtectorCoreClient(): Promise<IExecDataProtectorCore> {
  if (!iExecDataProtectorCore) {
    throw new Error(
      'iExec SDK not initialized. Please connect your wallet first.'
    );
  }
  return iExecDataProtectorCore;
}
