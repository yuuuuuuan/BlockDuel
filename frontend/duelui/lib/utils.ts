import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function truncateAddress(address: string, startLength = 6, endLength = 4): string {
  if (!address) return '';
  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  }).format(date);
}