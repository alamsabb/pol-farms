# Enterprise Poultry Farm Management System

A modern, enterprise-level web application for managing poultry farming operations built with Next.js 15, React 19, TypeScript, and MongoDB.

## 🏗️ Architecture

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **State Management**: Zustand, TanStack Query
- **Authentication**: NextAuth.js v5
- **UI Components**: Radix UI primitives

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes (login, etc.)
│   ├── (private)/         # Protected routes with layout
│   │   ├── dashboard/
│   │   ├── farms/
│   │   ├── batches/
│   │   ├── vendors/
│   │   └── sales/
│   └── layout.tsx
├── features/              # Feature-based modules
│   ├── dashboard/
│   ├── farms/
│   ├── batches/
│   ├── vendors/
│   ├── sales/
│   └── auth/
│       ├── components/    # Feature-specific components
│       ├── hooks/         # Custom hooks
│       ├── services/      # API calls & server actions
│       └── types/         # Feature-specific types
├── shared/               # Shared resources
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   └── layout/       # Layout components
│   ├── hooks/            # Shared custom hooks
│   ├── utils/            # Utility functions
│   └── constants/        # Application constants
├── lib/                  # Core utilities
├── types/                # Global type definitions
└── providers/            # Context providers
```

## 🚀 Features

### 🏡 Farm Management

- Multi-farm operations support
- Capacity tracking and location management
- Real-time farm metrics

### 🐣 Batch Lifecycle Management

- Complete batch tracking from chicks to sale
- Daily feed consumption and mortality recording
- Automated KPI calculations (FCR, mortality rate)
- Real-time bird count updates

### 👥 Vendor Management

- Customer/vendor directory
- Contact management and transaction history

### 💰 Sales & Financial Management

- Transaction recording with automatic calculations
- Payment status tracking
- Revenue analytics and reporting

### 📊 Dashboard & Analytics

- Real-time operational overview
- Key Performance Indicators
- Financial metrics and trends

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- npm/yarn/pnpm

### Installation

1. **Clone and install:**

   ```bash
   git clone <repository-url>
   cd poultry-farm-management
   npm install
   ```

2. **Environment setup:**

   ```bash
   cp .env.local.example .env.local
   ```

   Configure your `.env.local`:

   ```env
   MONGODB_URI=mongodb://localhost:27017/poultry-farm
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Development server:**

   ```bash
   npm run dev
   ```

4. **Access application:**
   Open http://localhost:3000

## 🏢 Enterprise Features

### Route Organization

- **Public Routes**: `/login`, `/register` (no authentication required)
- **Private Routes**: All main application routes with authentication

### Feature-Based Architecture

- Modular design with feature-specific components, hooks, and services
- Clean separation of concerns
- Scalable and maintainable codebase

### Performance Optimizations

- Server-side rendering with Next.js 15
- Optimized database queries with aggregation pipelines
- Efficient state management with Zustand and TanStack Query

### Security

- Role-based access control
- Secure authentication with NextAuth.js v5
- Input validation with Zod schemas

## 📱 Indian Localization

- Currency: Indian Rupees (₹)
- Date format: DD-MM-YYYY
- Number formatting: Indian locale
- Weight units: Kilograms (kg)

## 🚀 Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically

### Other Platforms

- AWS Amplify
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
