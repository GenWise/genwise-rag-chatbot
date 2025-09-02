import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isGenWiseEmail(email: string): boolean {
  return email.toLowerCase().endsWith('@genwise.in');
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

export function normalizeSchoolName(schoolName: string): string {
  if (!schoolName) return '';
  
  const normalized = schoolName.toLowerCase().trim();
  
  // Common variations mapping
  const schoolVariations: Record<string, string[]> = {
    'tvs': ['tvs academy', 'tvs school', 'tvs hosur', 'tvs tumkur', 'tvs tiruanamalai'],
    'kumarans': ['sri kumaran', 'kumarans', 'sri kumarans', 'kumaran children', 'kumaran public'],
    'greenwood': ['greenwood high', 'greenwood international', 'greenwood bannerghatta'],
    'vibgyor': ['vibgyor high', 'vibgyor school', 'vibgyor rise'],
    'inventure': ['inventure academy'],
    'gems': ['gems modern', 'gems genesis', 'gems our own', 'gems new millennium'],
    'dps': ['delhi public school', 'dps dubai', 'dps saket'],
    'jnv': ['jawahar navodaya vidyalaya', 'navodaya vidyalaya'],
  };
  
  for (const [key, variations] of Object.entries(schoolVariations)) {
    if (variations.some(variation => normalized.includes(variation))) {
      return key;
    }
  }
  
  return schoolName;
}

export function extractYear(programName: string): string {
  const yearMatch = programName.match(/20\d{2}/);
  return yearMatch ? yearMatch[0] : '';
}

export function extractMonth(programName: string): string {
  const monthMatch = programName.match(/(january|february|march|april|may|june|july|august|september|october|november|december)/i);
  return monthMatch ? monthMatch[1].toLowerCase() : '';
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}