import { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../constants/data';
import AddToCartButton from '../../components/AddToCartButton';
import { useNavigate } from 'react-router-dom';

const API_BASE = typeof window !== "undefined"
  ? (window.location.hostname.includes("qtitpc.dev")
    ? "https://api-pc.qtitpc.dev"
    : `${window.location.protocol}//${window.location.hostname}:3001`)
  : "http://localhost:3001";

interface Product {
  badge?: string;
  title: string;
  description: string;
  price: string;
  from: string;
  to: string;
  image?: string;
  name?: string;
  specs?: string;
}

interface ProductCarouselProps {
  title?: string;
  subtitle?: string;
  products?: Product[];
  apiEndpoint?: string;
}

/** Map API PC data → carousel product format */
function mapPCToCarouselProduct(pc: any): Product {
  return {
    badge: pc.badge || "",
    title: pc.name || pc.title || "",
    name: pc.name || pc.title || "",
    description: pc.specs || pc.description || "",
    specs: pc.specs || pc.description || "",
    price: pc.price || "",
    from: (pc.from || "#D9F9DF").replace("#", ""),
    to: (pc.to || "#AEE2FF").replace("#", ""),
    image: pc.image || "",
  };
}

export default function ProductCarousel({
  title = "Thế hệ mới nhất.",
  subtitle = "Xem ngay có gì mới.",
  products,
  apiEndpoint = "/api/featured-pcs",
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(!products);
  const navigate = useNavigate();

  // Fetch from API if no products passed as prop
  useEffect(() => {
    if (products) {
      setFetchedProducts(products);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API_BASE}${apiEndpoint}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFetchedProducts(data.map(mapPCToCarouselProduct));
        }
      })
      .catch((err) => {
        console.error("Error fetching products for carousel:", err);
      })
      .finally(() => setLoading(false));
  }, [products, apiEndpoint]);

  const displayProducts = fetchedProducts;

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollRight = () => {
    if (scrollRef.current && scrollRef.current.children.length > 1) {
      const cardWidth = (scrollRef.current.children[1] as HTMLElement).offsetWidth;
      const gap = window.innerWidth >= 768 ? 24 : 16;
      scrollRef.current.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
    }
  };

  const scrollLeftFn = () => {
    if (scrollRef.current && scrollRef.current.children.length > 1) {
      const cardWidth = (scrollRef.current.children[1] as HTMLElement).offsetWidth;
      const gap = window.innerWidth >= 768 ? 24 : 16;
      scrollRef.current.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
    }
  };

  /** Determine the detail page link and prefix based on apiEndpoint */
  const getPrefix = () => {
    if (apiEndpoint.includes("laptop")) return "laptop";
    if (apiEndpoint.includes("accessories")) return "accessory";
    if (apiEndpoint.includes("components")) return "component";
    return "pc";
  };

  const getProductLink = (product: Product) => {
    const name = product.name || product.title;
    const prefix = getPrefix();
    return `/san-pham/${prefix}-${name}`;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="mt-16 md:mt-24 pb-12">
        <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-8">
            <span className="text-[#1d1d1f]">{title}</span> <span className="text-[#86868b]">{subtitle}</span>
          </h2>
        </div>
        <div className="flex overflow-hidden gap-4 md:gap-6 pb-8 pt-4 px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="min-w-[280px] md:min-w-[300px] lg:min-w-[320px] xl:min-w-[360px] 2xl:min-w-[400px] h-[360px] md:h-[400px] lg:h-[420px] xl:h-[460px] 2xl:h-[500px] rounded-[2rem] bg-zinc-100 animate-pulse shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  if (displayProducts.length === 0) return null;

  return (
    <div className="mt-16 md:mt-24 pb-12">
      <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-8">
          <span className="text-[#1d1d1f]">{title}</span> <span className="text-[#86868b]">{subtitle}</span>
        </h2>
      </div>

      <div className="relative group">
        <motion.div
          ref={scrollRef}
          onScroll={checkScroll}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-8 pt-4 scrollbar-hide snap-x snap-mandatory"
        >
          <div className="shrink-0 snap-start [--page-padding:16px] md:[--page-padding:32px] lg:[--page-padding:40px] xl:[--page-padding:48px] 2xl:[--page-padding:64px]" style={{ width: 'max(var(--page-padding), calc(50vw - 900px + var(--page-padding)))' }}></div>

          {displayProducts.map((product, idx) => (
            <motion.div
              variants={itemVariants}
              key={idx}
              onClick={() => navigate(getProductLink(product))}
              className="min-w-[280px] md:min-w-[300px] lg:min-w-[320px] xl:min-w-[360px] 2xl:min-w-[400px] h-[360px] md:h-[400px] lg:h-[420px] xl:h-[460px] 2xl:h-[500px] rounded-[2rem] snap-start relative overflow-hidden cursor-pointer shadow-[2px_4px_16px_rgba(0,0,0,0.04)] hover:shadow-xl hover:scale-[1.02] transition-all duration-300 p-6 md:p-8 flex flex-col justify-between"
              style={{ background: `linear-gradient(135deg, #${product.from}, #${product.to})` }}
            >
              {/* Nội dung chữ ở trên */}
              <div className="flex flex-col text-[#1d1d1f]">
                {product.badge && (
                  <span className="text-[10px] md:text-xs font-semibold tracking-widest uppercase mb-2 md:mb-3 opacity-80">
                    {product.badge}
                  </span>
                )}
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
                  {product.title}
                </h3>
                <p className="text-sm md:text-base opacity-80 max-w-[80%] leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Phần thông tin ở dưới cùng */}
              <div className="flex justify-between items-end">
                <p className="text-sm md:text-base font-medium">
                  {product.price}
                </p>
                <AddToCartButton
                  product={{
                    id: `${getPrefix()}-${product.name || product.title}`,
                    name: product.name || product.title,
                    specs: product.specs || product.description,
                    price: product.price,
                    category: getPrefix() === "laptop" ? "Laptop" : "PC",
                  }}
                />
              </div>
            </motion.div>
          ))}
          <div className="shrink-0 snap-end [--page-padding:16px] md:[--page-padding:32px] lg:[--page-padding:40px] xl:[--page-padding:48px] 2xl:[--page-padding:64px]" style={{ width: 'max(var(--page-padding), calc(50vw - 900px + var(--page-padding)))' }}></div>
        </motion.div>
        {canScrollLeft && (
          <button
            onClick={scrollLeftFn}
            className="hidden md:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-[68px] h-[68px] bg-[#e8e8ed]/90 backdrop-blur-md rounded-full items-center justify-center shadow-sm hover:bg-[#e8e8ed] hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100 text-[#424245]"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-8 h-8 opacity-80 mr-1" strokeWidth={2.5} />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="hidden md:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-[68px] h-[68px] bg-[#e8e8ed]/90 backdrop-blur-md rounded-full items-center justify-center shadow-sm hover:bg-[#e8e8ed] hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100 text-[#424245]"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-8 h-8 opacity-80 ml-1" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}
