import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, Button, Input } from '../components';
import { colors, typography, spacing } from '../theme';
import { useAuth } from '../context';

export const AddDealScreen: React.FC = () => {
  const { isAuthenticated, roles } = useAuth();
  const isSeller = roles.includes('SELLER');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceOriginal: '',
    priceDeal: '',
  });

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradients.background}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Add New Deal</Text>

        {!isAuthenticated ? (
          <GlassCard style={styles.card}>
            <Text style={styles.message}>
              Please login to create deals
            </Text>
            <Button
              title="Login"
              onPress={() => console.log('Navigate to login')}
              filled={true}
              style={styles.button}
            />
          </GlassCard>
        ) : !isSeller ? (
          <GlassCard style={styles.card}>
            <Text style={styles.message}>
              You need a SELLER account to create deals
            </Text>
            <Text style={styles.description}>
              Upgrade your account to start posting deals and reach thousands of buyers
            </Text>
            <Button
              title="Become a Seller"
              onPress={() => console.log('Add seller role')}
              filled={true}
              style={styles.button}
            />
          </GlassCard>
        ) : (
          <GlassCard style={styles.formCard}>
            <Text style={styles.emoji}>➕</Text>
            <Text style={styles.message}>Create New Deal</Text>

            <View style={styles.form}>
              <Input
                id="title"
                placeholder="Deal Title"
                placeholderTextColor={colors.gray}
                onInputChanged={handleInputChange}
                value={formData.title}
              />
              <Input
                id="description"
                placeholder="Description"
                placeholderTextColor={colors.gray}
                onInputChanged={handleInputChange}
                value={formData.description}
                multiline
              />
              <Input
                id="priceOriginal"
                placeholder="Original Price"
                placeholderTextColor={colors.gray}
                onInputChanged={handleInputChange}
                value={formData.priceOriginal}
                keyboardType="numeric"
              />
              <Input
                id="priceDeal"
                placeholder="Deal Price"
                placeholderTextColor={colors.gray}
                onInputChanged={handleInputChange}
                value={formData.priceDeal}
                keyboardType="numeric"
              />
            </View>

            <Button
              title="Create Hot Deal"
              onPress={() => console.log('Create hot deal', formData)}
              filled={true}
              style={styles.button}
            />
          </GlassCard>
        )}
      </ScrollView>
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
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xxxl,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  card: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  message: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    width: '100%',
    marginTop: spacing.md,
  },
  formCard: {
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  form: {
    width: '100%',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});
