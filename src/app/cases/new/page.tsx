import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CaseForm } from "@/components/cases/case-form";

export default async function NewCasePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const isAdmin = session.user.role === "ADMIN";
  const users = isAdmin
    ? await prisma.user.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })
    : undefined;

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-[-0.96px] text-[#171717] mb-6">新規案件登録</h1>
      <CaseForm currentUserId={session.user.id} isAdmin={isAdmin} users={users} />
    </div>
  );
}
