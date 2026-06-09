import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Monitor, User } from 'lucide-react';
import { navItems, containerVariants, itemVariants } from '../constants/data';

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

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
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="max-w-[1000px] mx-auto px-4 md:px-8">
          <ul className="flex items-center justify-between h-11 text-[12px] text-[#1d1d1f]/80 font-medium tracking-wide">
            <li><a href="#home" className="hover:text-black transition-colors"><Monitor className="w-4 h-4" /></a></li>

            {navItems.map((item) => (
              <li
                key={item.name}
                className="hidden md:block h-11"
                onMouseEnter={() => setActiveMenu(item.name)}
              >
                <a href={item.name === 'Cửa hàng' ? '#store' : '#'} className="h-full flex items-center px-2 hover:text-black transition-colors">
                  {item.name}
                </a>
              </li>
            ))}

            <li><a href="#" className="hover:text-black transition-colors"><Search className="w-4 h-4" /></a></li>
            <li><a href="#" className="hover:text-black transition-colors"><ShoppingBag className="w-4 h-4" /></a></li>
            <li><a href="#" className="hover:text-black transition-colors"><User className="w-4 h-4" /></a></li>
          </ul>
        </div>
        <AnimatePresence>
          {activeMenu && navItems.find(i => i.name === activeMenu)?.dropdown && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="absolute top-11 left-0 w-full bg-white overflow-hidden"
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
                    className="max-w-[1000px] w-full mx-auto px-4 md:px-8 py-12 flex gap-16"
                  >
                    {navItems.find(i => i.name === activeMenu)?.dropdown?.map((col, idx) => (
                      <div key={idx} className="flex flex-col">
                        <motion.h3 variants={itemVariants} className="text-[12px] text-[#86868b] mb-4 tracking-wider uppercase font-semibold">
                          {col.title}
                        </motion.h3>
                        <ul className="space-y-3">
                          {col.links.map((link, lIdx) => (
                            <motion.li variants={itemVariants} key={lIdx}>
                              <a href="#" className="text-xl font-medium text-[#1d1d1f] hover:text-blue-600 transition-colors block">
                                {link}
                              </a>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
