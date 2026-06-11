import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Monitor, User, LogOut, Shield, UserCheck } from 'lucide-react';
import { navItems, containerVariants, itemVariants } from '../constants/data';
import { useAuth } from '../context/AuthContext';

const generateSlug = (text: string) => {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const getMenuSlug = (name: string) => {
  if (name === 'Cửa hàng') return 'store';
  return generateSlug(name);
};

const getComponentCatId = (name: string) => {
  if (name.includes('RAM')) return 'ram';
  if (name.includes('CPU')) return 'cpu';
  if (name.includes('VGA')) return 'vga';
  if (name.includes('Mainboard')) return 'mainboard';
  if (name.includes('SSD')) return 'ssd';
  if (name.includes('HDD')) return 'hdd';
  if (name.includes('Nguồn')) return 'psu';
  if (name.includes('Tản Nhiệt')) return 'cooling';
  if (name.includes('Case')) return 'case';
  return generateSlug(name);
};

const getMenuLink = (menuName: string, splitCatName: string, link: string) => {
  const menuSlug = getMenuSlug(menuName);
  
  if (menuSlug === 'linh-kien') {
    const catId = getComponentCatId(splitCatName);
    
    if (splitCatName === 'RAM') {
      if (link.includes('GB')) {
        return `/linh-kien?category=ram&capacity=${link}`;
      }
      if (link.startsWith('DDR')) {
        return `/linh-kien?category=ram&type=${link}`;
      }
    }
    
    if (splitCatName === 'CPU - Vi Xử Lý') {
      const brand = link.startsWith('Intel') ? 'Intel' : 'AMD';
      const series = link.replace('Intel ', '').replace('AMD ', '');
      return `/linh-kien?category=cpu&brand=${brand}&cpuSeries=${series}`;
    }
    
    if (splitCatName === 'VGA - Card Màn Hình') {
      const cleanLink = link.replace('NVIDIA ', '').replace('AMD ', '');
      return `/linh-kien?category=vga&vgaSeries=${cleanLink}`;
    }
    
    if (splitCatName === 'Mainboard - Bo Mạch Chủ') {
      return `/linh-kien?category=mainboard&chipset=${link}`;
    }
    
    if (splitCatName === 'Ổ Cứng SSD') {
      if (link.includes('GB') || link.includes('TB')) {
        return `/linh-kien?category=ssd&capacity=${link}`;
      }
      return `/linh-kien?category=ssd&type=${link}`;
    }
    
    if (splitCatName === 'Ổ Cứng HDD') {
      return `/linh-kien?category=hdd&capacity=${link}`;
    }
    
    if (splitCatName === 'Nguồn (PSU)') {
      if (link.includes('Plus')) {
        return `/linh-kien?category=psu&cert=${link}`;
      }
      return `/linh-kien?category=psu&wattage=${link}`;
    }
    
    if (splitCatName === 'Tản Nhiệt') {
      return `/linh-kien?category=cooling&type=${link}`;
    }
    
    if (splitCatName === 'Case - Vỏ Máy Tính') {
      return `/linh-kien?category=case&size=${link}`;
    }

    return `/linh-kien?category=${catId}`;
  }

  if (menuSlug === 'laptop') {
    return `/laptop?${generateSlug(splitCatName)}=${generateSlug(link)}`;
  }

  return `/${menuSlug}/${generateSlug(link)}`;
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSplitCategory, setActiveSplitCategory] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLLIElement>(null);

  // Click outside to close user menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setAccountMenuOpen(false);
    navigate("/");
  };

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
            <li className="relative flex items-center" ref={accountMenuRef}>
              {user ? (
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="hover:text-black transition-colors focus:outline-none flex items-center cursor-pointer h-full"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center text-[10px] font-bold">
                      {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                  )}
                </button>
              ) : (
                <Link to="/auth" className="hover:text-black transition-colors flex items-center">
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* Account Dropdown Menu */}
              <AnimatePresence>
                {user && accountMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl py-4 z-50 overflow-hidden"
                  >
                    {/* User Profile Summary */}
                    <div className="px-5 pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 animate-fade-in"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-zinc-950 text-white flex items-center justify-center text-sm font-bold">
                            {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-2.5 flex items-center gap-1.5">
                        {user.role === "admin" ? (
                          <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100 flex items-center gap-1">
                            <Shield className="w-3 h-3 animate-pulse" /> Quản trị viên
                          </span>
                        ) : (
                          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                            <UserCheck className="w-3 h-3" /> Thành viên
                          </span>
                        )}
                        {user.provider === "google" && (
                          <span className="bg-gray-50 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-100">
                            Google
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Menu Options */}
                    <div className="pt-2">
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
                        >
                          <Shield className="w-4 h-4 text-red-500" />
                          Trang quản trị (Admin)
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
                      >
                        <User className="w-4 h-4 text-blue-500" />
                        Thông tin cá nhân
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors text-left border-t border-gray-50 mt-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
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
                                  <Link 
                                    to={`/linh-kien?category=${getComponentCatId(cat.name)}`} 
                                    onMouseEnter={() => setActiveSplitCategory(cat.name)}
                                    onClick={() => setActiveMenu(null)}
                                    className={`text-xl font-medium transition-colors block ${activeSplitCategory === cat.name ? 'text-blue-600' : 'text-[#1d1d1f] hover:text-blue-600'}`}
                                  >
                                    {cat.name}
                                  </Link>
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
                                    <Link 
                                      to={getMenuLink(currentMenu?.name || '', cat.name, link)} 
                                      key={lIdx} 
                                      onClick={() => setActiveMenu(null)}
                                      className="text-xl font-medium text-[#1d1d1f] hover:text-blue-600 transition-colors block"
                                    >
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
                                {col.links.map((link, lIdx) => {
                                  const menuSlug = getMenuSlug(currentMenu?.name || '');
                                  const linkSlug = generateSlug(link);
                                  const targetUrl = menuSlug === 'phu-kien'
                                    ? `/phu-kien?category=${linkSlug}`
                                    : `/${menuSlug}/${linkSlug}`;
                                  return (
                                    <motion.li variants={itemVariants} key={lIdx}>
                                      <Link to={targetUrl} className="text-xl font-medium text-[#1d1d1f] hover:text-blue-600 transition-colors block">
                                        {link}
                                      </Link>
                                    </motion.li>
                                  );
                                })}
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
