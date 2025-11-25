import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, glassStyles, shadows } from '../theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.xl * 2;

export interface Deal {
  id: string;
  type: 'HOT' | 'TRANSPORT' | 'REAL_ESTATE';
  title: string;
  description?: string;
  priceOriginal?: string;
  priceDeal?: string;
  currency: string;
  expiresAt: string;
  quantityLeft: number;
  imageUrl?: string;
}

interface DealCardProps {
  deal: Deal;
  onPress?: () => void;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onPress }) => {
  const hasDiscount = deal.priceOriginal && deal.priceDeal;
  const discountPercent = hasDiscount
    ? Math.round(
        ((parseFloat(deal.priceOriginal!) - parseFloat(deal.priceDeal!)) /
          parseFloat(deal.priceOriginal!)) *
          100
      )
    : 0;

  const categoryColor =
    deal.type === 'HOT'
      ? colors.status.hot
      : deal.type === 'TRANSPORT'
      ? colors.status.transport
      : colors.status.realEstate;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
      >
        <BlurView intensity={40} tint="dark" style={[glassStyles.card, styles.card]}>
          {/* Image Section */}
          {deal.imageUrl ? (
            <Image source={{ uri: deal.imageUrl }} style={styles.image} />
          ) : (
            <LinearGradient
              colors={colors.gradients.card}
              style={styles.imagePlaceholder}
            >
              <Text style={styles.placeholderEmoji}>
                {deal.type === 'HOT' ? '🔥' : deal.type === 'TRANSPORT' ? '🚗' : '🏠'}
              </Text>
            </LinearGradient>
          )}

          {/* Discount Badge */}
          {hasDiscount && discountPercent > 0 && (
            <View style={[styles.badge, { backgroundColor: categoryColor }]}>
              <Text style={styles.badgeText}>-{discountPercent}%</Text>
            </View>
          )}

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {deal.title}
            </Text>

            {deal.description && (
              <Text style={styles.description} numberOfLines={2}>
                {deal.description}
              </Text>
            )}

            {/* Price Row */}
            <View style={styles.priceRow}>
              <View style={styles.priceContainer}>
                {hasDiscount && (
                  <Text style={styles.priceOriginal}>
                    {deal.priceOriginal} {deal.currency}
                  </Text>
                )}
                <Text style={styles.priceDeal}>
                  {deal.priceDeal || deal.priceOriginal || 'N/A'} {deal.currency}
                </Text>
              </View>

              {deal.quantityLeft <= 5 && (
                <View style={styles.stockBadge}>
                  <Text style={styles.stockText}>
                    {deal.quantityLeft} left
                  </Text>
                </View>
              )}
            </View>

            {/* Footer with Timer */}
            <View style={styles.footer}>
              <DealTimer expiresAt={deal.expiresAt} />
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </View>
  );
};

interface DealTimerProps {
  expiresAt: string;
}

const DealTimer: React.FC<DealTimerProps> = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = React.useState('');

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours >= 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}d ${hours % 24}h left`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m left`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <View style={styles.timer}>
      <Text style={styles.timerIcon}>⏰</Text>
      <Text style={styles.timerText}>{timeLeft}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
  },
  card: {
    ...shadows.glass,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 60,
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    lineHeight: typography.sizes.lg * 1.3,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  priceOriginal: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    textDecorationLine: 'line-through',
  },
  priceDeal: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  stockBadge: {
    backgroundColor: colors.transparentRed,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  stockText: {
    fontSize: typography.sizes.xs,
    color: colors.error,
    fontWeight: typography.fontWeights.semibold,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass.subtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.glass.light,
  },
  timerIcon: {
    fontSize: typography.sizes.md,
    marginRight: spacing.xs,
  },
  timerText: {
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeights.medium,
  },
});
