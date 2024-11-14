import { useAccount } from "wagmi";
import { Account } from "./account";
import { WalletOptions } from "./wallet-options";

function ConnectWallet() {
  const { isConnected } = useAccount();
  console.log("isConnected", isConnected);
  if (isConnected) return <Account />;
  return <WalletOptions />;
}

export { ConnectWallet };
