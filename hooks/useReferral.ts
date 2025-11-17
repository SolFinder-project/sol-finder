'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { StorageService } from '@/lib/utils/storage';
import { ReferralStats } from '@/types/user-stats';

export function useReferral() {
  const { publicKey } = useWallet();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [referrerCode, setReferrerCode] = useState<string | null>(null);
  const [referrerWallet, setReferrerWallet] = useState<string | null>(null);

  useEffect(() => {
    // Check URL for referral code on mount
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('ref');
      
      if (refCode) {
        console.log('🎁 Referral code detected:', refCode);
        
        // Save referrer code to sessionStorage (expires when tab closes)
        sessionStorage.setItem('solcloser_referrer', refCode);
        setReferrerCode(refCode);
        
        // Get referrer wallet from mapping
        const mapping = localStorage.getItem('solcloser_referral_mapping');
        if (mapping) {
          const map = JSON.parse(mapping);
          const wallet = map[refCode];
          if (wallet) {
            console.log('✅ Referrer wallet found:', wallet);
            sessionStorage.setItem('solcloser_referrer_wallet', wallet);
            setReferrerWallet(wallet);
          }
        }
        
        // Clean URL without reloading
        const url = new URL(window.location.href);
        url.searchParams.delete('ref');
        window.history.replaceState({}, '', url.toString());
      } else {
        // Check if we have a referrer in current session
        const savedReferrer = sessionStorage.getItem('solcloser_referrer');
        const savedWallet = sessionStorage.getItem('solcloser_referrer_wallet');
        
        if (savedReferrer) {
          setReferrerCode(savedReferrer);
        }
        
        if (savedWallet) {
          setReferrerWallet(savedWallet);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (publicKey) {
      // Generate referral code (first 8 chars of wallet)
      const code = publicKey.toString().slice(0, 8).toUpperCase();
      setReferralCode(code);

      // Save mapping: code -> wallet (persists in localStorage)
      const mapping = localStorage.getItem('solcloser_referral_mapping');
      const map = mapping ? JSON.parse(mapping) : {};
      map[code] = publicKey.toString();
      localStorage.setItem('solcloser_referral_mapping', JSON.stringify(map));

      // Load referral stats
      const stats = StorageService.getReferralStats(publicKey.toString());
      setReferralStats(stats);
    }
  }, [publicKey]);

  const getReferralLink = () => {
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}?ref=${referralCode}`;
  };

  return {
    referralCode,
    referralStats,
    referrerCode,
    referrerWallet,
    getReferralLink,
  };
}
