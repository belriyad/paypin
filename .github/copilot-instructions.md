# PayPing - AI Coding Agent Instructions

## Project Overview
PayPing is a React-based payment management platform with Firebase backend. Key architectural principle: **user-specific data isolation** with real-time synchronization across all components.

## Core Architecture

### Data Flow Pattern
```
AuthContext → AppDataContext → Components → FirebaseService → Firestore
```
- **AuthContext** (`src/contexts/AuthContext.jsx`): Google Auth + email/password
- **AppDataContext** (`src/contexts/AppDataContext.jsx`): Central state with Firebase real-time listeners
- **FirebaseService** (`src/services/firebaseService.js`): All database operations with user isolation

### User-Specific Data Model
```
users/{userId}/
├── customers/    # Customer records
├── templates/    # Email/SMS templates  
├── payments/     # Payment tracking
└── settings/     # User preferences
```

**Critical**: All Firebase operations use `getUserCollection()` helper for data isolation.

## Development Workflows

### Essential Commands
```bash
npm run dev        # Start dev server (Vite)
npm run build      # Production build
npm run lint       # ESLint check
```

### Firebase Setup Required
1. Enable Firestore Database in Firebase Console
2. Set environment variables in `.env`:
   ```
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_API_KEY=your-api-key
   # ... other Firebase config
   ```

## Key Patterns

### Firebase Integration Pattern
```javascript
// Always use FirebaseService for database operations
const { addCustomer, customers } = useAppData();
const newCustomer = await addCustomer(data); // Auto-updates UI via real-time listeners
```

### Component State Pattern
- **Loading states**: Use `isInitialized` from AppDataContext for initial load
- **Real-time updates**: Components automatically re-render via Firebase listeners
- **Error handling**: Use `error` and `clearError` from AppDataContext

### Route Protection
```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```
Checks authentication and redirects to login if needed.

## Critical Integration Points

### AppDataContext Usage
```javascript
const { 
  customers, payments, templates, // Real-time data
  addCustomer, updateCustomer,    // CRUD operations  
  loading, error, isInitialized   // UI states
} = useAppData();
```

### Firebase Service Operations
- All methods are async and handle user authentication internally
- Use server timestamps: `serverTimestamp()` for created/updated fields
- Real-time listeners: `onCustomersSnapshot()`, `onPaymentsSnapshot()`, etc.

## Project-Specific Conventions

### File Structure
- `pages/`: Route components (Dashboard, Payments, etc.)
- `components/`: Reusable UI components  
- `contexts/`: React Context providers (Auth, AppData)
- `services/`: External service integrations (Firebase)

### State Management
- **No Redux**: Uses React Context + useReducer pattern
- **Real-time sync**: Firebase listeners update context automatically
- **Optimistic updates**: UI updates immediately, Firebase sync in background

### Authentication Flow
1. User signs in → AuthContext updates
2. AppDataContext initializes user-specific data
3. Real-time listeners establish connection
4. Components render with live data

## Common Debugging

### Firebase Connection Issues
Check `getUserCollection()` throws error if user not authenticated.

### Real-time Updates Not Working
Verify listeners are set up in AppDataContext `useEffect` after `isInitialized`.

### Build Failures
Ensure environment variables are set for production build.
