# TypeScript Starter Kit - Task Manager

A comprehensive TypeScript starter project that teaches core TypeScript concepts through building a simple task management application. Perfect for developers new to TypeScript who want to learn by doing!

## 🎯 What You'll Learn

This project demonstrates essential TypeScript concepts through practical examples:

- **Basic Types**: string, number, boolean, arrays, objects
- **Interfaces & Type Aliases**: Defining contracts for your data
- **Classes**: Object-oriented programming with TypeScript
- **Enums**: Creating named constants
- **Generics**: Writing reusable, type-safe code
- **Union Types**: Handling multiple possible types
- **Optional Properties**: Making properties optional with `?`
- **Type Guards**: Runtime type checking
- **Modules**: Organizing code with imports/exports
- **Error Handling**: Type-safe error management
- **Modern JavaScript**: async/await, destructuring, optional chaining

## 🚀 Features

- ✅ TypeScript with strict type checking
- ✅ Interactive task management system
- ✅ User management with different roles
- ✅ Data persistence simulation
- ✅ Comprehensive error handling
- ✅ ESLint for code linting
- ✅ Prettier for code formatting
- ✅ Modern ES2020+ features
- ✅ Well-documented code with examples

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Basic JavaScript knowledge

## 🛠️ Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Development mode (with hot reload):**
   ```bash
   npm run dev
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Run the compiled JavaScript:**
   ```bash
   npm start
   ```

5. **Watch mode (auto-compile on changes):**
   ```bash
   npm run watch
   ```

6. **Lint the code:**
   ```bash
   npm run lint
   ```

7. **Format the code:**
   ```bash
   npm run format
   ```

## 📁 Project Structure

```
├── src/
│   ├── index.ts              # Main entry point - demonstrates all concepts
│   ├── models/
│   │   ├── Task.ts          # Task class with methods
│   │   ├── User.ts          # User class with role management
│   │   └── types.ts         # Interfaces, enums, and type definitions
│   ├── services/
│   │   ├── TaskService.ts   # Generic service class for CRUD operations
│   │   └── UserService.ts   # User management service
│   └── utils/
│       ├── validators.ts    # Type guards and validation functions
│       ├── helpers.ts       # Utility functions with generics
│       └── greeting.ts      # Original greeting utilities (kept for reference)
├── dist/                    # Compiled JavaScript output
├── package.json             # Project configuration
├── tsconfig.json            # TypeScript configuration
├── .eslintrc.json           # ESLint configuration
├── .prettierrc              # Prettier configuration
└── README.md               # This file
```

## 🎓 Learning Path

### 1. Start with Basic Types (`src/models/types.ts`)
Learn about interfaces, enums, and type aliases:
```typescript
interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
}

enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}
```

### 2. Explore Classes (`src/models/Task.ts`, `src/models/User.ts`)
See how TypeScript enhances classes with access modifiers and type safety:
```typescript
class Task {
  constructor(
    public readonly id: string,
    public title: string,
    private _completed: boolean = false
  ) {}

  public markComplete(): void {
    this._completed = true;
  }
}
```

### 3. Understand Generics (`src/services/TaskService.ts`)
Learn how to write reusable, type-safe code:
```typescript
class BaseService<T extends { id: string }> {
  protected items: T[] = [];
  
  public add(item: T): void {
    this.items.push(item);
  }
}
```

### 4. Practice Type Guards (`src/utils/validators.ts`)
Learn runtime type checking:
```typescript
function isTask(obj: unknown): obj is Task {
  return typeof obj === 'object' && 
         obj !== null && 
         'id' in obj && 
         'title' in obj;
}
```

### 5. See It All Together (`src/index.ts`)
The main file demonstrates how all concepts work together in a real application.

## 🔧 VS Code Setup

Install these recommended extensions for the best development experience:
- TypeScript and JavaScript Language Features (built-in)
- ESLint
- Prettier - Code formatter
- TypeScript Hero
- Auto Rename Tag
- Bracket Pair Colorizer

## 📚 Key Concepts Explained

### Interfaces vs Types
```typescript
// Interface - can be extended and merged
interface User {
  id: string;
  name: string;
}

// Type alias - more flexible for unions and complex types
type Status = 'pending' | 'completed' | 'cancelled';
```

### Optional Properties
```typescript
interface TaskOptions {
  title: string;
  description?: string;  // Optional property
  dueDate?: Date;       // Optional property
}
```

### Union Types
```typescript
type TaskStatus = 'todo' | 'in-progress' | 'done';
type ID = string | number;
```

### Generics
```typescript
function createArray<T>(items: T[]): T[] {
  return [...items];
}

