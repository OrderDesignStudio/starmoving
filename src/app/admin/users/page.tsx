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
        <h1 className="text-2xl font-bold">ユーザー管理</h1>
      </div>

      <AddUserForm />

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">名前</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">メールアドレス</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">ロール</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">案件数</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">登録日</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <RoleSelect userId={user.id} currentRole={user.role} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className="bg-gray-100 text-gray-700">{user._count.cases}件</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3 text-center">
                    <DeleteUserButton userId={user.id} userName={user.name} caseCount={user._count.cases} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 text-sm text-gray-500">
          全 {users.length} 名
        </div>
      </div>
    </div>
  );
}
