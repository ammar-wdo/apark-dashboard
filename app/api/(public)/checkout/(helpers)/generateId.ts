export function generateUniquePattern() {
    // Generate a random 8-digit number
    const randomNumber = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    
    // Prepend 'A' to the random number
    return `A${randomNumber}`;
  }