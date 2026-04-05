import React from "react";
import { FiShoppingBag, FiMapPin, FiPhone, FiMail, FiPackage, FiInfo } from "react-icons/fi";
import { SectionHeader } from "./AdminComponents";
import { adminApi } from "../../services/api";

const Orders = ({ orders, adminToken, handleAction }) => {
  const statusClasses = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    confirmed: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    preparing: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <SectionHeader title="Orders Management" subtitle="Process and track customer purchases" />
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order._id} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 transition-all hover:border-orange-500/20">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/30 text-orange-400">
                      <FiShoppingBag />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Order {order.orderNumber}</h4>
                      <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <span className={`rounded-full border px-4 py-1 text-xs font-bold uppercase ${statusClasses[order.status] || statusClasses.pending}`}>
                    {order.status}
                  </span>
                </div>
                <div className="grid gap-4 text-sm sm:grid-cols-2">
                  <div className="space-y-2 rounded-2xl bg-black/20 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Customer Details</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FiShoppingBag className="text-slate-500" />
                        <span className="font-bold text-slate-200">{order.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <FiMail className="shrink-0" />
                        <span className="truncate">{order.customerEmail}</span>
                      </div>
                      {order.phone && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <FiPhone className="shrink-0" />
                          <span>{order.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 rounded-2xl bg-black/20 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Delivery Info</p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-xs text-slate-300">
                        <FiMapPin className="mt-0.5 shrink-0 text-orange-500" />
                        <span className="leading-relaxed">{order.deliveryAddress}</span>
                      </div>
                      {order.landmark && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <FiInfo className="shrink-0" />
                          <span>Landmark: {order.landmark}</span>
                        </div>
                      )}
                      {order.deliveryNote && (
                        <div className="mt-1 rounded-lg bg-orange-500/5 px-2 py-1 text-[11px] italic text-orange-400/80">
                          "{order.deliveryNote}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ordered Items</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 p-2">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/5">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-600">
                              <FiPackage size={20} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-slate-200">{item.name}</p>
                          <p className="text-[10px] text-slate-500">
                            {item.quantity} x ৳{item.price} = <span className="text-orange-400">৳{item.quantity * item.price}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 lg:w-64">
                <div className="rounded-2xl bg-black/30 p-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Amount</p>
                  <p className="text-2xl font-bold text-orange-500">৳{order.totalAmount}</p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleAction(() => adminApi.updateOrderStatus(adminToken, order._id, { status: e.target.value }), "Status updated")}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500"
                >
                  {["pending", "confirmed", "preparing", "delivered", "cancelled"].map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
