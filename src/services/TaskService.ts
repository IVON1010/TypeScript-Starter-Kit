/**
 * TaskService class - demonstrates generics, CRUD operations, and service patterns
 * This service manages tasks with full CRUD functionality and advanced filtering
 */

import { Task } from '../models/Task.js';
import { ITask, TaskFilters, TaskStatus, Priority, ApiResponse, PaginationOptions } from '../models/types.js';

export class TaskService {
  private tasks: Task[] = [];
  private nextId: number = 1;

  // Generic method to generate IDs
  private generateId(): string {
    return `task_${this.nextId++}`;
  }

  // Create a new task
  public async create(taskData: Omit<ITask, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'status'>): Promise<ApiResponse<Task>> {
    try {
      const task = new Task({
        ...taskData,
        id: this.generateId()
      });

      const validation = task.validate();
      if (!validation.isValid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`,
          timestamp: new Date()
        };
      }

      this.tasks.push(task);

      return {
        success: true,
        data: task,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date()
      };
    }
  }

  // Get task by ID
  public async getById(id: string): Promise<ApiResponse<Task>> {
    try {
      const task = this.tasks.find(t => t.id === id);
      
      if (!task) {
        return {
          success: false,
          error: `Task with ID ${id} not found`,
          timestamp: new Date()
        };
      }

      return {
        success: true,
        data: task,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date()
      };
    }
  }

  // Get all tasks with optional filtering and pagination
  public async getAll(
    filters?: TaskFilters,
    pagination?: PaginationOptions
  ): Promise<ApiResponse<{ tasks: Task[]; total: number; page?: number; totalPages?: number }>> {
    try {
      let filteredTasks = [...this.tasks];

      // Apply filters
      if (filters) {
        filteredTasks = this.applyFilters(filteredTasks, filters);
      }

      // Apply sorting
      if (pagination?.sortBy) {
        filteredTasks = this.applySorting(filteredTasks, pagination.sortBy, pagination.sortOrder || 'asc');
      }

      const total = filteredTasks.length;

      // Apply pagination
      if (pagination) {
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        filteredTasks = filteredTasks.slice(startIndex, endIndex);

        return {
          success: true,
          data: {
            tasks: filteredTasks,
            total,
            page: pagination.page,
            totalPages: Math.ceil(total / pagination.limit)
          },
          timestamp: new Date()
        };
      }

      return {
        success: true,
        data: {
          tasks: filteredTasks,
          total
        },
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date()
      };
    }
  }

  // Update a task
  public async update(id: string, updates: Partial<ITask>): Promise<ApiResponse<Task>> {
    try {
      const taskIndex = this.tasks.findIndex(t => t.id === id);
      
      if (taskIndex === -1) {
        return {
          success: false,
          error: `Task with ID ${id} not found`,
          timestamp: new Date()
        };
      }

      const task = this.tasks[taskIndex];
      
      // Apply updates
      if (updates.title !== undefined) task.title = updates.title;
      if (updates.description !== undefined) task.description = updates.description;
      if (updates.priority !== undefined) task.priority = updates.priority;
      if (updates.assignedTo !== undefined) task.assignedTo = updates.assignedTo;
      if (updates.dueDate !== undefined) task.dueDate = updates.dueDate;
      if (updates.tags !== undefined) task.tags = [...updates.tags];
      if (updates.status !== undefined) task.status = updates.status;
      
      task.updatedAt = new Date();

      const validation = task.validate();
      if (!validation.isValid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`,
          timestamp: new Date()
        };
      }

      return {
        success: true,
        data: task,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date()
      };
    }
  }

  // Delete a task
  public async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const taskIndex = this.tasks.findIndex(t => t.id === id);
      
      if (taskIndex === -1) {
        return {
          success: false,
          error: `Task with ID ${id} not found`,
          timestamp: new Date()
        };
      }

      this.tasks.splice(taskIndex, 1);

      return {
        success: true,
        data: true,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date()
      };
    }
  }

  // Mark task as complete
  public async markComplete(id: string): Promise<ApiResponse<Task>> {
    try {
      const task = this.tasks.find(t => t.id === id);
      
      if (!task) {
        return {
          success: false,
          error: `Task with ID ${id} not found`,
          timestamp: new Date()
        };
      }

      task.markComplete();

      return {
        success: true,
        data: task,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date()
      };
    }
  }

  // Get tasks by user
  public async getTasksByUser(userId: string): Promise<ApiResponse<Task[]>> {
    try {
      const userTasks = this.tasks.filter(task => task.assignedTo === userId);

      return {
        success: true,
        data: userTasks,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date()
      };
    }
  }

  // Get overdue tasks
  public async getOverdueTasks(): Promise<ApiResponse<Task[]>> {
    try {
      const overdueTasks = this.tasks.filter(task => task.isOverdue());

      return {
        success: true,
        data: overdueTasks,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date()
      };
    }
  }

  // Get task statistics
  public getStatistics(): {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    byPriority: Record<Priority, number>;
    byStatus: Record<TaskStatus, number>;
  } {
    const stats = {
      total: this.tasks.length,
      completed: 0,
      pending: 0,
      overdue: 0,
      byPriority: {
        [Priority.LOW]: 0,
        [Priority.MEDIUM]: 0,
        [Priority.HIGH]: 0,
        [Priority.URGENT]: 0
      },
      byStatus: {
        [TaskStatus.TODO]: 0,
        [TaskStatus.IN_PROGRESS]: 0,
        [TaskStatus.DONE]: 0,
        [TaskStatus.CANCELLED]: 0
      }
    };

    this.tasks.forEach(task => {
      if (task.completed) stats.completed++;
      else stats.pending++;
      
      if (task.isOverdue()) stats.overdue++;
      
      stats.byPriority[task.priority]++;
      stats.byStatus[task.status]++;
    });

    return stats;
  }

  // Private method to apply filters
  private applyFilters(tasks: Task[], filters: TaskFilters): Task[] {
    return tasks.filter(task => {
      // Status filter
      if (filters.status) {
        const statusArray = Array.isArray(filters.status) ? filters.status : [filters.status];
        if (!statusArray.includes(task.status)) return false;
      }

      // Priority filter
      if (filters.priority) {
        const priorityArray = Array.isArray(filters.priority) ? filters.priority : [filters.priority];
        if (!priorityArray.includes(task.priority)) return false;
      }

      // Assigned to filter
      if (filters.assignedTo && task.assignedTo !== filters.assignedTo) {
        return false;
      }

      // Completed filter
      if (filters.completed !== undefined && task.completed !== filters.completed) {
        return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const taskDate = task.createdAt;
        if (taskDate < filters.dateRange.start || taskDate > filters.dateRange.end) {
          return false;
        }
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => task.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }

  // Private method to apply sorting
  private applySorting(tasks: Task[], sortBy: keyof ITask, sortOrder: 'asc' | 'desc'): Task[] {
    return tasks.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return sortOrder === 'asc' ? 1 : -1;
      if (bValue === undefined) return sortOrder === 'asc' ? -1 : 1;

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      else if (aValue > bValue) comparison = 1;

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  // Method to clear all tasks (useful for testing)
  public clear(): void {
    this.tasks = [];
    this.nextId = 1;
  }

  // Method to get task count
  public getCount(): number {
    return this.tasks.length;
  }
}
