export const dynamic = "force-dynamic";

import { AdminLayout } from "@/components/admin/admin-layout";
import Dashboard from "./Dashboard";

export default function Page() {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
}
