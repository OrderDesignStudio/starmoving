"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteCase } from "@/actions/case-actions";

export function DeleteCaseButton({ caseId }: { caseId: string }) {
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    await deleteCase(caseId);
  }

  if (confirming) {
    return (
      <div className="flex gap-2">
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          削除する
        </Button>
        <Button variant="outline" size="sm" onClick={() => setConfirming(false)}>
          キャンセル
        </Button>
      </div>
    );
  }

  return (
    <Button variant="destructive" size="sm" onClick={() => setConfirming(true)}>
      <Trash2 className="h-4 w-4 mr-1" />
      削除
    </Button>
  );
}
