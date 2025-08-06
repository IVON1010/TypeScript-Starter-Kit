/**
 * Main application entry point
 * Demonstrates all TypeScript concepts through a practical task management system
 */

import { Task } from './models/Task.js';
import { User } from './models/User.js';
import { TaskService } from './services/TaskService.js';
import { UserService } from './services/UserService.js';
import { 
  Priority, 
  TaskStatus, 
  UserRole, 
  CreateTaskInput, 
  CreateUserInput 
} from './models/types.js';
import { 
  formatDate, 
  getTimeAgo, 
  getPriorityDisplay, 
  getStatusDisplay, 
  getRoleDisplay,
  calculateCompletionRate,
  createLogger
} from './utils/helpers.js';
import { validateTaskData, validateUserData } from './utils/validators.js';

// Create logger for the application
const logger = createLogger('TaskManager');

async function main(): Promise<void> {
  try {
    logger.info('🚀 Starting TypeScript Task Manager Demo');
    
    // Initialize services
    const taskService = new TaskService();
    const userService = new UserService();
    
    console.log('\n' + '='.repeat(60));
    console.log('📚 TYPESCRIPT CONCEPTS DEMONSTRATION');
    console.log('='.repeat(60));
    
    // 1. BASIC TYPES AND INTERFACES
    console.log('\n1️⃣  BASIC TYPES & INTERFACES');
    console.log('-'.repeat(40));
    
    // Demonstrate primitive types
    const taskTitle: string = 'Learn TypeScript';
    const taskPriority: Priority = Priority.HIGH;
    const isCompleted: boolean = false;
    const createdAt: Date = new Date();
    const tags: string[] = ['learning', 'typescript', 'programming'];
    
    console.log(`📝 Task: ${taskTitle}`);
    console.log(`⚡ Priority: ${taskPriority}`);
    console.log(`✅ Completed: ${isCompleted}`);
    console.log(`📅 Created: ${formatDate(createdAt)}`);
    console.log(`🏷️  Tags: ${tags.join(', ')}`);
    
    // 2. ENUMS
    console.log('\n2️⃣  ENUMS');
    console.log('-'.repeat(40));
    
    console.log('📊 Available Priorities:');
    Object.values(Priority).forEach(priority => {
      const display = getPriorityDisplay(priority);
      console.log(`  ${display.emoji} ${display.label} (${priority})`);
    });
    
    console.log('\n📈 Available Task Statuses:');
    Object.values(TaskStatus).forEach(status => {
      const display = getStatusDisplay(status);
      console.log(`  ${display.emoji} ${display.label} (${status})`);
    });
    
    console.log('\n👥 Available User Roles:');
    Object.values(UserRole).forEach(role => {
      const display = getRoleDisplay(role);
      console.log(`  ${display.emoji} ${display.label} (${role})`);
    });
    
    // 3. CLASSES AND METHODS
    console.log('\n3️⃣  CLASSES & METHODS');
    console.log('-'.repeat(40));
    
    // Create users using classes
    const adminResult = await userService.create({
      name: 'Alice Johnson',
      email: 'alice@company.com',
      role: UserRole.ADMIN,
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en',
        timezone: 'UTC'
      }
    });
    
    const managerResult = await userService.create({
      name: 'Bob Smith',
      email: 'bob@company.com',
      role: UserRole.MANAGER
    });
    
    const userResult = await userService.create({
      name: 'Carol Davis',
      email: 'carol@company.com',
      role: UserRole.USER
    });
    
    if (adminResult.success && managerResult.success && userResult.success) {
      const admin = adminResult.data!;
      const manager = managerResult.data!;
      const user = userResult.data!;
      
      console.log(`👑 Admin: ${admin.getDisplayName()}`);
      console.log(`👔 Manager: ${manager.getDisplayName()}`);
      console.log(`👤 User: ${user.getDisplayName()}`);
      
      // Demonstrate method calls
      console.log(`\n🔐 Access Control Examples:`);
      console.log(`  Admin can manage users: ${admin.canManageUsers()}`);
      console.log(`  Manager can manage users: ${manager.canManageUsers()}`);
      console.log(`  User can manage users: ${user.canManageUsers()}`);
      
      // 4. GENERICS AND SERVICES
      console.log('\n4️⃣  GENERICS & SERVICES');
      console.log('-'.repeat(40));
      
      // Create tasks using generic service
      const taskData: CreateTaskInput[] = [
        {
          title: 'Set up development environment',
          description: 'Install Node.js, TypeScript, and VS Code',
          priority: Priority.HIGH,
          assignedTo: user.id,
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          tags: ['setup', 'development']
        },
        {
          title: 'Learn TypeScript basics',
          description: 'Study types, interfaces, and classes',
          priority: Priority.MEDIUM,
          assignedTo: user.id,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          tags: ['learning', 'typescript']
        },
        {
          title: 'Build a sample project',
          description: 'Create a task management application',
          priority: Priority.LOW,
          assignedTo: manager.id,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
          tags: ['project', 'practice']
        }
      ];
      
      const createdTasks: Task[] = [];
      for (const data of taskData) {
        const result = await taskService.create(data);
        if (result.success) {
          createdTasks.push(result.data!);
          console.log(`✅ Created task: ${result.data!.getSummary()}`);
        }
      }
      
      // 5. TYPE GUARDS AND VALIDATION
      console.log('\n5️⃣  TYPE GUARDS & VALIDATION');
      console.log('-'.repeat(40));
      
      // Demonstrate validation
      const invalidTaskData = {
        title: '', // Invalid: empty title
        description: 'A'.repeat(1001), // Invalid: too long
        priority: 'invalid' as any, // Invalid: not a valid priority
      };
      
      const validation = validateTaskData(invalidTaskData);
      console.log(`🔍 Validation result: ${validation.isValid ? 'Valid' : 'Invalid'}`);
      if (!validation.isValid) {
        console.log('❌ Validation errors:');
        validation.errors.forEach(error => console.log(`   • ${error}`));
      }
      
      // 6. UNION TYPES AND OPTIONAL PROPERTIES
      console.log('\n6️⃣  UNION TYPES & OPTIONAL PROPERTIES');
      console.log('-'.repeat(40));
      
      // Demonstrate optional chaining and nullish coalescing
      const task = createdTasks[0];
      console.log(`📝 Task: ${task.title}`);
      console.log(`📄 Description: ${task.description ?? 'No description'}`);
      console.log(`👤 Assigned to: ${task.assignedTo ?? 'Unassigned'}`);
      console.log(`📅 Due date: ${task.dueDate?.toLocaleDateString() ?? 'No due date'}`);
      
      // 7. ARRAY METHODS AND FUNCTIONAL PROGRAMMING
      console.log('\n7️⃣  ARRAY METHODS & FUNCTIONAL PROGRAMMING');
      console.log('-'.repeat(40));
      
      // Filter tasks by priority
      const highPriorityTasks = createdTasks.filter(t => t.priority === Priority.HIGH);
      console.log(`🔥 High priority tasks: ${highPriorityTasks.length}`);
      
      // Map tasks to summaries
      const taskSummaries = createdTasks.map(t => t.getSummary());
      console.log('📋 Task summaries:');
      taskSummaries.forEach(summary => console.log(`   ${summary}`));
      
      // Reduce to calculate completion rate
      const completionRate = calculateCompletionRate(createdTasks);
      console.log(`📊 Completion rate: ${completionRate}%`);
      
      // 8. ASYNC/AWAIT AND PROMISES
      console.log('\n8️⃣  ASYNC/AWAIT & PROMISES');
      console.log('-'.repeat(40));
      
      // Demonstrate async operations
      console.log('⏳ Marking first task as complete...');
      const completeResult = await taskService.markComplete(createdTasks[0].id);
      if (completeResult.success) {
        console.log(`✅ Task completed: ${completeResult.data!.getSummary()}`);
      }
      
      // Get updated statistics
      const stats = taskService.getStatistics();
      console.log('\n📈 Task Statistics:');
      console.log(`   Total: ${stats.total}`);
      console.log(`   Completed: ${stats.completed}`);
      console.log(`   Pending: ${stats.pending}`);
      console.log(`   Overdue: ${stats.overdue}`);
      
      // 9. ERROR HANDLING
      console.log('\n9️⃣  ERROR HANDLING');
      console.log('-'.repeat(40));
      
      // Demonstrate error handling with invalid operations
      const invalidResult = await taskService.getById('invalid-id');
      if (!invalidResult.success) {
        console.log(`❌ Expected error: ${invalidResult.error}`);
      }
      
      // Try to delete a non-existent task
      const deleteResult = await taskService.delete('non-existent');
      if (!deleteResult.success) {
        console.log(`❌ Expected error: ${deleteResult.error}`);
      }
      
      // 10. ADVANCED FEATURES
      console.log('\n🔟 ADVANCED FEATURES');
      console.log('-'.repeat(40));
      
      // Demonstrate filtering and pagination
      const allTasksResult = await taskService.getAll(
        { priority: [Priority.HIGH, Priority.MEDIUM] }, // Filter by priority
        { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' } // Pagination and sorting
      );
      
      if (allTasksResult.success) {
        console.log(`🔍 Filtered tasks: ${allTasksResult.data!.tasks.length} found`);
        console.log(`📄 Page 1 of ${allTasksResult.data!.totalPages || 1}`);
      }
      
      // Demonstrate user management
      const userStats = userService.getUserStatistics();
      console.log('\n👥 User Statistics:');
      console.log(`   Total users: ${userStats.total}`);
      console.log(`   Active users: ${userStats.active}`);
      console.log(`   Recently active: ${userStats.recentlyActive}`);
      console.log('   By role:');
      Object.entries(userStats.byRole).forEach(([role, count]) => {
        const display = getRoleDisplay(role as UserRole);
        console.log(`     ${display.emoji} ${display.label}: ${count}`);
      });
      
      // 11. PRACTICAL EXAMPLES
      console.log('\n1️⃣1️⃣  PRACTICAL EXAMPLES');
      console.log('-'.repeat(40));
      
      // Clone a task
      const clonedTask = task.clone();
      clonedTask.title = 'Cloned: ' + clonedTask.title;
      console.log(`📋 Original: ${task.title}`);
      console.log(`📋 Cloned: ${clonedTask.title}`);
      
      // Add tags to a task
      task.addTag('important');
      task.addTag('urgent');
      console.log(`🏷️  Updated tags: ${task.tags.join(', ')}`);
      
      // Check if task is overdue
      console.log(`⏰ Is overdue: ${task.isOverdue()}`);
      console.log(`📅 Days until due: ${task.getDaysUntilDue() ?? 'No due date'}`);
      
      // User preferences
      user.updatePreferences({ theme: 'dark', notifications: false });
      console.log(`🎨 User theme: ${user.preferences.theme}`);
      console.log(`🔔 Notifications: ${user.preferences.notifications}`);
      
      console.log('\n' + '='.repeat(60));
      console.log('🎉 TYPESCRIPT CONCEPTS DEMONSTRATION COMPLETE!');
      console.log('='.repeat(60));
      
      console.log('\n📚 What you learned:');
      console.log('✅ Basic types (string, number, boolean, Date, arrays)');
      console.log('✅ Interfaces and type definitions');
      console.log('✅ Classes with access modifiers and methods');
      console.log('✅ Enums for named constants');
      console.log('✅ Generics for reusable, type-safe code');
      console.log('✅ Union types and optional properties');
      console.log('✅ Type guards and runtime validation');
      console.log('✅ Async/await and Promise handling');
      console.log('✅ Error handling with typed responses');
      console.log('✅ Array methods and functional programming');
      console.log('✅ Service patterns and dependency management');
      console.log('✅ Utility types (Pick, Omit, Partial)');
      console.log('✅ Module system with imports/exports');
      
      console.log('\n🚀 Next steps:');
      console.log('• Explore the source code in src/ directory');
      console.log('• Try modifying the code to add new features');
      console.log('• Experiment with different TypeScript configurations');
      console.log('• Build your own TypeScript project using these patterns');
      
    } else {
      logger.error('Failed to create initial users');
    }
    
  } catch (error) {
    logger.error('Application error:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run the main function
main().catch((error) => {
  logger.error('Failed to start application:', error);
  process.exit(1);
});
