import React, { useEffect, useState } from 'react';
import { publicApi } from '../services/api';
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle, FiChevronRight } from 'react-icons/fi';

const MyOrders = ({ userProfile, onBack }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userProfile?.email) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await publicApi.getCustomerOrders(userProfile.email);
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [userProfile?.email]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <FiClock className="text-yellow-500" />;
      case 'confirmed': return <FiCheckCircle className="text-blue-500" />;
      case 'preparing': return <FiPackage className="text-orange-500" />;
      case 'out-for-delivery': return <FiTruck className="text-purple-500" />;
      case 'delivered': return <FiCheckCircle className="text-green-500" />;
      case 'cancelled': return <FiXCircle className="text-red-500" />;
      default: return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'preparing': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'out-for-delivery': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">My Orders</h1>
            <p className="mt-2 text-slate-400">Track and manage your recent orders.</p>
          </div>
          <button
            onClick={onBack}
            className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
          >
            Back to Home
          </button>
        </div>

        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <p className="text-slate-400">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm font-semibold text-orange-500 hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
              <FiPackage size={40} />
            </div>
            <h3 className="text-xl font-bold text-white">No orders yet</h3>
            <p className="mt-2 text-slate-400">You haven't placed any orders with us yet.</p>
            <button
              onClick={onBack}
              className="mt-6 rounded-full bg-orange-500 px-8 py-3 font-bold text-white transition-all hover:bg-orange-600"
            >
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all hover:border-orange-500/30 hover:bg-white/[0.07]"
              >
                <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                      <FiPackage size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-white">#{order.orderNumber}</span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-sm text-slate-400">
                        <span>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <span>{order.items?.length || 0} Items</span>
                        <span>•</span>
                        <span className="font-semibold text-orange-500">৳{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-t border-white/5 pt-4 sm:border-0 sm:pt-0">
                    <div className="flex -space-x-3 overflow-hidden">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#121212] bg-orange-500/20 text-[10px] font-bold text-orange-500 overflow-hidden"
                          title={item.name}
                        >
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            item.name.charAt(0)
                          )}
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#121212] bg-white/10 text-[10px] font-bold text-slate-400">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <FiChevronRight className="text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-orange-500" />
                  </div>
                </div>

                <div className="border-t border-white/5 bg-white/[0.02] px-6 py-4">
                  <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Payment:</span>
                      <span className="font-medium text-slate-300">{order.paymentLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Delivery to:</span>
                      <span className="font-medium text-slate-300 truncate max-w-[200px]">{order.deliveryAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyOrders;
