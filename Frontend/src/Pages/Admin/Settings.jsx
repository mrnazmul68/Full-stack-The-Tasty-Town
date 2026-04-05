import React from "react";
import { FiSettings, FiImage } from "react-icons/fi";
import { SectionHeader } from "./AdminComponents";
import { adminApi } from "../../services/api";

const Settings = ({ settingsForm, setSettingsForm, adminToken, handleAction, isSaving }) => {
  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <SectionHeader title="Site Settings" subtitle="Control global content and branding" />
      
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAction(() => adminApi.updateSettings(adminToken, settingsForm), "Settings saved");
        }}
        className="rounded-[2.5rem] border border-white/10 bg-black/20 p-8 space-y-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Site Title</label>
            <input
              value={settingsForm.siteTitle || ""}
              onChange={(e) => setSettingsForm(c => ({ ...c, siteTitle: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm outline-none focus:border-orange-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Hero Badge</label>
            <input
              value={settingsForm.heroBadge || ""}
              onChange={(e) => setSettingsForm(c => ({ ...c, heroBadge: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm outline-none focus:border-orange-500"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Site Subtitle</label>
            <textarea
              value={settingsForm.siteSubtitle || ""}
              onChange={(e) => setSettingsForm(c => ({ ...c, siteSubtitle: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm outline-none focus:border-orange-500 min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Logo URL</label>
            <input
              value={settingsForm.logoUrl || ""}
              onChange={(e) => setSettingsForm(c => ({ ...c, logoUrl: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm outline-none focus:border-orange-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Location</label>
            <input
              value={settingsForm.contactLocation || ""}
              onChange={(e) => setSettingsForm(c => ({ ...c, contactLocation: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm outline-none focus:border-orange-500"
            />
          </div>
        </div>
        
        <div className="pt-6 border-t border-white/5">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-10 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-400 active:scale-[0.98]"
          >
            <FiSettings /> Update Site Configuration
          </button>
        </div>
      </form>

      <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
        <h3 className="mb-4 text-lg font-bold text-white">Preview Identity</h3>
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-3xl bg-black/40 border border-white/10 p-4 flex items-center justify-center">
            {settingsForm.logoUrl ? (
              <img src={settingsForm.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
            ) : (
              <FiImage className="text-3xl text-slate-600" />
            )}
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">{settingsForm.siteTitle || "Tasty Town"}</h4>
            <p className="text-sm text-orange-500 font-medium">{settingsForm.heroBadge || "Fresh Flavors"}</p>
            <p className="mt-1 text-xs text-slate-400 max-w-md">{settingsForm.siteSubtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
