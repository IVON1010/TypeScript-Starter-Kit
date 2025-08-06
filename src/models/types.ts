/**
 * Core type definitions for the Task Manager application
 * This file demonstrates TypeScript interfaces, enums, type aliases, and union types
 */

// Enum for task priorities - demonstrates named constants
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Enum for task status - shows string enums
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
  CANCELLED = 'cancelled'
}

// Enum for user roles - demonstrates role-based access
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  GUEST = 'guest'
}

// Interface for Task - shows required and optional properties
export interface ITask {
  readonly id: string;           // readonly property
  title: string;
  description?: string;          // optional property
  completed: boolean;
  priority: Priority;
  status: TaskStatus;
  assignedTo?: string;          // optional - user ID
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;               // optional due date
  tags: string[];               // array type
}

// Interface for User - demonstrates object structure
export interface IUser {
  readonly id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;             // optional property
  preferences: UserPreferences; // nested interface
}

// Nested interface for user preferences
export interface UserPreferences {
  theme: 'light' | 'dark';      // union type with string literals
  notifications: boolean;
  language: string;
  timezone: string;
}

// Type alias for task creation - shows Partial utility type
export type CreateTaskInput = Omit<ITask, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'status'> & {
  title: string;
  description?: string;
  priority?: Priority;          // optional with default
  assignedTo?: string;
  dueDate?: Date;
  tags?: string[];             // optional with default
};

// Type alias for task updates - shows Partial utility type
export type UpdateTaskInput = Partial<Pick<ITask, 'title' | 'description' | 'priority' | 'assignedTo' | 'dueDate' | 'tags'>>;

// Type alias for user creation
export type CreateUserInput = {
  name: string;
  email: string;
  role?: UserRole;              // optional with default
  preferences?: Partial<UserPreferences>; // optional nested object
};

// Union type for different ID formats
export type ID = string | number;

// Type for API responses - demonstrates generic constraints
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

// Type for pagination
export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: keyof ITask;         // keyof operator
  sortOrder?: 'asc' | 'desc';   // union type
}

// Type for search filters - shows mapped types concept
export interface TaskFilters {
  status?: TaskStatus | TaskStatus[];    // single value or array
  priority?: Priority | Priority[];      // union with array
  assignedTo?: string;
  completed?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}

// Function type definitions - shows function signatures
export type TaskValidator = (task: ITask) => boolean;
export type TaskTransformer<T> = (task: ITask) => T;
export type EventHandler<T> = (event: T) => void;

// Event types for the application
export interface TaskEvent {
  type: 'created' | 'updated' | 'deleted' | 'completed';
  taskId: string;
  userId: string;
  timestamp: Date;
  data?: any;
}

export interface UserEvent {
  type: 'login' | 'logout' | 'created' | 'updated' | 'deactivated';
  userId: string;
  timestamp: Date;
  data?: any;
}

// Utility types for error handling
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface AppError {
  message: string;
  code: string;
  details?: ValidationError[];
}

// Configuration types
export interface AppConfig {
  database: {
    host: string;
    port: number;
    name: string;
  };
  server: {
    port: number;
    host: string;
  };
  features: {
    enableNotifications: boolean;
    maxTasksPerUser: number;
    allowGuestAccess: boolean;
  };
}
