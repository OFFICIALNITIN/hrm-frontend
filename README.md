# HR Management System - Frontend

A modern, modular HR Management system built with Next.js 14, TypeScript, and Tailwind CSS, **now with complete authentication system integrated with your NestJS backend**.

## 🚀 Features

### ✅ **Complete Authentication System**
- **JWT Token Management** - Automatic token storage and retrieval
- **Protected Routes** - All pages require authentication
- **Auto Token Injection** - Bearer token automatically added to all API requests
- **Session Management** - Automatic logout on token expiry
- **Login/Logout Flow** - Complete authentication workflow

### ✅ **NestJS Backend Integration**
- **Real API endpoints** - Connected to your NestJS backend
- **Employee management** - Full CRUD operations with your database
- **Department management** - Manage departments through your API
- **Secure API calls** - All requests include authentication headers

## 🔐 **Authentication Flow**

### **Login Process**
1. User enters credentials on login form
2. Frontend calls `/auth/login` endpoint
3. Backend returns JWT token and user data
4. Token stored in localStorage and set in API service
5. User redirected to dashboard

### **API Request Flow**
1. Every API request automatically includes `Authorization: Bearer <token>`
2. If token is invalid/expired (401 response), user is logged out
3. All protected routes require valid authentication

### **Logout Process**
1. Token and user data cleared from localStorage
2. API service token cleared
3. User redirected to login page

## 🔧 Setup Instructions

1. **Start your NestJS backend** (make sure it's running on the correct port)

2. **Configure environment variables**:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   \`\`\`

3. **Install and run the frontend**:
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`

4. **Login with your credentials** - The system will automatically handle token management

## 🎯 **Authentication Features**

### **Login Form**
- Email/password validation
- Show/hide password toggle
- Loading states during authentication
- Error handling with user-friendly messages
- Demo credentials display

### **Protected Routes**
- All pages require authentication
- Automatic redirect to login if not authenticated
- Loading screen while checking authentication status

### **Token Management**
- Automatic token storage in localStorage
- Token included in all API requests
- Automatic logout on token expiry
- Session persistence across browser refreshes

### **User Interface**
- User avatar and name in sidebar
- Logout option in user dropdown
- Real user data from authentication

## 🔄 **API Integration Status**

### ✅ **Fully Integrated with Authentication**
- Employee CRUD operations (with auth headers)
- Department management (with auth headers)
- User management (with auth headers)
- Dashboard statistics (with auth headers)

### 🔄 **Ready for Integration** (when you add these endpoints)
- Leave requests management
- Attendance tracking
- Payroll systems
- Reports generation

## 🛡️ **Security Features**

1. **JWT Token Security**
   - Tokens stored securely in localStorage
   - Automatic token expiry handling
   - Bearer token authentication

2. **Route Protection**
   - All routes protected by authentication
   - Automatic redirect for unauthenticated users

3. **API Security**
   - All API calls include authentication headers
   - Automatic logout on 401 responses
   - Error handling for authentication failures

## 🎨 **Authentication Components**

- `AuthProvider` - Context provider for authentication state
- `ProtectedRoute` - Wrapper for protected pages
- `LoginForm` - Beautiful login interface
- `LoadingScreen` - Loading states during auth checks

## 📋 **Usage**

### **For Development**
\`\`\`bash
# Start your NestJS backend first
npm run start:dev  # in your NestJS project

# Then start the frontend
npm run dev  # in this project
\`\`\`

### **Login Credentials**
Use the credentials from your NestJS backend user system. The login form shows demo credentials for reference.

## 🚀 **What Works Now**

1. **Complete Authentication** - Login/logout with JWT tokens ✅
2. **Protected Routes** - All pages require authentication ✅
3. **Automatic Token Management** - Tokens handled automatically ✅
4. **Secure API Calls** - All requests include auth headers ✅
5. **Session Persistence** - Login state persists across refreshes ✅
6. **Employee Management** - Full CRUD with authentication ✅
7. **Department Management** - Complete interface with auth ✅

Your frontend now has a complete, secure authentication system integrated with your NestJS backend! 🎉

## 🔧 **Customization**

### **Adding New Protected Pages**
Simply add them inside the `ProtectedRoute` wrapper - authentication is handled automatically.

### **Customizing Login Form**
Modify `components/auth/login-form.tsx` to match your design requirements.

### **Adding Role-Based Access**
The user object from authentication can include roles for implementing role-based access control.

## 📄 License

This project is licensed under the MIT License.
