import { getUsers } from "@/actions/user-actions";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AddUserForm } from "@/components/admin/add-user-form";
import { DeleteUserButton } from "@/components/admin/delete-user-button";
import { RoleSelect } from "@/components/admin/role-select";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] font-semibold tracking-[-0.96px] text-[#171717]">ユーザー管理</h1>
      </div>

      <AddUserForm />

      <div className="rounded-[8px] bg-white shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_2px] overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="shadow-[inset_0_-1px_0_rgba(0,0,0,0.08)]">
                <th className="px-6 py-3 text-left text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">名前</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">メールアドレス</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">ロール</th>
                <th className="px-6 py-3 text-center text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">案件数</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">登録日</th>
                <th className="px-6 py-3 text-center text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)] hover:bg-[#fafafa] transition-colors">
                  <td className="px-6 py-3 font-medium text-[#171717]">{user.name}</td>
                  <td className="px-6 py-3 text-[#666666] font-mono text-xs">{user.email}</td>
                  <td className="px-6 py-3">
                    <RoleSelect userId={user.id} currentRole={user.role} />
                  </td>
                  <td className="px-6 py-3 text-center">
                    <Badge className="bg-[#fafafa] text-[#4d4d4d] shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px]">{user._count.cases}件</Badge>
                  </td>
                  <td className="px-6 py-3 text-[#666666] font-mono text-xs">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-3 text-center">
                    <DeleteUserButton userId={user.id} userName={user.name} caseCount={user._count.cases} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="shadow-[inset_0_1px_0_rgba(0,0,0,0.08)] px-6 py-3 text-xs text-[#808080] font-mono">
          全 {users.length} 名
        </div>
      </div>
    </div>
  );
}
