# Junto Mobile App - Setup Guide

## Overview

This is a React Native mobile application built with Expo Router, featuring a clean white theme design, authentication flow, and beautiful UI components using FontAwesome icons.

## Features

- ✨ Clean white theme design
- 🔐 Authentication flow (login screen shown first)
- 🎨 FontAwesome icons throughout the app
- 📱 Bottom tab navigation
- 🎯 Expo Router for file-based routing
- 💾 Zustand for state management
- 🎨 NativeWind (Tailwind CSS) for styling
- 📦 Organized folder structure

## Project Structure

```
junto-frontend/
├── app/                          # Expo Router app directory
│   ├── (auth)/                  # Authentication screens group
│   │   ├── _layout.tsx          # Auth layout
│   │   └── login.tsx            # Login screen
│   ├── (tabs)/                  # Main app tabs group
│   │   ├── _layout.tsx          # Tabs layout with bottom nav
│   │   ├── index.tsx            # Home screen
│   │   ├── categories.tsx       # Categories screen
│   │   ├── deals.tsx            # Add Deal screen
│   │   └── profile.tsx          # Profile screen
│   └── _layout.tsx              # Root layout with auth check
├── shared/                       # Shared resources
│   ├── store/                   # Zustand stores
│   │   └── authStore.ts         # Authentication store
│   ├── types/                   # TypeScript types
│   │   └── index.ts             # Shared types
│   ├── constants/               # Constants
│   │   └── theme.ts             # Theme configuration
│   ├── components/              # Shared components
│   ├── hooks/                   # Custom hooks
│   ├── utils/                   # Utility functions
│   └── services/                # API services
├── src/                         # Legacy source (can be migrated)
├── tailwind.config.js           # Tailwind configuration
├── global.css                   # Global styles
├── metro.config.js              # Metro bundler config
└── package.json                 # Dependencies

```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on a platform:**
   ```bash
   npm run android  # For Android
   npm run ios      # For iOS
   npm run web      # For Web
   ```

## Key Technologies

### Expo Router
- File-based routing system
- Automatic navigation setup
- Deep linking support
- Type-safe navigation

### Authentication Flow
The app uses a protected route pattern:
1. App starts and checks for existing auth token
2. If not authenticated → redirects to `(auth)/login`
3. After successful login → redirects to `(tabs)` (main app)
4. Auth state is managed globally with Zustand

### Theme System
- White background as the main theme
- Clean, modern design with proper spacing
- Consistent color palette defined in `shared/constants/theme.ts`
- All colors, spacing, and typography centralized

### State Management (Zustand)
```typescript
import { useAuthStore } from '../../shared/store/authStore';

// In your component
const { user, login, logout, isAuthenticated } = useAuthStore();
```

### FontAwesome Icons
```typescript
import { FontAwesome5 } from '@expo/vector-icons';

<FontAwesome5 name="home" size={24} color="#6C5DD3" />
```

## Available Screens

### Authentication
- **Login Screen** (`app/(auth)/login.tsx`)
  - Email and password inputs
  - Remember me checkbox
  - Social login options (Google, Facebook, Apple)
  - Beautiful animations
  - Form validation

### Main App (Tabs)
- **Home** (`app/(tabs)/index.tsx`)
  - User greeting
  - Search bar with filter
  - Categories carousel
  - Featured deals
  - Activity stats

- **Categories** (`app/(tabs)/categories.tsx`)
  - Browse all categories
  - Deal counts per category
  - Color-coded icons

- **Add Deal** (`app/(tabs)/deals.tsx`)
  - Form to submit new deals
  - Category selection
  - Price inputs
  - Guidelines info card

- **Profile** (`app/(tabs)/profile.tsx`)
  - User profile information
  - Activity statistics
  - Settings menu
  - Logout functionality

## Customization

### Changing Colors
Edit `shared/constants/theme.ts`:
```typescript
export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#6C5DD3',     // Your primary color
    secondary: '#FF6B9D',   // Your secondary color
    // ... more colors
  },
};
```

### Adding New Screens
1. Create a new file in `app/(tabs)/` for a new tab
2. Or create in `app/` for standalone screens
3. Expo Router will automatically handle routing

### Adding New Icons
Browse FontAwesome 5 icons: https://fontawesome.com/v5/search
```typescript
<FontAwesome5 name="icon-name" size={24} color="#000" />
```

## Environment Setup

Create a `.env` file in the root directory:
```env
API_URL=https://your-api-url.com
```

## API Integration

Update the auth store (`shared/store/authStore.ts`) to connect to your backend:
```typescript
login: async (email: string, password: string) => {
  try {
    // Replace with your API call
    const response = await fetch('YOUR_API_URL/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    // Handle response...
  } catch (error) {
    // Handle error...
  }
},
```

## Typography

Using system fonts by default. To add custom fonts:
1. Add font files to `assets/fonts/`
2. Load them in `app/_layout.tsx`
3. Update `tailwind.config.js` fontFamily

## Building for Production

```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Troubleshooting

### Metro bundler issues
```bash
npm start -- --clear
```

### TypeScript errors
```bash
npx tsc --noEmit
```

### Cache issues
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## Testing

The app includes:
- Pre-filled login credentials for testing
- Mock data for deals and categories
- Simulated API delays

**Test Credentials:**
- Email: `Loisbecket@gmail.com`
- Password: `password123`

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private - All rights reserved

## Support

For issues or questions, please contact the development team.
