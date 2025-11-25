# NexTrip Deals - Quick Setup Guide

## Prerequisites

Before starting, make sure you have:
- ✅ Node.js v20.15.0 or higher
- ✅ npm or yarn package manager
- ✅ Expo Go app on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- ✅ Backend server running (see `junto-go-backend/`)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd junto-frontend
npm install
```

This will install all required packages including:
- React Native & Expo
- Navigation libraries
- Animation libraries (Reanimated)
- Blur effects (expo-blur)
- API communication (axios)

### 2. Configure Backend Connection

Open `src/services/api.ts` and update the API base URL:

**For Development:**

```typescript
// iOS Simulator
const API_BASE_URL = 'http://localhost:4000';

// Android Emulator
const API_BASE_URL = 'http://10.0.2.2:4000';

// Physical Device (same WiFi network)
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:4000';
```

**Finding Your Computer's IP:**

Windows:
```bash
ipconfig
# Look for IPv4 Address under your WiFi adapter
```

Mac/Linux:
```bash
ifconfig
# Look for inet under en0 or wlan0
```

### 3. Start the Backend Server

In a separate terminal:

```bash
cd junto-go-backend
npm run dev
```

Backend should be running on `http://localhost:4000`

### 4. Start the Frontend

```bash
npm start
```

This will:
- Start the Expo development server
- Display a QR code in the terminal
- Open Expo DevTools in your browser

### 5. Run on Your Device

**Option A: Physical Device (Recommended)**
1. Open Expo Go app on your phone
2. Scan the QR code from the terminal
3. Wait for the app to load

**Option B: iOS Simulator (Mac only)**
```bash
npm run ios
```

**Option C: Android Emulator**
```bash
npm run android
```

## Verify Everything Works

### Test Checklist:

1. **App Loads** ✅
   - You see the glassmorphism blue gradient background
   - "NexTrip Deals" header appears at the top
   - Bottom navigation is visible

2. **Navigation Works** ✅
   - Tap Home, Categories, Add Deal, Profile
   - Screens transition smoothly

3. **Backend Connection** ✅
   - Hot Deals should load (if backend has data)
   - Or see empty state if no deals exist

4. **Animations** ✅
   - Scroll the home screen
   - Header should animate on scroll
   - Deal cards should animate on press

## Common Issues & Solutions

### Issue: "Network Error" or No Deals Loading

**Solution:**
1. Check backend is running: Visit `http://localhost:4000/health` in browser
2. Verify API_BASE_URL in `src/services/api.ts`
3. If on physical device, ensure same WiFi network
4. Check firewall isn't blocking port 4000

**Test Backend Connection:**
```bash
# From your phone's browser, visit:
http://YOUR_COMPUTER_IP:4000/health
# Should see: {"ok":true}
```

### Issue: Blur Effects Not Working

**Solution:**
```bash
npx expo install expo-blur
npx expo start -c  # Clear cache
```

### Issue: Animations Stuttering

**Solution:**
1. Make sure you're using Expo Go app (not web browser)
2. Close other apps on your device
3. Restart the development server

### Issue: "Unable to resolve module"

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

### Issue: TypeScript Errors

**Solution:**
```bash
npm install --save-dev @types/react
npx expo start -c
```

## Testing Features

### Test User Authentication

1. Go to **Profile** screen
2. Tap **Register** (or use existing account)
3. Fill in details:
   - Display Name: "Test User"
   - Email: "test@example.com"
   - Password: "Pass123!@#"
4. After registration, you should see your profile

### Test Deal Viewing

1. Go to **Home** screen
2. Pull down to refresh
3. Deals should load from backend
4. Tap a deal card to view (logs to console for now)

### Test Category Switching

1. On **Home** screen
2. Tap **Transport** or **Immobilier** tabs
3. Category should change (empty for now as backend only has Hot Deals)

### Test Seller Features

1. Login as a user
2. Go to **Add Deal** screen
3. Tap **Become a Seller**
4. Now you can create deals (form to be implemented)

## Development Commands

```bash
# Start development server
npm start

# Start with cache cleared
npx expo start -c

# Run on specific platform
npm run ios     # iOS simulator
npm run android # Android emulator
npm run web     # Web browser

# Type checking
npx tsc --noEmit
```

## Environment-Specific URLs

### Development
```
Backend: http://localhost:4000
Frontend: expo://localhost:19000
```

### Production (Future)
```
Backend: https://api.nextrip.com
Frontend: expo://nextrip-deals
```

## Next Steps After Setup

1. **Create Test Data** - Add some deals via backend API or Postman
2. **Test Authentication** - Register and login
3. **Explore Screens** - Navigate through all screens
4. **Check Animations** - Scroll, tap, and interact with components
5. **Test on Multiple Devices** - iOS and Android

## File Structure Overview

```
junto-frontend/
├── App.tsx                 # Main entry point
├── babel.config.js         # Babel configuration
├── app.json               # Expo configuration
├── package.json           # Dependencies
└── src/
    ├── components/        # Reusable UI components
    ├── screens/          # Screen components
    ├── navigation/       # Navigation setup
    ├── context/          # Global state
    ├── services/         # API services
    ├── hooks/            # Custom hooks
    ├── theme/            # Design system
    └── utils/            # Helper functions
```

## Debugging Tips

### Enable Remote Debugging
1. Shake your device
2. Tap "Debug Remote JS"
3. Chrome DevTools will open

### View Network Requests
1. Shake device
2. Tap "Toggle Element Inspector"
3. View component hierarchy

### View Logs
```bash
# Terminal will show:
- Network requests
- Console.log outputs
- Error messages
```

## Performance Tips

1. **Use Release Builds** for better performance:
   ```bash
   expo build:android --release-channel production
   ```

2. **Enable Hermes** (already enabled by default in Expo)

3. **Optimize Images** - Use appropriate sizes and formats

4. **Lazy Load** - Load data as needed, not all at once

## Getting Help

If you encounter issues:

1. Check this SETUP.md guide
2. Review README.md for detailed documentation
3. Check backend logs for API errors
4. Review Expo documentation: https://docs.expo.dev
5. Check React Native docs: https://reactnative.dev

## Success! 🎉

You're ready to build amazing features on top of this glassmorphism foundation!

### What's Already Built:
✅ Beautiful glassmorphism UI
✅ Animated components
✅ Navigation system
✅ Authentication flow
✅ Deal listing and viewing
✅ Category filtering
✅ Real-time timers
✅ Pull-to-refresh

### What You Can Build Next:
- Deal detail screens
- Image upload functionality
- Search and filtering
- Favorites system
- Booking system
- User ratings
- Push notifications
- And much more!

---

**Happy Coding! 🚀**
