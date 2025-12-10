import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { accountCreator } from "@/lib/validation/account";
import { validateWithZodMessages } from "@/lib/validation/utils";


export async function GET(_request: NextRequest) {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      accounts,
    });
  } catch (error) {
    console.error("アカウント取得エラー:", error);
    return NextResponse.json(
      {
        success: false,
        error: "アカウントの取得に失敗しました",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // zodスキーマでバリデーション
    const validation = validateWithZodMessages(accountCreator, body);
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

    const account = await prisma.account.create({
      data: {
        accountName: validation.data!.accountName,
        icon: validation.data!.icon,
      },
    });

    return NextResponse.json({
      success: true,
      account,
    });
  } catch (error) {
    console.error("アカウント作成エラー:", error);
    return NextResponse.json(
      {
        success: false,
        error: "アカウントの作成に失敗しました",
      },
      { status: 500 }
    );
  }
}
