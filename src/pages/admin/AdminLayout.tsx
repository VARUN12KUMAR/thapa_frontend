import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function AdminLayout() {
  const { admin, loading, logout } = useAuth();
  const toast = useToast();

  if (loading) {
    return <div className="empty">Checking session…</div>;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  function onLogout() {
    logout();
    toast.info('Logged out', 'See you next time.');
  }

  return (
    <div className="admin-layout">
      <aside className="admin-side">
        <div>
          <div className="brand" style={{ color: 'var(--cream)' }}>
            Aarushi Admin
          </div>
          <p className="muted" style={{ color: 'rgba(250,247,242,0.65)', marginTop: '0.35rem' }}>
            {admin.name}
          </p>
        </div>
        <nav style={{ display: 'grid', gap: '0.75rem' }}>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/products/new">Add product</NavLink>
          <NavLink to="/">View storefront</NavLink>
        </nav>
        <button className="btn btn-ghost" type="button" onClick={onLogout}>
          Log out
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
