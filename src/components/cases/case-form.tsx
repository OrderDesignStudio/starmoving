"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  CASE_STATUS_LABELS,
  CASE_TYPE_LABELS,
  LETTER_STATUS_LABELS,
  ON_SITE_ESTIMATE_LABELS,
  DISCLOSURE_LABELS,
} from "@/lib/constants";
import { createCase, updateCase } from "@/actions/case-actions";
import type { CaseFormData } from "@/lib/validations/case";

interface User {
  id: string;
  name: string;
}

interface CaseFormProps {
  initialData?: CaseFormData & { id?: string };
  users?: User[];
  currentUserId: string;
  isAdmin: boolean;
}

function formatDateForInput(date: string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

function formatDateTimeForInput(date: string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().slice(0, 16);
}

export function CaseForm({ initialData, users, currentUserId, isAdmin }: CaseFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!initialData?.id;

  const tabs = ["案件概要", "ヒアリング", "クロージング", "見積時経費"];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};

    // Text/select fields
    for (const [key, value] of form.entries()) {
      if (typeof value === "string") {
        data[key] = value === "" ? undefined : value;
      }
    }

    // Checkboxes
    data.motivationDone = form.get("motivationDone") === "on";
    data.testClosingDone = form.get("testClosingDone") === "on";

    // Number fields
    const numberFields = [
      "cargoVolume", "moveCount", "competingEstimates",
      "estimateAmount", "workingHours", "drivers", "assistants",
      "distance", "highwayToll", "outsourcingCost", "disposalCost",
      "mediumBoxes", "largeBoxes", "otherExpenses",
    ];
    for (const field of numberFields) {
      const val = form.get(field) as string;
      data[field] = val && val !== "" ? Number(val) : null;
    }

    try {
      let result;
      if (isEdit && initialData?.id) {
        result = await updateCase(initialData.id, data);
      } else {
        result = await createCase(data);
      }
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch {
      // redirect throws NEXT_REDIRECT, which is expected
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-[#fff5f5] text-[#ff5b4f] text-sm p-3 rounded-[6px] shadow-[rgba(255,91,79,0.15)_0px_0px_0px_1px] mb-4">
          {error}
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex gap-1 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-sm font-medium rounded-[6px] transition-colors ${
              activeTab === i
                ? "bg-[#171717] text-white"
                : "text-[#666666] hover:bg-[#fafafa] hover:text-[#171717]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 0: 案件概要 */}
      <div className={activeTab === 0 ? "" : "hidden"}>
        <Card>
          <CardHeader>
            <CardTitle>案件概要</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isAdmin && users && (
              <div className="space-y-2">
                <Label htmlFor="userId">案件担当者</Label>
                <Select name="userId" defaultValue={initialData?.userId || currentUserId}>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="caseDate">案件発生日 *</Label>
              <Input type="date" name="caseDate" defaultValue={formatDateForInput(initialData?.caseDate)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="caseSource">案件発生経路 *</Label>
              <Input name="caseSource" defaultValue={initialData?.caseSource || ""} placeholder="例: Web問い合わせ、紹介、電話" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="caseType">案件種別 *</Label>
              <Select name="caseType" defaultValue={initialData?.caseType || ""} required>
                <option value="">選択してください</option>
                {Object.entries(CASE_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smoverId">SmoverID</Label>
              <Input name="smoverId" defaultValue={initialData?.smoverId || ""} placeholder="SM-XXXX-XXX" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerName">顧客名 *</Label>
              <Input name="customerName" defaultValue={initialData?.customerName || ""} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visitDate">訪問日</Label>
              <Input type="date" name="visitDate" defaultValue={formatDateForInput(initialData?.visitDate)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimateSubmitDate">見積送付日</Label>
              <Input type="date" name="estimateSubmitDate" defaultValue={formatDateForInput(initialData?.estimateSubmitDate)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">状況 *</Label>
              <Select name="status" defaultValue={initialData?.status || "PRE_ESTIMATE"} required>
                {Object.entries(CASE_STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="movingDate">移転日</Label>
              <Input type="date" name="movingDate" defaultValue={formatDateForInput(initialData?.movingDate)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargoVolume">荷量（㎥）</Label>
              <Input type="number" step="0.1" name="cargoVolume" defaultValue={initialData?.cargoVolume ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientContact">先方担当者</Label>
              <Input name="clientContact" defaultValue={initialData?.clientContact || ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="letterEnclosed">手紙同封</Label>
              <Select name="letterEnclosed" defaultValue={initialData?.letterEnclosed || "NOT_SENT"}>
                {Object.entries(LETTER_STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="onSiteEstimate">その場見積提出</Label>
              <Select name="onSiteEstimate" defaultValue={initialData?.onSiteEstimate || ""}>
                <option value="">未選択</option>
                {Object.entries(ON_SITE_ESTIMATE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">備考</Label>
              <Textarea name="notes" defaultValue={initialData?.notes || ""} rows={3} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab 1: ヒアリング */}
      <div className={activeTab === 1 ? "" : "hidden"}>
        <Card>
          <CardHeader>
            <CardTitle>案件ヒアリング</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="moveCount">引越し回数</Label>
              <Input type="number" name="moveCount" defaultValue={initialData?.moveCount ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">予算</Label>
              <Input name="budget" defaultValue={initialData?.budget || ""} placeholder="例: 不明、300万円上限" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyDisclosure">自社開示/自己開示</Label>
              <Select name="companyDisclosure" defaultValue={initialData?.companyDisclosure || "NOT_DONE"}>
                {Object.entries(DISCLOSURE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivationDone" className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="motivationDone"
                  defaultChecked={initialData?.motivationDone || false}
                  className="rounded border-gray-300"
                />
                動機/目的ヒアリング実施
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="competingEstimates">相見積もり先数</Label>
              <Input type="number" name="competingEstimates" defaultValue={initialData?.competingEstimates ?? ""} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="competingDetails">相見積もり先詳細</Label>
              <Textarea name="competingDetails" defaultValue={initialData?.competingDetails || ""} rows={2} placeholder="例: A引越し、B運送" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab 2: クロージング */}
      <div className={activeTab === 2 ? "" : "hidden"}>
        <Card>
          <CardHeader>
            <CardTitle>クロージング</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testClosingDone" className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="testClosingDone"
                  defaultChecked={initialData?.testClosingDone || false}
                  className="rounded border-gray-300"
                />
                テストクロージング実施
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneClosingDate">電話クロージング予定</Label>
              <Input type="datetime-local" name="phoneClosingDate" defaultValue={formatDateTimeForInput(initialData?.phoneClosingDate)} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab 3: 見積時経費 */}
      <div className={activeTab === 3 ? "" : "hidden"}>
        <Card>
          <CardHeader>
            <CardTitle>見積時経費</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimateAmount">見積もり金額（円）</Label>
              <Input type="number" name="estimateAmount" defaultValue={initialData?.estimateAmount ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workingHours">稼働時間（h）</Label>
              <Input type="number" step="0.5" name="workingHours" defaultValue={initialData?.workingHours ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="drivers">ドライバー（人）</Label>
              <Input type="number" name="drivers" defaultValue={initialData?.drivers ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assistants">助手（人）</Label>
              <Input type="number" name="assistants" defaultValue={initialData?.assistants ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance">距離（km）</Label>
              <Input type="number" step="0.1" name="distance" defaultValue={initialData?.distance ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="highwayToll">高速代（円）</Label>
              <Input type="number" name="highwayToll" defaultValue={initialData?.highwayToll ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="outsourcingCost">外注費用（円）</Label>
              <Input type="number" name="outsourcingCost" defaultValue={initialData?.outsourcingCost ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="disposalCost">処分費用（円）</Label>
              <Input type="number" name="disposalCost" defaultValue={initialData?.disposalCost ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mediumBoxes">中段ボール（個）</Label>
              <Input type="number" name="mediumBoxes" defaultValue={initialData?.mediumBoxes ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="largeBoxes">大段ボール（個）</Label>
              <Input type="number" name="largeBoxes" defaultValue={initialData?.largeBoxes ?? ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherExpenses">その他経費（円）</Label>
              <Input type="number" name="otherExpenses" defaultValue={initialData?.otherExpenses ?? ""} />
            </div>

            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label htmlFor="outsourcingDetails">外注詳細</Label>
              <Textarea name="outsourcingDetails" defaultValue={initialData?.outsourcingDetails || ""} rows={2} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          キャンセル
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "保存中..." : isEdit ? "更新する" : "登録する"}
        </Button>
      </div>
    </form>
  );
}
