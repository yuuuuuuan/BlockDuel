import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Card } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { useToast } from '../../components/ui/use-toast';
import { Progress } from '../../src/components/ui/progress';
import { useWeb3 } from '../../lib/blockchain/Web3Provider';
import Game2048 from '../../components/games/Game2048';

// Reward thresholds for the game
const REWARD_THRESHOLD = 2048; // Score needed to be eligible for rewards

const Game2048Page: NextPage = () => {
  const { toast } = useToast();
  const { claimReward, isConnected } = useWeb3();
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [rewardEligible, setRewardEligible] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Load best score from localStorage on component mount
  useEffect(() => {
    const savedBestScore = localStorage.getItem('2048_bestScore');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
    
    const savedRewardClaimed = localStorage.getItem('2048_rewardClaimed');
    if (savedRewardClaimed === 'true') {
      setRewardClaimed(true);
    }
  }, []);
  
  // Update best score when current score exceeds it
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048_bestScore', score.toString());
    }
    
    // Calculate progress towards reward threshold
    const newProgress = Math.min(100, Math.floor((score / REWARD_THRESHOLD) * 100));
    setProgress(newProgress);
    
    // Check if eligible for reward
    if (score >= REWARD_THRESHOLD) {
      setRewardEligible(true);
    }
  }, [score, bestScore]);
  
  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
  };
  
  const handleClaimReward = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to claim rewards.",
        variant: "destructive"
      });
      return;
    }
    
    if (!rewardEligible) {
      toast({
        title: "Not Eligible",
        description: `You need to score at least ${REWARD_THRESHOLD} points to claim rewards.`,
        variant: "destructive"
      });
      return;
    }
    
    if (rewardClaimed) {
      toast({
        title: "Already Claimed",
        description: "You have already claimed your reward for this game.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await claimReward(score);
      setRewardClaimed(true);
      localStorage.setItem('2048_rewardClaimed', 'true');
      
      toast({
        title: "Reward Claimed!",
        description: "Your reward has been sent to your wallet.",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: "There was an error claiming your reward.",
        variant: "destructive"
      });
      console.error(error);
    }
  };
  
  return (
    <>
      <Head>
        <title>2048 Game | BlockDuel Platform</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">2048 Game</h1>
            <p className="text-muted-foreground">
              Combine tiles to reach 2048 and earn crypto rewards!
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <Game2048 onScoreUpdate={handleScoreUpdate} />
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Game Stats</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Current Score</span>
                      <span className="font-bold">{score}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Best Score</span>
                    <span className="font-bold">{bestScore}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Reward Threshold</span>
                    <span className="font-bold">{REWARD_THRESHOLD}</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Rewards</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {rewardEligible 
                      ? "Congratulations! You're eligible for a reward." 
                      : `Reach a score of ${REWARD_THRESHOLD} to qualify for rewards.`}
                  </p>
                  
                  <Button 
                    onClick={handleClaimReward}
                    disabled={!rewardEligible || !isConnected || rewardClaimed}
                    className="w-full"
                    variant={rewardEligible && !rewardClaimed ? "default" : "outline"}
                  >
                    {rewardClaimed 
                      ? "Reward Claimed" 
                      : isConnected 
                        ? "Claim Reward" 
                        : "Connect Wallet to Claim"}
                  </Button>
                  
                  {!isConnected && (
                    <p className="text-sm text-muted-foreground">
                      You need to connect your wallet to claim rewards.
                    </p>
                  )}
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">How to Play</h2>
                <ul className="space-y-2 text-sm">
                  <li>• Use arrow keys to slide tiles in the desired direction.</li>
                  <li>• When two tiles with the same number touch, they merge into one.</li>
                  <li>• After each move, a new tile appears.</li>
                  <li>• Your goal is to create a tile with the number 2048.</li>
                  <li>• Reach a score of {REWARD_THRESHOLD} to earn rewards!</li>
                </ul>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Game2048Page;