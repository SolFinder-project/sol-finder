'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getUserTransactions } from '@/lib/supabase/transactions';

interface Transaction {
  id: string;
  signature: string;
  accounts_closed: number;
  sol_reclaimed: number;
  fee: number;
  net_received: number;
  referrer_code?: string;
  referral_earned?: number;
  timestamp: number;
  created_at: string;
}

export default function TransactionHistory() {
  const { publicKey } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      if (!publicKey) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await getUserTransactions(publicKey.toString());
      setTransactions(data || []);
      setLoading(false);
    }

    loadTransactions();
  }, [publicKey]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatSignature = (sig: string) => {
    return sig.slice(0, 8) + '...' + sig.slice(-8);
  };

  if (!publicKey) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">👛</div>
        <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
        <p className="text-gray-400">Connect your wallet to view transaction history</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin text-6xl">⚡</div>
        <p className="text-gray-400 mt-4">Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📜</div>
        <h2 className="text-2xl font-bold mb-4">No Transactions Yet</h2>
        <p className="text-gray-400">Start closing accounts to see your transaction history!</p>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Transaction History</h1>
        <p className="text-gray-400 text-lg">View all your past account closures</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="card-cyber">
          <div className="text-sm text-gray-400 mb-1">Total Transactions</div>
          <div className="text-3xl font-bold">{transactions.length}</div>
        </div>
        <div className="card-cyber">
          <div className="text-sm text-gray-400 mb-1">Total Accounts Closed</div>
          <div className="text-3xl font-bold">
            {transactions.reduce((sum, tx) => sum + tx.accounts_closed, 0)}
          </div>
        </div>
        <div className="card-cyber">
          <div className="text-sm text-gray-400 mb-1">Total SOL Reclaimed</div>
          <div className="text-3xl font-bold">
            {transactions.reduce((sum, tx) => sum + tx.sol_reclaimed, 0).toFixed(4)}
          </div>
        </div>
        <div className="card-cyber">
          <div className="text-sm text-gray-400 mb-1">Total Fees Paid</div>
          <div className="text-3xl font-bold">
            {transactions.reduce((sum, tx) => sum + tx.fee, 0).toFixed(4)}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="card-cyber">
            <div className="flex flex-col gap-4">
              <div>
                <div className="font-bold text-lg mb-2">
                  Closed {tx.accounts_closed} Accounts
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  {formatDate(tx.timestamp)}
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  Signature: {formatSignature(tx.signature)}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-400">Reclaimed</div>
                  <div className="font-bold text-neon-cyan">{tx.sol_reclaimed.toFixed(4)} SOL</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Fee</div>
                  <div className="font-bold text-neon-pink">{tx.fee.toFixed(4)} SOL</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Received</div>
                  <div className="font-bold text-neon-green">{tx.net_received.toFixed(4)} SOL</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          Live Data from Supabase
        </span>
      </div>
    </div>
  );
}
