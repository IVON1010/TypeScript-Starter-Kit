/**
 * Utility functions for creating greetings
 * Demonstrates TypeScript interfaces, enums, and function typing
 */

// Enum for supported languages
export enum Language {
  ENGLISH = 'en',
  SPANISH = 'es',
  FRENCH = 'fr',
  GERMAN = 'de'
}

// Interface defining the structure of greeting options
export interface GreetingOptions {
  name: string;
  language?: Language | string; // Optional with default
  includeTime?: boolean;        // Optional boolean
}

// Type alias for greeting function
export type GreetingFunction = (options: GreetingOptions) => string;

/**
 * Creates a personalized greeting message
 * @param options - Configuration options for the greeting
 * @returns A formatted greeting string
 */
export const createGreeting: GreetingFunction = (options) => {
  const { name, language = Language.ENGLISH, includeTime = false } = options;
  
  // Object mapping languages to greeting templates
  const greetings: Record<string, string> = {
    [Language.ENGLISH]: 'Hello',
    [Language.SPANISH]: 'Hola',
    [Language.FRENCH]: 'Bonjour',
    [Language.GERMAN]: 'Hallo'
  };
  
  // Get the appropriate greeting or default to English
  const greeting = greetings[language] || greetings[Language.ENGLISH];
  
  // Build the message
  let message = `${greeting}, ${name}!`;
  
  // Optionally include current time
  if (includeTime) {
    const currentTime = new Date().toLocaleTimeString();
    message += ` (Current time: ${currentTime})`;
  }
  
  return message;
};

/**
 * Utility function to validate greeting options
 * @param options - Options to validate
 * @returns True if options are valid, false otherwise
 */
export function validateGreetingOptions(options: GreetingOptions): boolean {
  return (
    typeof options.name === 'string' &&
    options.name.trim().length > 0 &&
    (options.language === undefined || typeof options.language === 'string') &&
    (options.includeTime === undefined || typeof options.includeTime === 'boolean')
  );
}
