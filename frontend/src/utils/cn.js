import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes safely using clsx and tailwind-merge.
 * This is the standard utility for modern React projects to manage
 * dynamic and conditional Tailwind classes.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
