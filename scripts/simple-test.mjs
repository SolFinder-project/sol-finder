import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// REMPLACE PAR TON ADRESSE PHANTOM DEVNET
const walletAddress = '9bt6Fh38myJgw79Pein7hB6kHyvjhqXgo4uvz6mmM1Lj';

async function checkAccounts() {
  try {
    const publicKey = new PublicKey(walletAddress);
    const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    
    console.log('🔍 Scanning wallet:', walletAddress);
    
    const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });
    
    console.log(`\n📊 Found ${accounts.value.length} token accounts`);
    
    const emptyAccounts = accounts.value.filter(acc => 
      acc.account.data.parsed.info.tokenAmount.uiAmount === 0
    );
    
    console.log(`💰 Empty accounts: ${emptyAccounts.length}`);
    console.log(`✨ Closeable SOL: ${(emptyAccounts.length * 0.00203928).toFixed(6)} SOL`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAccounts();
