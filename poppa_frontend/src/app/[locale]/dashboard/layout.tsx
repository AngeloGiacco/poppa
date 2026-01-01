import ProtectedRoute from "@/components/ProtectedRoute";
import "@/app/[locale]/globals.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">{children}</div>
    </ProtectedRoute>
  );
}
