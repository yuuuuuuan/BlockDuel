import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// Update the import path below if the file is located elsewhere, e.g.:
import { useWeb3 } from '../../lib/blockchain/Web3Provider';
// Or use the correct relative path based on your project structure
import { Button } from '../../components/ui/button';
import { Wallet, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { isConnected, account } = useWeb3();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Games', path: '/games/2048' },
    { name: 'Wallet', path: '/wallet' },
  ];
  
  const isActive = (path: string) => {
    return router.pathname === path;
  };
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="font-bold text-2xl">
              <span className="text-primary">Block</span>
              <span className="text-muted-foreground">Duel</span>
            </div>
          </Link>
          
          <nav className="mx-6 hidden items-center space-x-4 md:flex lg:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) 
                    ? 'text-foreground font-bold' 
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            
            <div className="hidden md:block">
              {isConnected ? (
                <Link href="/wallet">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Wallet className="h-4 w-4" />
                    <span>{formatAddress(account)}</span>
                  </Button>
                </Link>
              ) : (
                <Link href="/wallet">
                  <Button size="sm" className="gap-2">
                    <Wallet className="h-4 w-4" />
                    <span>Connect Wallet</span>
                  </Button>
                </Link>
              )}
            </div>
            
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-30 bg-background border-t">
          <nav className="container flex flex-col py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`py-4 text-lg font-medium transition-colors hover:text-primary ${
                  isActive(item.path) 
                    ? 'text-foreground font-bold' 
                    : 'text-muted-foreground'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="py-4">
              {isConnected ? (
                <Link href="/wallet" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Wallet className="h-4 w-4" />
                    <span>{formatAddress(account)}</span>
                  </Button>
                </Link>
              ) : (
                <Link href="/wallet" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-start gap-2">
                    <Wallet className="h-4 w-4" />
                    <span>Connect Wallet</span>
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BlockDuel Platform. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;