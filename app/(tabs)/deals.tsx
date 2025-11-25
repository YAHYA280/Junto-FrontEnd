import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../../shared/constants/theme';
import { GlassCard, GlassButton } from '../../shared/components';
import { useAppTheme } from '../../shared/hooks/useAppTheme';

export default function AddDealScreen() {
  const theme = useAppTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('');

  const categories = ['Electronics', 'Fashion', 'Food', 'Travel', 'Home', 'Sports'];

  const handleSubmit = () => {
    if (!title || !price || !category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert('Success', 'Deal submitted successfully!', [
      {
        text: 'OK',
        onPress: () => {
          setTitle('');
          setDescription('');
          setPrice('');
          setOriginalPrice('');
          setCategory('');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Add New Deal</Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>Share amazing deals with the community</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Deal Title <Text style={{ color: theme.colors.error }}>*</Text>
          </Text>
          <View style={[styles.inputContainer, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}>
            <FontAwesome5 name="tag" size={16} color={theme.colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="e.g., 50% Off Premium Headphones"
              placeholderTextColor={theme.colors.textTertiary}
              value={title}
              onChangeText={setTitle}
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Description</Text>
          <View style={[styles.inputContainer, styles.textArea, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}>
            <TextInput
              style={[styles.input, styles.textAreaInput, { color: theme.colors.text }]}
              placeholder="Describe the deal..."
              placeholderTextColor={theme.colors.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Price Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Price <Text style={{ color: theme.colors.error }}>*</Text>
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}>
              <FontAwesome5 name="dollar-sign" size={16} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="29.99"
                placeholderTextColor={theme.colors.textTertiary}
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Original Price</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}>
              <FontAwesome5 name="dollar-sign" size={16} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="59.99"
                placeholderTextColor={theme.colors.textTertiary}
                value={originalPrice}
                onChangeText={setOriginalPrice}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Category <Text style={{ color: theme.colors.error }}>*</Text>
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border },
                  category === cat && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryChipText,
                  { color: theme.colors.textSecondary },
                  category === cat && styles.categoryChipTextActive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.info + '10', borderColor: theme.colors.info + '30' }]}>
          <FontAwesome5 name="info-circle" size={20} color={theme.colors.info} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>Deal Guidelines</Text>
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              • Make sure the deal is currently active{'\n'}
              • Provide accurate pricing information{'\n'}
              • Include relevant details in the description
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <GlassButton
          title="Submit Deal"
          onPress={handleSubmit}
          variant="primary"
          size="large"
          icon={<FontAwesome5 name="check-circle" size={20} color="#FFFFFF" />}
          style={{ marginBottom: spacing.xl }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.base,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    height: 56,
  },
  textArea: {
    height: 120,
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
  },
  textAreaInput: {
    minHeight: 90,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryChip: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  infoCard: {
    flexDirection: 'row',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  submitButton: {
    borderRadius: borderRadius.md,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  submitButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
});
