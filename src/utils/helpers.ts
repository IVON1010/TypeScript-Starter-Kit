/**
 * Helper utility functions
 * Demonstrates TypeScript generics, utility functions, and functional programming concepts
 */

import { ITask, IUser, Priority, TaskStatus, UserRole } from '../models/types.js';

// Generic function to create a deep copy of an object
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Generic function to pick specific properties from an object
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

// Generic function to omit specific properties from an object
export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

// Generic function to group array items by a key
export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// Generic function to sort array by a property
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return order === 'asc' ? 1 : -1;
    if (bValue === undefined) return order === 'asc' ? -1 : 1;

    let comparison = 0;
    if (aValue !== null && bValue !== null) {
      if (aValue < bValue) comparison = -1;
      else if (aValue > bValue) comparison = 1;
    }

    return order === 'desc' ? -comparison : comparison;
  });
}

// Generic function to filter unique items
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

// Generic function to filter unique items by a property
export function uniqueBy<T, K extends keyof T>(array: T[], key: K): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

// Function to format date in a readable format
export function formatDate(date: Date, format: 'short' | 'long' | 'time' = 'short'): string {
  const options: Intl.DateTimeFormatOptions = {};

  switch (format) {
    case 'short':
      options.year = 'numeric';
      options.month = 'short';
      options.day = 'numeric';
      break;
    case 'long':
      options.year = 'numeric';
      options.month = 'long';
      options.day = 'numeric';
      options.weekday = 'long';
      break;
    case 'time':
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.second = '2-digit';
      break;
  }

  return date.toLocaleDateString('en-US', options);
}

// Function to calculate time difference in human-readable format
export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

// Function to generate random ID
export function generateId(prefix: string = '', length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Function to capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Function to convert string to title case
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// Function to truncate text
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

// Function to get priority color/emoji
export function getPriorityDisplay(priority: Priority): { emoji: string; color: string; label: string } {
  switch (priority) {
    case Priority.LOW:
      return { emoji: '🟢', color: 'green', label: 'Low' };
    case Priority.MEDIUM:
      return { emoji: '🟡', color: 'yellow', label: 'Medium' };
    case Priority.HIGH:
      return { emoji: '🟠', color: 'orange', label: 'High' };
    case Priority.URGENT:
      return { emoji: '🔴', color: 'red', label: 'Urgent' };
    default:
      return { emoji: '⚪', color: 'gray', label: 'Unknown' };
  }
}

// Function to get status display
export function getStatusDisplay(status: TaskStatus): { emoji: string; color: string; label: string } {
  switch (status) {
    case TaskStatus.TODO:
      return { emoji: '⏳', color: 'blue', label: 'To Do' };
    case TaskStatus.IN_PROGRESS:
      return { emoji: '🔄', color: 'orange', label: 'In Progress' };
    case TaskStatus.DONE:
      return { emoji: '✅', color: 'green', label: 'Done' };
    case TaskStatus.CANCELLED:
      return { emoji: '❌', color: 'red', label: 'Cancelled' };
    default:
      return { emoji: '❓', color: 'gray', label: 'Unknown' };
  }
}

// Function to get role display
export function getRoleDisplay(role: UserRole): { emoji: string; color: string; label: string } {
  switch (role) {
    case UserRole.ADMIN:
      return { emoji: '👑', color: 'purple', label: 'Administrator' };
    case UserRole.MANAGER:
      return { emoji: '👔', color: 'blue', label: 'Manager' };
    case UserRole.USER:
      return { emoji: '👤', color: 'green', label: 'User' };
    case UserRole.GUEST:
      return { emoji: '👥', color: 'gray', label: 'Guest' };
    default:
      return { emoji: '❓', color: 'gray', label: 'Unknown' };
  }
}

// Function to calculate task completion percentage
export function calculateCompletionRate(tasks: ITask[]): number {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.completed).length;
  return Math.round((completedTasks / tasks.length) * 100);
}

// Function to get tasks due soon
export function getTasksDueSoon(tasks: ITask[], days: number = 7): ITask[] {
  const now = new Date();
  const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));

  return tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    return task.dueDate >= now && task.dueDate <= futureDate;
  });
}

// Function to get overdue tasks
export function getOverdueTasks(tasks: ITask[]): ITask[] {
  const now = new Date();
  return tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    return task.dueDate < now;
  });
}

// Generic debounce function
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

// Generic throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Function to create a range of numbers
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

// Function to chunk array into smaller arrays
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Function to flatten nested arrays
export function flatten<T>(array: (T | T[])[]): T[] {
  return array.reduce<T[]>((acc, val) => {
    return acc.concat(Array.isArray(val) ? flatten(val) : val);
  }, []);
}

// Function to create a simple logger
export function createLogger(prefix: string) {
  return {
    info: (message: string, ...args: any[]) => {
      console.log(`[${prefix}] INFO: ${message}`, ...args);
    },
    warn: (message: string, ...args: any[]) => {
      console.warn(`[${prefix}] WARN: ${message}`, ...args);
    },
    error: (message: string, ...args: any[]) => {
      console.error(`[${prefix}] ERROR: ${message}`, ...args);
    },
    debug: (message: string, ...args: any[]) => {
      console.debug(`[${prefix}] DEBUG: ${message}`, ...args);
    }
  };
}

// Function to measure execution time
export async function measureTime<T>(
  operation: () => Promise<T> | T,
  label: string = 'Operation'
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await operation();
  const end = performance.now();
  const duration = end - start;
  
  console.log(`${label} took ${duration.toFixed(2)} milliseconds`);
  
  return { result, duration };
}
