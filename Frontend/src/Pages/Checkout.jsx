import React, { useMemo, useState } from 'react';

const paymentOptions = [
  { value: 'cash', label: 'Cash on Delivery' },
  { value: 'mobile', label: 'Mobile Agent Payment' },
];

const mobileAgents = ['bKash', 'Nagad', 'Rocket'];

const Checkout = ({ items = [], userProfile, onBack, onPlaceOrder }) => {
  const totalAmount = useMemo(
    () => items.reduce((total, item) => total + item.price * (item.quantity || 1), 0),
    [items]
  );

  const [formData, setFormData] = useState({
    customerName: userProfile?.fullName || '',
    customerEmail: userProfile?.email || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    landmark: '',
    paymentMethod: 'cash',
    mobileAgent: 'bKash',
    transactionId: '',
    deliveryNote: '',
  });
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    const paymentLabel = paymentOptions.find(
      (option) => option.value === formData.paymentMethod
    )?.label;

    try {
      await onPlaceOrder({
        ...formData,
        paymentLabel: paymentLabel || 'Cash on Delivery',
      });
    } catch (error) {
      setSubmitError(error.message || 'Order placement failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="py-12 sm:py-16">
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-16 text-center">
          <p className="text-lg font-semibold">No items selected for checkout</p>
          <p className="mt-2 text-sm text-slate-300">
            Add some foods first, then continue to place your order.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-6 rounded-full border border-orange-500 px-5 py-3 text-sm font-semibold text-orange-500 transition-colors duration-200 hover:bg-orange-500 hover:text-white"
          >
            Go Back
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="mb-8 space-y-3 sm:mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
          Checkout
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">Delivery and payment details</h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Please fill in your name, number, address, and payment method so we can
          confirm and deliver the order correctly.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_16px_40px_rgba(220,32,22,0.18)] sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 sm:col-span-1">
              <span className="text-sm font-medium text-slate-200">Full name</span>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(event) => handleChange('customerName', event.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-orange-500"
              />
            </label>

            <label className="space-y-2 sm:col-span-1">
              <span className="text-sm font-medium text-slate-200">Phone number</span>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(event) => handleChange('phone', event.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-orange-500"
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-200">Email address</span>
              <input
                type="email"
                required
                value={formData.customerEmail}
                onChange={(event) => handleChange('customerEmail', event.target.value)}
                placeholder="Enter your email address"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-orange-500"
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-200">Delivery address</span>
              <textarea
                required
                rows={4}
                value={formData.address}
                onChange={(event) => handleChange('address', event.target.value)}
                placeholder="House, road, area, city"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-orange-500"
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-200">Landmark or area note</span>
              <input
                type="text"
                value={formData.landmark}
                onChange={(event) => handleChange('landmark', event.target.value)}
                placeholder="Nearby shop, building, floor, gate instruction"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-orange-500"
              />
            </label>

            <div className="space-y-3 sm:col-span-2">
              <span className="text-sm font-medium text-slate-200">Payment option</span>
              <div className="grid gap-3 sm:grid-cols-2">
                {paymentOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-2xl border px-4 py-4 transition-colors duration-200 ${
                      formData.paymentMethod === option.value
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-white/10 bg-black/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={formData.paymentMethod === option.value}
                      onChange={(event) => handleChange('paymentMethod', event.target.value)}
                      className="sr-only"
                    />
                    <p className="font-semibold text-white">{option.label}</p>
                    <p className="mt-1 text-sm text-slate-300">
                      {option.value === 'cash'
                        ? 'Pay the rider after receiving your food.'
                        : 'Send the payment first using a mobile payment agent.'}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            {formData.paymentMethod === 'mobile' ? (
              <>
                <label className="space-y-2 sm:col-span-1">
                  <span className="text-sm font-medium text-slate-200">Mobile agent</span>
                  <select
                    required
                    value={formData.mobileAgent}
                    onChange={(event) => handleChange('mobileAgent', event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 focus:border-orange-500"
                  >
                    {mobileAgents.map((agent) => (
                      <option key={agent} value={agent}>
                        {agent}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 sm:col-span-1">
                  <span className="text-sm font-medium text-slate-200">Transaction ID</span>
                  <input
                    type="text"
                    required
                    value={formData.transactionId}
                    onChange={(event) => handleChange('transactionId', event.target.value)}
                    placeholder="Enter transaction ID"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-orange-500"
                  />
                </label>
              </>
            ) : null}

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-200">Delivery note</span>
              <textarea
                rows={3}
                value={formData.deliveryNote}
                onChange={(event) => handleChange('deliveryNote', event.target.value)}
                placeholder="Spice level, no onion, call before delivery, or any special request"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-orange-500"
              />
            </label>
          </div>

          {submitError ? <p className="mt-4 text-sm text-red-300">{submitError}</p> : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onBack}
              className="w-full rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors duration-200 hover:border-orange-500 hover:text-orange-400"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-400"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>

        <aside className="rounded-3xl border border-orange-500/30 bg-orange-500/10 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-orange-400">Order summary</p>
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-slate-300">Qty: {item.quantity || 1}</p>
                </div>
                <p className="text-sm font-bold text-white">
                  {'\u09F3'}{item.price * (item.quantity || 1)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">
            <div className="flex items-center justify-between text-slate-300">
              <span>Subtotal</span>
              <span>{'\u09F3'}{totalAmount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Delivery charge</span>
              <span>{'\u09F3'}60</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-bold text-white">
              <span>Total payable</span>
              <span>{'\u09F3'}{totalAmount + 60}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Checkout;
