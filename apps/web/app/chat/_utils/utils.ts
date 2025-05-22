/**
 * Utilities for token API functions
 */

/**
 * Cleans a contract address by removing spaces, converting to lowercase, and ensuring 0x prefix
 * @param address The contract address to clean
 * @returns The cleaned address
 */
export function cleanContractAddress(address?: string): string {
  if (!address) return "";

  // Remove spaces, convert to lowercase
  let cleaned = address.trim().toLowerCase();

  // Ensure it has the 0x prefix
  if (!cleaned.startsWith("0x")) {
    cleaned = "0x" + cleaned;
  }

  return cleaned;
}
