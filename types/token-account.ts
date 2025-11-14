import { PublicKey } from '@solana/web3.js';

export interface TokenAccount {
  pubkey: PublicKey;
  mint: PublicKey;
  owner: PublicKey;
  amount: bigint;
  tokenAmount: {
    amount: string;
    decimals: number;
    uiAmount: number | null;
  };
  rentExemptReserve: number;
  isCloseable: boolean;
}

export interface ScanResult {
  totalAccounts: number;
  closeableAccounts: TokenAccount[];
  totalReclaimable: number;
  estimatedFee: number;
  netRecovery: number;
}

export interface CloseAccountResult {
  signature: string;
  accountsClosed: number;
  solReclaimed: number;
  success: boolean;
  error?: string;
}
