import { 
  PublicKey, 
  Transaction, 
  SystemProgram,
} from '@solana/web3.js';
import { 
  createCloseAccountInstruction,
} from '@solana/spl-token';
import { getConnection } from './connection';
import { TokenAccount, CloseAccountResult } from '@/types/token-account';
import { TOKEN_PROGRAM_ID } from './constants';
import { StorageService } from '@/lib/utils/storage';
import { TransactionHistory } from '@/types/user-stats';
import { saveTransaction } from '@/lib/supabase/transactions';

export async function closeTokenAccounts(
  accounts: TokenAccount[],
  walletAdapter: any,
  referrerWallet?: string | null
): Promise<CloseAccountResult> {
  try {
    if (!walletAdapter.publicKey) {
      throw new Error('Wallet not connected');
    }

    // Vérifie que le wallet de fees est configuré
    if (!process.env.NEXT_PUBLIC_FEE_RECIPIENT_WALLET) {
      throw new Error('Fee recipient wallet not configured. Please contact support.');
    }

    const connection = getConnection();
    const transaction = new Transaction();

    const feePercentage = Number(process.env.NEXT_PUBLIC_SERVICE_FEE_PERCENTAGE || 15);
    const referralFeePercentage = Number(process.env.NEXT_PUBLIC_REFERRAL_FEE_PERCENTAGE || 10);
    
    const feeRecipient = new PublicKey(process.env.NEXT_PUBLIC_FEE_RECIPIENT_WALLET);

    let totalReclaimable = 0;

    // Close all accounts
    for (const account of accounts) {
      const closeInstruction = createCloseAccountInstruction(
        account.pubkey,
        walletAdapter.publicKey,
        walletAdapter.publicKey,
        [],
        TOKEN_PROGRAM_ID
      );
      transaction.add(closeInstruction);
      totalReclaimable += account.rentExemptReserve;
    }

    const totalFeeAmount = Math.floor((totalReclaimable * feePercentage) / 100);
    let referralAmount = 0;
    let referrerCode: string | undefined;

    // Handle referral
    if (referrerWallet) {
      try {
        const referrerPubkey = new PublicKey(referrerWallet);
        referralAmount = Math.floor((totalReclaimable * referralFeePercentage) / 100);
        const platformAmount = totalFeeAmount - referralAmount;
        
        // Génère le referrer code (8 premiers chars)
        referrerCode = referrerWallet.slice(0, 8).toUpperCase();
        
        // Send platform fee
        if (platformAmount > 0) {
          const platformInstruction = SystemProgram.transfer({
            fromPubkey: walletAdapter.publicKey,
            toPubkey: feeRecipient,
            lamports: platformAmount,
          });
          transaction.add(platformInstruction);
        }
        
        // Send referral reward
        if (referralAmount > 0) {
          const referralInstruction = SystemProgram.transfer({
            fromPubkey: walletAdapter.publicKey,
            toPubkey: referrerPubkey,
            lamports: referralAmount,
          });
          transaction.add(referralInstruction);
        }

        console.log(`✅ Referral: ${referralAmount / 1e9} SOL to ${referrerWallet.slice(0, 8)}`);
      } catch (error) {
        console.error('Invalid referrer wallet, sending full fee to platform:', error);
        referralAmount = 0;
        referrerCode = undefined;
        const feeInstruction = SystemProgram.transfer({
          fromPubkey: walletAdapter.publicKey,
          toPubkey: feeRecipient,
          lamports: totalFeeAmount,
        });
        transaction.add(feeInstruction);
      }
    } else {
      // No referral: send full fee to platform
      const feeInstruction = SystemProgram.transfer({
        fromPubkey: walletAdapter.publicKey,
        toPubkey: feeRecipient,
        lamports: totalFeeAmount,
      });
      transaction.add(feeInstruction);
    }

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = walletAdapter.publicKey;

    const signed = await walletAdapter.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());

    await connection.confirmTransaction(signature, 'confirmed');

    // Calculate amounts
    const solReclaimed = totalReclaimable / 1e9;
    const fee = totalFeeAmount / 1e9;
    const netReceived = solReclaimed - fee;

    // Save transaction history (localStorage - backup)
    const transactionHistory: TransactionHistory = {
      id: signature.slice(0, 16),
      signature,
      timestamp: Date.now(),
      accountsClosed: accounts.length,
      solReclaimed,
      fee,
      netReceived,
      referralEarned: referralAmount > 0 ? referralAmount / 1e9 : undefined,
    };

    StorageService.saveTransaction(
      walletAdapter.publicKey.toString(),
      transactionHistory
    );

    // 🔥 NOUVEAU : Save to Supabase
    try {
      await saveTransaction({
        signature,
        wallet_address: walletAdapter.publicKey.toString(),
        accounts_closed: accounts.length,
        sol_reclaimed: solReclaimed,
        fee,
        net_received: netReceived,
        referrer_code: referrerCode,
        referral_earned: referralAmount > 0 ? referralAmount / 1e9 : undefined,
        timestamp: Date.now(),
      });
      console.log('✅ Transaction saved to Supabase');
    } catch (supabaseError) {
      console.error('⚠️ Failed to save to Supabase (non-blocking):', supabaseError);
      // Non-blocking: l'app continue même si Supabase échoue
    }

    // Update referral stats in localStorage (legacy)
    if (referrerWallet && referralAmount > 0) {
      StorageService.updateReferralStats(
        referrerWallet,
        walletAdapter.publicKey.toString(),
        referralAmount / 1e9
      );
    }

    return {
      signature,
      accountsClosed: accounts.length,
      solReclaimed: netReceived,
      success: true,
    };
  } catch (error: any) {
    console.error('Error closing accounts:', error);
    return {
      signature: '',
      accountsClosed: 0,
      solReclaimed: 0,
      success: false,
      error: error.message,
    };
  }
}
