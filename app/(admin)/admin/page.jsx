"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Activity,
  Eye,
  Calendar,
  BadgeCheck,
} from "lucide-react";

// ---------------------------------------------
// Mock data (simulates an API response shape)
// ---------------------------------------------
const MOCK_USER = {
  id: "usr_8841",
  name: "Mahar Abdul Qudoos",
  email: "ayesha.raza@nimbus.io",
  role: "Senior Product Admin",
  phone: "+92 300 1234567",
  avatar: "https://i.pravatar.cc/160?img=68",
};

const MOCK_USERS = [
  {
    id: "usr_1001",
    username: "sara.khan",
    full_name: "Sara Khan",
    email: "sara.khan@nimbus.io",
    profile_image: "https://i.pravatar.cc/80?img=32",
  },
  {
    id: "usr_1002",
    username: "ali.raza",
    full_name: "Ali Raza",
    email: "ali.raza@nimbus.io",
    profile_image: "https://i.pravatar.cc/80?img=12",
  },
  {
    id: "usr_1003",
    username: "hina.malik",
    full_name: "Hina Malik",
    email: "hina.malik@nimbus.io",
    profile_image: "https://i.pravatar.cc/80?img=47",
  },
  {
    id: "usr_1004",
    username: "usman.tariq",
    full_name: "Usman Tariq",
    email: "usman.tariq@nimbus.io",
    profile_image: "https://i.pravatar.cc/80?img=5",
  },
  {
    id: "usr_1005",
    username: "ayesha.noor",
    full_name: "Ayesha Noor",
    email: "ayesha.noor@nimbus.io",
    profile_image: "https://i.pravatar.cc/80?img=25",
  },
  {
    id: "usr_1006",
    username: "bilal.ahmed",
    full_name: "Bilal Ahmed",
    email: "bilal.ahmed@nimbus.io",
    profile_image: "https://i.pravatar.cc/80?img=15",
  },
];

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
  { label: "Users", icon: Users, to: "/admin/users" },
  { label: "Analytics", icon: BarChart3, to: "/admin/analytics" },
  { label: "Settings", icon: Settings, to: "/admin/settings" },
];

// Shared glass surface — plain Tailwind, no config needed
const GLASS = "bg-white/[0.03] backdrop-blur-xl border border-white/[0.07]";
const GLASS_HOVER =
  "transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.12]";

// ---------------------------------------------
// Reusable: Stat card
// ---------------------------------------------
function StatCard({ stat }) {
  console.log(stat);
  
  return (
    <div className={`${GLASS} ${GLASS_HOVER} rounded-2xl p-5 flex flex-col gap-4`}>

<div className="flex items-center justify-between rounded-xl bg-slate-900 p-6 shadow-lg">
  <div>
    <p className="text-sm text-gray-400">Total Users</p>
    <h2 className="text-4xl font-bold text-white">
      {stat.length}
    </h2>
  </div>

  <div className="rounded-full bg-blue-500/20 p-3">
    <Users className="h-8 w-8 text-blue-400" />
  </div>
</div>
     
    </div>
  );
}

