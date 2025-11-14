import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  burn,
} from '@solana/spl-token';

async function createTestAccounts() {
  // Connect to devnet
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  
  // REMPLACE PAR TON WALLET PHANTOM (devnet)
  const walletPublicKey = new PublicKey('VOTRE_ADRESSE_PHANTOM_DEVNET');
  
  console.log('🚀 Creating test token accounts on devnet...');
  console.log('📍 Wallet:', walletPublicKey.toString());
  
  // Create 5 test tokens
  for (let i = 0; i < 5; i++) {
    try {
      console.log(`\n✨ Creating test token ${i + 1}/5...`);
      
      // Create a new mint (simulating different tokens)
      const mintAuthority = Keypair.generate();
      
      const mint = await createMint(
        connection,
        mintAuthority,
        mintAuthority.publicKey,
        null,
        9 // 9 decimals
      );
      
      console.log(`  ✓ Mint created: ${mint.toString().slice(0, 8)}...`);
      
      // NOTE: This script shows you WHAT to do, but you'll need to 
      // actually perform these actions through Phantom wallet
      console.log(`  → Go to https://spl-token-faucet.com/?devnet`);
      console.log(`  → Request tokens with mint: ${mint.toString()}`);
      console.log(`  → Then transfer/burn them to create empty accounts`);
      
    } catch (error) {
      console.error(`  ✗ Error creating token ${i + 1}:`, error);
    }
  }
  
  console.log('\n✅ Script completed!');
}

createTestAccounts().catch(console.error);
