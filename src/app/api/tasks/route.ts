import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { taskCreator } from "@/lib/validation/task";
import { validateWithZodMessages } from "@/lib/validation/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");

    if (!accountId) {
      return NextResponse.json(
        {
          success: false,
          error: "accountIdが必要です",
        },
        { status: 400 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: {
        accountId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("タスク取得エラー:", error);
    return NextResponse.json(
      {
        success: false,
        error: "タスクの取得に失敗しました",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // zodスキーマでバリデーション
    const validation = validateWithZodMessages(taskCreator, body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.errors[0] || "バリデーションエラーが発生しました",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title: validation.data!.title,
        description: validation.data!.description || "",
        accountId: validation.data!.accountId,
        status: "TODO",
      },
    });

    return NextResponse.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("タスク作成エラー:", error);
    return NextResponse.json(
      {
        success: false,
        error: "タスクの作成に失敗しました",
      },
      { status: 500 }
    );
  }
}
