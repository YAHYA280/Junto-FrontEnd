# NexTrip Deals - Quick Start Guide

## ✅ Your App is Ready!

The React Native Expo frontend has been successfully created with stunning glassmorphism design!

## 🚀 How to Run the App

### Option 1: Physical Device (Recommended - Easiest)

1. **Install Expo Go App**
   - iOS: [Download from App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Download from Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start the Development Server**
   ```bash
   cd junto-frontend
   npm start
   ```

3. **Scan QR Code**
   - A QR code will appear in your terminal
   - iOS: Open Camera app and scan QR code
   - Android: Open Expo Go app and tap "Scan QR Code"

4. **Done!** The app will load on your device

### Option 2: iOS Simulator (Mac Only)

```bash
cd junto-frontend
npm run ios
```

### Option 3: Web Browser (For Quick Testing)

```bash
cd junto-frontend
npm run web
```

**Note:** Blur effects won't work in web browser, but you can see the layout.

## ⚠️ Ignore Android SDK Errors

You're seeing these errors:
```
Failed to resolve the Android SDK path
'adb' is not recognized
```

**This is completely normal!** You don't need Android Studio or Android SDK to run the app.

**Solutions:**
- ✅ Use Expo Go app on your physical phone (easiest)
- ✅ Use iOS Simulator if on Mac
- ✅ Use web browser for quick preview
- ⚠️ Only install Android Studio if you want to build native Android apps later

## 📱 What You'll See

Once running, you'll experience:
- 🎨 Beautiful glassmorphism UI with frosted glass effects
- 🌊 Smooth 60 FPS animations
- 🔥 Hot Deals category with real-time countdown timers
- 📱 Bottom navigation with glass effects
- 🎯 Category tabs (Hot Deals, Transport, Immobilier)

## 🔌 Backend Connection

**Important:** Update the API URL before running!

Edit `src/services/api.ts`:

```typescript
// For iOS Simulator
const API_BASE_URL = 'http://localhost:4000';

// For Android Emulator
const API_BASE_URL = 'http://10.0.2.2:4000';

// For Physical Device
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:4000';
```

**Find Your Computer's IP:**
```bash
# Windows
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)

# Mac/Linux
ifconfig
# Look for inet under en0 (e.g., 192.168.1.100)
```

**Start Backend First:**
```bash
cd junto-go-backend
npm run dev
```

## 🎯 Quick Test

1. **Start Backend:**
   ```bash
   cd junto-go-backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd junto-frontend
   npm start
   ```

3. **Open on Phone:**
   - Open Expo Go app
   - Scan QR code
   - App loads with beautiful glassmorphism UI!

## 📂 Project Overview

```
junto-frontend/
├── src/
│   ├── components/      # Glass UI components
│   ├── screens/         # Home, Profile, Categories, AddDeal
│   ├── theme/           # Colors, typography, glass effects
│   ├── services/        # API integration
│   ├── context/         # Auth & Deals state
│   └── navigation/      # App navigation
├── App.tsx              # Main entry
└── package.json         # Dependencies
```

## ✨ Features Implemented

- ✅ Glassmorphism UI Design
- ✅ User Authentication (Register, Login, Logout)
- ✅ Hot Deals Listing
- ✅ Real-time Countdown Timers
- ✅ Category Filtering
- ✅ Pull-to-Refresh
- ✅ Animated Transitions
- ✅ Bottom Navigation
- ✅ Role-based Access (Buyer/Seller)

## 🔧 Common Commands

```bash
# Start development server
npm start

# Clear cache and restart
npx expo start -c

# Run on specific platform
npm run ios      # Mac only
npm run android  # Requires Android Studio
npm run web      # Web browser

# Install dependencies
npm install
```

## 🐛 Troubleshooting

### Issue: Can't connect to backend
**Solution:**
1. Make sure backend is running on port 4000
2. Update API_BASE_URL with your computer's IP
3. Ensure phone and computer on same WiFi network

### Issue: Blank screen
**Solution:**
1. Check terminal for errors
2. Shake device → "Reload"
3. Clear cache: `npx expo start -c`

### Issue: "Network Error"
**Solution:**
1. Verify backend URL is correct
2. Test in browser: `http://YOUR_IP:4000/health`
3. Check firewall settings

### Issue: Animations not smooth
**Solution:**
1. Close other apps on your device
2. Ensure using Expo Go app (not web)
3. Restart Expo server

## 📚 Documentation

- **README.md** - Complete app documentation
- **SETUP.md** - Detailed setup instructions
- **PROJECT_SUMMARY.md** - Technical overview
- **CONTRIBUTING.md** - Development guidelines

## 🎨 Design System

**Colors:**
- Primary: #1363DF (Blue)
- Secondary: #47B5FF (Light Blue)
- Background: #06283D (Dark Blue)
- Accent: #DFF6FF (Pale Blue)

**Key Components:**
- GlassCard - Frosted glass container
- GlassButton - Animated button
- GlassHeader - Scroll-aware header
- CategoryTabs - Horizontal tabs
- DealCard - Rich deal display
- BottomNav - Floating navigation

## 🚀 Next Steps

1. **Test the App** - Run on your phone
2. **Explore Features** - Navigate all screens
3. **Add Test Data** - Create deals via backend
4. **Customize** - Modify colors, add features

## 💡 Tips

- Use Expo Go for fastest development
- Changes auto-reload on save
- Shake device to open dev menu
- Check terminal for errors
- Backend must be running first

## 🎉 You're All Set!

Your beautiful glassmorphism mobile app is ready to run!

**Just do:**
```bash
npm start
```

Then scan the QR code with Expo Go app on your phone.

Enjoy building amazing features! 🚀

---

**Questions?** Check the full README.md or SETUP.md for detailed information.
