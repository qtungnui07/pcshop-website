import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

export type CartProduct = {
  id: string;
  name: string;
  specs?: string;
  price: number | string;
  image?: string;
  category?: string;
};

export type CartItem = CartProduct & {
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: CartProduct) => boolean;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function parseCartPrice(price: number | string) {
  if (typeof price === "number") return price;
  return parseInt(String(price).replace(/[^\d]/g, ""), 10) || 0;
}

export function formatCartPrice(price: number | string) {
  return new Intl.NumberFormat("vi-VN").format(parseCartPrice(price)) + " đ";
}

function getCartKey(userId: string) {
  return `pcshop_cart_${userId}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    const rawCart = localStorage.getItem(getCartKey(user.id || user.email));
    if (!rawCart) {
      setItems([]);
      return;
    }

    try {
      setItems(JSON.parse(rawCart));
    } catch {
      localStorage.removeItem(getCartKey(user.id || user.email));
      setItems([]);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(getCartKey(user.id || user.email), JSON.stringify(items));
  }, [items, user]);

  const addItem = (product: CartProduct) => {
    if (!user) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return false;
    }

    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });

    return true;
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((current) => {
      if (quantity <= 0) return current.filter((item) => item.id !== id);
      return current.map((item) => (item.id === id ? { ...item, quantity } : item));
    });
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const value = useMemo<CartContextType>(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + parseCartPrice(item.price) * item.quantity, 0);

    return {
      items,
      totalItems,
      totalPrice,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [items, user]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
