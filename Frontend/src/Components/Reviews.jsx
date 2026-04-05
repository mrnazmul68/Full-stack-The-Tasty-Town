import React, { useEffect, useRef } from 'react';
import { FiUser, FiStar } from 'react-icons/fi';

const Reviews = ({ reviews = [] }) => {
  const scrollRef = useRef(null);

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || reviews.length === 0) return;

    let animationId;
    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 1;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [reviews]);

  // Duplicate reviews for seamless infinite scroll
  const displayReviews = [...reviews, ...reviews];

  return (
    <section id="reviews" className="py-20 overflow-hidden">
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500 mb-2">Reviews</p>
        <h2 className="text-4xl font-bold text-white sm:text-5xl">What Our Customers Say</h2>
        <p className="mt-4 text-slate-400">Honest feedback from our lovely foodies.</p>
      </div>

      {/* Auto-scrolling reviews */}
      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden whitespace-nowrap py-4"
        >
          {displayReviews.map((review, idx) => (
            <div 
              key={`${review._id}-${idx}`}
              className="inline-block w-[350px] shrink-0 whitespace-normal rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-all hover:border-orange-500/30 hover:bg-white/[0.08]"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20 text-orange-500">
                  <FiUser size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white">{review.name}</h4>
                  <div className="flex gap-1 text-orange-500">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        size={12} 
                        fill={i < (review.rating || 5) ? "currentColor" : "none"} 
                        className={i < (review.rating || 5) ? "" : "text-slate-600"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="italic leading-relaxed text-slate-300">
                "{review.message}"
              </p>
            </div>
          ))}
        </div>
        
        {/* Fading edges for the scroll */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent" />
      </div>
    </section>
  );
};

export default Reviews;
