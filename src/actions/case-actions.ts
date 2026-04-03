"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { caseFormSchema } from "@/lib/validations/case";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function parseDate(dateStr: string | undefined | null): Date | null {
  if (!dateStr) return null;
  return new Date(dateStr);
}

export async function createCase(formData: Record<string, unknown>) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = caseFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: "入力内容に誤りがあります", details: parsed.error.flatten() };
  }

  const data = parsed.data;
  const userId = data.userId || session.user.id;

  // Only admin can set a different userId
  if (userId !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "権限がありません" };
  }

  const newCase = await prisma.case.create({
    data: {
      userId,
      caseDate: new Date(data.caseDate),
      caseSource: data.caseSource,
      caseType: data.caseType,
      smoverId: data.smoverId || null,
      customerName: data.customerName,
      visitDate: parseDate(data.visitDate),
      estimateSubmitDate: parseDate(data.estimateSubmitDate),
      status: data.status,
      movingDate: parseDate(data.movingDate),
      cargoVolume: data.cargoVolume || null,
      clientContact: data.clientContact || null,
      letterEnclosed: data.letterEnclosed,
      onSiteEstimate: data.onSiteEstimate || null,
      notes: data.notes || null,
      moveCount: data.moveCount || null,
      budget: data.budget || null,
      companyDisclosure: data.companyDisclosure,
      motivationDone: data.motivationDone,
      competingEstimates: data.competingEstimates || null,
      competingDetails: data.competingDetails || null,
      testClosingDone: data.testClosingDone,
      phoneClosingDate: parseDate(data.phoneClosingDate),
      expenses:
        data.estimateAmount != null
          ? {
              create: {
                estimateAmount: data.estimateAmount,
                workingHours: data.workingHours || null,
                drivers: data.drivers || null,
                assistants: data.assistants || null,
                distance: data.distance || null,
                highwayToll: data.highwayToll || null,
                outsourcingCost: data.outsourcingCost || null,
                disposalCost: data.disposalCost || null,
                mediumBoxes: data.mediumBoxes || null,
                largeBoxes: data.largeBoxes || null,
                otherExpenses: data.otherExpenses || null,
                outsourcingDetails: data.outsourcingDetails || null,
              },
            }
          : undefined,
    },
  });

  revalidatePath("/cases");
  revalidatePath("/dashboard");
  redirect(`/cases/${newCase.id}`);
}

export async function updateCase(caseId: string, formData: Record<string, unknown>) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const existing = await prisma.case.findUnique({ where: { id: caseId }, include: { expenses: true } });
  if (!existing) return { error: "案件が見つかりません" };

  if (existing.userId !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "権限がありません" };
  }

  const parsed = caseFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: "入力内容に誤りがあります", details: parsed.error.flatten() };
  }

  const data = parsed.data;

  await prisma.case.update({
    where: { id: caseId },
    data: {
      caseDate: new Date(data.caseDate),
      caseSource: data.caseSource,
      caseType: data.caseType,
      smoverId: data.smoverId || null,
      customerName: data.customerName,
      visitDate: parseDate(data.visitDate),
      estimateSubmitDate: parseDate(data.estimateSubmitDate),
      status: data.status,
      movingDate: parseDate(data.movingDate),
      cargoVolume: data.cargoVolume || null,
      clientContact: data.clientContact || null,
      letterEnclosed: data.letterEnclosed,
      onSiteEstimate: data.onSiteEstimate || null,
      notes: data.notes || null,
      moveCount: data.moveCount || null,
      budget: data.budget || null,
      companyDisclosure: data.companyDisclosure,
      motivationDone: data.motivationDone,
      competingEstimates: data.competingEstimates || null,
      competingDetails: data.competingDetails || null,
      testClosingDone: data.testClosingDone,
      phoneClosingDate: parseDate(data.phoneClosingDate),
    },
  });

  // Handle expenses
  const hasExpenseData = data.estimateAmount != null;
  if (hasExpenseData) {
    await prisma.caseExpense.upsert({
      where: { caseId },
      update: {
        estimateAmount: data.estimateAmount,
        workingHours: data.workingHours || null,
        drivers: data.drivers || null,
        assistants: data.assistants || null,
        distance: data.distance || null,
        highwayToll: data.highwayToll || null,
        outsourcingCost: data.outsourcingCost || null,
        disposalCost: data.disposalCost || null,
        mediumBoxes: data.mediumBoxes || null,
        largeBoxes: data.largeBoxes || null,
        otherExpenses: data.otherExpenses || null,
        outsourcingDetails: data.outsourcingDetails || null,
      },
      create: {
        caseId,
        estimateAmount: data.estimateAmount,
        workingHours: data.workingHours || null,
        drivers: data.drivers || null,
        assistants: data.assistants || null,
        distance: data.distance || null,
        highwayToll: data.highwayToll || null,
        outsourcingCost: data.outsourcingCost || null,
        disposalCost: data.disposalCost || null,
        mediumBoxes: data.mediumBoxes || null,
        largeBoxes: data.largeBoxes || null,
        otherExpenses: data.otherExpenses || null,
        outsourcingDetails: data.outsourcingDetails || null,
      },
    });
  }

  revalidatePath("/cases");
  revalidatePath("/dashboard");
  redirect(`/cases/${caseId}`);
}

export async function deleteCase(caseId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  if (session.user.role !== "ADMIN") {
    return { error: "管理者のみ削除可能です" };
  }

  await prisma.case.delete({ where: { id: caseId } });

  revalidatePath("/cases");
  revalidatePath("/dashboard");
  redirect("/cases");
}
