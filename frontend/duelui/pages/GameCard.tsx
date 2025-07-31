import { FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../src/components/ui/card'; // 假设这些组件是其他地方的 UI 组件
import { Button } from '../src/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface GameCardProps {
  title: string;
  description: string;
  path: string;
  color: string;
  imagePath?: string;
  disabled?: boolean;
}

const GameCard: FC<GameCardProps> = ({ title, description, path, color, imagePath, disabled }) => {
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
