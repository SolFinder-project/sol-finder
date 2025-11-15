'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import dynamic from 'next/dynamic';

// Import dynamique sans SSR
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function WalletButton() {
  return (
    <WalletMultiButtonDynamic className="!bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 transition-opacity" />
  );
}
