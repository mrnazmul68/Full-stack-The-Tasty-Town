import React, { useMemo, useState } from 'react';
import { FiMinus, FiPlus, FiSearch } from 'react-icons/fi';
import { food_list } from '../assets/assets';

const FoodsOrder = ({
  cartItems,
  items = food_list,
  onAddToCart,
  onRemoveFromCart,
  onOrderItem,
}) => {
  const [pageSearch, setPageSearch] = useState('');

  const filteredFoods = useMemo(() => {
    const query = pageSearch.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) => {
      const name = item.name.toLowerCase();
      const category = item.category.toLowerCase();
      const description = item.description.toLowerCase();

      return (
        name.includes(query) ||
        category.includes(query) ||
        description.includes(query)
      );
    });
  }, [items, pageSearch]);

  return (
    <section className="py-12 sm:py-16">
      <div className="mb-8 space-y-3 sm:mb-10">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
          Foods Order
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">Choose from all available foods</h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Search by food name, category, or related word and order your favorite meal
          directly from this page.
        </p>
      </div>

      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <FiSearch className="text-lg text-slate-400" />
        <input
          type="text"
          value={pageSearch}
          onChange={(event) => setPageSearch(event.target.value)}
          placeholder="Search foods to order..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
        />
      </div>

      {filteredFoods.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-14 text-center">
          <p className="text-lg font-semibold">No foods found</p>
          <p className="mt-2 text-sm text-slate-300">Try another food name or category.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFoods.map((item) => (
            <article
              key={item._id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-48 w-full object-cover"
                />

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
                    {'\u09F3'}{item.price}
                  </span>
                </div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  {item.category}
                </p>
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

export default FoodsOrder;
