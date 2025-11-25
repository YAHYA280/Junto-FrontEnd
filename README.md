# NexTrip Deals - React Native Frontend

A stunning glassmorphism-styled mobile application built with React Native and Expo Go for the Junto Go backend platform. Features time-limited deals across three categories: Hot Deals (24h), Transport (24-48h), and Immobilier (72h).

## Features

- **Glassmorphism UI Design** - Beautiful frosted glass effects with blur backgrounds
- **Animated Components** - Smooth transitions and micro-interactions using Reanimated 2
- **Real-time Countdown Timers** - Live deal expiration tracking
- **Pull-to-Refresh** - Instant deal list updates
- **Category Navigation** - Filter deals by Hot, Transport, and Real Estate
- **User Authentication** - Cookie-based JWT authentication with role management
- **Deal Management** - Create, view, and manage deals (sellers only)
- **Responsive Design** - Optimized for all mobile screen sizes

## Color Palette

```javascript
Primary Colors:
- Dark Blue: #06283D (Deep background)
- Primary Blue: #1363DF (Primary actions)
- Light Blue: #47B5FF (Secondary/highlights)
- Pale Blue: #DFF6FF (Accents/text)
```

## Tech Stack

- **React Native** - Mobile framework
- **Expo Go** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation system
- **Reanimated 2** - Advanced animations
- **Expo Blur** - Glassmorphism effects
- **Expo Linear Gradient** - Beautiful gradients
- **Axios** - API communication
- **AsyncStorage** - Local data persistence

## Project Structure

```
src/
├── assets/              # Images, icons, fonts
├── components/          # Reusable UI components
│   ├── GlassCard.tsx
│   ├── GlassButton.tsx
│   ├── GlassHeader.tsx
│   ├── CategoryTabs.tsx
│   ├── DealCard.tsx
│   └── BottomNav.tsx
├── screens/             # Page-level screens
│   ├── HomeScreen.tsx
│   ├── CategoriesScreen.tsx
│   ├── AddDealScreen.tsx
│   └── ProfileScreen.tsx
├── navigation/          # Navigation logic
│   └── AppNavigator.tsx
├── hooks/               # Custom hooks
│   ├── useFetchDeals.ts
│   └── useTimer.ts
├── context/             # Global state management
│   ├── AuthContext.tsx
│   └── DealsContext.tsx
├── services/            # API layer
│   ├── api.ts
│   ├── authService.ts
│   └── dealsService.ts
├── theme/               # Design system
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── shadows.ts
│   └── glass.ts
└── utils/               # Helper functions
    ├── dateUtils.ts
    ├── priceUtils.ts
    └── validationUtils.ts
```

## Installation

### Prerequisites

- Node.js (v20.15.0 or higher recommended)
- npm or yarn
- Expo Go app installed on your mobile device
- Running Junto Go backend server

### Setup

1. **Clone and navigate to frontend folder:**

   ```bash
   cd junto-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure API endpoint:**

   Edit `src/services/api.ts` and update the API base URL:

   ```typescript
   const API_BASE_URL = "http://YOUR_BACKEND_IP:4000";
   ```

   For local development:

   - iOS Simulator: `http://localhost:4000`
   - Android Emulator: `http://10.0.2.2:4000`
   - Physical Device: `http://YOUR_COMPUTER_IP:4000`

4. **Start the development server:**

   ```bash
   npm start
   ```

5. **Run on device:**
   - Scan QR code with Expo Go app (iOS) or Expo Go app (Android)
   - Or press `i` for iOS simulator / `a` for Android emulator

## Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android device/emulator
npm run ios        #w
Run on iOS simulator (Mac only)
npm run web        # Run in web browser
```

## Backend Integration

This frontend connects to the Junto Go backend. Make sure your backend is running before starting the app.

### API Endpoints Used

**Authentication:**

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/role` - Add user role
- `POST /auth/refresh` - Refresh token

**Deals:**

- `GET /deals/hot` - List hot deals
- `GET /deals/hot/:id` - Get deal details
- `POST /deals/hot` - Create hot deal (seller only)
- `PUT /deals/hot/:id` - Update deal (seller only)
- `DELETE /deals/hot/:id` - Delete deal (seller only)

### Authentication Flow

The app uses cookie-based JWT authentication:

1. User logs in → Receives HTTP-only cookies (`jg_at`, `jg_rt`)
2. Cookies automatically sent with each request
3. Token refresh handled automatically on 401 errors
4. User data cached locally with AsyncStorage

## Components

### Glass Components

**GlassCard** - Translucent card with blur effect

```tsx
<GlassCard variant="card" intensity="medium">
  <Text>Content here</Text>
</GlassCard>
```

**GlassButton** - Animated button with glass effect

```tsx
<GlassButton
  title="Click Me"
  onPress={() => {}}
  variant="primary"
  size="medium"
/>
```

