# Contributing Guide

Thank you for your interest in contributing to Attendance Tracker! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We welcome contributors of all skill levels.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/attendance.git
   cd attendance
   ```
3. **Set up the development environment** (see [SETUP.md](SETUP.md))
4. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Guidelines

### Code Style

#### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow existing code patterns
- Use meaningful variable and function names
- Add JSDoc comments for public functions

```typescript
/**
 * Marks attendance for a student in a session
 * @param sessionId - The session ID
 * @param studentId - The student ID
 * @param status - Attendance status (PRESENT, ABSENT, LATE, EXCUSED)
 * @returns The created/updated attendance record
 */
async function markAttendance(
  sessionId: string,
  studentId: string,
  status: AttendanceStatus
): Promise<Attendance> {
  // Implementation
}
```

#### React Components

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Follow the existing component structure

```tsx
interface StudentCardProps {
  student: Student;
  onClick?: () => void;
}

export function StudentCard({ student, onClick }: StudentCardProps) {
  return (
    <div className="glass-card" onClick={onClick}>
      {/* Component content */}
    </div>
  );
}
```

### Styling

- Use Tailwind CSS classes
- Follow the "Apple Glass" design system:
  - Background: `bg-white/70 backdrop-blur-[20px]`
  - Border radius: `rounded-2xl` (16px) or `rounded-xl` (12px)
  - Shadows: `shadow-glass`
- Keep colors consistent with the theme

### Database Changes

1. Create a migration:
   ```bash
   npx prisma migrate dev --name describe_your_change
   ```
2. Update the seed file if needed
3. Test migrations both up and down

### API Changes

1. Follow RESTful conventions
2. Add input validation using `express-validator`
3. Return consistent error responses
4. Update API documentation

## Commit Messages

Follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(attendance): add bulk attendance marking
fix(auth): resolve token expiration issue
docs(api): update attendance endpoints documentation
```

## Pull Request Process

1. **Update documentation** if your changes affect it
2. **Add tests** for new functionality
3. **Run the test suite** to ensure nothing is broken
4. **Update the CHANGELOG** if applicable
5. **Create a Pull Request** with:
   - Clear title describing the change
   - Description of what and why
   - Screenshots for UI changes
   - Link to related issues

### PR Checklist

- [ ] Code follows the project style guidelines
- [ ] Self-review of the code performed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings introduced
- [ ] Tests pass locally

## Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd web
npm test
```

### Writing Tests

- Write unit tests for utilities and services
- Write integration tests for API endpoints
- Test both success and error cases

## Project Structure

```
attendance/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Entry point
│   │   ├── routes/           # API routes
│   │   │   ├── auth.ts
│   │   │   ├── students.ts
│   │   │   ├── classes.ts
│   │   │   ├── attendance.ts
│   │   │   └── admin.ts
│   │   ├── middleware/       # Express middleware
│   │   │   └── auth.ts
│   │   ├── services/         # Business logic
│   │   └── utils/            # Utilities
│   └── prisma/
│       ├── schema.prisma     # Database schema
│       └── seed.ts           # Seed data
├── web/
│   ├── app/                  # Next.js App Router pages
│   ├── components/           # React components
│   │   ├── ui/               # Base UI components
│   │   └── ...               # Feature components
│   └── lib/                  # Utilities and API client
└── docs/                     # Documentation
```

## Feature Requests & Bug Reports

### Feature Requests

1. Check existing issues first
2. Open a new issue with the `enhancement` label
3. Describe:
   - The problem you're trying to solve
   - Your proposed solution
   - Alternative solutions considered

### Bug Reports

1. Check existing issues first
2. Open a new issue with the `bug` label
3. Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Environment details

## Questions?

Feel free to:
- Open a GitHub Discussion
- Ask in an existing issue
- Reach out to the maintainers

Thank you for contributing! 🎉
