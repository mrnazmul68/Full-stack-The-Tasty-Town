import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { FiChevronDown, FiLogOut, FiMenu, FiPackage, FiSearch, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';

const navItems = ['Home', 'Menu', 'Top Foods', 'Reviews', 'Contact Us'];
const sectionMap = {
  Home: 'home',
  Menu: 'menu',
  'Top Foods': 'top-foods',
  Reviews: 'reviews',
  'Contact Us': 'contact-us',
};

const Navbar = ({
  cartCount,
  onLogout,
  searchQuery,
  onSearchChange,
  siteSettings,
  userProfile,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('Home');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const desktopSearchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const profileMenuRef = useRef(null);

  const handleNavigate = (item) => {
    const sectionId = sectionMap[item];
    if (!sectionId) return;

    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        section?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const section = document.getElementById(sectionId);
      section?.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(item);
    setIsMenuOpen(false);
  };

  const userInitials = userProfile?.fullName
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchOpen && !searchQuery.trim() && searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (isProfileMenuOpen && profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen, isSearchOpen, searchQuery]);

  useEffect(() => {
    if (isSearchOpen) {
      const activeInput = window.innerWidth >= 768 ? desktopSearchInputRef.current : mobileSearchInputRef.current;
      activeInput?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const updateActiveSection = () => {
      if (location.pathname !== '/') {
        setActiveSection('');
        return;
      }
      const viewportTarget = 140;
      const sections = Object.entries(sectionMap)
        .map(([item, id]) => {
          const element = document.getElementById(id);
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          return { item, top: rect.top, bottom: rect.bottom, distance: Math.abs(rect.top - viewportTarget) };
        })
        .filter(Boolean);

      if (sections.length === 0) return;
      if (window.scrollY <= 40) {
        setActiveSection('Home');
        return;
      }
      const visibleSection = sections.find(s => s.top <= viewportTarget && s.bottom >= viewportTarget);
      if (visibleSection) {
        setActiveSection(visibleSection.item);
      } else {
        const closest = sections.sort((a, b) => a.distance - b.distance)[0];
        if (closest) setActiveSection(closest.item);
      }
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [location.pathname]);

  // Navbar Show/Hide on Scroll
  useEffect(() => {
    const handleScrollVisibility = () => {
      const currentScrollY = window.scrollY;
      
      // If menu is open or search is open, don't hide
      if (isMenuOpen || isSearchOpen || isProfileMenuOpen) {
        setIsVisible(true);
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling Down - Hide
        setIsVisible(false);
      } else {
        // Scrolling Up - Show
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScrollVisibility, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollVisibility);
  }, [lastScrollY, isMenuOpen, isSearchOpen, isProfileMenuOpen]);

  const getNavItemClassName = (item, isMobile = false) => {
    const isActive = location.pathname === '/' && activeSection === item;
    if (isMobile) {
      return `block rounded-xl px-3 py-2 transition-colors duration-200 ${isActive ? 'bg-orange-500/15 text-orange-500' : 'hover:bg-orange-500/10 hover:text-orange-500'}`;
    }
    return `border-b-2 pb-1 transition-all duration-200 ${isActive ? 'border-orange-500 text-orange-500' : 'border-transparent hover:border-orange-500 hover:text-orange-500'}`;
  };

  return (
    <div className={`fixed left-1/2 top-3 z-50 w-[calc(100%-1rem)] max-w-7xl -translate-x-1/2 transition-transform duration-300 sm:w-[calc(100%-3rem)] lg:w-[calc(100%-10rem)] ${isVisible ? 'translate-y-0' : '-translate-y-[140%]'}`}>
      <nav className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-black/80 px-4 py-4 shadow-[0_14px_40px_rgba(220,32,22,0.35)] backdrop-blur sm:gap-4 sm:px-5 sm:py-5">
        <div className="flex items-center">
          <button type="button" onClick={() => navigate('/')} aria-label="Go to home page">
            <img src={siteSettings?.logo || assets.logo} alt="Logo" className="h-[44px] w-[44px] object-contain sm:h-[50px] sm:w-[50px]" />
          </button>
        </div>

        <ul className="hidden items-center justify-center gap-8 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <li key={item}>
              <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate(item); }} className={getNavItemClassName(item)}>{item}</a>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-self-center md:justify-self-auto md:justify-end gap-2 sm:gap-3 md:gap-4">
          <div ref={searchContainerRef} className="flex items-center gap-2">
            <button type="button" onClick={() => setIsSearchOpen(!isSearchOpen)} className="rounded-full p-2 hover:text-orange-500 md:hidden"><FiSearch className="text-xl" /></button>
            <div className={`hidden md:flex overflow-hidden transition-all duration-300 ${isSearchOpen ? 'w-60 opacity-100' : 'w-0 opacity-0'}`}>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <FiSearch className="text-base text-slate-400" />
                <input ref={desktopSearchInputRef} type="text" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search..." className="w-full bg-transparent text-sm outline-none" />
                {searchQuery && <button onClick={() => onSearchChange('')}><FiX /></button>}
              </div>
            </div>
            <button type="button" onClick={() => setIsSearchOpen(!isSearchOpen)} className="hidden md:block rounded-full p-2 hover:text-orange-500"><FiSearch className="text-xl" /></button>
            {isSearchOpen && (
              <div className="absolute left-1/2 top-full z-40 mt-3 flex w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/10 bg-neutral-950/95 px-3 py-3 md:hidden">
                <FiSearch className="text-lg text-slate-400" />
                <input ref={mobileSearchInputRef} type="text" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search..." className="w-full bg-transparent text-sm outline-none" />
              </div>
            )}
          </div>

          <button type="button" onClick={() => navigate('/cart')} className="rounded-full p-2 hover:text-orange-500 relative">
            <FiShoppingCart className="text-xl" />
            {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold">{cartCount}</span>}
          </button>

          {userProfile ? (
            <div ref={profileMenuRef} className="relative">
              <button type="button" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 sm:px-2 transition-all hover:border-orange-500">
                {userProfile.photo ? <img src={userProfile.photo} className="h-8 w-8 rounded-full object-cover" /> : <span className="h-8 w-8 flex items-center justify-center rounded-full bg-orange-500 text-xs font-bold">{userInitials}</span>}
                <FiChevronDown className="hidden sm:block text-slate-300" />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-neutral-950/95 p-1 shadow-xl backdrop-blur">
                  {userProfile.role === 'admin' && <button onClick={() => { navigate('/admin'); setIsProfileMenuOpen(false); }} className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-orange-500/10 hover:text-orange-400 rounded-lg"><FiUser />Admin</button>}
                  <button onClick={() => { navigate('/my-orders'); setIsProfileMenuOpen(false); }} className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-orange-500/10 hover:text-orange-400 rounded-lg"><FiPackage />Orders</button>
                  <button onClick={() => { navigate('/profile'); setIsProfileMenuOpen(false); }} className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-orange-500/10 hover:text-orange-400 rounded-lg"><FiUser />Profile</button>
                  <button onClick={() => { onLogout(); setIsProfileMenuOpen(false); }} className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-red-500/10 text-red-400 rounded-lg"><FiLogOut />Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate('/sign-in')} className="rounded-full border border-orange-500 px-4 py-1.5 text-sm font-semibold text-orange-500 hover:bg-orange-500 hover:text-white">Sign In</button>
          )}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">{isMenuOpen ? <FiX size={24}/> : <FiMenu size={24}/>}</button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-white/10 bg-neutral-950/95 p-4 shadow-xl backdrop-blur md:hidden">
          <ul className="flex flex-col gap-2">
            {navItems.map(item => <li key={item}><a href="#" onClick={(e) => { e.preventDefault(); handleNavigate(item); }} className={getNavItemClassName(item, true)}>{item}</a></li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
