# Learn LMS - Next.js Learning Management System

A modern, full-featured Learning Management System built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn UI components.

## 🚀 Features

### Authentication
- User registration and login
- Role-based access (Student, Instructor, Admin)
- Protected routes and layouts

### Course Management
- Browse and search courses
- Course creation for instructors
- Course enrollment for students
- Course categorization and filtering

### Dashboard
- Personalized dashboard for students and instructors
- Progress tracking
- Course management
- Analytics and statistics

### UI/UX
- Modern, responsive design
- Shadcn UI components
- Dark mode support
- Accessible components

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication route group
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── register/
│   │   │   └── page.tsx         # Registration page
│   │   └── layout.tsx           # Auth layout
│   ├── (dashboard)/             # Dashboard route group
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Dashboard overview
│   │   └── layout.tsx           # Dashboard layout
│   ├── courses/
│   │   ├── page.tsx             # Course browsing
│   │   └── create/
│   │       └── page.tsx         # Course creation
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/
│   ├── ui/                      # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── card.tsx
│   │   ├── avatar.tsx
│   │   └── dropdown-menu.tsx
│   ├── auth/                    # Authentication components
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── courses/                 # Course-related components
│   │   ├── course-card.tsx
│   │   ├── course-grid.tsx
│   │   └── create-course-form.tsx
│   └── dashboard/               # Dashboard components
│       ├── dashboard-header.tsx
│       └── dashboard-sidebar.tsx
├── lib/
│   └── utils.ts                 # Utility functions
├── types/
│   └── index.ts                 # TypeScript type definitions
└── hooks/                       # Custom React hooks (future)
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **State Management**: React hooks (ready for Zustand/Redux)
- **Authentication**: Ready for NextAuth.js/Auth.js
- **Database**: Ready for Prisma + PostgreSQL/MongoDB

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd learn
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Key Features Implemented

### 1. Authentication System
- Login and registration forms
- Role-based user management
- Protected route layouts

### 2. Course Management
- Course browsing with search and filters
- Course creation form for instructors
- Course cards with detailed information
- Responsive course grid layout

### 3. Dashboard
- Personalized dashboard for different user roles
- Statistics and progress tracking
- Navigation sidebar with role-specific menu items
- User profile management

### 4. UI Components
- Complete set of reusable Shadcn UI components
- Responsive design system
- Consistent styling and theming
- Accessibility features

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (when implementing)
DATABASE_URL="your-database-url"

# Authentication (when implementing)
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# API Keys (when implementing external services)
# STRIPE_SECRET_KEY="your-stripe-secret"
# CLOUDINARY_URL="your-cloudinary-url"
```

### Tailwind Configuration

The project uses Tailwind CSS v4 with custom design tokens. The configuration is in `tailwind.config.js` and includes:

- Custom color palette
- Typography scales
- Spacing system
- Component-specific utilities

## 🎨 Design System

The project follows a consistent design system with:

- **Colors**: HSL-based color tokens with dark mode support
- **Typography**: Inter font family with consistent sizing
- **Spacing**: 4px base unit system
- **Components**: Shadcn UI component library
- **Icons**: Lucide React icon set

## 🔮 Future Enhancements

### Planned Features
- [ ] Real authentication with NextAuth.js
- [ ] Database integration with Prisma
- [ ] File upload for course materials
- [ ] Video streaming integration
- [ ] Payment processing with Stripe
- [ ] Real-time notifications
- [ ] Course reviews and ratings
- [ ] Discussion forums
- [ ] Progress certificates
- [ ] Mobile app (React Native)

### Technical Improvements
- [ ] API routes for backend functionality
- [ ] State management with Zustand
- [ ] Form validation with Zod
- [ ] Testing with Jest and React Testing Library
- [ ] CI/CD pipeline
- [ ] Performance optimization
- [ ] SEO improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the component library
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Next.js](https://nextjs.org/) for the React framework
- [Lucide](https://lucide.dev/) for the icon set

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.
