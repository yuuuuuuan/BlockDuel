import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../src/components/ui/card';
import { Button } from '../src/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../src/components/ui/tabs';
import { useWeb3 } from '../lib/blockchain/Web3Provider';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../src/components/ui/alert';

const WalletPage: NextPage = () => {
  const { account, balance, connectWallet, disconnectWallet, isConnected, network, rewards } = useWeb3();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      await connectWallet();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <>
      <Head>
        <title>Wallet | BlockDuel Platform</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Your Wallet</h1>

          {isConnected ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Wallet</CardTitle>
                  <CardDescription>Your blockchain wallet is connected to BlockDuel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Address</span>
                      <span className="font-mono">{formatAddress(account)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Network</span>
                      <span>{network}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Balance</span>
                      <span>{balance} ETH</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={handleDisconnect}>
                    Disconnect Wallet
                  </Button>
                </CardFooter>
              </Card>

              <Tabs defaultValue="rewards" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="rewards">Game Rewards</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>
                <TabsContent value="rewards">
                  <Card>
                    <CardHeader>
                      <CardTitle>Game Rewards</CardTitle>
                      <CardDescription>Rewards earned from playing games on BlockDuel</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {rewards && rewards.length > 0 ? (
                        <div className="space-y-4">
                          {rewards.map((reward, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b">
                              <div>
                                <p className="font-medium">{reward.game}</p>
                                <p className="text-sm text-muted-foreground">{reward.date}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{reward.amount} TOKEN</p>
                                <p className="text-sm text-muted-foreground">Score: {reward.score}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No rewards yet. Play games to earn tokens!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="transactions">
                  <Card>
                    <CardHeader>
                      <CardTitle>Transaction History</CardTitle>
                      <CardDescription>Your blockchain transactions on BlockDuel</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No transactions yet.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Wallet connected</AlertTitle>
                <AlertDescription>
                  Your wallet is connected to BlockDuel. You can now play games and earn rewards.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>Connect your blockchain wallet to play games and earn rewards</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="py-8 space-y-4">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
                  </div>
                  <p>Connect your Ethereum wallet to access all features of the BlockDuel platform</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleConnect} disabled={connecting}>
                  {connecting ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              </CardFooter>
            </Card>
          )}

          <div className="mt-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                This is a demo application. Do not use real funds or send any cryptocurrency to the contracts on this platform.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletPage;