import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Monitor, User } from 'lucide-react';
import { navItems, containerVariants, itemVariants } from '../constants/data';

const generateSlug = (text: string) => {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSplitCategory, setActiveSplitCategory] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (menuName: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (activeMenu) {
      setActiveMenu(menuName);
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setActiveMenu(menuName);
      }, 500);
    }
  };

  const handleMouseLeaveItem = () => {
    if (!activeMenu && hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleNavMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveMenu(null);
  };

  useEffect(() => {
    if (activeMenu) {
      const menu = navItems.find(i => i.name === activeMenu);
      // @ts-ignore - dynamic property
      if (menu?.isSplit && menu.splitData) {
        // @ts-ignore
        setActiveSplitCategory(menu.splitData[0].name);
      }
    }
  }, [activeMenu]);

  return (
    <>
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${activeMenu ? 'bg-white' : 'bg-white/70 backdrop-blur-md'}`}
        onMouseLeave={handleNavMouseLeave}
      >
        <div className="max-w-[1000px] mx-auto px-4 md:px-8">
          <ul className="flex items-center justify-between h-16 text-[15px] text-[#1d1d1f]/80 font-medium tracking-wide">
            <li><Link to="/" className="hover:text-black transition-colors"><Monitor className="w-5 h-5" /></Link></li>

            {navItems.map((item) => (
              <li
                key={item.name}
                className="hidden md:block h-13"
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeaveItem}
              >
                <Link to={item.name === 'Cửa hàng' ? '/store' : `/${generateSlug(item.name)}`} className="h-full flex items-center px-2 hover:text-black transition-colors">
                  {item.name}
                </Link>
              </li>
            ))}

            <li><a href="#" className="hover:text-black transition-colors"><Search className="w-5 h-5" /></a></li>
            <li><a href="#" className="hover:text-black transition-colors"><ShoppingBag className="w-5 h-5" /></a></li>
            <li><Link to="/auth" className="hover:text-black transition-colors"><User className="w-5 h-5" /></Link></li>
          </ul>
        </div>
        <AnimatePresence>
          {activeMenu && (() => {
            const currentMenu = navItems.find(i => i.name === activeMenu);
            // @ts-ignore
            if (!currentMenu?.dropdown && !currentMenu?.isSplit) return null;
            return (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                className="absolute top-[52px] left-0 w-full bg-white overflow-hidden"
              >
                <div className="grid w-full">
                  <AnimatePresence>
                    <motion.div
                      key={activeMenu}
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      style={{ gridArea: '1 / 1' }}
                      className="max-w-[1000px] w-full mx-auto px-4 md:px-8 py-12"
                    >
                      {/* @ts-ignore */}
                      {currentMenu?.isSplit ? (
                        <div className="flex gap-16">
                          {/* Left side */}
                          <div className="flex flex-col w-1/3 border-r border-gray-100 pr-8">
                            <motion.h3 variants={itemVariants} className="text-[12px] text-[#86868b] mb-4 tracking-wider uppercase font-semibold">
                              Danh mục linh kiện
                            </motion.h3>
                            <ul className="space-y-3">
                              {/* @ts-ignore */}
                              {currentMenu.splitData?.map((cat, idx) => (
                                <motion.li variants={itemVariants} key={idx}>
                                  <a 
                                    href="#" 
                                    onMouseEnter={() => setActiveSplitCategory(cat.name)}
                                    className={`text-xl font-medium transition-colors block ${activeSplitCategory === cat.name ? 'text-blue-600' : 'text-[#1d1d1f] hover:text-blue-600'}`}
                                  >
                                    {cat.name}
                                  </a>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                          {/* Right side */}
                          <div className="flex-1 pl-8">
                            {/* @ts-ignore */}
                            {currentMenu.splitData?.filter(cat => cat.name === activeSplitCategory).map((cat, idx) => (
                              <motion.div 
                                key={cat.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col"
                              >
                                <h3 className="text-[12px] text-[#86868b] mb-4 tracking-wider uppercase font-semibold">
                                  {cat.title}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                                  {/* @ts-ignore */}
                                  {cat.links.map((link, lIdx) => (
                                    <Link to={`/${generateSlug(currentMenu?.name || '')}/${generateSlug(link)}`} key={lIdx} className="text-xl font-medium text-[#1d1d1f] hover:text-blue-600 transition-colors block">
                                      {link}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-16">
                          {currentMenu?.dropdown?.map((col, idx) => (
                            <div key={idx} className="flex flex-col">
                              <motion.h3 variants={itemVariants} className="text-[12px] text-[#86868b] mb-4 tracking-wider uppercase font-semibold">
                                {col.title}
                              </motion.h3>
                              <ul className="space-y-3">
                                {col.links.map((link, lIdx) => (
                                  <motion.li variants={itemVariants} key={lIdx}>
                                    <Link to={`/${generateSlug(currentMenu?.name || '')}/${generateSlug(link)}`} className="text-xl font-medium text-[#1d1d1f] hover:text-blue-600 transition-colors block">
                                      {link}
                                    </Link>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </nav>
    </>
  );
}
