import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  FiBarChart2,
  FiCoffee,
  FiGrid,
  FiLoader,
  FiMessageSquare,
  FiSettings,
  FiShield,
  FiShoppingBag,
  FiUsers,
  FiHome,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiX
} from "react-icons/fi";
import { adminApi } from "../../services/api";
import { toast } from "react-hot-toast";

// Import sub-components
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Users from "./Users";
import Reviews from "./Reviews";
import Menus from "./Menus";
import Items from "./Items";
import Settings from "./Settings";

const sections = [
  { id: "dashboard", label: "Overview", icon: FiBarChart2, description: "Performance and insights" },
  { id: "orders", label: "Orders", icon: FiShoppingBag, description: "Manage sales" },
  { id: "users", label: "Users", icon: FiUsers, description: "Customer management" },
  { id: "reviews", label: "Reviews", icon: FiMessageSquare, description: "Public feedback" },
  { id: "menus", label: "Menus", icon: FiGrid, description: "Categories" },
  { id: "items", label: "Items", icon: FiCoffee, description: "Dishes & products" },
  { id: "settings", label: "Settings", icon: FiSettings, description: "Site configuration" },
];

const emptyCategoryForm = { name: "", slug: "", description: "", imageKey: "", imageUrl: "", sortOrder: 0 };
const emptyItemForm = { name: "", description: "", price: "", categorySlug: "", imageKey: "", imageUrl: "", sortOrder: 0, isFeatured: false };

