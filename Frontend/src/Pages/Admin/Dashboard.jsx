import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingBag, FiClock, FiUsers, FiMessageSquare, FiLoader, FiPlus, FiCalendar } from "react-icons/fi";
import { SectionHeader, StatCard, QuickAction, SimpleChart } from "./AdminComponents";

const Dashboard = ({ dashboard, orders, loadAdminData }) => {
  const navigate = useNavigate();
  const orderTrends = useMemo(() => [12, 18, 15, 25, 32, 28, 40], []);
  const userTrends = useMemo(() => [5, 12, 8, 15, 20, 18, 25], []);

  const stats = useMemo(() => [
    { label: "Total Revenue", value: dashboard?.totalOrders * 120 || 0, icon: FiShoppingBag, trend: { value: 12, isUp: true }, colorClass: "from-orange-500" },
    { label: "Active Orders", value: dashboard?.pendingOrders || 0, icon: FiClock, trend: { value: 5, isUp: true }, colorClass: "from-amber-500" },
    { label: "Total Customers", value: dashboard?.totalUsers || 0, icon: FiUsers, trend: { value: 8, isUp: true }, colorClass: "from-sky-500" },
    { label: "Pending Reviews", value: dashboard?.totalReviews || 0, icon: FiMessageSquare, trend: { value: 2, isUp: false }, colorClass: "from-violet-500" },
  ], [dashboard]);

  const statusClasses = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    confirmed: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    preparing: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <SectionHeader 
        title="Dashboard Overview" 
        subtitle="Real-time performance metrics and business health"
        actions={
          <div className="flex gap-3">
            <QuickAction label="Refresh" icon={FiLoader} onClick={() => loadAdminData()} color="bg-white/10 hover:bg-white/20" />
            <QuickAction label="Add Item" icon={FiPlus} onClick={() => navigate("/admin/items")} color="bg-orange-500" />
          </div>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Order Volume</h3>
              <p className="text-xs text-slate-400">Weekly trend analysis</p>
            </div>
            <div className="rounded-xl bg-black/30 p-2 text-orange-400">
              <FiCalendar className="text-lg" />
            </div>
          </div>
          <SimpleChart data={orderTrends} color="#f97316" />
          <div className="mt-6 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">User Growth</h3>
              <p className="text-xs text-slate-400">New registration metrics</p>
            </div>
            <div className="rounded-xl bg-black/30 p-2 text-sky-400">
              <FiUsers className="text-lg" />
            </div>
          </div>
          <SimpleChart data={userTrends} color="#0ea5e9" />
          <div className="mt-6 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Recent Orders</h3>
            <button onClick={() => navigate("/admin/orders")} className="text-xs font-semibold text-orange-500 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-500">
                  <th className="pb-4 font-semibold">Order</th>
                  <th className="pb-4 font-semibold">Customer</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="group transition-colors hover:bg-white/[0.02]">
                    <td className="py-4">
                      <span className="text-sm font-bold text-white">#{order.orderNumber?.slice(-4)}</span>
                    </td>
                    <td className="py-4">
                      <p className="text-sm font-medium text-slate-300">{order.customerName}</p>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${statusClasses[order.status] || statusClasses.pending}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-bold text-white">৳{order.totalAmount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <h3 className="mb-6 text-lg font-bold text-white">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Add Menu", icon: FiShoppingBag, action: () => setActiveSection("menus"), color: "bg-emerald-500/10 text-emerald-400" },
              { label: "Site Meta", icon: FiClock, action: () => setActiveSection("settings"), color: "bg-amber-500/10 text-amber-400" },
              { label: "Block User", icon: FiUsers, action: () => setActiveSection("users"), color: "bg-rose-500/10 text-rose-400" },
              { label: "Reviews", icon: FiMessageSquare, action: () => setActiveSection("reviews"), color: "bg-sky-500/10 text-sky-400" },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-white/5 bg-black/20 p-4 transition-all hover:border-white/20 hover:bg-black/40"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${btn.color}`}>
                  <btn.icon />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
