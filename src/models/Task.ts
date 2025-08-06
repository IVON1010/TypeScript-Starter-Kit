/**
 * Task class implementation
 * Demonstrates TypeScript classes, access modifiers, getters/setters, and methods
 */

import { ITask, Priority, TaskStatus, CreateTaskInput, UpdateTaskInput } from './types.js';

export class Task implements ITask {
  // Public readonly property - can be accessed but not modified
  public readonly id: string;
  
  // Public properties - can be accessed and modified
  public title: string;
  public description?: string;
  public priority: Priority;
  public status: TaskStatus;
  public assignedTo?: string;
  public readonly createdAt: Date;
  public updatedAt: Date;
  public dueDate?: Date;
  public tags: string[];

  // Private property - only accessible within this class
  private _completed: boolean;

  constructor(input: CreateTaskInput & { id: string }) {
    this.id = input.id;
    this.title = input.title;
    this.description = input.description;
    this.priority = input.priority || Priority.MEDIUM;
    this.status = TaskStatus.TODO;
    this.assignedTo = input.assignedTo;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.dueDate = input.dueDate;
    this.tags = input.tags || [];
    this._completed = false;
  }

  // Getter for completed status - demonstrates computed properties
  public get completed(): boolean {
    return this._completed;
  }

  // Public method to mark task as complete
  public markComplete(): void {
    this._completed = true;
    this.status = TaskStatus.DONE;
    this.updatedAt = new Date();
  }

  // Public method to mark task as incomplete
  public markIncomplete(): void {
    this._completed = false;
    this.status = TaskStatus.TODO;
    this.updatedAt = new Date();
  }

  // Method to update task properties
  public update(updates: UpdateTaskInput): void {
    // Use object destructuring and optional chaining
    const { title, description, priority, assignedTo, dueDate, tags } = updates;

    if (title !== undefined) this.title = title;
    if (description !== undefined) this.description = description;
    if (priority !== undefined) this.priority = priority;
    if (assignedTo !== undefined) this.assignedTo = assignedTo;
    if (dueDate !== undefined) this.dueDate = dueDate;
    if (tags !== undefined) this.tags = [...tags]; // Create new array to avoid mutation

    this.updatedAt = new Date();
  }

  // Method to add a tag
  public addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
  }

  // Method to remove a tag
  public removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
      this.updatedAt = new Date();
    }
  }

  // Method to check if task is overdue
  public isOverdue(): boolean {
    if (!this.dueDate || this.completed) {
      return false;
    }
    return new Date() > this.dueDate;
  }

  // Method to get days until due date
  public getDaysUntilDue(): number | null {
    if (!this.dueDate) return null;
    
    const now = new Date();
    const diffTime = this.dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  // Method to get task summary
  public getSummary(): string {
    const statusEmoji = this.getStatusEmoji();
    const priorityText = this.priority.toUpperCase();
    const dueText = this.dueDate ? ` (Due: ${this.dueDate.toLocaleDateString()})` : '';
    
    return `${statusEmoji} [${priorityText}] ${this.title}${dueText}`;
  }

  // Private method to get status emoji
  private getStatusEmoji(): string {
    switch (this.status) {
      case TaskStatus.TODO:
        return '⏳';
      case TaskStatus.IN_PROGRESS:
        return '🔄';
      case TaskStatus.DONE:
        return '✅';
      case TaskStatus.CANCELLED:
        return '❌';
      default:
        return '📝';
    }
  }

  // Method to convert task to plain object (useful for JSON serialization)
  public toJSON(): ITask {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      priority: this.priority,
      status: this.status,
      assignedTo: this.assignedTo,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      dueDate: this.dueDate,
      tags: [...this.tags] // Return copy of array
    };
  }

  // Static method to create task from plain object
  public static fromJSON(data: ITask): Task {
    const task = new Task({
      id: data.id,
      title: data.title,
      description: data.description,
      priority: data.priority,
      assignedTo: data.assignedTo,
      dueDate: data.dueDate,
      tags: data.tags
    });

    // Set private/readonly properties that can't be set in constructor
    (task as any)._completed = data.completed;
    (task as any).status = data.status;
    (task as any).createdAt = data.createdAt;
    task.updatedAt = data.updatedAt;

    return task;
  }

  // Method to clone the task
  public clone(): Task {
    return Task.fromJSON(this.toJSON());
  }

  // Method to validate task data
  public validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.title || this.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (this.title && this.title.length > 200) {
      errors.push('Title must be less than 200 characters');
    }

    if (this.description && this.description.length > 1000) {
      errors.push('Description must be less than 1000 characters');
    }

    if (this.dueDate && this.dueDate < this.createdAt) {
      errors.push('Due date cannot be before creation date');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
