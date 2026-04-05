import React from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const MenuCategory = ({
  category,
  items = [],
  cartItems,
  onAddToCart,
  onBack,
  onOrderItem,
  onRemoveFromCart,
}) => {
  return (
    <section className="py-12 sm:py-16">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-colors duration-200 hover:border-orange-500 hover:text-orange-400"
      >
        Back to Menu
      </button>

      <div className="mb-8 space-y-3 sm:mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
          {category?.name || "Menu"}
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">
          {category?.name || "Category"} favorites
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Explore the dishes available in this section and order your favorite picks.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-300">
          No items are available in this menu right now.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <article
              key={item._id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="relative">
                <img src={item.image} alt={item.name} className="h-48 w-full object-cover" />
                <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 p-1 shadow-lg backdrop-blur">
                  <button
                    type="button"
                    onClick={() => onRemoveFromCart(item._id)}
                    disabled={!cartItems[item._id]}
                    className="rounded-full p-2 text-slate-200 transition-colors duration-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiMinus className="text-sm" />
                  </button>
                  <span className="min-w-6 text-center text-sm font-semibold text-white">
                    {cartItems[item._id] || 0}
                  </span>
                  <button
                    type="button"
                    onClick={() => onAddToCart(item._id)}
                    className="rounded-full bg-orange-500 p-2 text-white transition-colors duration-200 hover:bg-orange-400"
                  >
                    <FiPlus className="text-sm" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <span className="rounded-full bg-orange-500/15 px-3 py-1 text-sm font-bold text-orange-400">
                    {"\u09F3"}
                    {item.price}
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-300">{item.description}</p>
                <button
                  type="button"
                  onClick={() => onOrderItem(item)}
                  className="w-full rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-400"
                >
                  Order Now
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default MenuCategory;
