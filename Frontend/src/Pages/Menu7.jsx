import React from 'react';
import { FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';
import { food_list } from '../assets/assets';

const pastaItems = food_list.filter((item) => item.category === 'Pasta');

const Menu7 = ({ cartItems, onAddToCart, onRemoveFromCart, onOrderItem, onBack }) => {
  return (
    <section className="py-12 sm:py-16">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition-colors duration-200 hover:border-orange-500 hover:text-orange-400"
      >
        <FiArrowLeft className="text-base" />
        Back to menu
      </button>

      <div className="mb-10 space-y-3">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
          Pasta Menu
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">Creamy, cheesy, and classic pasta</h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Explore rich pasta bowls with tomato, cheese, cream, and chicken flavors for
          every mood.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pastaItems.map((item) => (
          <article
            key={item._id}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="relative">
              <img src={item.image} alt={item.name} className="h-52 w-full object-cover" />

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
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{item.category}</p>
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
    </section>
  );
};

export default Menu7;
