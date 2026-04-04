"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { hashSync } from "bcryptjs";

export async function getUsers() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("権限がありません");
  }

  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: { select: { cases: true } },
    },
  });
}

export async function createUser(formData: { name: string; email: string; password: string; role: string }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "権限がありません" };
  }

  if (!formData.name || !formData.email || !formData.password) {
    return { error: "名前、メールアドレス、パスワードは必須です" };
  }

  const existing = await prisma.user.findUnique({ where: { email: formData.email } });
  if (existing) {
    return { error: "このメールアドレスは既に登録されています" };
  }

  await prisma.user.create({
    data: {
      name: formData.name,
      email: formData.email,
      password: hashSync(formData.password, 10),
      role: formData.role || "SALES_REP",
    },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "権限がありません" };
  }

  if (userId === session.user.id) {
    return { error: "自分自身は削除できません" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { _count: { select: { cases: true } } },
  });

  if (!user) return { error: "ユーザーが見つかりません" };

  if (user._count.cases > 0) {
    return { error: `このユーザーには${user._count.cases}件の案件が紐づいています。先に案件を別の担当者に移してください` };
  }

  await prisma.user.delete({ where: { id: userId } });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserRole(userId: string, role: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "権限がありません" };
  }

  if (userId === session.user.id) {
    return { error: "自分自身のロールは変更できません" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
  return { success: true };
}
