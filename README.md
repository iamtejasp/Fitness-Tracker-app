# FitCoach - AI-Powered Fitness Tracker

A premium mobile fitness dashboard designed around workout history and AI guidance. Track your workouts, identify plateaus, and get personalized coaching for your next set.

## 🎯 Overview

FitCoach is a comprehensive fitness tracking application built with React Native and Expo. It provides users with:

- **Workout Tracking**: Log and track exercises with detailed metrics (sets, reps, weight)
- **Progress Analytics**: Visualize your fitness journey with workout stats and exercise distribution
- **AI Coach**: Get personalized fitness advice based on your workout history
- **User Profiles**: Manage your account and fitness profile
- **Responsive Design**: Beautiful dark-themed UI optimized for mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- Expo CLI (install via `npm install -g expo-cli`)

### Installation

1. **Clone or download the project**

```bash
cd /Users/tejas/Tejas Learning/fitness-tracker-app/mobile
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm start
```

This will start the Expo development server. You can then:

- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Press `w` to open web version
- Scan the QR code with Expo Go app to run on physical device

### Available Scripts

```bash
npm start      # Start Expo development server
npm run ios    # Run on iOS simulator
npm run android # Run on Android emulator
npm run web    # Run on web browser
```

## 📁 Project Structure

```
.
├── app/                     # Expo Router app directory (main navigation)
│   ├── (tabs)/             # Tabbed navigation screens
│   │   ├── index.tsx       # Dashboard/Home screen
│   │   ├── add.tsx         # Add workout screen
│   │   ├── ai.tsx          # AI Coach screen
│   │   ├── profile.tsx     # Profile tab
│   │   ├── progress.tsx    # Progress tracking
│   │   └── workouts.tsx    # Workout history
│   ├── profile/            # Profile management
│   ├── workout/            # Workout details
│   ├── login.tsx           # User login
│   ├── register.tsx        # User registration
│   ├── onboarding.tsx      # Onboarding flow
│   ├── settings.tsx        # App settings
│   └── index.tsx           # Splash screen
├── components/             # Reusable React components
│   ├── AppHeader.tsx       # Header component
│   ├── Button.tsx          # Custom button
│   ├── ChatBubble.tsx      # Chat message component
│   ├── EmptyState.tsx      # Empty state placeholder
│   ├── ExerciseRow.tsx     # Exercise list row
│   ├── Logo.tsx            # App logo
│   ├── Screen.tsx          # Screen wrapper
│   ├── StatCard.tsx        # Stats display card
│   ├── TextField.tsx       # Text input field
│   ├── WorkoutCard.tsx     # Workout summary card
│   └── __tests__/          # Component tests
├── constants/              # App constants
│   ├── theme.ts            # Color palette and styling
│   └── config.ts           # App configuration
├── types/                  # TypeScript interfaces
│   └── api.ts              # API data structures
├── data/                   # Mock data
│   └── mockData.ts         # Sample workouts and users
├── assets/                 # Static assets
│   ├── fonts/              # Custom fonts
│   └── images/             # App icons and images
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
└── app.json                # Expo configuration

```

## 🎨 Key Features

### 1. Dashboard (Home)

- View workout statistics (total workouts, weekly activity, favorite exercises)
- Weekly activity progression chart
- Exercise distribution pie chart
- Quick access to recent workouts
- Suggested exercises based on history

### 2. Workout Tracking

- Add new workouts with multiple exercises
- Log exercise details: sets, reps, and weight
- View complete workout history
- Edit previous workouts
- Delete workouts

### 3. AI Coach

- Chat interface for fitness guidance
- Personalized advice based on workout history
- Tips for breaking plateaus
- Exercise form and technique suggestions
- Contextual recommendations

### 4. Progress Analytics

- Track your fitness journey over time
- Weekly activity visualization
- Exercise type distribution
- Personal statistics and records

### 5. User Management

- User registration and login
- Profile customization
- Account settings
- Personal fitness goals

## 🛠️ Technology Stack

### Core Framework

- **React Native** 0.81.5 - Cross-platform mobile framework
- **React** 19.1.0 - UI library
- **Expo** ~54.0.33 - Development platform and build service
- **Expo Router** ~6.0.23 - File-based routing

### Navigation & UI

- **React Navigation** 7.1.8 - Navigation library
- **Expo Vector Icons** 15.0.3 - Icon library (Ionicons)
- **React Native Reanimated** 4.1.1 - Animations
- **React Native Screens** 4.16.0 - Native screen handling

### Development

- **TypeScript** 5.9.2 - Type-safe JavaScript
- **Expo Font** 14.0.11 - Custom font loading
- **Expo Constants** 18.0.13 - Runtime constants

## 🎨 Design System

### Color Palette

- **Primary**: #7CFF6B (Neon Green) - Primary actions
- **Background**: #080B10 (Dark Navy) - Main background
- **Card**: #151B24 (Slightly lighter navy) - Card backgrounds
- **Text**: #F7FAFC (Off-white) - Primary text
- **Accent Colors**:
  - Coral (#FF775C) - Warnings/alerts
  - Cyan (#5AD7FF) - Secondary actions
  - Amber (#FFB84D) - Highlights

### Theme

Dark mode UI optimized for night-time training sessions and reduced eye strain.

## 📊 Data Models

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}
```

### Workout

```typescript
interface Workout {
  id: string;
  date: string;
  exercises: Exercise[];
  createdAt: string;
}
```

### Exercise

```typescript
interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}
```

### WorkoutStats

```typescript
interface WorkoutStats {
  totalWorkouts: number;
  workoutsThisWeek: number;
  mostFrequentExercise: string | null;
}
```

## 🔐 Authentication

The app includes authentication screens:

- **Login**: For existing users
- **Register**: For new user creation
- **Onboarding**: Initial setup flow after registration

Currently using mock data for demonstration. Ready to integrate with backend API.

## 📱 Responsive Design

- **Portrait orientation** - Optimized for mobile devices
- **Safe area handling** - Proper handling of notches and safe areas
- **Tablet support** (iOS) - Responsive layout on larger screens

## 🚀 Build & Deployment

### For iOS

```bash
npm run ios
```

Or build for production:

```bash
eas build --platform ios
```

### For Android

```bash
npm run android
```

Or build for production:

```bash
eas build --platform android
```

### For Web

```bash
npm run web
```

## 🔄 API Integration Points

The app is structured to easily integrate with a backend API. Current mock data shows the expected data structures for:

- User authentication
- Workout CRUD operations
- AI coaching responses
- Workout statistics

## 📝 Development Notes

- **State Management**: Currently using local component state and mock data
- **Navigation**: File-based routing with Expo Router
- **Styling**: React Native StyleSheet for native performance
- **Icons**: Ionicons from Expo Vector Icons
- **Type Safety**: Full TypeScript support

## 🛣️ Future Enhancements

- Backend API integration
- Real-time synchronization
- Social features (share workouts, friend groups)
- Advanced analytics and insights
- Custom workout plans
- Nutrition tracking
- Wearable device integration
- Push notifications
- Offline mode

## 📄 License

Private project

## 👤 Author

Tejas

---

## 🤝 Support

For questions or issues, please refer to the project structure and component documentation in the code.

---

**Last Updated**: May 2026
