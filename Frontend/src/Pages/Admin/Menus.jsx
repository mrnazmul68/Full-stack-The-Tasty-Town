import React, { useRef, useState } from "react";
import { FiGrid, FiSettings, FiTrash2, FiPlus, FiUpload, FiX } from "react-icons/fi";
import { SectionHeader } from "./AdminComponents";
import { adminApi } from "../../services/api";

const Menus = ({ 
  categories, 
  adminToken, 
  handleAction, 
  editingCategory, 
  setEditingCategory, 
  categoryForm, 
  setCategoryForm, 
  emptyCategoryForm,
  isSaving 
}) => {
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState("");

  const handleNameChange = (name) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    setCategoryForm(c => ({ ...c, name, slug }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadError("");
      setCategoryForm(c => ({ ...c, imageUrl: reader.result }));
    };
    reader.onerror = () => {
      setUploadError("Image upload failed.");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setCategoryForm(c => ({ ...c, imageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <SectionHeader title="Menu Categories" subtitle="Organize your dishes into sections" />
      
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const ok = await handleAction(
            () => 
              editingCategory 
                ? adminApi.updateMenuCategory(adminToken, editingCategory._id, categoryForm)
                : adminApi.createMenuCategory(adminToken, categoryForm),
            editingCategory ? "Category updated" : "Category added"
          );
          if (ok) {
            setCategoryForm(emptyCategoryForm);
            setEditingCategory(null);
          }
        }}
        className="rounded-[2.5rem] border border-white/10 bg-black/20 p-8 shadow-2xl"
      >
        <h3 className="mb-6 text-lg font-bold text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            {editingCategory ? <FiSettings className="text-orange-500" /> : <FiPlus className="text-orange-500" />}
            {editingCategory ? "Edit Category" : "New Category"}
          </span>
          {editingCategory && (
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm(emptyCategoryForm);
              }}
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel Edit
            </button>
          )}
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Display Name</label>
              <input
                value={categoryForm.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Desserts"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm outline-none focus:border-orange-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Sort Order</label>
              <input
                type="number"
                value={categoryForm.sortOrder}
                onChange={(e) => setCategoryForm(c => ({ ...c, sortOrder: parseInt(e.target.value) }))}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Category Image</label>
            <div className="relative group/img flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 bg-black/40 p-4 transition-all hover:border-orange-500/30">
              {categoryForm.imageUrl ? (
                <div className="relative h-full w-full">
                  <img 
                    src={categoryForm.imageUrl} 
                    alt="Preview" 
                    className="h-48 w-full rounded-2xl object-cover shadow-xl" 
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-rose-500"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center py-10"
                >
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 transition-transform group-hover/img:scale-110">
                    <FiUpload size={24} />
                  </div>
                  <p className="text-xs font-bold text-white">Click to upload image</p>
                  <p className="mt-1 text-[10px] text-slate-500">PNG, JPG or WebP (Max. 2MB)</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            {uploadError && <p className="text-[10px] font-bold text-rose-500 ml-2">{uploadError}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-8 w-full rounded-2xl bg-orange-500 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-400 active:scale-[0.98] disabled:opacity-50"
        >
          {editingCategory ? "Update Category" : "Create Category"}
        </button>
      </form>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <div key={category._id} className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-6 transition-all hover:border-orange-500/30 hover:bg-white/[0.07]">
            <div className="mb-6 flex items-center justify-between">
              <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                {category.imageUrl ? (
                  <img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-orange-400">
                    <FiGrid size={24} />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditingCategory(category);
                    setCategoryForm({
                      name: category.name,
                      slug: category.slug,
                      description: category.description,
                      imageUrl: category.imageUrl,
                      sortOrder: category.sortOrder,
                    });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }} 
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-orange-500 hover:text-white transition-all"
                >
                  <FiSettings size={18} />
                </button>
                <button 
                  onClick={() => handleAction(() => adminApi.deleteMenuCategory(adminToken, category._id), "Removed")} 
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-rose-500 hover:text-white transition-all"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
            <h4 className="text-lg font-bold text-white">{category.name}</h4>
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Sort: {category.sortOrder}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500/70">/{category.slug}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menus;
