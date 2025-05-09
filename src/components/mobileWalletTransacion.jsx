import { Keypair } from '@solana/web3.js';

const FrontEndUrl = import.meta.env.VITE_FRONTEND_URL;
const recipient = "A7PB8vLhPAh93QCpgZFTuHWY6tq7rQGHfByxy3CjyRWr";
const memo = "Stake your solana";

export function handleInvestInMobile(amount) {
  const reference = Keypair.generate().publicKey.toBase58();
  const redirectLink = `${FrontEndUrl}/verify?ref=${reference}`;

  const phantomLink = `https://phantom.app/ul/v1/send?recipient=${recipient}&amount=${amount}&reference=${reference}&memo=${memo}&label=NovaRealm&message=Earn+tokens+with+NovaRealm&redirect=${encodeURIComponent(redirectLink)}`;
  
  window.location.href = phantomLink;
}