**GlassHeader** - Animated header with search

```tsx
<GlassHeader
  title="NexTrip Deals"
  showSearch={true}
  onSearchChange={(text) => {}}
/>
```

### Deal Components

**CategoryTabs** - Horizontal category selector

```tsx
<CategoryTabs
  activeCategory={category}
  onCategoryChange={(cat) => setCategory(cat)}
/>
```

**DealCard** - Animated deal display card

```tsx
<DealCard deal={dealData} onPress={() => console.log("Deal pressed")} />
```

**BottomNav** - Floating navigation bar

```tsx
<BottomNav activeRoute={route} onRouteChange={(route) => setRoute(route)} />
```

## Screens

### HomeScreen

- Displays active deals in the selected category
- Pull-to-refresh functionality
- Animated header with scroll detection
- Category filtering tabs
- Real-time countdown timers

### CategoriesScreen

- Overview of all deal categories
- Quick navigation to specific categories

### AddDealScreen

- Deal creation form (sellers only)
- Role-based access control
- Authentication check

### ProfileScreen

- User profile information
- Role management
- Login/logout functionality

## Context Providers

### AuthContext

Manages user authentication state:

```tsx
const { user, isAuthenticated, roles, login, logout } = useAuth();
```

### DealsContext

Manages deals data and filtering:

```tsx
const { deals, loading, activeCategory, setActiveCategory } = useDeals();
```

## Custom Hooks

### useFetchDeals

Fetch and paginate deals:

```tsx
const { deals, loading, error, refetch, fetchMore } = useFetchDeals("HOT", 20);
```

### useTimer

Real-time countdown timer:

```tsx
const { days, hours, minutes, seconds, expired, formatted } =
  useTimer(expiresAt);
```

## Utilities

### Date Utils

- `formatDate(dateString)` - Format date as "2d left"
- `isExpired(expiresAt)` - Check if deal expired
- `getTimeLeft(expiresAt)` - Get time breakdown

### Price Utils

- `formatPrice(price, currency)` - Format price display
- `calculateDiscount(original, deal)` - Calculate discount %
- `calculateSavings(original, deal)` - Calculate amount saved

### Validation Utils

- `validateEmail(email)` - Email validation
- `validatePhoneE164(phone)` - Phone number validation
- `validatePassword(password)` - Password strength check

## Styling System

### Theme Structure

```typescript
import { colors, typography, spacing, shadows, glassStyles } from "./theme";

// Usage
<View style={glassStyles.card}>
  <Text style={{ color: colors.text.primary, fontSize: typography.sizes.lg }}>
    Content
  </Text>
</View>;
```

### Glassmorphism Presets

- `glassStyles.light` - Light glass effect
- `glassStyles.medium` - Medium glass effect
- `glassStyles.dark` - Dark glass effect
- `glassStyles.card` - Card glass effect
- `glassStyles.floating` - Floating glass effect

## Known Limitations

1. **Backend Endpoints Missing:**

   - Transport deals (schema exists, no API)
   - Real Estate deals (schema exists, no API)
   - Favorites system
   - Booking system
   - Media upload

2. **Features Not Implemented:**

   - Image upload (expects external URLs)
   - Search functionality
   - Deal filtering/sorting
   - Push notifications
   - Offline mode

3. **Security Notes:**
   - Backend lacks deal ownership verification
   - No rate limiting
   - CSRF middleware not fully enforced

## Future Enhancements

- [ ] Implement Transport and Real Estate deal screens
- [ ] Add image upload with Cloudinary/S3
- [ ] Implement favorites functionality
- [ ] Add booking system
- [ ] Real-time notifications
- [ ] Advanced search and filters
- [ ] Map view for location-based deals
- [ ] User ratings and reviews
- [ ] Deal sharing functionality
- [ ] Offline caching with React Query
- [ ] Dark/Light theme toggle

## Troubleshooting

### "Network Error" when fetching deals

- Ensure backend is running on the correct IP/port
- Update `API_BASE_URL` in `src/services/api.ts`
- Check firewall settings on your computer
- For physical devices, ensure same WiFi network

### Blur effects not working

- Run `npx expo install expo-blur`
- Clear cache: `npx expo start -c`

### Animations not smooth

- Enable Hermes engine (enabled by default in Expo)
- Check device performance
- Reduce animation complexity if needed

### Authentication not persisting

- Check AsyncStorage permissions
- Verify cookies are being set by backend
- Check CORS configuration on backend

## Contributing

This is an MVP frontend. Contributions welcome for:

- Additional screens and features
- Performance optimizations
- Bug fixes
- Documentation improvements

## License

MIT License - See backend for full license details

## Backend Repository

This frontend is designed for the Junto Go backend located in `junto-go-backend/`.

## Contact

For issues or questions about the frontend, please create an issue in the repository.

---

**Built with ❤️ using React Native, Expo, and Glassmorphism Design**
