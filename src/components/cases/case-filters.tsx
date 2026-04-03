"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CASE_STATUS_LABELS, CASE_TYPE_LABELS } from "@/lib/constants";
import { Search, X } from "lucide-react";

interface CaseFiltersProps {
  currentStatus?: string;
  currentCaseType?: string;
  currentSearch?: string;
  currentUserId?: string;
  isAdmin: boolean;
  users: { id: string; name: string }[];
}

export function CaseFilters({
  currentStatus,
  currentCaseType,
  currentSearch,
  currentUserId,
  isAdmin,
  users,
}: CaseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/cases?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/cases");
  }

  const hasFilters = currentStatus || currentCaseType || currentSearch || currentUserId;

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="顧客名で検索..."
            defaultValue={currentSearch || ""}
            onChange={(e) => {
              const timer = setTimeout(() => updateFilter("search", e.target.value), 300);
              return () => clearTimeout(timer);
            }}
            className="pl-10"
          />
        </div>
      </div>

      <Select
        value={currentStatus || ""}
        onChange={(e) => updateFilter("status", e.target.value)}
        className="w-[160px]"
      >
        <option value="">全ステータス</option>
        {Object.entries(CASE_STATUS_LABELS).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </Select>

      <Select
        value={currentCaseType || ""}
        onChange={(e) => updateFilter("caseType", e.target.value)}
        className="w-[160px]"
      >
        <option value="">全種別</option>
        {Object.entries(CASE_TYPE_LABELS).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </Select>

      {isAdmin && (
        <Select
          value={currentUserId || ""}
          onChange={(e) => updateFilter("userId", e.target.value)}
          className="w-[160px]"
        >
          <option value="">全担当者</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </Select>
      )}

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          クリア
        </Button>
      )}
    </div>
  );
}
