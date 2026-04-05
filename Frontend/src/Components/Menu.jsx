import React from 'react';
import { menu_list } from '../assets/assets';

const Menu = ({ categories = menu_list, onMenuSelect }) => {
  return (
    <section id="menu" className="scroll-mt-24 py-12 sm:py-16">
      <div className="mb-8 space-y-3  sm:mb-10">
        <p className="text-sm font-semibold text-center uppercase tracking-[0.3em] text-orange-500 ">
          Explore Menu
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">Choose your favorite dish</h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Browse our popular categories and find the perfect meal for every craving,
          from light salads to rich desserts.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
        {categories.map((item) => (
          <div
            key={item._id || item.slug || item.menu_name}
            role="button"
            tabIndex={0}
            onClick={() => onMenuSelect?.(item)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onMenuSelect?.(item);
              }
            }}
            className="group cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:border-orange-500/60 hover:bg-white/8"
          >
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white/5 sm:h-28 sm:w-28">
              <img
                src={item.menu_image}
                alt={item.menu_name}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <h3 className="text-sm font-semibold sm:text-base">{item.menu_name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Menu;
