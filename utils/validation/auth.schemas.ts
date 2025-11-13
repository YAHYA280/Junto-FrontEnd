import { z } from 'zod';

/**
 * Validation schemas matching backend validation
 */

// Email validation
const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(1, 'Email is required')
  .optional();

// Phone validation (E.164 format: +[country code][number])
const phoneE164Schema = z
  .string()
  .regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format. Use E.164 format (e.g., +212612345678)')
  .optional();

// Password validation
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

// Display name validation
const displayNameSchema = z
  .string()
  .min(2, 'Display name must be at least 2 characters')
  .max(50, 'Display name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Display name can only contain letters and spaces');

/**
 * Login Schema
 * Either email or phoneE164 is required along with password
 */
export const loginSchema = z
  .object({
    email: emailSchema,
    phoneE164: phoneE164Schema,
    password: passwordSchema,
  })
  .refine((data) => data.email || data.phoneE164, {
    message: 'Either email or phone number is required',
    path: ['email'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register Schema
 * Either email or phoneE164 is required along with displayName and password
 */
export const registerSchema = z
  .object({
    displayName: displayNameSchema,
    email: emailSchema,
    phoneE164: phoneE164Schema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.email || data.phoneE164, {
    message: 'Either email or phone number is required',
    path: ['email'],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Validate form data and return errors
 */
export const validateForm = <T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: boolean; data?: z.infer<T>; errors?: Record<string, string> } => {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path) {
          errors[err.path[0]] = err.message;
        }
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
};

/**
 * Validate single field
 */
export const validateField = <T extends z.ZodType>(
  schema: T,
  fieldName: string,
  value: unknown
): string | null => {
  try {
    // Handle refined schemas by accessing the inner schema
    let baseSchema = schema as any;

    // If it's a ZodEffects (refined schema), get the underlying schema
    if (baseSchema._def?.typeName === 'ZodEffects') {
      baseSchema = baseSchema._def.schema;
    }

    // Now access the field schema
    const fieldSchema = baseSchema.shape?.[fieldName];

    if (fieldSchema) {
      fieldSchema.parse(value);
    }
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Invalid value';
    }
    return 'Validation error';
  }
};

export default {
  loginSchema,
  registerSchema,
  validateForm,
  validateField,
};
