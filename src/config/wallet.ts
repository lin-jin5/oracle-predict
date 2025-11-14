import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, polygon, arbitrum, optimism, base } from '@reown/appkit/networks';
import { QueryClient } from '@tanstack/react-query';

// Get projectId from environment or use a placeholder
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

// Create wagmi config
export const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, polygon, arbitrum, optimism, base],
  projectId,
});

// Create query client
export const queryClient = new QueryClient();

// Create modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, polygon, arbitrum, optimism, base],
  projectId,
  features: {
    analytics: true,
  },
  metadata: {
    name: 'CryptoPredict',
    description: 'Decentralized Prediction Market Platform',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }
});

export const config = wagmiAdapter.wagmiConfig;
