import { Plus } from "lucide-react";
import { useCart, type CartProduct } from "../context/CartContext";

type AddToCartButtonProps = {
  product: CartProduct;
  className?: string;
  label?: string;
};

export default function AddToCartButton({ product, className = "", label }: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        addItem(product);
      }}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-zinc-200 bg-white/95 text-zinc-950 shadow-[0_8px_22px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-950 hover:text-white active:scale-95 cursor-pointer ${label ? "h-9 px-3 text-xs font-bold" : "h-9 w-9"} ${className}`}
      aria-label={`Thêm ${product.name} vào giỏ hàng`}
      title="Thêm vào giỏ hàng"
    >
      <Plus className="h-4 w-4" />
      {label && <span>{label}</span>}
    </button>
  );
}
