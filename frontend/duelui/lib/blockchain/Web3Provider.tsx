import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

// Mock contract info commented out to avoid unused vars warnings
// const REWARD_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
// const REWARD_CONTRACT_ABI = [
//   'function claimReward(uint256 score) external returns (bool)',
//   'function getRewards(address player) external view returns (tuple(string game, uint256 score, uint256 amount, string date)[])'
// ];

type Reward = {
  game: string;
  score: number;
  amount: number;
  date: string;
};

interface Web3ContextType {
  account: string;
  balance: string;
  isConnected: boolean;
  network: string;
  rewards: Reward[];
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  claimReward: (gameScore: number) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType>({
  account: '',
  balance: '0',
  isConnected: false,
  network: '',
  rewards: [],
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  claimReward: async () => {},
});

export const useWeb3 = () => useContext(Web3Context);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [network, setNetwork] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if MetaMask is installed
        if (typeof window !== 'undefined' && window.ethereum !== undefined) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length > 0) {
            const ethersProvider = new ethers.BrowserProvider(window.ethereum);
            setProvider(ethersProvider);
            
            const userAccount = accounts[0];
            const userBalance = await ethersProvider.getBalance(userAccount);
            const network = await ethersProvider.getNetwork();
            
            setAccount(userAccount);
            setBalance(ethers.formatEther(userBalance).substring(0, 6));
            setNetwork(network.name);
            setIsConnected(true);
            
            // Load user rewards
            await loadRewards(ethersProvider, userAccount);
          }
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    };
    
    checkConnection();
  }, []);
  
  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum !== undefined) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else {
          // User switched accounts
          const newAccount = accounts[0];
          setAccount(newAccount);
          
          if (provider) {
            const userBalance = await provider.getBalance(newAccount);
            setBalance(ethers.formatEther(userBalance).substring(0, 6));
            
            // Load user rewards for new account
            await loadRewards(provider, newAccount);
          }
        }
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [provider]);
  
  const loadRewards = async (_provider: ethers.BrowserProvider, userAccount: string) => {
    try {
      // In a real application, we would load rewards from the blockchain
      // This is a mock implementation for demo purposes
      
      // Check local storage for mock rewards
      const storedRewards = localStorage.getItem(`rewards_${userAccount}`);
      if (storedRewards) {
        setRewards(JSON.parse(storedRewards));
      } else {
        // Set empty rewards
        setRewards([]);
      }
    } catch (error) {
      console.error("Error loading rewards:", error);
    }
  };
  
  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum !== undefined) {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        
        const userAccount = accounts[0];
        const userBalance = await ethersProvider.getBalance(userAccount);
        const network = await ethersProvider.getNetwork();
        
        setProvider(ethersProvider);
        setAccount(userAccount);
        setBalance(ethers.formatEther(userBalance).substring(0, 6));
        setNetwork(network.name);
        setIsConnected(true);
        
        // Load user rewards
        await loadRewards(ethersProvider, userAccount);
        
        toast.success('Wallet connected successfully');
      } else {
        toast.error('Ethereum wallet not detected. Please install MetaMask.');
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error('Failed to connect wallet');
    }
  };
  
  const disconnectWallet = async () => {
    setAccount('');
    setBalance('0');
    setNetwork('');
    setIsConnected(false);
    setProvider(null);
    setRewards([]);
    
    toast.success('Wallet disconnected');
  };
  
  const claimReward = async (gameScore: number) => {
    if (!isConnected || !provider) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    try {
      // In a real application, we would call the smart contract
      // This is a mock implementation for demo purposes
      
      // Calculate reward based on score
      const rewardAmount = Math.floor(gameScore / 100);
      
      // Mock a successful transaction
      const newReward: Reward = {
        game: '2048',
        score: gameScore,
        amount: rewardAmount,
        date: new Date().toISOString().split('T')[0]
      };
      
      // Update rewards
      const updatedRewards = [...rewards, newReward];
      setRewards(updatedRewards);
      
      // Store in localStorage for persistence
      localStorage.setItem(`rewards_${account}`, JSON.stringify(updatedRewards));
      
      toast.success(`Successfully claimed ${rewardAmount} tokens!`);
      return;
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast.error('Failed to claim reward');
      throw error;
    }
  };
  
  return (
    <Web3Context.Provider
      value={{
        account,
        balance,
        isConnected,
        network,
        rewards,
        connectWallet,
        disconnectWallet,
        claimReward
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

// Add type definition for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}