const numbers = createArray([1, 2, 3]);     // T is number
const strings = createArray(['a', 'b']);    // T is string
```

## 🎯 Try These Exercises

1. **Add a new task priority**: Extend the `Priority` enum with `URGENT`
2. **Create a project model**: Add a `Project` class that can contain multiple tasks
3. **Implement filtering**: Add methods to filter tasks by status or priority
4. **Add validation**: Create more type guards for different data types
5. **Extend user roles**: Add more user roles and permissions

## 🐛 Common TypeScript Errors & Solutions

### Error: Property doesn't exist on type
```typescript
// ❌ Error
const user: any = { name: 'John' };
console.log(user.age); // No error, but unsafe

// ✅ Solution: Use proper typing
interface User {
  name: string;
  age?: number;
}
const user: User = { name: 'John' };
console.log(user.age); // TypeScript knows age might be undefined
```

### Error: Argument of type 'X' is not assignable to parameter of type 'Y'
```typescript
// ❌ Error
function greet(name: string) {
  console.log(`Hello, ${name}`);
}
greet(123); // Error: number is not assignable to string

// ✅ Solution: Use correct types or type conversion
greet(String(123)); // Convert to string
// or
greet('123'); // Use string literal
```

## 🚀 Next Steps

After completing this starter kit, you'll be ready to:
- Build larger TypeScript applications
- Use TypeScript with frameworks like React, Vue, or Angular
- Explore advanced TypeScript features like mapped types and conditional types
- Contribute to open-source TypeScript projects

## 🎯 Learning Prompts & Guided Exercises

Use these prompts to guide your exploration and deepen your understanding of the TypeScript concepts demonstrated in this project:

### 1. **"Explore the Type System"**
*Start here if you're new to TypeScript*

**Prompt**: "Examine the `src/models/types.ts` file and identify 5 different TypeScript features being used. For each feature, explain what it does and why it's useful. Then, try creating your own interface for a 'Project' that could contain multiple tasks."

**What you'll learn**: Basic types, interfaces, enums, optional properties, union types, utility types

**Try this**: Create a new interface and see how TypeScript helps with autocomplete and error checking.

---

### 2. **"Master Classes and OOP Concepts"**
*Perfect for understanding object-oriented programming in TypeScript*

**Prompt**: "Study the `Task.ts` and `User.ts` classes. Compare how private properties, getters/setters, and methods work. Then extend the `Task` class to create a `RecurringTask` class that has additional properties like `frequency` and `nextDueDate`. Implement methods to calculate the next occurrence."

**What you'll learn**: Classes, inheritance, access modifiers, method overriding, encapsulation

**Try this**: Add new functionality while maintaining type safety and proper encapsulation.

---

### 3. **"Understand Generics and Service Patterns"**
*Dive into advanced TypeScript features*

**Prompt**: "Analyze the `TaskService.ts` and `UserService.ts` classes. Notice how they handle CRUD operations and error handling. Create a generic `BaseService<T>` class that both services can extend, reducing code duplication. What challenges do you encounter with generic constraints?"

**What you'll learn**: Generics, inheritance, DRY principles, type constraints, service architecture

**Try this**: Refactor the services to use a common base class while maintaining type safety.

---

### 4. **"Build Type Guards and Validation"**
*Focus on runtime type safety and data validation*

**Prompt**: "Examine the `validators.ts` file and understand how type guards work. Create a new validation system for a 'Comment' type that could be added to tasks. Include type guards, validation functions, and error handling. How do you ensure both compile-time and runtime type safety?"

**What you'll learn**: Type guards, runtime validation, type narrowing, defensive programming

**Try this**: Add a comment system to tasks with full validation and type safety.

---

### 5. **"Extend the Application Architecture"**
*Apply everything you've learned to build new features*

**Prompt**: "Using all the patterns you've observed, add a complete 'Project' feature to the application. Projects should contain multiple tasks, have their own status, and include project-specific statistics. Consider: How will you handle the relationships between projects and tasks? What new types and interfaces do you need? How will you maintain data consistency?"

**What you'll learn**: System design, data relationships, complex type definitions, architectural patterns

**Try this**: Build a feature that integrates with the existing codebase while following established patterns.

---

## 💡 Learning Tips

- **Start Small**: Begin with prompt #1 and work your way through
- **Experiment**: Don't be afraid to break things - that's how you learn!
- **Use TypeScript's Help**: Pay attention to error messages and autocomplete suggestions
- **Read the Code**: The existing code is heavily commented to guide your learning
- **Test Your Changes**: Run `npm run dev` after making changes to see the results

## 📖 Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Definitely Typed](https://github.com/DefinitelyTyped/DefinitelyTyped) - Type definitions for JavaScript libraries

Happy coding! 🎉
