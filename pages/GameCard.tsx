import { FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../src/components/ui/card'; // 假设这些组件是其他地方的 UI 组件
import { Button } from '../src/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface GameCardProps {
  title: string;
  description: string;
  gametype?: string;
  path: string;
  color: string;
  imagePath?: string;
  disabled?: boolean;
}

// 定义 GameType 枚举
enum GameType {
  PVP = 'PVP',
  PVE = 'PVE',
  Single = 'Single',
  Staytuned = 'Stay tuned',
}

// 为不同的游戏类型定义不同的颜色
const gameTypeColors: { [key in GameType]: string } = {
  [GameType.PVP]: 'bg-red-500',
  [GameType.PVE]: 'bg-blue-600',
  [GameType.Single]: 'bg-green-500',
  [GameType.Staytuned]: 'bg-amber-500',
};

const GameCard: FC<GameCardProps> = ({ title, description, path, color, imagePath, disabled, gametype }) => {
  
  const gametypeColor = gametype ? gameTypeColors[gametype as GameType] : 'bg-gray-500';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href={path} passHref>
        <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105">
          <div className={`h-2 ${color}`} />
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="min-h-[3.6rem] leading-6">{description}</CardDescription>
          </CardHeader>

          {gametype && (
            <div 
              className={`absolute top-4 right-2 text-xs font-bold text-transparent px-3 py-1 rounded-full shadow-md ${gametypeColor} bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 border border-gray-300 dark:border-gray-600`}
            >
              {gametype}
            </div>
          )}

          <CardContent>
            <div className="h-32 flex items-center justify-center">
              <div className="text-4xl opacity-30">
                {imagePath ? (
                  <img src={imagePath} alt={title} className="w-16 h-16 object-contain" />
                ) : (
                  '🎮'
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className={`w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={disabled}>
              {disabled ? 'Coming Soon' : 'Play Now'}
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

export default GameCard;