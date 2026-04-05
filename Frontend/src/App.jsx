import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Cart from "./Components/Cart";
import SignIn from "./Pages/SignIn";
import OrderSuccess from "./Pages/OrderSuccess";
import FoodsOrder from "./Pages/FoodsOrder";
import Profile from "./Pages/Profile";
import MyOrders from "./Pages/MyOrders";
import Checkout from "./Pages/Checkout";
import MenuCategory from "./Pages/MenuCategory";
import AdminPanel from "./Pages/Admin/AdminPanel";

import { customerApi, publicApi } from "./services/api";
import { useAuth } from "./hooks/useAuth";
import { useCart } from "./hooks/useCart";
import { useCatalog } from "./hooks/useCatalog";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, setUserProfile, login, register, logout, isAdmin } = useAuth();
  const { catalogData, catalogMessage, searchQuery, setSearchQuery, isSearching, searchPersistentResults, searchError, handleSubmitReview, fetchCatalogData } = useCatalog();
  const { cartItems, setCartItems, handleAddToCart, handleRemoveFromCart, clearCartItems, cartCount, cartProducts, totalAmount } = useCart(catalogData.items);

  const [selectedCategorySlug, setSelectedCategorySlug] = useState("");
  const [orderedItems, setOrderedItems] = useState([]);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  const handleOrderItem = (item) => {
    setCheckoutItems([{ ...item, quantity: 1 }]);
    navigate("/checkout");
  };

  const handleMenuSelect = (category) => {
    setSelectedCategorySlug(category?.slug || selectedCategorySlug);
    navigate("/menu-category");
  };

  const isAdminPanel = location.pathname.startsWith('/admin');

  return (
    <div className={`mx-auto min-h-screen max-w-7xl bg-black px-4 ${isAdminPanel ? 'pt-0' : 'pt-24'} text-white sm:px-6 ${isAdminPanel ? 'sm:pt-0' : 'sm:pt-28'} lg:px-20`}>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: "#1a1a1a", color: "#fff", borderRadius: "1rem", border: "1px solid rgba(255, 255, 255, 0.1)" }}} />
      
      {!isAdminPanel && (
        <Navbar
          cartCount={cartCount}
          onLogout={() => { logout(); navigate("/"); }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          siteSettings={catalogData.settings}
          userProfile={userProfile}
        />
      )}

      {catalogMessage && !isAdminPanel && (
        <div className="mb-6 rounded-3xl border border-orange-500/30 bg-orange-500/10 px-5 py-4 text-sm text-orange-100">
          {catalogMessage}
        </div>
      )}

      <Routes>
        <Route path="/" element={
          <Home 
            catalogData={catalogData}
            searchQuery={searchQuery}
            searchResults={searchPersistentResults}
            isSearching={isSearching}
            searchError={searchError}
            onClearSearch={() => setSearchQuery("")}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onOrderNow={() => navigate("/foods-order")}
            onExploreMenu={() => {
              navigate("/");
              window.requestAnimationFrame(() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" }));
            }}
            onMenuSelect={handleMenuSelect}
            onOrderItem={handleOrderItem}
            onSubmitReview={handleSubmitReview}
            userProfile={userProfile}
          />
        } />
        
        <Route path="/cart" element={
          <Cart 
            items={cartProducts} 
            totalAmount={totalAmount} 
            onAddToCart={handleAddToCart} 
            onRemoveFromCart={handleRemoveFromCart} 
            onContinueShopping={() => navigate("/")} 
            onOrderNow={() => { setCheckoutItems(cartProducts); navigate("/checkout"); }}
          />
        } />

        <Route path="/sign-in" element={
          <SignIn 
            onBack={() => navigate(-1)} 
            onLogin={async (creds) => {
              const profile = await login(creds);
              navigate(profile.role === "admin" ? "/admin" : "/profile");
            }}
            onRegister={async (creds) => {
              await register(creds);
              navigate("/profile");
            }}
          />
        } />

        <Route path="/profile" element={
          <Profile 
            userProfile={userProfile} 
            onBack={() => navigate("/")} 
            onSave={async (upd) => {
              const saved = await customerApi.saveProfile({ ...upd, id: userProfile.id });
              const next = { ...userProfile, ...saved };
              setUserProfile(next);
              toast.success("Profile updated!");
              return next;
            }}
          />
        } />

        <Route path="/my-orders" element={<MyOrders userProfile={userProfile} onBack={() => navigate("/")} />} />
        
        <Route path="/checkout" element={
          <Checkout 
            items={checkoutItems} 
            userProfile={userProfile} 
            onBack={() => navigate(-1)} 
            onPlaceOrder={async (details) => {
              const res = await publicApi.createOrder({ ...details, items: checkoutItems, totalAmount: checkoutItems.reduce((t, i) => t + i.price * i.quantity, 0) });
              setOrderedItems(checkoutItems);
              setLastOrderDetails({ ...details, orderNumber: res.orderNumber });
              clearCartItems(checkoutItems.map(i => i._id));
              setCheckoutItems([]);
              toast.success("Order placed!");
              navigate("/order-success");
            }} 
          />
        } />

        <Route path="/foods-order" element={
          <FoodsOrder 
            items={catalogData.items} 
            cartItems={cartItems} 
            onAddToCart={handleAddToCart} 
            onRemoveFromCart={handleRemoveFromCart} 
            onOrderItem={handleOrderItem} 
          />
        } />

        <Route path="/order-success" element={<OrderSuccess orderedItems={orderedItems} orderDetails={lastOrderDetails} onBackHome={() => navigate("/")} />} />
        
        <Route path="/menu-category" element={
          <MenuCategory 
            category={catalogData.categories.find(c => c.slug === selectedCategorySlug)} 
            items={catalogData.items.filter(i => i.categorySlug === selectedCategorySlug)}
            cartItems={cartItems} 
            onAddToCart={handleAddToCart} 
            onRemoveFromCart={handleRemoveFromCart} 
            onOrderItem={handleOrderItem} 
            onBack={() => navigate("/")} 
          />
        } />

        {isAdmin && (
          <Route path="/admin/*" element={
            <AdminPanel 
              token={userProfile.token} 
              onCatalogRefresh={() => fetchCatalogData()} 
              onUnauthorized={() => { logout(); navigate("/"); }} 
              siteSettings={catalogData.settings} 
            />
          } />
        )}
      </Routes>
    </div>
  );
};

export default App;
