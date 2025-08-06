/**
 * UserService class - demonstrates user management, role-based access, and service patterns
 */

import { User } from '../models/User.js';
import { IUser, UserRole, CreateUserInput, ApiResponse } from '../models/types.js';

export class UserService {
  private users: User[] = [];
  private nextId: number = 1;

  constructor() {
    // Create default admin user
    this.createDefaultAdmin();
  }

  // Generate unique ID
  private generateId(): string {
    return `user_${this.nextId++}`;
  }

  // Create default admin user
  private createDefaultAdmin(): void {
    const adminUser = new User({
      id: this.generateId(),
      name: 'System Administrator',
      email: 'admin@taskmanager.com',
      role: UserRole.ADMIN,
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en',
        timezone: 'UTC'
      }
    });

    this.users.push(adminUser);
  }

  // Create a new user
  public async create(userData: CreateUserInput, createdBy?: User): Promise<ApiResponse<User>> {
    try {
      // Check if creator has permission (if provided)
      if (createdBy && !createdBy.canManageUsers()) {
        return {
          success: false,
          error: 'Insufficient permissions to create users',
          timestamp: new Date()
        };
      }

      // Check if email already exists
      const existingUser = this.users.find(u => u.email === userData.email);
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists',
          timestamp: new Date()
        };
      }

      const user = new User({
        ...userData,
        id: this.generateId()
      });

      const validation = user.validate();
      if (!validation.isValid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`,
          timestamp: new Date()
        };
      }

      this.users.push(user);

      return {
        success: true,
        data: user,
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

  // Get user by ID
  public async getById(id: string): Promise<ApiResponse<User>> {
    try {
      const user = this.users.find(u => u.id === id);
      
      if (!user) {
        return {
          success: false,
          error: `User with ID ${id} not found`,
          timestamp: new Date()
        };
      }

      return {
        success: true,
        data: user,
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

  // Get user by email
  public async getByEmail(email: string): Promise<ApiResponse<User>> {
    try {
      const user = this.users.find(u => u.email === email);
      
      if (!user) {
        return {
          success: false,
          error: `User with email ${email} not found`,
          timestamp: new Date()
        };
      }

      return {
        success: true,
        data: user,
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

  // Get all users
  public async getAll(requestedBy?: User): Promise<ApiResponse<User[]>> {
    try {
      // Filter based on permissions
      let usersToReturn = [...this.users];

      if (requestedBy && !requestedBy.canManageUsers()) {
        // Regular users can only see active users (limited info)
        usersToReturn = this.users.filter(u => u.isActive);
      }

      return {
        success: true,
        data: usersToReturn,
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

  // Update user
  public async update(
    id: string, 
    updates: Partial<IUser>, 
    updatedBy?: User
  ): Promise<ApiResponse<User>> {
    try {
      const user = this.users.find(u => u.id === id);
      
      if (!user) {
        return {
          success: false,
          error: `User with ID ${id} not found`,
          timestamp: new Date()
        };
      }

      // Check permissions
      if (updatedBy) {
        const canUpdate = updatedBy.id === id || updatedBy.canManageUsers();
        if (!canUpdate) {
          return {
            success: false,
            error: 'Insufficient permissions to update this user',
            timestamp: new Date()
          };
        }

        // Only admins can change roles
        if (updates.role && !updatedBy.isAdmin()) {
          return {
            success: false,
            error: 'Only administrators can change user roles',
            timestamp: new Date()
          };
        }
      }

      // Apply updates
      if (updates.name !== undefined) user.name = updates.name;
      if (updates.email !== undefined) {
        // Check if new email is already taken
        const existingUser = this.users.find(u => u.email === updates.email && u.id !== id);
        if (existingUser) {
          return {
            success: false,
            error: 'Email is already taken by another user',
            timestamp: new Date()
          };
        }
        user.email = updates.email;
      }
      if (updates.role !== undefined) user.role = updates.role;
      if (updates.isActive !== undefined) user.isActive = updates.isActive;
      if (updates.preferences !== undefined) {
        user.updatePreferences(updates.preferences);
      }

      const validation = user.validate();
      if (!validation.isValid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`,
          timestamp: new Date()
        };
      }

      return {
        success: true,
        data: user,
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

  // Delete user
  public async delete(id: string, deletedBy?: User): Promise<ApiResponse<boolean>> {
    try {
      const userIndex = this.users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        return {
          success: false,
          error: `User with ID ${id} not found`,
          timestamp: new Date()
        };
      }

      const userToDelete = this.users[userIndex];

      // Check permissions
      if (deletedBy && !deletedBy.canManageUsers()) {
        return {
          success: false,
          error: 'Insufficient permissions to delete users',
          timestamp: new Date()
        };
      }

      // Prevent deleting the last admin
      if (userToDelete.role === UserRole.ADMIN) {
        const adminCount = this.users.filter(u => u.role === UserRole.ADMIN).length;
        if (adminCount <= 1) {
          return {
            success: false,
            error: 'Cannot delete the last administrator',
            timestamp: new Date()
          };
        }
      }

      this.users.splice(userIndex, 1);

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

  // Authenticate user (simplified)
  public async authenticate(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const user = this.users.find(u => u.email === email);
      
      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials',
          timestamp: new Date()
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          error: 'Account is deactivated',
          timestamp: new Date()
        };
      }

      if (user.isLocked) {
        return {
          success: false,
          error: 'Account is locked due to too many failed login attempts',
          timestamp: new Date()
        };
      }

      // In a real app, you would verify the password hash
      // For this demo, we'll assume authentication is successful
      user.recordLogin();

      return {
        success: true,
        data: user,
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

  // Get users by role
  public async getUsersByRole(role: UserRole): Promise<ApiResponse<User[]>> {
    try {
      const users = this.users.filter(u => u.role === role);

      return {
        success: true,
        data: users,
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

  // Get active users
  public async getActiveUsers(): Promise<ApiResponse<User[]>> {
    try {
      const activeUsers = this.users.filter(u => u.isActive);

      return {
        success: true,
        data: activeUsers,
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

  // Get user statistics
  public getUserStatistics(): {
    total: number;
    active: number;
    inactive: number;
    byRole: Record<UserRole, number>;
    recentlyActive: number;
  } {
    const stats = {
      total: this.users.length,
      active: 0,
      inactive: 0,
      byRole: {
        [UserRole.ADMIN]: 0,
        [UserRole.MANAGER]: 0,
        [UserRole.USER]: 0,
        [UserRole.GUEST]: 0
      },
      recentlyActive: 0
    };

    this.users.forEach(user => {
      if (user.isActive) stats.active++;
      else stats.inactive++;
      
      stats.byRole[user.role]++;
      
      if (user.isRecentlyActive()) stats.recentlyActive++;
    });

    return stats;
  }

  // Method to clear all users except admin (useful for testing)
  public clear(): void {
    const admin = this.users.find(u => u.role === UserRole.ADMIN);
    this.users = admin ? [admin] : [];
    this.nextId = admin ? 2 : 1;
  }

  // Method to get user count
  public getCount(): number {
    return this.users.length;
  }
}
