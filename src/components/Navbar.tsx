import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
 
interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: 'Problem', href: '#problem' },
  { name: 'Solution', href: '#solution' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Earnings', href: '#earnings' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'For Brands', href: '#brands' },
  { name: 'Hiring', href: '#hiring' },
];

export const Navbar: React.FC<{ onOpenWaitlist: () => void }> = ({ onOpenWaitlist }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/20 border-b border-white/10 transition-all duration-300 ${
        isScrolled ? 'py-3 shadow-lg' : 'py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center space-x-2">
          <Image src={'./logo.svg.png'} alt="Veyra Logo" className="h-8 w-8 md:h-10 md:w-10 object-contain" />
          <span className="text-2xl md:text-3xl font-bold text-foreground font-poppins">Veyra</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="relative text-sm text-foreground/80 hover:text-foreground transition-colors after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-veyra-cta after:transition-all hover:after:w-full"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Actions & Mobile Menu */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={onOpenWaitlist}
  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 shadow-md hover:shadow-lg transition-all"
          >
            Join Waitlist
          </Button>

          <button
            className="md:hidden p-2 rounded-full hover:bg-white/20 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden backdrop-blur-md bg-white/20 mt-2 px-4 py-4 mx-4 rounded-xl shadow-lg"
        >
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};
