"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createUser } from "@/actions/user-actions";
import { useRouter } from "next/navigation";
import { UserPlus, ChevronDown, ChevronUp } from "lucide-react";

export function AddUserForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const form = new FormData(e.currentTarget);
    const result = await createUser({
      name: form.get("name") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      role: form.get("role") as string,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess("ユーザーを追加しました");
      setLoading(false);
      e.currentTarget.reset();
      router.refresh();
      setTimeout(() => setSuccess(""), 3000);
    }
  }

  return (
    <Card>
      <CardHeader
        className="cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            <CardTitle>新規ユーザー追加</CardTitle>
          </div>
          {open ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
        </div>
      </CardHeader>
      {open && (
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md mb-4">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 text-sm p-3 rounded-md mb-4">{success}</div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="name">名前 *</Label>
              <Input name="name" placeholder="山田太郎" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス *</Label>
              <Input name="email" type="email" placeholder="yamada@star-moving.co.jp" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード *</Label>
              <Input name="password" type="password" minLength={6} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">ロール</Label>
              <Select name="role" defaultValue="SALES_REP">
                <option value="SALES_REP">営業担当者</option>
                <option value="ADMIN">管理者</option>
              </Select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "追加中..." : "追加"}
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
