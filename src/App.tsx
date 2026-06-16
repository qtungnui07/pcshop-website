import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { CartProvider } from './context/CartContext';
import type { ComponentType } from 'react';
import { useEffect, useRef } from 'react';

// Automatically import all .tsx files inside the pages directory
const modules = import.meta.glob('./pages/**/*.tsx', { eager: true });

const routes = Object.keys(modules).map((path) => {
  const match = path.match(/\.\/pages\/(.*)\.tsx$/);
  if (!match) return null;
  
  let routePath = match[1].toLowerCase();
  
  // Transform 'index' or 'folder/index' to correct URLs
  routePath = routePath.replace(/\/index$/, '').replace(/^index$/, '/');
  
  // Transform Next.js style dynamic routes: [category] -> :category
  routePath = routePath.replace(/\[([^\]]+)\]/g, ':$1');

  if (routePath !== '/') {
    routePath = `/${routePath}`;
  }

  // @ts-ignore
  const Component = modules[path].default as ComponentType;
  
  return {
    path: routePath,
    Component
  };
}).filter(Boolean) as { path: string, Component: ComponentType }[];

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const prevPathnameRef = useRef<string | null>(null);
  const prevCategoryRef = useRef<string | null>(null);

  useEffect(() => {
    const isPCCategory = pathname.startsWith('/pc/') && pathname !== '/pc';
    const searchParams = new URLSearchParams(search);
    const category = searchParams.get('category');
    const hasAccessoryCategory = pathname === '/phu-kien' && category;
    const hasComponentCategory = pathname === '/linh-kien' && category;
    const shouldScrollToComponentCategories = hasComponentCategory && hash === '#danh-muc-linh-kien';

    const pathnameChanged = prevPathnameRef.current !== pathname;
    const categoryChanged = prevCategoryRef.current !== category;

    prevPathnameRef.current = pathname;
    prevCategoryRef.current = category;

    // Only scroll if pathname or category has changed
    if (!pathnameChanged && !categoryChanged) {
      return;
    }

    // If pathname didn't change, we are on /linh-kien, category changed, but we are NOT scrolling to #danh-muc-linh-kien, we return early
    if (!pathnameChanged && hasComponentCategory && !shouldScrollToComponentCategories) {
      return;
    }

    if (isPCCategory) {
      const timer = setTimeout(() => {
        const element = document.getElementById("products-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' as any });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else if (hasAccessoryCategory) {
      const timer = setTimeout(() => {
        const element = document.getElementById("accessories-main");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' as any });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else if (shouldScrollToComponentCategories) {
      const timer = setTimeout(() => {
        const element = document.getElementById("danh-muc-linh-kien");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as any });
    }
  }, [pathname, search, hash]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<MainLayout />}>
            {routes.map((route) => {
              if (route.path === '/') {
                return <Route key={route.path} index element={<route.Component />} />;
              }
              return <Route key={route.path} path={route.path} element={<route.Component />} />;
            })}
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
