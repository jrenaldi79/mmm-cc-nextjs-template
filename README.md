# Northwestern MPD2 Next.js Starter Template

A production-ready starter template for Northwestern MPD2 master's students, featuring a dual-app architecture designed to accelerate development while learning the BMAD methodology.

## 🎯 Purpose

This starter template provides MPD2 students with:
1. **A Document Viewer** - Interactive markdown viewer to reference BMAD methodology documentation while coding
2. **A Shell Main App** - A starter structure that students replace with their own project ideas
3. **Production-Ready Setup** - TDD framework, TypeScript, Tailwind CSS, and best practices pre-configured

## 🏗️ Dual-App Architecture

### 1. Document Viewer (`/markdown-preview`)
A built-in markdown documentation viewer that helps students:
- Reference BMAD methodology while coding
- View project documentation with syntax highlighting
- Render Mermaid diagrams for visual understanding
- Keep methodology docs accessible during development

**This viewer stays with your project** - use it to document your own app as you build!

### 2. Main App Shell (`/`)
A minimal starter application that students **replace with their own ideas**:
- Clean layout with header, main content, and footer
- Example component showing React hooks and state management
- Links to helpful resources
- Ready for you to build your unique application

## 🚀 Quick Start for Students

### Step 1: Start with the Template
```bash
# The template is already set up and running
# Access at port 5000 in your Replit webview
```

### Step 2: Understand the Structure
```
.
├── app/                          # Your main application
│   ├── page.tsx                 # 👈 Start here! Replace with your app
│   ├── components/              # 👈 Add your components here
│   │   └── ExampleComponent.tsx # Example to learn from (delete when ready)
│   ├── api/                     # API routes
│   └── markdown-preview/        # Document viewer (keep this!)
│
├── tests/                       # Your tests (TDD is required!)
├── types/                       # TypeScript type definitions
└── replit.md                    # Project rules & guidelines
```

### Step 3: Build Your App
1. **Replace the home page** (`app/page.tsx`) with your app's main interface
2. **Add your components** in `app/components/`
3. **Create API routes** in `app/api/` as needed
4. **Write tests first** (TDD) in `tests/`
5. **Document as you go** using markdown files

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
| **Markdown** | marked + DOMPurify | Documentation & security |
| **Diagrams** | Mermaid | Visual documentation |

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

## 📚 Using the Document Viewer

The markdown viewer at `/markdown-preview` helps you:
- Keep BMAD methodology docs open while coding
- Reference your own project documentation
- View code examples with syntax highlighting
- Understand architecture with Mermaid diagrams

**Pro tip**: Add your own markdown docs as you build - they'll automatically appear in the viewer!

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

### Keep the Document Viewer
The `/markdown-preview` route is independent - your styling changes won't affect it!

## 🔒 Security & Best Practices

### Built-In Security
- XSS protection via DOMPurify
- Path traversal prevention
- TypeScript for type safety
- Environment variables via Replit Secrets

### Required Practices
- **TDD**: Write tests before code
- **Coverage**: Maintain >80% test coverage
- **Types**: Use TypeScript types
- **Secrets**: Never commit API keys (use Replit Secrets)

## 📋 Assignment Checklist

Before submitting your project:
- [ ] Replaced shell app with your unique idea
- [ ] All features have tests (TDD)
- [ ] Test coverage >80%
- [ ] TypeScript types defined
- [ ] Documentation in markdown files
- [ ] No hardcoded secrets
- [ ] Code follows project structure

## 🆘 Getting Help

### Resources
- **BMAD Docs**: Use the `/markdown-preview` viewer
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **React**: https://react.dev

### Common Issues

**Changes not showing?**
- Restart the workflow in Replit
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
6. **Professional documentation** practices

## 🚢 Deployment

When ready to deploy:
1. Ensure all tests pass
2. Build production version: `npm run build`
3. Use Replit's deployment features
4. Set environment variables in Replit Secrets

## 📄 License

ISC - This is your starter template to build upon!

---

**Remember**: This is YOUR canvas. The shell app is just a starting point - replace it with your creative vision and make something amazing! 🌟

**Happy Coding!** 
*Northwestern MPD2 Program*