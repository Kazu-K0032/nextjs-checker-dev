import { z } from "zod";

/**
 * アカウント作成フォーマットのスキーマ
 */
export const accountCreator = z.object({
  accountName: z
    .string()
    .min(2, "アカウント名は2文字以上で入力してください")
    .max(50, "アカウント名は50文字以内で入力してください")
    .trim(),
  icon: z
    .string()
    .min(1, "アイコンURLは必須です")
    .url("有効なURLを入力してください")
    .trim(),
})

export type AccountCreator = z.infer<typeof accountCreator>;

/**
 * アカウント編集フォーム
 */
export const accountEditor = z.object({
  accountName: z
    .string()
    .min(2, "アカウント名は2文字以上で入力してください")
    .max(50, "アカウント名は50文字以内で入力してください")
    .trim(),
  icon: z
    .string()
    .min(1, "アイコンURLは必須です")
    .url("有効なURLを入力してください")
    .trim(),
})

export type AccountEditor = z.infer<typeof accountEditor>;
