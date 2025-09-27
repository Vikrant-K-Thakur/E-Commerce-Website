# 🛍️ NXTFIT Clothing — E‑Commerce Website

<div align="center">

**Modern Full-Stack E-Commerce Platform with Customer Storefront & Admin Dashboard**

*Built with Next.js 14, TypeScript, MongoDB, and Tailwind CSS*

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.19.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 🌟 Live Demo

- **🛒 Customer Storefront**: [nxtfitclothing.vercel.app](https://nxtfitclothing.vercel.app/)
- **⚙️ Admin Dashboard**: [nxtfitclothing-admin.vercel.app](https://nxtfitclothing-admin.vercel.app/admin/login)
- **📂 Source Code**: [GitHub Repository](https://github.com/Vikrant-K-Thakur/E-Commerce-Website)

> **Deployment Note**: When deploying, set the correct root folder (`customer-frontend` or `admin-frontend`) in your hosting provider.

---

## 📋 Table of Contents

1. [✨ Features](#-features)
2. [🛠️ Tech Stack](#️-tech-stack)
3. [📁 Project Structure](#-project-structure)
4. [⚡ Quick Start](#-quick-start)
5. [🔧 Environment Setup](#-environment-setup)
6. [🚀 Deployment](#-deployment)
7. [📱 Key Features Deep Dive](#-key-features-deep-dive)
8. [🔍 API Endpoints](#-api-endpoints)
9. [🎨 UI Components](#-ui-components)
10. [🐛 Troubleshooting](#-troubleshooting)
11. [🤝 Contributing](#-contributing)
12. [📄 License](#-license)

---

## ✨ Features

### 🛒 **Customer Frontend**
- **🔐 Authentication**: Email/Password + Google OAuth integration
- **🛍️ Shopping Experience**: Product browsing, filtering, detailed product pages
- **🛒 Cart & Checkout**: Advanced cart management with size selection
- **💰 Rewards System**: Coin-based loyalty program with login bonuses (50 coins)
- **🎟️ Coupon System**: Discount coupons with expiration tracking
- **📍 Delivery Management**: Address management and pickup point selection
- **💳 Payment Integration**: Razorpay payment gateway
- **📱 Responsive Design**: Mobile-first approach with bottom navigation
- **⭐ Reviews & Ratings**: Product review system
- **❤️ Wishlist**: Save favorite products
- **📦 Order Tracking**: Real-time order status updates
- **🔔 Notifications**: In-app notification system
- **👤 Profile Management**: Complete user profile with address management

### ⚙️ **Admin Dashboard**
- **📊 Analytics Dashboard**: Sales metrics and customer insights
- **📦 Product Management**: Full CRUD operations with image uploads
- **👥 Customer Management**: View and manage customer accounts
- **📋 Order Management**: Process and track orders
- **🎯 Marketing Tools**: Manage promotions and discount codes
- **📍 Pickup Points**: Manage delivery locations
- **⭐ Review Management**: Monitor and manage product reviews
- **🎁 Redeem Codes**: Create and manage promotional codes
- **📈 Advanced Analytics**: Detailed sales and performance reports

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 14.2.16 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.1.9 + Tailwind Animate
- **UI Components**: Radix UI + Custom Components
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context API
- **Charts**: Recharts for analytics

### **Backend & Database**
- **Database**: MongoDB 6.19.0
- **Authentication**: Custom JWT + bcryptjs
- **Payment**: Razorpay integration
- **Email**: Nodemailer for notifications
- **File Handling**: Next.js API routes

### **Development & Deployment**
- **Package Manager**: npm/pnpm
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics
- **Fonts**: Geist font family

---

## 📁 Project Structure

```
E-Commerce-Website/
├── 🛒 customer-frontend/          # Customer storefront
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # API routes
│   │   │   ├── auth/              # Authentication endpoints
│   │   │   ├── cart/              # Cart management
│   │   │   ├── customer/          # Customer operations
│   │   │   ├── orders/            # Order processing
│   │   │   ├── products/          # Product data
│   │   │   ├── rewards/           # Loyalty system
│   │   │   └── wallet/            # Payment handling
│   │   ├── addresses/             # Address management
│   │   ├── auth/                  # Authentication pages
│   │   ├── cart/                  # Shopping cart
│   │   ├── checkout/              # Checkout process
│   │   ├── orders/                # Order history
│   │   ├── products/              # Product pages
│   │   ├── profile/               # User profile
│   │   ├── rewards/               # Loyalty program
│   │   ├── wallet/                # Wallet management
│   │   └── wishlist/              # Saved items
│   ├── components/                # Reusable components
│   │   ├── ui/                    # UI components
│   │   ├── auth-guard.tsx         # Route protection
│   │   ├── auth-modal.tsx         # Login/signup modal
│   │   └── bottom-navigation.tsx  # Mobile navigation
│   ├── contexts/                  # React contexts
│   │   ├── auth-context.tsx       # Authentication state
│   │   ├── cart-context.tsx       # Cart state
│   │   └── wishlist-context.tsx   # Wishlist state
│   └── lib/                       # Utilities
│       ├── database.ts            # Database operations
│       └── utils.ts               # Helper functions
│
├── ⚙️ admin-frontend/             # Admin dashboard
│   ├── app/                       # Next.js App Router
│   │   ├── admin/                 # Admin pages
│   │   │   ├── dashboard/         # Main dashboard
│   │   │   ├── products/          # Product management
│   │   │   ├── customers/         # Customer management
│   │   │   ├── orders/            # Order management
│   │   │   ├── analytics/         # Analytics & reports
│   │   │   ├── promotions/        # Marketing tools
│   │   │   └── pickup-points/     # Location management
│   │   └── api/                   # Admin API routes
│   ├── components/                # Admin components
│   │   ├── ui/                    # UI components
│   │   └── admin/                 # Admin-specific components
│   └── lib/                       # Admin utilities
│
└── 📄 README.md                   # Project documentation
```

---

## ⚡ Quick Start

### **Prerequisites**
- Node.js 18.x or newer
- npm or pnpm
- MongoDB database
- Razorpay account (for payments)

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/Vikrant-K-Thakur/E-Commerce-Website.git
cd E-Commerce-Website
```

2. **Setup Customer Frontend**
```bash
cd customer-frontend
npm install
# Create .env.local file (see environment setup below)
npm run dev
# Opens at http://localhost:3000
```

3. **Setup Admin Frontend** (new terminal)
```bash
cd admin-frontend
npm install
# Create .env.local file (see environment setup below)
npm run dev
# Opens at http://localhost:3001
```

---

## 🔧 Environment Setup

### **Customer Frontend (.env.local)**
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nxtfit

# Authentication
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# Payment Gateway
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Email Service
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# App URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
```

### **Admin Frontend (.env.local)**
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nxtfit

# Authentication
JWT_SECRET=your-super-secret-jwt-key
ADMIN_EMAIL=admin@nxtfit.com
ADMIN_PASSWORD=your-admin-password

# App URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3001
```

### **Production Build**
```bash
# In each frontend directory
npm run build
npm run start
```

---

## 🚀 Deployment

### **Vercel Deployment (Recommended)**

1. **Connect Repository**
   - Link your GitHub repository to Vercel
   - Create two separate projects:
     - Customer Frontend (root: `customer-frontend/`)
     - Admin Dashboard (root: `admin-frontend/`)

2. **Environment Variables**
   - Add all environment variables in Vercel project settings
   - Never commit `.env` files to version control

3. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### **Alternative Platforms**
- **Netlify**: Set build directory and environment variables
- **AWS Amplify**: Configure build settings for Next.js
- **Railway/Render**: Set root directory for each frontend

---

## 📱 Key Features Deep Dive

### **🔐 Authentication System**
- **Dual Authentication**: Email/Password + Google OAuth
- **JWT Tokens**: Secure session management
- **Login Bonus**: 50 coins for new users (15-day expiration)
- **Password Security**: bcryptjs encryption

### **💰 Rewards & Loyalty System**
- **Coin System**: 1 coin = ₹1 discount
- **Login Bonus**: 50 coins for new registrations
- **Expiration Tracking**: Automatic coin expiry management
- **Maximum Limits**: Admin-controlled coin limits per product

### **🎟️ Coupon Management**
- **One-Time Use**: Permanent marking after order placement
- **Expiration Dates**: Time-based coupon validity
- **Admin Control**: Create and manage discount coupons

### **📍 Delivery System**
- **Address Management**: Multiple address support
- **Pickup Points**: Predefined collection locations
- **Delivery Options**: Home delivery + pickup point selection

---

## 🔍 API Endpoints

### **Customer API**
```
POST   /api/auth/google          # Google OAuth
POST   /api/customer             # User registration/login
GET    /api/products             # Product listing
POST   /api/cart                 # Cart management
POST   /api/orders               # Order placement
GET    /api/rewards              # Loyalty rewards
POST   /api/reviews              # Product reviews
POST   /api/wallet/add-funds     # Wallet top-up
```

### **Admin API**
```
POST   /api/admin/login          # Admin authentication
GET    /api/admin/dashboard      # Dashboard metrics
CRUD   /api/admin/products       # Product management
GET    /api/admin/customers      # Customer management
GET    /api/admin/orders         # Order management
GET    /api/admin/analytics      # Sales analytics
```

---

## 🎨 UI Components

### **Design System**
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Custom Components**: Branded UI elements
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Theme switching support

### **Key Components**
- `AuthModal`: Login/signup modal
- `BottomNavigation`: Mobile navigation
- `ProductCard`: Product display component
- `CartDrawer`: Shopping cart sidebar
- `AddressForm`: Address management
- `AdminSidebar`: Dashboard navigation

---

## 🐛 Troubleshooting

### **Common Issues**

**🔴 Database Connection Failed**
```bash
# Check MongoDB URI format
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
# Ensure IP whitelist includes your deployment IP
```

**🔴 Authentication Errors**
```bash
# Verify JWT secret is set
JWT_SECRET=your-complex-secret-key
# Check Google OAuth credentials
```

**🔴 Payment Integration Issues**
```bash
# Verify Razorpay keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
# Test with Razorpay test mode first
```

**🔴 Build Failures**
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check TypeScript errors
npm run lint
```

### **Performance Optimization**
- Enable Next.js Image Optimization
- Use MongoDB indexes for queries
- Implement proper caching strategies
- Optimize bundle size with dynamic imports

---

## 🤝 Contributing

### **Development Workflow**
1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** Pull Request with detailed description

### **Code Standards**
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format

### **Testing Guidelines**
- Test authentication flows
- Verify payment integration with test keys
- Check responsive design on multiple devices
- Validate form submissions and error handling

---

## 📄 License

**MIT License** - see [LICENSE](LICENSE) file for details.

### **Contact**

**👨‍💻 Developer**: Vikrant Thakur  
**📧 Email**: [your-email@example.com](mailto:your-email@example.com)  
**🔗 LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)  
**🐙 GitHub**: [@Vikrant-K-Thakur](https://github.com/Vikrant-K-Thakur)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

*Built with ❤️ by Vikrant Thakur*

</div>