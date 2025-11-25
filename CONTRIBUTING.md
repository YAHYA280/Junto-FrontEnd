# Contributing to NexTrip Deals Frontend

Thank you for considering contributing to NexTrip Deals! This document provides guidelines and instructions for contributing to the frontend application.

## Development Workflow

### 1. Setting Up Development Environment

```bash
# Clone and navigate to project
cd junto-frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 2. Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `refactor/*` - Code refactoring

### 3. Commit Convention

Use conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(deals): add deal detail screen"
git commit -m "fix(auth): resolve token refresh issue"
git commit -m "docs(readme): update setup instructions"
```

## Code Style Guidelines

### TypeScript

```typescript
// ✅ DO: Use TypeScript for type safety
interface Props {
  title: string;
  onPress: () => void;
}

// ✅ DO: Export types
export interface Deal {
  id: string;
  title: string;
}

// ❌ DON'T: Use 'any' type
const data: any = {};  // Avoid this
```

### React Components

```typescript
// ✅ DO: Use functional components with hooks
export const MyComponent: React.FC<Props> = ({ title, onPress }) => {
  const [state, setState] = useState('');

  return <View>...</View>;
};

// ✅ DO: Extract complex logic to custom hooks
const useMyLogic = () => {
  // Complex logic here
  return { data, loading };
};

// ❌ DON'T: Use class components
class MyComponent extends Component { } // Avoid this
```

### Styling

```typescript
// ✅ DO: Use theme system
import { colors, spacing, typography } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.glass.dark,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
  },
});

// ❌ DON'T: Use hardcoded values
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#06283D',  // Use colors.darkBlue instead
    padding: 20,  // Use spacing.lg instead
  },
});
```

### File Naming

```
✅ Components: PascalCase
   - GlassCard.tsx
   - DealCard.tsx
   - BottomNav.tsx

✅ Utilities: camelCase
   - dateUtils.ts
   - priceUtils.ts

✅ Services: camelCase with 'Service'
   - authService.ts
   - dealsService.ts

✅ Screens: PascalCase with 'Screen'
   - HomeScreen.tsx
   - ProfileScreen.tsx
```

## Adding New Features

### 1. Create a Component

```typescript
// src/components/MyNewComponent.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

interface MyNewComponentProps {
  title: string;
  onPress?: () => void;
}

export const MyNewComponent: React.FC<MyNewComponentProps> = ({
  title,
  onPress
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
  },
  title: {
    color: colors.text.primary,
  },
});
```

### 2. Export from Index

```typescript
// src/components/index.ts
export { MyNewComponent } from './MyNewComponent';
```

### 3. Create a Screen

```typescript
// src/screens/MyNewScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MyNewComponent } from '../components';
import { colors } from '../theme';

export const MyNewScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradients.background}
        style={styles.background}
      >
        <MyNewComponent title="Hello" />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
```

### 4. Add to Navigation

```typescript
// src/navigation/AppNavigator.tsx
import { MyNewScreen } from '../screens';

// Add to navigation logic
```

## Creating API Services

```typescript
// src/services/myNewService.ts
import api from './api';

export interface MyData {
  id: string;
  name: string;
}

class MyNewService {
  async getData(): Promise<MyData[]> {
    try {
      const response = await api.get<{ data: MyData[] }>('/my-endpoint');
      return response.data.data;
    } catch (error) {
      console.error('Get data error:', error);
      throw error;
    }
  }

  async createData(data: Partial<MyData>): Promise<MyData> {
    try {
      const response = await api.post<{ data: MyData }>('/my-endpoint', data);
      return response.data.data;
    } catch (error) {
      console.error('Create data error:', error);
      throw error;
    }
  }
}

export default new MyNewService();
```

## Creating Custom Hooks

```typescript
// src/hooks/useMyHook.ts
import { useState, useEffect } from 'react';
import { myNewService, MyData } from '../services';

export const useMyHook = () => {
  const [data, setData] = useState<MyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await myNewService.getData();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchData };
};
```

## Adding Context

```typescript
// src/context/MyContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MyContextType {
  value: string;
  setValue: (value: string) => void;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
};

interface MyProviderProps {
  children: ReactNode;
}

export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [value, setValue] = useState('');

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};
```

## Testing Guidelines

### Unit Tests (To Implement)

```typescript
// MyComponent.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <MyComponent title="Test" onPress={onPress} />
    );
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

## Pull Request Process

### 1. Before Submitting

- ✅ Code follows style guidelines
- ✅ TypeScript types are correct
- ✅ No console.log statements (use proper logging)
- ✅ Components are documented
- ✅ Tested on iOS and Android
- ✅ No breaking changes (or documented)

### 2. PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Tested with backend

## Screenshots
Add screenshots if UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
```

### 3. Review Process

1. Submit PR to `develop` branch
2. Wait for code review
3. Address feedback
4. Get approval
5. Merge to `develop`

## Common Tasks

### Adding a New Color

```typescript
// src/theme/colors.ts
export const colors = {
  // ... existing colors
  newColor: '#FF5733',
  glass: {
    // ... existing glass colors
    newGlass: 'rgba(255, 87, 51, 0.6)',
  },
};
```

### Adding a New Font Size

```typescript
// src/theme/typography.ts
export const typography = {
  sizes: {
    // ... existing sizes
    newSize: 28,
  },
};
```

### Adding Animation

```typescript
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const MyAnimatedComponent = () => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {/* Content */}
    </Animated.View>
  );
};
```

## Debugging Tips

### Console Logging

```typescript
// Development only
if (__DEV__) {
  console.log('Debug info:', data);
}

// Better: Use a logging service
import { logger } from '../utils/logger';
logger.debug('User logged in', { userId: user.id });
```

### React DevTools

1. Shake device
2. Select "Toggle Element Inspector"
3. Inspect component hierarchy

### Network Debugging

```typescript
// Enable in development
import api from './services/api';

if (__DEV__) {
  api.interceptors.request.use(request => {
    console.log('Request:', request.url);
    return request;
  });
}
```

## Performance Optimization

### 1. Use React.memo

```typescript
export const ExpensiveComponent = React.memo<Props>(({ data }) => {
  return <View>{/* Expensive rendering */}</View>;
});
```

### 2. Use useCallback

```typescript
const handlePress = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### 3. Use useMemo

```typescript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

## Documentation

### Component Documentation

```typescript
/**
 * GlassCard component with blur effect
 *
 * @param children - Content to render inside the card
 * @param variant - Glass style variant (light, medium, dark, card)
 * @param intensity - Blur intensity (light, medium, strong, intense)
 * @param blurEnabled - Enable/disable blur effect
 *
 * @example
 * <GlassCard variant="card" intensity="medium">
 *   <Text>Content</Text>
 * </GlassCard>
 */
export const GlassCard: React.FC<GlassCardProps> = ({ ... }) => {
  // Implementation
};
```

## Resources

### Learning
- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Design
- [Glassmorphism Examples](https://glassmorphism.com)
- [Color Palette](https://coolors.co)
- [React Native Directory](https://reactnative.directory)

## Questions?

If you have questions about contributing:
1. Check existing documentation
2. Search existing issues
3. Create a new discussion
4. Ask in team chat

---

**Thank you for contributing to NexTrip Deals! 🚀**
