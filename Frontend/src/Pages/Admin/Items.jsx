import React, { useRef, useState } from "react";
import { FiSettings, FiTrash2, FiPlus, FiUpload, FiX, FiPackage } from "react-icons/fi";
import { SectionHeader } from "./AdminComponents";
import { adminApi } from "../../services/api";

const Items = ({ 
  items, 
  categories, 
  adminToken, 
  handleAction, 
  editingItem, 
  setEditingItem, 
  itemForm, 
  setItemForm, 
  emptyItemForm,
  isSaving 
}) => {
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState("");

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
      setItemForm(c => ({ ...c, imageUrl: reader.result }));
    };
    reader.onerror = () => {
      setUploadError("Image upload failed.");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setItemForm(c => ({ ...c, imageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <SectionHeader title="Dish Management" subtitle="Add and edit products in your catalog" />
      
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const ok = await handleAction(
            () => 
              editingItem 
                ? adminApi.updateMenuItem(adminToken, editingItem._id, itemForm)
                : adminApi.createMenuItem(adminToken, itemForm),
            editingItem ? "Item updated" : "Item added"
          );
          if (ok) {
            setItemForm({ ...emptyItemForm, categorySlug: categories[0]?.slug || "" });
            setEditingItem(null);
          }
        }}
        className="rounded-[2.5rem] border border-white/10 bg-black/20 p-8 shadow-2xl"
      >
        <h3 className="mb-6 text-lg font-bold text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            {editingItem ? <FiSettings className="text-orange-500" /> : <FiPlus className="text-orange-500" />}
            {editingItem ? "Edit Product" : "New Product"}
          </span>
          {editingItem && (
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setItemForm({ ...emptyItemForm, categorySlug: categories[0]?.slug || "" });
              }}
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel Edit
            </button>
          )}
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Dish Name</label>
                <input
                  value={itemForm.name}
                  onChange={(e) => setItemForm(c => ({ ...c, name: e.target.value }))}
                  placeholder="e.g. Garlic Naan"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Price (৳)</label>
                <input
                  type="number"
                  value={itemForm.price}
                  onChange={(e) => setItemForm(c => ({ ...c, price: e.target.value }))}
                  placeholder="150"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Category</label>
                <select
                  value={itemForm.categorySlug}
                  onChange={(e) => setItemForm(c => ({ ...c, categorySlug: e.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm outline-none focus:border-orange-500 appearance-none"
                  required
                >
                  {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex items-end pb-3 pl-2">
                <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.isFeatured}
                    onChange={(e) => setItemForm(c => ({ ...c, isFeatured: e.target.checked }))}
                    className="h-5 w-5 rounded-lg border-white/10 bg-black/40 text-orange-500 focus:ring-orange-500"
                  />
                  Featured Dish
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Description</label>
              <textarea
                value={itemForm.description}
                onChange={(e) => setItemForm(c => ({ ...c, description: e.target.value }))}
                placeholder="Tell customers about this dish..."
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm outline-none focus:border-orange-500 min-h-[100px]"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-2">Dish Image</label>
            <div className="relative group/img flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 bg-black/40 p-4 transition-all hover:border-orange-500/30">
              {itemForm.imageUrl ? (
                <div className="relative h-full w-full">
                  <img 
                    src={itemForm.imageUrl} 
                    alt="Preview" 
                    className="h-48 w-full rounded-2xl object-cover shadow-xl lg:h-64" 
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
                  className="flex cursor-pointer flex-col items-center justify-center py-10 lg:py-20"
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
          {editingItem ? "Update Product" : "Add Product"}
        </button>
      </form>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item._id} className="group overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 transition-all hover:border-orange-500/20 hover:bg-white/[0.07]">
            <div className="relative h-48 overflow-hidden">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-black/40 text-slate-600">
                  <FiPackage size={40} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => {
                    setEditingItem(item);
                    setItemForm({
                      name: item.name,
                      price: item.price,
                      categorySlug: item.categorySlug,
                      description: item.description,
                      imageUrl: item.imageUrl,
                      isFeatured: item.isFeatured,
                      sortOrder: item.sortOrder || 0,
                    });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }} 
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-orange-500 transition-colors"
                >
                  <FiSettings />
                </button>
                <button onClick={() => handleAction(() => adminApi.deleteMenuItem(adminToken, item._id), "Removed")} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-rose-500 transition-colors">
                  <FiTrash2 />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-white line-clamp-1">{item.name}</h4>
                <span className="text-sm font-bold text-orange-500">৳{item.price}</span>
              </div>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">{item.categorySlug}</p>
              <p className="mt-3 text-xs leading-relaxed text-slate-400 line-clamp-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Items;
