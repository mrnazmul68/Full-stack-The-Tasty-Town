import React from 'react';

const Cart = ({
  items,
  totalAmount,
  onAddToCart,
  onRemoveFromCart,
  onContinueShopping,
  onOrderNow,
}) => {
  return (
    <section className="py-12 sm:py-16">
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
            Cart Page
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">Your selected foods</h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Review your items, update quantities, and continue when everything looks right.
          </p>
        </div>

        <button
          type="button"
          onClick={onContinueShopping}
          className="rounded-full border border-orange-500 px-5 py-3 text-sm font-semibold text-orange-500 transition-colors duration-200 hover:bg-orange-500 hover:text-white"
        >
          Continue Shopping
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-16 text-center">
          <p className="text-lg font-semibold">Your cart is empty</p>
          <p className="mt-2 text-sm text-slate-300">
            Add some top foods to see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item._id}
              className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded-2xl object-cover"
                />
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-slate-300">{item.category}</p>
                  <p className="text-sm font-semibold text-orange-400">
                    {'\u09F3'}{item.price} each
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-2 py-1">
                  <button
                    type="button"
                    onClick={() => onRemoveFromCart(item._id)}
                    className="rounded-full px-3 py-2 text-lg text-slate-200 transition-colors duration-200 hover:bg-white/10"
                  >
                    -
                  </button>
                  <span className="min-w-6 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onAddToCart(item._id)}
                    className="rounded-full px-3 py-2 text-lg text-orange-400 transition-colors duration-200 hover:bg-orange-500/10"
                  >
                    +
                  </button>
                </div>

                <p className="min-w-24 text-right text-sm font-bold text-white">
                  {'\u09F3'}{item.price * item.quantity}
                </p>
              </div>
            </article>
          ))}

          <div className="mt-6 flex justify-end">
            <div className="min-w-[260px] rounded-3xl border border-orange-500/30 bg-orange-500/10 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-orange-400">Total</p>
              <p className="mt-2 text-3xl font-bold text-white">{'\u09F3'}{totalAmount}</p>
              <button
                type="button"
                onClick={onOrderNow}
                className="mt-4 w-full rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-400"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Cart;
