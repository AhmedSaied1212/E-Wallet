import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  TrendingDown,
  Tags,
  Settings,
  ChartPie,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const SideBar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const links = [
    { name: "Dashboard",  path: "/",  icon: <LayoutDashboard size={20} /> },
    { name: "Settings",   path: "/settings",    icon: <Settings size={20} /> },
  ];

  const handleLinkClick = () => {
    // Close sidebar drawer on mobile when navigating
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <>
      {/* ── Mobile overlay backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Sidebar panel ── */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-72 bg-background border-r border-border
          flex flex-col justify-between transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:z-auto md:flex md:h-auto md:min-h-screen
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div>
          {/* Logo + mobile close button */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-blue-500 to-indigo-600 p-2 rounded-xl">
                <Wallet className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">E-Wallet</h1>
            </div>
            {/* Close button – only shown on mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="mt-4 px-3 flex flex-col gap-1">
            {links.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                    ${active
                      ? "bg-blue-50 text-blue-600 dark:text-blue-400"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default SideBar;