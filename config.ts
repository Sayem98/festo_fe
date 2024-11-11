import { http, createConfig } from "wagmi";
import { mainnet, bsc, sepolia } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";

const projectId = "f37a44911258a7a7ec9131f91a1b9204";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const config = createConfig({
  chains: [bsc],
  transports: {
    [bsc.id]: http(),
  },
  connectors: [metaMask()],
});