// ---------------------------------------------
// Reusable: User profile card
// ---------------------------------------------
function UserProfileCard({ user, loading }) {
  if (loading) {
    return (
      <div className={`${GLASS} rounded-2xl p-6 animate-pulse`}>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-xl bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-white/10 rounded" />
            <div className="h-3 w-24 bg-white/10 rounded" />
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-3 w-full bg-white/10 rounded" />
          <div className="h-3 w-2/3 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className={`${GLASS} ${GLASS_HOVER} rounded-2xl p-6`}>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-16 w-16 rounded-xl object-cover border border-white/10"
          />
          <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-black" />
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-semibold text-lg tracking-tight truncate">
            {user.name}
          </h3>
          <p className="text-sm text-indigo-400 flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            {user.role}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3 border-t border-white/[0.06] pt-5">
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <Mail className="h-4 w-4 text-zinc-600 shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <Phone className="h-4 w-4 text-zinc-600 shrink-0" />
          <span className="truncate">{user.phone}</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------
// Status pill helper
// ---------------------------------------------
function StatusPill({ status }) {
  const styles = {
    Active: "bg-emerald-500/10 text-emerald-400",
    Invited: "bg-indigo-500/10 text-indigo-400",
    Suspended: "bg-red-500/10 text-red-400",
  };
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
        styles[status] || "bg-zinc-500/10 text-zinc-400"
      }`}
    >
      {status}
    </span>
  );
}

// ---------------------------------------------
// Users table — click a row to view full mock info
// ---------------------------------------------
function UsersTable({ users, onSelect }) {
  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.07] rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <h2 className="text-white font-semibold tracking-tight">Users</h2>
        <span className="text-xs text-zinc-500">{users.length} total</span>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500 text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                onClick={() => onSelect(u)}
                className="border-t border-white/[0.05] hover:bg-white/[0.04] cursor-pointer transition-colors"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.profile_image}
                      alt={u.full_name}
                      className="h-8 w-8 rounded-lg object-cover border border-white/10"
                    />
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">{u.username}</p>
                      <p className="text-zinc-500 text-xs truncate">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-zinc-400">User</td>
                <td className="px-5 py-3">
                  <StatusPill status="Active" />
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(u);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-white transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="sm:hidden divide-y divide-white/[0.05]">
        {users.map((u) => (
          <button
            key={u.id}
            onClick={() => onSelect(u)}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.04] transition-colors text-left"
          >
            <img
              src={u.profile_image}
              alt={u.username}
              className="h-9 w-9 rounded-lg object-cover border border-white/10 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-white font-medium text-sm truncate">{u.username}</p>
              <p className="text-zinc-500 text-xs truncate">User</p>
            </div>
            <StatusPill status="Active" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------
// User detail modal — shows full mock info on click
// ---------------------------------------------
function UserDetailModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-zinc-950 border border-white/[0.08] rounded-2xl p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-4">
          <img
            src={user.profile_image}
            alt={user.username}
            className="h-16 w-16 rounded-xl object-cover border border-white/10"
          />
          <div className="min-w-0">
            <h3 className="text-white font-semibold text-lg tracking-tight truncate">
              {user.username}
            </h3>
            <p className="text-sm text-indigo-400 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Active
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t border-white/[0.06] pt-5">
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <Mail className="h-4 w-4 text-zinc-600 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
                </div>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <BadgeCheck className="h-4 w-4 text-zinc-600 shrink-0" />
            <span>ID: {user.id}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-zinc-600">
              <Activity className="h-4 w-4" />
            </span>
            <StatusPill status="Active" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------
// Sidebar
// ---------------------------------------------
function Sidebar({ open, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 shrink-0 z-40 transform transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="h-full bg-zinc-950/95 border-r border-white/[0.06] flex flex-col p-5 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-indigo-600/10 blur-3xl" />

          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center font-bold text-white">
                N
              </div>
              <span className="font-semibold text-white text-lg tracking-tight">
                Nimbus
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-zinc-500 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-10 flex flex-col gap-1.5 relative">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.to || pathname?.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.label}
                  href={item.to}
                  className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white/[0.06] text-white border border-white/[0.08]"
                      : "text-zinc-500 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/[0.06] relative">
            <Link
              href="/"
              onClick={() => localStorage.removeItem("isAuth")}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut className="h-4.5 w-4.5" strokeWidth={2} />
              Logout
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

// ---------------------------------------------
// Top navbar
// ---------------------------------------------
function Navbar({ onMenuClick, user }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticate");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-20 bg-black/70 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-6 py-3.5 flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-zinc-500 hover:text-white transition-colors"
      >
        <Menu className="h-5.5 w-5.5" />
      </button>

      <div className="hidden sm:flex items-center gap-2.5 flex-1 max-w-md bg-white/[0.04] border border-white/[0.07] rounded-xl px-3.5 py-2 focus-within:border-indigo-500/40 transition-colors">
        <Search className="h-4 w-4 text-zinc-600" />
        <input
          type="text"
          placeholder="Search users, orders, reports..."
          className="bg-transparent outline-none text-sm text-zinc-200 placeholder:text-zinc-600 w-full"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button className="relative text-zinc-500 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/[0.05]">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-400" />
        </button>

        <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-white/[0.07]">
          <img
            src={user?.avatar}
            alt=""
            className="h-8 w-8 rounded-lg object-cover border border-white/10"
          />
          <span className="text-sm font-medium text-white">
            {user?.name?.split(" ")[0]}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Logout
        </button>
      </div>
    </header>
  );
}

// ---------------------------------------------
// Admin — main page
// ---------------------------------------------
export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [STATS, setSTATS] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUser(MOCK_USER);
      setSTATS(MOCK_USERS);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  console.log(STATS);

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""}
              <span className="text-indigo-500">.</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Here's what's happening across your workspace today.
            </p>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            <StatCard stat={STATS} />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-1">
              <UserProfileCard user={user} loading={loading} />
            </div>

            <div className="lg:col-span-2">
              <UsersTable users={STATS} onSelect={setSelectedUser} />
            </div>
          </section>
        </main>
      </div>

      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}