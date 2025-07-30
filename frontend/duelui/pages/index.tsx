import { NextPage } from 'next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const HomePage: NextPage = () => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const gameCards = [
    {
      title: '2048',
      description: 'Slide and merge tiles to reach 2048 and earn crypto rewards!',
      path: '/games/2048',
      color: 'bg-gradient-to-r from-orange-400 to-amber-600'
    },
    {
      title: 'Coming Soon',
      description: 'More blockchain games with exciting rewards are coming soon!',
      path: '#',
      color: 'bg-gradient-to-r from-purple-400 to-indigo-600'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
          BlockDuel Platform
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Play games, earn rewards, and engage with blockchain technology in a fun and interactive way.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gameCards.map((game, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Link href={game.path} passHref>
              <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <div className={`h-2 ${game.color}`} />
                <CardHeader>
                  <CardTitle>{game.title}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex items-center justify-center">
                    {game.title === '2048' ? (
                      <div className="grid grid-cols-2 grid-rows-2 gap-1">
                        {[2, 4, 8, 16].map((num, i) => (
                          <div 
                            key={i}
                            className={`w-12 h-12 flex items-center justify-center rounded-md font-bold text-white
                                      ${num === 2 ? 'bg-amber-200 text-gray-800' : 
                                        num === 4 ? 'bg-amber-300 text-gray-800' : 
                                        num === 8 ? 'bg-amber-400 text-white' : 
                                        'bg-amber-500 text-white'}`}
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-4xl opacity-30">🎮</div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className={`w-full ${game.title === 'Coming Soon' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {game.title === 'Coming Soon' ? 'Coming Soon' : 'Play Now'}
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-20 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg border bg-card">
            <div className="mb-4 text-4xl">🎮</div>
            <h3 className="text-xl font-semibold mb-2">1. Play Games</h3>
            <p className="text-muted-foreground">Choose from our selection of blockchain-powered games</p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <div className="mb-4 text-4xl">🏆</div>
            <h3 className="text-xl font-semibold mb-2">2. Earn Rewards</h3>
            <p className="text-muted-foreground">Reach score thresholds to qualify for token rewards</p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <div className="mb-4 text-4xl">💰</div>
            <h3 className="text-xl font-semibold mb-2">3. Claim Tokens</h3>
            <p className="text-muted-foreground">Connect your wallet and claim your earned tokens</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;