import { z } from "zod";

/**
 * タスク作成フォームのスキーマ
 */
export const taskCreator = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(100, "タイトルは100文字以内で入力してください")
    .trim(),
  description: z
    .string()
    .max(1000, "説明は1000文字以内で入力してください")
    .trim()
    .optional()
    .default(""),
  accountId: z.string().min(1, "アカウントIDは必須です"),
});

export type TaskCreator = z.infer<typeof taskCreator>;
