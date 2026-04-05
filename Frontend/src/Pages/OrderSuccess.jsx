import React from 'react';

const OrderSuccess = ({ orderedItems = [], orderDetails, onBackHome }) => {
  const totalAmount = orderedItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_16px_40px_rgba(220,32,22,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
          Order Confirmed
        </p>
        <h2 className="mt-3 text-3xl font-bold">Your order has been placed</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
          Thanks for ordering from Tasty Town. We have received your items and will
          start preparing them right away.
        </p>

        {orderedItems.length > 0 && (
          <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5 text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
              Order Summary
            </p>
            <div className="mt-4 space-y-3">
              {orderedItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-200">
                    {item.name} x {item.quantity || 1}
                  </span>
                  <span className="font-semibold text-white">
                    {'\u09F3'}{item.price * (item.quantity || 1)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-sm uppercase tracking-[0.2em] text-orange-400">Total</span>
              <span className="text-lg font-bold text-white">{'\u09F3'}{totalAmount}</span>
            </div>
          </div>
        )}

        {orderDetails && (
          <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5 text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
              Delivery Details
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-200">
              {orderDetails.orderNumber ? (
                <p>
                  <span className="text-slate-400">Order ID:</span> {orderDetails.orderNumber}
                </p>
              ) : null}
              <p>
                <span className="text-slate-400">Name:</span> {orderDetails.customerName}
              </p>
              <p>
                <span className="text-slate-400">Phone:</span> {orderDetails.phone}
              </p>
              <p>
                <span className="text-slate-400">Address:</span> {orderDetails.address}
              </p>
              <p>
                <span className="text-slate-400">Payment:</span> {orderDetails.paymentLabel}
              </p>
              {orderDetails.mobileAgent ? (
                <p>
                  <span className="text-slate-400">Mobile Agent:</span>{' '}
                  {orderDetails.mobileAgent}
                </p>
              ) : null}
              {orderDetails.deliveryNote ? (
                <p>
                  <span className="text-slate-400">Note:</span> {orderDetails.deliveryNote}
                </p>
              ) : null}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onBackHome}
          className="mt-6 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-400"
        >
          Back to Home
        </button>
      </div>
    </section>
  );
};

export default OrderSuccess;
