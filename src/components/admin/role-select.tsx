"use client";

import { useState } from "react";
import { Select } from "@/components/ui/select";
import { updateUserRole } from "@/actions/user-actions";
import { useRouter } from "next/navigation";

export function RoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const result = await updateUserRole(userId, e.target.value);
    if (result?.error) {
      setError(result.error);
      setTimeout(() => setError(""), 3000);
    } else {
      router.refresh();
    }
  }

  return (
    <div>
      <Select
        value={currentRole}
        onChange={handleChange}
        className="w-[130px] text-xs h-8"
      >
        <option value="SALES_REP">営業担当者</option>
        <option value="ADMIN">管理者</option>
      </Select>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
