import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  burn,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import bs58 from 'bs58';

// CONFIGURATION
const DEVNET_RPC = 'https://api.devnet.solana.com';
const NUMBER_OF_ACCOUNTS = 5;

// ⚠️ REMPLACE PAR TA CLÉ PRIVÉE PHANTOM (DEVNET SEULEMENT!)
// Pour l'obtenir: Phantom > Settings > Show Secret Recovery Phrase > Export Private Key
const YOUR_PRIVATE_KEY = '4rFYUCaninMq9vetbaHz2g5QQ9AAjJhMkfM2poY5i75H4Agz88LumHdWhURMHFjXv8ctiCGEuW3bPDhEwdiFqnrj';

async function createEmptyTokenAccounts() {
  console.log('🚀 Starting to create empty token accounts...\n');

  try {
    // Parse private key
    let keypair;
    try {
      const secretKey = bs58.decode(YOUR_PRIVATE_KEY);
      keypair = Keypair.fromSecretKey(secretKey);
    } catch (e) {
      console.error('❌ Invalid private key format. Make sure you copied it correctly.');
      return;
    }

    const connection = new Connection(DEVNET_RPC, 'confirmed');
    
    console.log('📍 Wallet:', keypair.publicKey.toString());
    console.log('🔗 Network: Devnet\n');

    // Check SOL balance
    const balance = await connection.getBalance(keypair.publicKey);
    console.log('💰 SOL Balance:', (balance / 1e9).toFixed(4), 'SOL\n');

    if (balance < 0.1 * 1e9) {
      console.log('⚠️  Low SOL balance! Get some from: https://faucet.solana.com/\n');
    }

    // Create empty token accounts
    for (let i = 0; i < NUMBER_OF_ACCOUNTS; i++) {
      console.log(`\n--- Creating Empty Account ${i + 1}/${NUMBER_OF_ACCOUNTS} ---`);
      
      try {
        // 1. Create a new token mint
        console.log('  ⏳ Creating new token mint...');
        const mint = await createMint(
          connection,
          keypair,
          keypair.publicKey, // mint authority
          null, // freeze authority
          9 // decimals
        );
        console.log('  ✅ Mint created:', mint.toString().slice(0, 8) + '...');

        // 2. Create associated token account
        console.log('  ⏳ Creating token account...');
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          keypair,
          mint,
          keypair.publicKey
        );
        console.log('  ✅ Token account created:', tokenAccount.address.toString().slice(0, 8) + '...');

        // 3. Mint some tokens
        console.log('  ⏳ Minting tokens...');
        await mintTo(
          connection,
          keypair,
          mint,
          tokenAccount.address,
          keypair.publicKey,
          1000000000 // 1 token with 9 decimals
        );
        console.log('  ✅ Tokens minted');

        // 4. Burn all tokens to make balance = 0
        console.log('  ⏳ Burning tokens to make account empty...');
        await burn(
          connection,
          keypair,
          tokenAccount.address,
          mint,
          keypair.publicKey,
          1000000000
        );
        console.log('  ✅ Account is now EMPTY (balance = 0)');
        console.log('  💰 Rent locked: ~0.00204 SOL');

      } catch (error) {
        console.error(`  ❌ Error creating account ${i + 1}:`, error.message);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n\n🎉 DONE! Created', NUMBER_OF_ACCOUNTS, 'empty token accounts!');
    console.log('💡 Now go to your app and click "Scan My Wallet"\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Run the script
createEmptyTokenAccounts();
