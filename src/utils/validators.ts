/**
 * Validation utilities and type guards
 * Demonstrates TypeScript type guards, runtime type checking, and validation patterns
 */

import { ITask, IUser, Priority, TaskStatus, UserRole } from '../models/types.js';

// Type guard to check if value is a string
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// Type guard to check if value is a number
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

// Type guard to check if value is a boolean
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

// Type guard to check if value is a Date
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

// Type guard to check if value is an array
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

// Type guard to check if value is an object (not null, not array)
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Type guard for Priority enum
export function isPriority(value: unknown): value is Priority {
  return isString(value) && Object.values(Priority).includes(value as Priority);
}

// Type guard for TaskStatus enum
export function isTaskStatus(value: unknown): value is TaskStatus {
  return isString(value) && Object.values(TaskStatus).includes(value as TaskStatus);
}

// Type guard for UserRole enum
export function isUserRole(value: unknown): value is UserRole {
  return isString(value) && Object.values(UserRole).includes(value as UserRole);
}

// Type guard to check if object is a valid Task
export function isTask(obj: unknown): obj is ITask {
  if (!isObject(obj)) return false;

  const task = obj as Record<string, unknown>;

  return (
    isString(task.id) &&
    isString(task.title) &&
    isBoolean(task.completed) &&
    isPriority(task.priority) &&
    isTaskStatus(task.status) &&
    isDate(task.createdAt) &&
    isDate(task.updatedAt) &&
    isArray(task.tags) &&
    task.tags.every(isString) &&
    (task.description === undefined || isString(task.description)) &&
    (task.assignedTo === undefined || isString(task.assignedTo)) &&
    (task.dueDate === undefined || isDate(task.dueDate))
  );
}

// Type guard to check if object is a valid User
export function isUser(obj: unknown): obj is IUser {
  if (!isObject(obj)) return false;

  const user = obj as Record<string, unknown>;

  return (
    isString(user.id) &&
    isString(user.name) &&
    isString(user.email) &&
    isUserRole(user.role) &&
    isBoolean(user.isActive) &&
    isDate(user.createdAt) &&
    isObject(user.preferences) &&
    (user.lastLogin === undefined || isDate(user.lastLogin))
  );
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password strength validation
export function isStrongPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}

// Validate task title
export function isValidTaskTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 200;
}

// Validate task description
export function isValidTaskDescription(description: string): boolean {
  return description.length <= 1000;
}

// Validate user name
export function isValidUserName(name: string): boolean {
  return name.trim().length > 0 && name.length <= 100;
}

// Generic validation function
export function validateRequired<T>(value: T | undefined | null, fieldName: string): string | null {
  if (value === undefined || value === null) {
    return `${fieldName} is required`;
  }
  if (isString(value) && value.trim().length === 0) {
    return `${fieldName} cannot be empty`;
  }
  return null;
}

// Validate string length
export function validateStringLength(
  value: string,
  fieldName: string,
  minLength: number = 0,
  maxLength: number = Infinity
): string | null {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  if (value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters long`;
  }
  return null;
}

// Validate date range
export function validateDateRange(startDate: Date, endDate: Date): string | null {
  if (startDate >= endDate) {
    return 'Start date must be before end date';
  }
  return null;
}

// Validate future date
export function validateFutureDate(date: Date, fieldName: string): string | null {
  if (date <= new Date()) {
    return `${fieldName} must be in the future`;
  }
  return null;
}

// Comprehensive task validation
export function validateTaskData(taskData: Partial<ITask>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate title
  if (taskData.title !== undefined) {
    const titleError = validateRequired(taskData.title, 'Title');
    if (titleError) errors.push(titleError);
    else {
      const lengthError = validateStringLength(taskData.title, 'Title', 1, 200);
      if (lengthError) errors.push(lengthError);
    }
  }

  // Validate description
  if (taskData.description !== undefined && taskData.description !== null) {
    const lengthError = validateStringLength(taskData.description, 'Description', 0, 1000);
    if (lengthError) errors.push(lengthError);
  }

  // Validate priority
  if (taskData.priority !== undefined && !isPriority(taskData.priority)) {
    errors.push('Invalid priority value');
  }

  // Validate status
  if (taskData.status !== undefined && !isTaskStatus(taskData.status)) {
    errors.push('Invalid status value');
  }

  // Validate due date
  if (taskData.dueDate !== undefined && taskData.dueDate !== null) {
    if (!isDate(taskData.dueDate)) {
      errors.push('Due date must be a valid date');
    }
  }

  // Validate tags
  if (taskData.tags !== undefined) {
    if (!isArray(taskData.tags)) {
      errors.push('Tags must be an array');
    } else if (!taskData.tags.every(isString)) {
      errors.push('All tags must be strings');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Comprehensive user validation
export function validateUserData(userData: Partial<IUser>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate name
  if (userData.name !== undefined) {
    const nameError = validateRequired(userData.name, 'Name');
    if (nameError) errors.push(nameError);
    else {
      const lengthError = validateStringLength(userData.name, 'Name', 1, 100);
      if (lengthError) errors.push(lengthError);
    }
  }

  // Validate email
  if (userData.email !== undefined) {
    const emailError = validateRequired(userData.email, 'Email');
    if (emailError) errors.push(emailError);
    else if (!isValidEmail(userData.email)) {
      errors.push('Invalid email format');
    }
  }

  // Validate role
  if (userData.role !== undefined && !isUserRole(userData.role)) {
    errors.push('Invalid user role');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Sanitize string input
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

// Sanitize email
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Check if value is empty (null, undefined, empty string, empty array, empty object)
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (isString(value)) return value.trim().length === 0;
  if (isArray(value)) return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
}

// Deep validation for nested objects
export function validateNested<T>(
  obj: unknown,
  validator: (obj: unknown) => obj is T,
  fieldName: string
): string | null {
  if (!validator(obj)) {
    return `${fieldName} is not valid`;
  }
  return null;
}
