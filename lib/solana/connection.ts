import { Connection, Commitment } from '@solana/web3.js';
import { COMMITMENT } from './constants';

let connectionInstance: Connection | null = null;

export function getConnection(): Connection {
  if (!connectionInstance) {
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 
                   'https://api.mainnet-beta.solana.com';
    
    connectionInstance = new Connection(rpcUrl, COMMITMENT as Commitment);
  }
  
  return connectionInstance;
}

export function resetConnection(): void {
  connectionInstance = null;
}
