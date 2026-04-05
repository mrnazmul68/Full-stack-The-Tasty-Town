import React from "react";
import { FiStar, FiTrash2 } from "react-icons/fi";
import { SectionHeader } from "./AdminComponents";
import { adminApi } from "../../services/api";

const Reviews = ({ reviews, adminToken, handleAction }) => {
  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <SectionHeader title="Customer Feedback" subtitle="Moderate and analyze public reviews" />
      <div className="columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="break-inside-avoid rounded-3xl border border-white/10 bg-white/5 p-6 transition-all hover:border-orange-500/20">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
                  <FiStar className="fill-current" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{review.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{review.email}</p>
                </div>
              </div>
              <button onClick={() => handleAction(() => adminApi.deleteReview(adminToken, review._id), "Review removed")} className="text-slate-500 hover:text-rose-500 transition-colors">
                <FiTrash2 />
              </button>
            </div>
            <p className="text-sm italic leading-relaxed text-slate-300">"{review.message}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
