import { AdminLayout } from "@/components/admin/admin-layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AdminLayout>
        <div className="bg-white">{children}</div>
      </AdminLayout>
    </div>
  );
}
