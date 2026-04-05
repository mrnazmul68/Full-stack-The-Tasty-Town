import React, { useEffect, useMemo, useRef, useState } from 'react';

const Profile = ({ userProfile, onBack, onSave }) => {
  const [formData, setFormData] = useState(() => ({
    fullName: userProfile?.fullName || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    photo: userProfile?.photo || null,
  }));
  const [uploadError, setUploadError] = useState('');
  const [saveFeedback, setSaveFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData({
      fullName: userProfile?.fullName || '',
      email: userProfile?.email || '',
      phone: userProfile?.phone || '',
      address: userProfile?.address || '',
      photo: userProfile?.photo || null,
    });
  }, [userProfile]);

  const initials = useMemo(() => {
    return formData.fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'TT';
  }, [formData.fullName]);

  const handleChange = (field, value) => {
    setSaveFeedback(null);
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaveFeedback(null);
    setIsSubmitting(true);

    try {
      await onSave(formData);
      onBack();
    } catch (error) {
      setSaveFeedback({
        type: 'error',
        message: error.message || 'Profile update failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image file.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setUploadError('');
      handleChange('photo', reader.result);
    };

    reader.onerror = () => {
      setUploadError('Image upload failed. Please try another file.');
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setUploadError('');
    handleChange('photo', null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_16px_40px_rgba(220,32,22,0.18)] sm:p-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {formData.photo ? (
              <img
                src={formData.photo}
                alt={`${formData.fullName} profile`}
                className="h-18 w-18 rounded-full border border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-18 w-18 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white">
                {initials}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                My Profile
              </p>
              <h2 className="text-3xl font-bold">{formData.fullName || 'Your Profile'}</h2>
              <p className="text-sm text-slate-300">
                Update your personal info and profile photo anytime.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 sm:justify-end">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="profile-photo-upload"
            />
            <label
              htmlFor="profile-photo-upload"
              className="cursor-pointer rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-400"
            >
              Upload Photo
            </label>
            {formData.photo && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors duration-200 hover:border-orange-500 hover:text-orange-400"
              >
                Remove Photo
              </button>
            )}
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors duration-200 hover:border-orange-500 hover:text-orange-400"
            >
              Back to Home
            </button>
          </div>
        </div>

        {uploadError && (
          <p className="mb-6 text-sm text-red-400">{uploadError}</p>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 sm:col-span-1">
            <span className="text-sm font-medium text-slate-200">Full name</span>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(event) => handleChange('fullName', event.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-orange-500"
            />
          </label>

          <label className="space-y-2 sm:col-span-1">
            <span className="text-sm font-medium text-slate-200">Email address</span>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(event) => handleChange('email', event.target.value)}
              placeholder="Enter your email address"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-orange-500"
            />
          </label>

          <label className="space-y-2 sm:col-span-1">
            <span className="text-sm font-medium text-slate-200">Phone number</span>
            <input
              type="tel"
              value={formData.phone}
              onChange={(event) => handleChange('phone', event.target.value)}
              placeholder="Enter your phone number"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-orange-500"
            />
          </label>

          <label className="space-y-2 sm:col-span-1">
            <span className="text-sm font-medium text-slate-200">Delivery address</span>
            <input
              type="text"
              value={formData.address}
              onChange={(event) => handleChange('address', event.target.value)}
              placeholder="Enter your delivery address"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-orange-500"
            />
          </label>

          <div className="sm:col-span-2 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
            <p className="font-semibold text-white">Profile preview</p>
            <p>Name: {formData.fullName || 'Not added yet'}</p>
            <p>Email: {formData.email || 'Not added yet'}</p>
            <p>Phone: {formData.phone || 'Not added yet'}</p>
            <p>Address: {formData.address || 'Not added yet'}</p>
            <p>Photo: {formData.photo ? 'Added' : 'Not added yet'}</p>
          </div>

          {saveFeedback?.type === 'error' && (
            <div
              className="sm:col-span-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {saveFeedback.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="sm:col-span-2 w-full rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Profile;
