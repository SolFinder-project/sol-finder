import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { getConnection } from './connection';
import { TokenAccount } from '@/types/token-account';

export async function scanWallet(walletPublicKey: PublicKey): Promise<TokenAccount[]> {
  const connection = getConnection();
  const emptyAccounts: TokenAccount[] = [];

  try {
    // Scan SPL Token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      walletPublicKey,
      { programId: TOKEN_PROGRAM_ID }
    );

    for (const account of tokenAccounts.value) {
      const accountInfo = account.account.data.parsed.info;
      const balance = accountInfo.tokenAmount.uiAmount;

      if (balance === 0) {
        emptyAccounts.push({
          pubkey: account.pubkey,
          mint: new PublicKey(accountInfo.mint),
          balance: 0,
          rentExemptReserve: account.account.lamports,
        });
      }
    }

    // Scan Token-2022 accounts
    try {
      const token2022Accounts = await connection.getParsedTokenAccountsByOwner(
        walletPublicKey,
        { programId: TOKEN_2022_PROGRAM_ID }
      );

      for (const account of token2022Accounts.value) {
        const accountInfo = account.account.data.parsed.info;
        const balance = accountInfo.tokenAmount.uiAmount;

        if (balance === 0) {
          emptyAccounts.push({
            pubkey: account.pubkey,
            mint: new PublicKey(accountInfo.mint),
            balance: 0,
            rentExemptReserve: account.account.lamports,
          });
        }
      }
    } catch (error) {
      console.log('No Token-2022 accounts or error scanning:', error);
    }

    return emptyAccounts;
  } catch (error) {
    console.error('Error scanning wallet:', error);
    throw new Error('Failed to scan wallet. Please try again.');
  }
}
