# Northwestern MPD2 Next.js Starter Template

A production-ready starter template for Northwestern MPD2 master's students, designed to accelerate development with TypeScript, Tailwind CSS, and a TDD framework pre-configured.

## 🎯 Purpose

This starter template provides MPD2 students with:
1. **A Shell Main App** - A starter structure that students replace with their own project ideas
2. **Production-Ready Setup** - TDD framework, TypeScript, Tailwind CSS, and best practices pre-configured
3. **A Database Example** - A working Supabase CRUD example to learn from

## 🏗️ Main App Shell (`/`)

A minimal starter application that students **replace with their own ideas**:
- Clean layout with header, main content, and footer
- Example component showing React hooks and state management
- Links to helpful resources
- Ready for you to build your unique application

## 🚀 Quick Start for Students

### Step 1: Start the Dev Server
```bash
npm install
npm run dev
# Opens on port 5000
```

### Step 2: Understand the Structure
```
.
├── app/                          # Your main application
│   ├── page.tsx                 # 👈 Start here! Replace with your app
│   ├── components/              # 👈 Add your components here
│   │   └── ExampleComponent.tsx # Example to learn from (delete when ready)
│   └── api/                     # API routes
│
├── tests/                       # Your tests (TDD is required!)
├── types/                       # TypeScript type definitions
└── CLAUDE.md                    # Project rules & guidelines
```

### Step 3: Build Your App
1. **Replace the home page** (`app/page.tsx`) with your app's main interface
2. **Add your components** in `app/components/`
3. **Create API routes** in `app/api/` as needed
4. **Write tests first** (TDD) in `tests/`

## 💡 What to Build

Replace the shell app with YOUR idea:
- 🛍️ E-commerce platform
- 📊 Data visualization dashboard
- 🎮 Interactive game
- 📱 Social media app
- 🤖 AI-powered tool
- 📚 Educational platform
- Whatever you imagine!

## 🗄️ Database Integration Example

This template includes a **working Supabase database example** to help you learn how to integrate a database into your app:

- **Live Demo:** Visit `/tasks` to see it in action
- **Full CRUD Operations:** Create, Read, Update, Delete tasks
- **Complete Code Examples:** API routes, UI components, and TypeScript types
- **Security Best Practices:** Row Level Security (RLS) setup and environment variable configuration

### Get Started with the Database Example

📖 **[View Complete Setup Guide →](SUPABASE_SETUP.md)**

The guide includes:
- ✅ Step-by-step Supabase project setup
- ✅ SQL schema and sample data
- ✅ Environment variable configuration
- ✅ Security and RLS best practices
- ✅ API endpoint documentation
- ✅ Troubleshooting tips

**Study the example code** in `app/tasks/`, `app/api/tasks/`, and `lib/supabase.ts` to understand how to build database-backed features in your own app!

## 🛠️ Pre-Configured Tech Stack

| Category | Technology | Why It's Included |
|----------|------------|-------------------|
| **Framework** | Next.js 16 | Industry-standard React framework |
| **Language** | TypeScript | Type safety and better IDE support |
| **Styling** | Tailwind CSS | Rapid UI development |
| **Testing** | Jest + React Testing Library | TDD methodology (required) |
| **Database** | Supabase | Backend example with CRUD operations |

## 📝 Development Workflow

### 1. Always Start with Tests (TDD)
```bash
# Write test first
# Create: tests/unit/app/components/MyComponent.test.tsx

# Run tests (they should fail - RED)
npm test

# Write code to pass tests - GREEN
# Create: app/components/MyComponent.tsx

# Run tests again (they should pass)
npm test
```

### 2. Run Your Development Server
```bash
npm run dev
# Opens on port 5000
```

### 3. Check Test Coverage
```bash
npm run test:coverage
# Minimum 80% coverage required
```

## 🎨 Customization Guide

### Changing the Main App
1. **Home Page**: Edit `app/page.tsx`
2. **Global Styles**: Modify `app/globals.css`
3. **Layout**: Update `app/layout.tsx`
4. **Colors**: Adjust Tailwind config in `tailwind.config.js`

### Adding Features
1. **New Page**: Create `app/your-feature/page.tsx`
2. **API Route**: Create `app/api/your-endpoint/route.ts`
3. **Component**: Create `app/components/YourComponent.tsx`
4. **Test**: Create `tests/unit/app/components/YourComponent.test.tsx`

## 🔒 Security & Best Practices

### Built-In Security
- Path traversal prevention
- TypeScript for type safety
- Environment variables for secrets

### Required Practices
- **TDD**: Write tests before code
- **Coverage**: Maintain >80% test coverage
- **Types**: Use TypeScript types
- **Secrets**: Never commit API keys (use environment variables)

## 📋 Assignment Checklist

Before submitting your project:
- [ ] Replaced shell app with your unique idea
- [ ] All features have tests (TDD)
- [ ] Test coverage >80%
- [ ] TypeScript types defined
- [ ] No hardcoded secrets
- [ ] Code follows project structure

## 🆘 Getting Help

### Resources
- **Project Rules**: See `CLAUDE.md`
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **React**: https://react.dev

### Common Issues

**Changes not showing?**
- Restart the dev server
- Check the console for errors
- Clear browser cache

**Tests failing?**
- Read error messages carefully
- Check test file location
- Ensure proper imports

**Type errors?**
- Define types in `types/index.ts`
- Use proper TypeScript syntax
- Check tsconfig.json

## 🎓 Learning Objectives

This starter template helps you learn:
1. **Modern web development** with Next.js and React
2. **Test-Driven Development** methodology
3. **TypeScript** for production code
4. **Component-based architecture**
5. **API development** with Next.js routes

## 🚢 Deployment

When ready to deploy:
1. Ensure all tests pass
2. Build production version: `npm run build`
3. Deploy to your hosting platform of choice
4. Set environment variables in your host's configuration

## 📄 License

ISC - This is your starter template to build upon!

---

**Remember**: This is YOUR canvas. The shell app is just a starting point - replace it with your creative vision and make something amazing! 🌟

**Happy Coding!**
*Northwestern MPD2 Program*
