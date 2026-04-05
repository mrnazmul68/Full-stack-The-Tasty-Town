import React, { useState, useEffect } from "react";
import { FiMapPin, FiMessageSquare, FiStar, FiSend } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const socialLinks = [
  { name: "Facebook", icon: FaFacebookF, href: "#" },
  { name: "Instagram", icon: FaInstagram, href: "#" },
  { name: "YouTube", icon: FaYoutube, href: "#" },
];

const Contact = ({ onSubmitReview, siteSettings, userProfile }) => {
  const [formData, setFormData] = useState({
    name: userProfile?.fullName || "",
    email: userProfile?.email || "",
    message: "",
    rating: 5,
  });
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        name: userProfile.fullName || "",
        email: userProfile.email || "",
      }));
    }
  }, [userProfile]);

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const reviewData = {
        ...formData,
        photo: userProfile?.photo || "",
      };
      await onSubmitReview?.(reviewData);
      setFormData((current) => ({
        ...current,
        message: "",
        rating: 5,
      }));
    } catch (error) {
      console.error("Review submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-us" className="scroll-mt-24 py-12 sm:py-16">
      <div className="mb-8 space-y-3 sm:mb-10 text-center md:text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
          Contact
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">Visit, follow, or send a review</h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base mx-auto md:mx-0">
          Stay connected with the shop, find the location easily, and send your message
          or review directly from here.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_1.1fr]">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-2xl">
          <div className="mb-6 flex items-center gap-3 text-orange-400">
            <FiMessageSquare className="text-2xl" />
            <h3 className="text-xl font-bold text-white">Share Your Experience</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="ml-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  required
                  disabled={!!userProfile}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-orange-500 disabled:opacity-60"
                />
              </div>
              <div className="space-y-1.5">
                <label className="ml-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  required
                  disabled={!!userProfile}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-orange-500 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="ml-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Rating</label>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleChange("rating", star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform active:scale-90"
                    >
                      <FiStar 
                        size={20} 
                        fill={(hoveredRating || formData.rating) >= star ? "currentColor" : "none"}
                        className={(hoveredRating || formData.rating) >= star ? "text-orange-500" : "text-slate-600"}
                      />
                    </button>
                  ))}
                </div>
                <span className="ml-2 text-xs font-bold text-slate-400">
                  {formData.rating === 5 ? "Excellent!" : formData.rating === 4 ? "Very Good" : formData.rating === 3 ? "Good" : formData.rating === 2 ? "Fair" : "Poor"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="ml-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Your Review</label>
              <textarea
                rows="4"
                placeholder="What did you love about our food?"
                value={formData.message}
                onChange={(event) => handleChange("message", event.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-400 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <FiSend className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  Submit Review
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-orange-400">
              <FiMapPin className="text-xl" />
              <h3 className="text-xl font-semibold text-white">Location</h3>
            </div>
            <p className="text-sm leading-7 text-slate-300 sm:text-base">
              {siteSettings?.contactLocation || "Khila Uttorbazar, Monohorgong, Comilla"}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Social Media</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm font-medium transition-colors duration-200 hover:border-orange-500 hover:text-orange-400"
                >
                  <link.icon className="text-base" />
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
        {siteSettings?.footerText || "Copyright (c) Tasty Town Shop. All rights reserved."}
      </div>
    </section>
  );
};

export default Contact;
