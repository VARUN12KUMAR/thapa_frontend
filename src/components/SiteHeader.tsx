import { NavLink } from 'react-router-dom';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav">
        <NavLink to="/" className="brand">
          Aarushi Thapa <span>Collection</span>
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/gifts">Gifts</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
      </div>
    </header>
  );
}
