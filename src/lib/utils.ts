import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Convenience wrapper around `clsx` and `twMerge`.
 * Takes a variable number of class value inputs and returns a single
 * class string with all the inputs merged together.
 *
 * @example
 * cn("bg-red", "text-sm") // "bg-red text-sm"
 *
 * @param inputs - Class values to merge together
 * @returns A single class string with all inputs merged
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
