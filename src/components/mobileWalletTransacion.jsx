import { PublicKey, Keypair } from '@solana/web3.js';

const FrontEndUrl = import.meta.env.VITE_FRONTEND_URL;
const recipient = "A7PB8vLhPAh93QCpgZFTuHWY6tq7rQGHfByxy3CjyRWr";
const memo = "Stake your solana";

export function handleInvestInMobile(amount) {
  const reference = Keypair.generate().publicKey; // Keep as PublicKey
  const referenceStr = reference.toBase58();
  const redirectLink = `${FrontEndUrl}/verify?ref=${referenceStr}`;

  const phantomLink = new URL("https://phantom.app/ul/v1/send");
  phantomLink.searchParams.set("recipient", recipient);
  phantomLink.searchParams.set("amount", amount.toString());
  phantomLink.searchParams.set("reference", referenceStr);
  phantomLink.searchParams.set("memo", memo);
  phantomLink.searchParams.set("label", "NovaRealm");
  phantomLink.searchParams.set("message", "Earn tokens with NovaRealm");
  phantomLink.searchParams.set("redirect", redirectLink);

  window.location.href = phantomLink.toString();
}
