import { NextPage } from 'next';
import { motion } from 'framer-motion';
import { Button } from '../src/components/ui/button'; // 假设这个在别的地方
import GameCard from './GameCard';  // 这里改成相对路径
import Link from 'next/link';

const HomePage: NextPage = () => {
  const gameCards = [
    {
      title: 'Blockchain Adventure',
      description: 'Explore the world of blockchain and earn exciting rewards!',
      path: '/games/blockchain-adventure',
      color: 'bg-gradient-to-r from-blue-400 to-indigo-600',
      //imagePath: '/images/blockchain-icon.png', // 自定义图标路径
    },
    {
      title: 'Coming Soon',
      description: 'New exciting blockchain games are on the way!',
      path: '#',
      color: 'bg-gradient-to-r from-purple-400 to-indigo-600',
      disabled: true, // 禁用状态
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8 } } }} className="text-center mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
          BlockDuel Platform
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Play games, earn rewards, and engage with blockchain technology in a fun and interactive way.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gameCards.map((game, index) => (
          <GameCard key={index} {...game} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
