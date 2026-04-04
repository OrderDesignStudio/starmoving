"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteUser } from "@/actions/user-actions";
import { useRouter } from "next/navigation";

export function DeleteUserButton({
  userId,
  userName,
  caseCount,
}: {
  userId: string;
  userName: string;
  caseCount: number;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const result = await deleteUser(userId);
    if (result?.error) {
      setError(result.error);
      setConfirming(false);
    } else {
      router.refresh();
    }
  }

  if (error) {
    return (
      <div className="text-xs text-red-600">
        {error}
        <button className="ml-2 underline" onClick={() => setError("")}>OK</button>
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="flex gap-1 justify-center">
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          削除
        </Button>
        <Button variant="outline" size="sm" onClick={() => setConfirming(false)}>
          戻る
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setConfirming(true)}
      className="text-gray-400 hover:text-red-600"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
