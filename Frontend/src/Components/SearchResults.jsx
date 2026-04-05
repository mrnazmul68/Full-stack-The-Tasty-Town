import React from 'react';

const SearchResults = ({ query, results, onAddToCart, onRemoveFromCart, cartItems }) => {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return null;
  }

  return (
    <section className="py-6 sm:py-8">
      <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              Search Results
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Results for "{normalizedQuery}"
            </h2>
            <p className="text-sm text-slate-300">
              {results.length} {results.length === 1 ? 'match' : 'matches'} found
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex w-fit rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition-colors duration-200 hover:border-orange-500 hover:text-orange-400"
          >
            Back to top
          </button>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center">
          <p className="text-lg font-semibold">Nothing found</p>
          <p className="mt-2 text-sm text-slate-300">
            Try another food name or category.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((item) => (
            <article
              key={item._id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-44 w-full object-cover sm:h-48"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 p-1 shadow-lg backdrop-blur">
                  <button
                    type="button"
                    onClick={() => onRemoveFromCart(item._id)}
                    disabled={!cartItems[item._id]}
                    className="rounded-full px-3 py-2 text-sm text-slate-200 transition-colors duration-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="min-w-6 text-center text-sm font-semibold text-white">
                    {cartItems[item._id] || 0}
                  </span>
                  <button
                    type="button"
                    onClick={() => onAddToCart(item._id)}
                    className="rounded-full bg-orange-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-orange-400"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      {item.category}
                    </p>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                  </div>
                  <span className="rounded-full bg-orange-500/15 px-3 py-1 text-sm font-bold text-orange-400">
                    {'\u09F3'}{item.price}
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-300">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchResults;
