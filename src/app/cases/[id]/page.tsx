import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/cases/status-badge";
import {
  CASE_TYPE_LABELS,
  LETTER_STATUS_LABELS,
  ON_SITE_ESTIMATE_LABELS,
  DISCLOSURE_LABELS,
} from "@/lib/constants";
import { formatDate, formatCurrency, daysBetween } from "@/lib/utils";
import Link from "next/link";
import { Pencil, ArrowLeft } from "lucide-react";
import { DeleteCaseButton } from "@/components/cases/delete-case-button";

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  const caseData = await prisma.case.findUnique({
    where: { id },
    include: { user: true, expenses: true },
  });

  if (!caseData) notFound();

  if (caseData.userId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/cases");
  }

  const daysToVisit = daysBetween(caseData.caseDate, caseData.visitDate);
  const daysToEstimate = daysBetween(caseData.visitDate, caseData.estimateSubmitDate);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/cases">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-[24px] font-semibold tracking-[-0.96px] text-[#171717]">{caseData.customerName}</h1>
          <StatusBadge status={caseData.status} />
        </div>
        <div className="flex gap-2">
          <Link href={`/cases/${caseData.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-1" />
              編集
            </Button>
          </Link>
          {session.user.role === "ADMIN" && (
            <DeleteCaseButton caseId={caseData.id} />
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {(daysToVisit !== null || daysToEstimate !== null) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {daysToVisit !== null && (
              <div className="rounded-[8px] shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px] p-5 text-center">
                <p className="text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">案件発生から訪問まで</p>
                <p className="text-[40px] font-semibold tracking-[-2.4px] text-[#0a72ef] mt-1">{daysToVisit}<span className="text-lg ml-0.5">日</span></p>
              </div>
            )}
            {daysToEstimate !== null && (
              <div className="rounded-[8px] shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px] p-5 text-center">
                <p className="text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">訪問から見積提出まで</p>
                <p className="text-[40px] font-semibold tracking-[-2.4px] text-[#de1d8d] mt-1">{daysToEstimate}<span className="text-lg ml-0.5">日</span></p>
              </div>
            )}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>案件概要</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              <DetailItem label="案件担当者" value={caseData.user.name} />
              <DetailItem label="案件発生日" value={formatDate(caseData.caseDate)} />
              <DetailItem label="案件発生経路" value={caseData.caseSource} />
              <DetailItem label="案件種別" value={CASE_TYPE_LABELS[caseData.caseType] || caseData.caseType} />
              <DetailItem label="SmoverID" value={caseData.smoverId || "-"} />
              <DetailItem label="顧客名" value={caseData.customerName} />
              <DetailItem label="訪問日" value={formatDate(caseData.visitDate)} />
              <DetailItem label="見積送付日" value={formatDate(caseData.estimateSubmitDate)} />
              <DetailItem label="移転日" value={formatDate(caseData.movingDate)} />
              <DetailItem label="荷量" value={caseData.cargoVolume ? `${caseData.cargoVolume} ㎥` : "-"} />
              <DetailItem label="先方担当者" value={caseData.clientContact || "-"} />
              <DetailItem label="手紙同封" value={LETTER_STATUS_LABELS[caseData.letterEnclosed] || "-"} />
              <DetailItem label="その場見積提出" value={caseData.onSiteEstimate ? ON_SITE_ESTIMATE_LABELS[caseData.onSiteEstimate] : "-"} />
              {caseData.notes && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <DetailItem label="備考" value={caseData.notes} />
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>案件ヒアリング</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              <DetailItem label="引越し回数" value={caseData.moveCount?.toString() || "-"} />
              <DetailItem label="予算" value={caseData.budget || "-"} />
              <DetailItem label="自社開示/自己開示" value={DISCLOSURE_LABELS[caseData.companyDisclosure] || "-"} />
              <DetailItem label="動機/目的" value={caseData.motivationDone ? "実施" : "未実施"} />
              <DetailItem label="相見積もり先数" value={caseData.competingEstimates?.toString() || "-"} />
              <DetailItem label="相見積もり先詳細" value={caseData.competingDetails || "-"} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>クロージング</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <DetailItem label="テストクロージング" value={caseData.testClosingDone ? "実施" : "未実施"} />
              <DetailItem
                label="電話クロージング予定"
                value={caseData.phoneClosingDate
                  ? new Date(caseData.phoneClosingDate).toLocaleString("ja-JP")
                  : "-"}
              />
            </dl>
          </CardContent>
        </Card>

        {caseData.expenses && (
          <Card>
            <CardHeader>
              <CardTitle>見積時経費</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                <DetailItem label="見積もり金額" value={formatCurrency(caseData.expenses.estimateAmount)} />
                <DetailItem label="稼働時間" value={caseData.expenses.workingHours ? `${caseData.expenses.workingHours}h` : "-"} />
                <DetailItem label="ドライバー" value={caseData.expenses.drivers ? `${caseData.expenses.drivers}人` : "-"} />
                <DetailItem label="助手" value={caseData.expenses.assistants ? `${caseData.expenses.assistants}人` : "-"} />
                <DetailItem label="距離" value={caseData.expenses.distance ? `${caseData.expenses.distance}km` : "-"} />
                <DetailItem label="高速代" value={formatCurrency(caseData.expenses.highwayToll)} />
                <DetailItem label="外注費用" value={formatCurrency(caseData.expenses.outsourcingCost)} />
                <DetailItem label="処分費用" value={formatCurrency(caseData.expenses.disposalCost)} />
                <DetailItem label="中段ボール" value={caseData.expenses.mediumBoxes ? `${caseData.expenses.mediumBoxes}個` : "-"} />
                <DetailItem label="大段ボール" value={caseData.expenses.largeBoxes ? `${caseData.expenses.largeBoxes}個` : "-"} />
                <DetailItem label="その他経費" value={formatCurrency(caseData.expenses.otherExpenses)} />
                {caseData.expenses.outsourcingDetails && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <DetailItem label="外注詳細" value={caseData.expenses.outsourcingDetails} />
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono mb-1">{label}</dt>
      <dd className="text-sm font-medium text-[#171717]">{value}</dd>
    </div>
  );
}
