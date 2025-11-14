import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  burn,
} from '@solana/spl-token';
import bs58 from 'bs58';

const DEVNET_RPC = 'https://api.devnet.solana.com';

const YOUR_PRIVATE_KEY = '';

async function createEmptyAccounts() {
  console.log('🚀 Starting...\n');

  const connection = new Connection(DEVNET_RPC, 'confirmed');
  
  let keypair;
  if (YOUR_PRIVATE_KEY) {
    keypair = Keypair.fromSecretKey(bs58.decode(YOUR_PRIVATE_KEY));
    console.log('✅ Using existing wallet:', keypair.publicKey.toString());
  } else {
    keypair = Keypair.generate();
    console.log('✅ Generated new wallet:', keypair.publicKey.toString());
    console.log('🔑 Private Key:', bs58.encode(keypair.secretKey));
    console.log('\n⚠️  SAVE THIS PRIVATE KEY! You can reuse it later.\n');
  }

  let balance = await connection.getBalance(keypair.publicKey);
  console.log('💰 Current balance:', (balance / LAMPORTS_PER_SOL).toFixed(4), 'SOL\n');

  if (balance < 0.5 * LAMPORTS_PER_SOL) {
    console.log('❌ Not enough SOL! Requesting airdrop...');
    try {
      const sig = await connection.requestAirdrop(
        keypair.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(sig);
      balance = await connection.getBalance(keypair.publicKey);
      console.log('✅ Airdrop successful! New balance:', (balance / LAMPORTS_PER_SOL).toFixed(4), 'SOL\n');
    } catch (e) {
      console.log('⚠️  Airdrop failed. Get SOL from: https://faucet.solana.com/');
      console.log('   Address:', keypair.publicKey.toString());
      return;
    }
  }

  for (let i = 0; i < 5; i++) {
    console.log(`\n📦 Creating empty account ${i + 1}/5...`);
    
    try {
      const mint = await createMint(
        connection,
        keypair,
        keypair.publicKey,
        null,
        9
      );
      console.log('  ✅ Mint created');

      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        keypair,
        mint,
        keypair.publicKey
      );
      console.log('  ✅ Token account created');

      await mintTo(
        connection,
        keypair,
        mint,
        tokenAccount.address,
        keypair.publicKey,
        1000000000
      );
      console.log('  ✅ Tokens minted');

      await burn(
        connection,
        keypair,
        tokenAccount.address,
        mint,
        keypair.publicKey,
        1000000000
      );
      console.log('  ✅ Tokens burned - Account is now EMPTY');
      console.log('  💰 Rent locked: ~0.00204 SOL');

      await new Promise(r => setTimeout(r, 1000));
    } catch (error) {
      console.error('  ❌ Error:', error.message);
    }
  }

  console.log('\n\n🎉 DONE! Created 5 empty token accounts!');
  console.log('\n📍 Your wallet address:', keypair.publicKey.toString());
  console.log('💡 Now connect this wallet in your app and scan!\n');
}

createEmptyAccounts();
