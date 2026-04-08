import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { CaseForm } from "@/components/cases/case-form";

export default async function EditCasePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  const caseData = await prisma.case.findUnique({
    where: { id },
    include: { expenses: true },
  });

  if (!caseData) notFound();

  if (caseData.userId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/cases");
  }

  const isAdmin = session.user.role === "ADMIN";
  const users = isAdmin
    ? await prisma.user.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })
    : undefined;

  const initialData = {
    id: caseData.id,
    userId: caseData.userId,
    caseDate: caseData.caseDate.toISOString(),
    caseSource: caseData.caseSource,
    caseType: caseData.caseType,
    smoverId: caseData.smoverId || undefined,
    customerName: caseData.customerName,
    visitDate: caseData.visitDate?.toISOString() || undefined,
    estimateSubmitDate: caseData.estimateSubmitDate?.toISOString() || undefined,
    status: caseData.status,
    movingDate: caseData.movingDate?.toISOString() || undefined,
    cargoVolume: caseData.cargoVolume,
    clientContact: caseData.clientContact || undefined,
    letterEnclosed: caseData.letterEnclosed,
    onSiteEstimate: caseData.onSiteEstimate || undefined,
    notes: caseData.notes || undefined,
    moveCount: caseData.moveCount,
    budget: caseData.budget || undefined,
    companyDisclosure: caseData.companyDisclosure,
    motivationDone: caseData.motivationDone,
    competingEstimates: caseData.competingEstimates,
    competingDetails: caseData.competingDetails || undefined,
    testClosingDone: caseData.testClosingDone,
    phoneClosingDate: caseData.phoneClosingDate?.toISOString() || undefined,
    estimateAmount: caseData.expenses?.estimateAmount,
    workingHours: caseData.expenses?.workingHours,
    drivers: caseData.expenses?.drivers,
    assistants: caseData.expenses?.assistants,
    distance: caseData.expenses?.distance,
    highwayToll: caseData.expenses?.highwayToll,
    outsourcingCost: caseData.expenses?.outsourcingCost,
    disposalCost: caseData.expenses?.disposalCost,
    mediumBoxes: caseData.expenses?.mediumBoxes,
    largeBoxes: caseData.expenses?.largeBoxes,
    otherExpenses: caseData.expenses?.otherExpenses,
    outsourcingDetails: caseData.expenses?.outsourcingDetails || undefined,
  };

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-[-0.96px] text-[#171717] mb-6">案件編集: {caseData.customerName}</h1>
      <CaseForm
        initialData={initialData}
        currentUserId={session.user.id}
        isAdmin={isAdmin}
        users={users}
      />
    </div>
  );
}
