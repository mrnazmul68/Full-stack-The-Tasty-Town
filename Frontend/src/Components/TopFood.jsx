import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { food_list } from '../assets/assets';

const TopFood = ({
  cartItems,
  items = food_list,
  onAddToCart,
  onRemoveFromCart,
  onOrderItem,
}) => {
  const topFoods = items.filter((item) => item.isFeatured !== false).slice(0, 10);

  return (
    <section id="top-foods" className="scroll-mt-24 py-12 sm:py-16">
      <div className="mb-8 space-y-3 sm:mb-10">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
          Top Foods
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">Most loved dishes right now</h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Scroll through our featured picks and discover a few of the dishes customers
          keep ordering again and again.
        </p>
      </div>

      <div className="scrollbar-hidden flex gap-4 overflow-x-auto pb-4 sm:gap-6">
        {topFoods.map((item) => (
          <article
            key={item._id}
            className="min-w-[240px] max-w-[240px] flex-none overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="h-44 w-full object-cover"
              />

              <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 p-1 shadow-lg backdrop-blur">
                <button
                  type="button"
                  aria-label={`Remove ${item.name} from cart`}
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
                  aria-label={`Add ${item.name} to cart`}
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
              <p className="text-sm leading-6 text-slate-300">{item.description}</p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  {item.category}
                </span>

                <button
                  type="button"
                  onClick={() => onOrderItem(item)}
                  className="rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-orange-400"
                >
                  Order Now
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TopFood;
