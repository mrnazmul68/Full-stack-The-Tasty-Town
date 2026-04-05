import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { food_list } from '../assets/assets';

const lassiItems = food_list.filter((item) => item.category === 'Lassi');

const Menu6 = ({ onBack }) => {
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
          Lassi Menu
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">Cool and refreshing lassi drinks</h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Sweet, creamy, and chilled lassi options will appear here as soon as you add
          them to your menu data.
        </p>
      </div>

      {lassiItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-300">
          No lassi items are available yet.
        </div>
      ) : null}
    </section>
  );
};

export default Menu6;
