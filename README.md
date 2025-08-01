# SecurePass - Password Manager

A secure, modern password manager built with React, TypeScript, and Supabase.

## Project Structure

```
├── frontend/                 # Frontend application
│   ├── public/              # Static assets
│   │   └── robots.txt       # SEO configuration
│   └── src/                 # React application source
│       ├── styles/          # CSS styling
│       │   ├── index.css    # Global styles and design tokens
│       │   └── App.css      # Application-specific styles
│       ├── components/      # React components
│       │   ├── ui/          # Reusable UI components
│       │   └── auth/        # Authentication components
│       ├── pages/           # Page components
│       ├── contexts/        # React context providers
│       ├── hooks/           # Custom React hooks
│       ├── lib/             # Utility functions
│       ├── App.tsx          # Main application component
│       ├── main.tsx         # Application entry point
│       └── vite-env.d.ts    # TypeScript environment definitions
├── backend/                 # Backend services
│   ├── integrations/        # External service integrations
│   │   └── supabase/        # Supabase client and types
│   └── supabase/            # Supabase configuration
├── index.html               # Main HTML file
├── vite.config.ts           # Vite build configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── eslint.config.js         # ESLint configuration
└── README.md                # This file
```

## Features

- **Secure Authentication**: Email-based signup/login with password recovery
- **Password Management**: Store, view, edit, and delete passwords securely
- **Responsive Design**: Optimized for desktop and mobile devices
- **Search & Filter**: Find passwords quickly with real-time search
- **Profile Management**: Update personal information and change passwords
- **Modern UI**: Clean, glassmorphism design with smooth animations

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, RLS)
- **Build Tool**: Vite
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context + Hooks

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure Supabase credentials
4. Run development server: `npm run dev`
5. Open http://localhost:8080

## Security Features

- Row Level Security (RLS) policies
- Encrypted password storage
- Secure session management
- HTTPS enforced
- Input validation and sanitization

## Contributing

1. Follow the established project structure
2. Use TypeScript for type safety
3. Follow the design system defined in `frontend/src/styles/`
4. Write clean, maintainable code
5. Test thoroughly before submitting