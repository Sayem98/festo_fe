import { http, createConfig } from 'wagmi'
import { mainnet,bsc, sepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [bsc],
  transports: {
    [bsc.id]: http()
  },
})