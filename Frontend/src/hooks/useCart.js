import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";

export const useCart = (catalogItems) => {
  const [cartItems, setCartItems] = useState({});

  const handleAddToCart = (itemId) => {
    setCartItems(curr => ({ ...curr, [itemId]: (curr[itemId] || 0) + 1 }));
    toast.success("Added to cart!", { duration: 1000 });
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems(curr => {
      const updated = { ...curr };
      if (updated[itemId] <= 1) delete updated[itemId];
      else updated[itemId] -= 1;
      return updated;
    });
    toast.error("Removed from cart", { duration: 1000 });
  };

  const clearCartItems = (itemIds) => {
    setCartItems(curr => {
      const upd = { ...curr };
      itemIds.forEach(id => delete upd[id]);
      return upd;
    });
  };

  const cartCount = Object.values(cartItems).reduce((t, c) => t + c, 0);

  const cartProducts = useMemo(() => 
    catalogItems.filter(i => cartItems[i._id]).map(i => ({ ...i, quantity: cartItems[i._id] })),
    [cartItems, catalogItems]
  );

  const totalAmount = cartProducts.reduce((t, i) => t + i.price * i.quantity, 0);

  return {
    cartItems,
    setCartItems,
    handleAddToCart,
    handleRemoveFromCart,
    clearCartItems,
    cartCount,
    cartProducts,
    totalAmount
  };
};
