import ProtectedRoute from "./ProtectedRoute";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}