const AdminPanel = ({ token, onCatalogRefresh, onUnauthorized, siteSettings }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminData, setAdminData] = useState(null);
  const [settingsForm, setSettingsForm] = useState(siteSettings);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const activeSection = location.pathname.split("/").pop() || "dashboard";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    let isActive = true;

    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        const data = await adminApi.getBootstrap(token);
        if (!isActive) return;
        setAdminData(data);
        setSettingsForm(data.settings || siteSettings);
        setItemForm(curr => ({ ...curr, categorySlug: curr.categorySlug || data.categories?.[0]?.slug || "" }));
        setFeedback("");
      } catch (error) {
        if (!isActive) return;
        if (error.message.toLowerCase().includes("admin")) onUnauthorized?.();
        else setFeedback(error.message);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void fetchAdminData();
    return () => { isActive = false; };
  }, [token, onUnauthorized, siteSettings]);

  const loadAdminData = async (options = {}) => {
    if (options.showLoading !== false) setIsLoading(true);
    try {
      const data = await adminApi.getBootstrap(token);
      setAdminData(data);
      setSettingsForm(data.settings || siteSettings);
    } catch (error) {
      if (error.message.toLowerCase().includes("admin")) onUnauthorized?.();
      setFeedback(error.message);
    } finally {
      if (options.showLoading !== false) setIsLoading(false);
    }
  };

  const handleAction = async (action, successMessage) => {
    setIsSaving(true);
    setFeedback("");
    try {
      await action();
      await loadAdminData({ showLoading: false });
      await onCatalogRefresh?.();
      setFeedback(successMessage);
      toast.success(successMessage || "Action completed successfully!");
      return true;
    } catch (error) {
      if (error.message.toLowerCase().includes("admin")) {
        onUnauthorized?.();
      } else {
        setFeedback(error.message);
        toast.error(error.message);
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !adminData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-ping rounded-full bg-orange-500/20"></div>
          <div className="relative flex h-full w-full items-center justify-center rounded-full border-2 border-orange-500/50 bg-black">
            <FiLoader className="animate-spin text-2xl text-orange-500" />
          </div>
        </div>
        <p className="animate-pulse text-sm font-medium text-slate-400">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen gap-6 py-6 overflow-hidden bg-black px-4 lg:px-6">
      {/* Sidebar Navigation - Desktop */}
      <aside className={`relative hidden h-full transition-all duration-300 lg:flex ${sidebarCollapsed ? 'w-20' : 'w-72'}`}>
        {/* Collapse Toggle Button - Positioned relative to aside but outside scroll area */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-12 z-[60] flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-orange-500 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
        >
          {sidebarCollapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
        </button>

        <div className="flex w-full flex-col gap-8 overflow-y-auto overflow-x-hidden scrollbar-hidden py-4">
          <div className="my-auto flex flex-col gap-8">
            <div className="relative flex flex-col gap-2 rounded-[2.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              {/* Home Button */}
              <button
                onClick={() => navigate("/")}
                className={`group relative flex items-center gap-3 rounded-2xl p-3.5 transition-all duration-300 text-slate-400 hover:bg-white/5 hover:text-white ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300 bg-black/20 group-hover:scale-110`}>
                  <FiHome className="text-xl" />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-bold tracking-tight">Home</span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Back to storefront</span>
                  </div>
                )}
              </button>

              <div className="my-2 h-px w-full bg-white/10" />

              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => navigate(`/admin/${section.id}`)}
                    className={`group relative flex items-center gap-3 rounded-2xl p-3.5 transition-all duration-300 ${
                      activeSection === section.id 
                        ? "bg-orange-500 text-white shadow-[0_12px_24px_rgba(249,115,22,0.3)]" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    } ${sidebarCollapsed ? 'justify-center' : ''}`}
                  >
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${activeSection === section.id ? 'bg-white/20' : 'bg-black/20 group-hover:scale-110'}`}>
                      <Icon className="text-xl" />
                    </div>
                    {!sidebarCollapsed && (
                      <div className="flex flex-col items-start text-left">
                        <span className="text-sm font-bold tracking-tight">{section.label}</span>
                        <span className={`text-[10px] uppercase tracking-widest ${activeSection === section.id ? 'text-orange-100' : 'text-slate-500'}`}>{section.description}</span>
                      </div>
                    )}
                    {activeSection === section.id && !sidebarCollapsed && (
                      <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]"></div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {!sidebarCollapsed && (
              <div className="rounded-[2.5rem] border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg">
                  <FiShield className="text-xl" />
                </div>
                <h4 className="text-sm font-bold text-white">Pro Admin Access</h4>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">You have full control over Tasty Town's ecosystem.</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-72 transform bg-neutral-950 p-6 transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto scrollbar-hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <FiShield size={20} />
            </div>
            <span className="text-lg font-black text-white">Admin Panel</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-400"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {/* Mobile Home Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-4 rounded-2xl p-4 text-slate-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <FiHome size={20} />
            <span className="text-sm font-bold">Back to Home</span>
          </button>

          <div className="my-2 h-px w-full bg-white/10" />

          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => {
                  navigate(`/admin/${section.id}`);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-4 rounded-2xl p-4 transition-all ${
                  isActive 
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-bold">{section.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full space-y-8 overflow-y-auto custom-scrollbar px-2 sm:px-4 pb-10">
        {/* Mobile Header with Hamburger */}
        <div className="flex items-center justify-between lg:hidden mb-6">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-orange-500 shadow-xl"
          >
            <FiMenu size={24} />
          </button>
          <div className="flex flex-col items-end">
            <h2 className="text-sm font-black uppercase tracking-widest text-white">
              {sections.find(s => s.id === activeSection)?.label}
            </h2>
            <p className="text-[10px] text-orange-500 font-bold">Management</p>
          </div>
        </div>

        {/* Render Active Section via Routing */}
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={
            <Dashboard 
              dashboard={adminData?.dashboard} 
              orders={adminData?.orders || []} 
              loadAdminData={loadAdminData} 
            />
          } />
          <Route path="orders" element={
            <Orders 
              orders={adminData?.orders || []} 
              adminToken={token} 
              handleAction={handleAction} 
            />
          } />
          <Route path="users" element={
            <Users 
              users={adminData?.users || []} 
              adminToken={token} 
              handleAction={handleAction} 
            />
          } />
          <Route path="reviews" element={
            <Reviews 
              reviews={adminData?.reviews || []} 
              adminToken={token} 
              handleAction={handleAction} 
            />
          } />
          <Route path="menus" element={
            <Menus 
              categories={adminData?.categories || []} 
              adminToken={token} 
              handleAction={handleAction} 
              editingCategory={editingCategory}
              setEditingCategory={setEditingCategory}
              categoryForm={categoryForm}
              setCategoryForm={setCategoryForm}
              emptyCategoryForm={emptyCategoryForm}
              isSaving={isSaving}
            />
          } />
          <Route path="items" element={
            <Items 
              items={adminData?.items || []} 
              categories={adminData?.categories || []} 
              adminToken={token} 
              handleAction={handleAction} 
              editingItem={editingItem}
              setEditingItem={setEditingItem}
              itemForm={itemForm}
              setItemForm={setItemForm}
              emptyItemForm={emptyItemForm}
              isSaving={isSaving}
            />
          } />
          <Route path="settings" element={
            <Settings 
              settingsForm={settingsForm} 
              setSettingsForm={setSettingsForm} 
              adminToken={token} 
              handleAction={handleAction} 
              isSaving={isSaving}
            />
          } />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPanel;
