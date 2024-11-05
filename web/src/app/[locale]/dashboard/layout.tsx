import ProtectedRoute from '@/components/ProtectedRoute';
import '@/app/[locale]/globals.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {children}
      </div>
    </ProtectedRoute>
  );
} 

