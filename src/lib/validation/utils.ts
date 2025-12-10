import { z } from "zod";

/**
 * zodスキーマでバリデーションを実行し、結果を返す
 */
export function validateWithZod<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): {
  success: boolean;
  data?: z.infer<T>;
  errors?: z.ZodError;
} {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    errors: result.error,
  };
}

/**
 * zodスキーマでバリデーションを実行し、エラーメッセージの配列を返す
 */
export function validateWithZodMessages<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): {
  isValid: boolean;
  errors: string[];
  data?: z.infer<T>;
} {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      isValid: true,
      errors: [],
      data: result.data,
    };
  }

  const errors = result.error.issues.map((err) => {
    const path = err.path.join(".");
    return path ? `${path}: ${err.message}` : err.message;
  });

  return {
    isValid: false,
    errors,
  };
}
