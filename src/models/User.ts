/**
 * User class implementation
 * Demonstrates class inheritance concepts, role-based access, and user management
 */

import { IUser, UserRole, UserPreferences, CreateUserInput } from './types.js';

export class User implements IUser {
  public readonly id: string;
  public name: string;
  public email: string;
  public role: UserRole;
  public isActive: boolean;
  public readonly createdAt: Date;
  public lastLogin?: Date;
  public preferences: UserPreferences;

  // Private properties for internal state
  private _loginAttempts: number = 0;
  private _isLocked: boolean = false;

  constructor(input: CreateUserInput & { id: string }) {
    this.id = input.id;
    this.name = input.name;
    this.email = input.email;
    this.role = input.role || UserRole.USER;
    this.isActive = true;
    this.createdAt = new Date();
    
    // Set default preferences if not provided
    const defaultPreferences: UserPreferences = {
      theme: 'light',
      notifications: true,
      language: 'en',
      timezone: 'UTC'
    };
    
    this.preferences = {
      ...defaultPreferences,
      ...input.preferences // Spread operator to override defaults
    };
  }

  // Method to update user profile
  public updateProfile(updates: Partial<Pick<IUser, 'name' | 'email'>>): void {
    if (updates.name !== undefined) {
      this.name = updates.name;
    }
    if (updates.email !== undefined) {
      this.email = updates.email;
    }
  }

  // Method to update user preferences
  public updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = {
      ...this.preferences,
      ...updates
    };
  }

  // Method to change user role (admin only)
  public changeRole(newRole: UserRole, adminUser: User): boolean {
    if (!this.canChangeRole(adminUser)) {
      return false;
    }
    
    this.role = newRole;
    return true;
  }

  // Method to deactivate user
  public deactivate(): void {
    this.isActive = false;
  }

  // Method to activate user
  public activate(): void {
    this.isActive = true;
    this._isLocked = false;
    this._loginAttempts = 0;
  }

  // Method to record login
  public recordLogin(): void {
    this.lastLogin = new Date();
    this._loginAttempts = 0;
    this._isLocked = false;
  }

  // Method to record failed login attempt
  public recordFailedLogin(): void {
    this._loginAttempts++;
    if (this._loginAttempts >= 5) {
      this._isLocked = true;
    }
  }

  // Getter for account locked status
  public get isLocked(): boolean {
    return this._isLocked;
  }

  // Getter for login attempts
  public get loginAttempts(): number {
    return this._loginAttempts;
  }

  // Method to check if user can perform admin actions
  public isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  // Method to check if user can manage other users
  public canManageUsers(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.MANAGER;
  }

  // Method to check if user can change another user's role
  public canChangeRole(targetUser: User): boolean {
    if (!this.isAdmin()) {
      return false;
    }
    
    // Admins can't change other admin roles (prevent lockout)
    if (targetUser.role === UserRole.ADMIN && targetUser.id !== this.id) {
      return false;
    }
    
    return true;
  }

  // Method to check if user can access resource
  public canAccess(requiredRole: UserRole): boolean {
    const roleHierarchy = {
      [UserRole.GUEST]: 0,
      [UserRole.USER]: 1,
      [UserRole.MANAGER]: 2,
      [UserRole.ADMIN]: 3
    };

    return roleHierarchy[this.role] >= roleHierarchy[requiredRole];
  }

  // Method to get user display name
  public getDisplayName(): string {
    return `${this.name} (${this.role})`;
  }

  // Method to get user initials
  public getInitials(): string {
    return this.name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  // Method to check if user has been active recently
  public isRecentlyActive(days: number = 30): boolean {
    if (!this.lastLogin) {
      return false;
    }
    
    const daysSinceLogin = Math.floor(
      (Date.now() - this.lastLogin.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return daysSinceLogin <= days;
  }

  // Method to get account age in days
  public getAccountAge(): number {
    return Math.floor(
      (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // Method to validate user data
  public validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (this.name && this.name.length > 100) {
      errors.push('Name must be less than 100 characters');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Valid email is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Private method to validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Method to convert user to safe object (without sensitive data)
  public toSafeJSON(): Omit<IUser, 'email'> & { email: string } {
    return {
      id: this.id,
      name: this.name,
      email: this.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // Mask email
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin,
      preferences: { ...this.preferences }
    };
  }

  // Method to convert user to full object
  public toJSON(): IUser {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin,
      preferences: { ...this.preferences }
    };
  }

  // Static method to create user from plain object
  public static fromJSON(data: IUser): User {
    const user = new User({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      preferences: data.preferences
    });

    // Set readonly/private properties
    (user as any).createdAt = data.createdAt;
    user.isActive = data.isActive;
    user.lastLogin = data.lastLogin;

    return user;
  }
}
