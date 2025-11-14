'use client';

import { TokenAccount } from '@/types/token-account';
import { useState } from 'react';

interface AccountListProps {
  accounts: TokenAccount[];
  onSelectionChange: (selected: TokenAccount[]) => void;
}

export default function AccountList({ accounts, onSelectionChange }: AccountListProps) {
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());

  const toggleAccount = (pubkey: string) => {
    const newSelected = new Set(selectedAccounts);
    if (newSelected.has(pubkey)) {
      newSelected.delete(pubkey);
    } else {
      newSelected.add(pubkey);
    }
    setSelectedAccounts(newSelected);
    
    const selected = accounts.filter(acc => newSelected.has(acc.pubkey.toString()));
    onSelectionChange(selected);
  };

  const selectAll = () => {
    if (selectedAccounts.size === accounts.length) {
      setSelectedAccounts(new Set());
      onSelectionChange([]);
    } else {
      const allKeys = new Set(accounts.map(acc => acc.pubkey.toString()));
      setSelectedAccounts(allKeys);
      onSelectionChange(accounts);
    }
  };

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No closeable token accounts found</p>
        <p className="text-sm mt-2">All your token accounts are either in use or already closed</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Closeable Accounts ({accounts.length})
        </h3>
        <button
          onClick={selectAll}
          className="px-4 py-2 text-sm bg-primary-100 hover:bg-primary-200 rounded-lg transition-colors"
        >
          {selectedAccounts.size === accounts.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {accounts.map((account) => (
          <div
            key={account.pubkey.toString()}
            onClick={() => toggleAccount(account.pubkey.toString())}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedAccounts.has(account.pubkey.toString())
                ? 'border-solana-purple bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="font-mono text-sm text-gray-600 truncate">
                  {account.pubkey.toString().slice(0, 8)}...{account.pubkey.toString().slice(-8)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Mint: {account.mint.toString().slice(0, 8)}...
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-solana-green">
                  +{(account.rentExemptReserve / 1e9).toFixed(6)} SOL
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm text-gray-600">
          Selected: {selectedAccounts.size} / {accounts.length} accounts
        </p>
      </div>
    </div>
  );
}
