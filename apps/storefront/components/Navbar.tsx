"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { SignInButton, useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { CART_UPDATED_EVENT, getCartItemCount } from "@/lib/cart";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { label: "Tienda", href: "/tienda" },
  { label: "Suscripciones", href: "/suscripciones" },
  { label: "Nosotros", href: "/nosotros" },
];

export default function Navbar({ lightBg = false }: { lightBg?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { openCart } = useCart();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const syncCartCount = () => setCartCount(getCartItemCount());

    syncCartCount();
    window.addEventListener(CART_UPDATED_EVENT, syncCartCount);
    window.addEventListener("storage", syncCartCount);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCartCount);
      window.removeEventListener("storage", syncCartCount);
    };
  }, []);

  useEffect(() => {
    if (!accountOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [accountOpen]);

  const closeMenus = () => {
    setMenuOpen(false);
    setAccountOpen(false);
  };

  const handleSignOut = async () => {
    closeMenus();
    await signOut({ redirectUrl: "/" });
  };

  return (
    <motion.header
      initial={{ y: -88, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || lightBg
          ? "bg-[#FEF7ED]/97 backdrop-blur-xl shadow-[0_1px_24px_rgba(0,0,0,0.09)]"
          : "bg-gradient-to-b from-black/55 via-black/20 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-12 h-[76px] flex items-center justify-between">

        {/* Left nav */}
        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[15px] font-semibold tracking-wide transition-colors duration-200 relative group ${
                scrolled || lightBg
                  ? "text-[#005088] hover:text-[#003d6b]"
                  : "text-white hover:text-white/80"
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-0.5 left-0 w-0 h-[2px] group-hover:w-full transition-all duration-300 rounded-full ${
                  scrolled || lightBg ? "bg-[#005088]" : "bg-white"
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Logo — centered */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <Image
            src={scrolled || lightBg ? "/logos/logocolor.webp" : "/logos/logowht.webp"}
            alt="NovaPatch"
            width={180}
            height={50}
            className="h-[44px] w-auto object-contain transition-opacity duration-300"
            priority
          />
        </Link>

        {/* Right */}
        <div className="flex items-center gap-1">
<button
            onClick={openCart}
            aria-label="Carrito"
            className={`relative p-2.5 rounded-xl transition-all duration-200 ${
              scrolled || lightBg
                ? "text-[#005088] hover:text-[#003d6b] hover:bg-[#005088]/8"
                : "text-white hover:text-white/80 hover:bg-white/10"
            }`}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E8503A] px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </button>
          {/* Cuenta — UserButton si logueado, link a /sign-in si no */}
          <div className="hidden md:flex items-center">
            {isSignedIn ? (
              <div className="relative pl-1" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  className="flex items-center gap-2 rounded-full p-1 transition-all duration-200"
                >
                  <span className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-[#E8503A]/60 ring-offset-2 ring-offset-transparent">
                    {user?.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt={user.fullName ?? "Mi cuenta"}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-white text-[14px] font-bold text-[#005088]">
                        {user?.firstName?.[0] ?? "N"}
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      scrolled || lightBg ? "text-[#005088]" : "text-white"
                    } ${accountOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {accountOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-[calc(100%+12px)] w-[320px] overflow-hidden rounded-[28px] border border-[#0D1B35]/10 bg-[#FFFDF9] shadow-[0_24px_80px_rgba(13,27,53,0.22)]"
                    >
                      <div className="border-b border-[#0D1B35]/8 px-5 py-4">
                        <div className="flex items-center gap-4">
                          <span className="relative h-14 w-14 overflow-hidden rounded-full bg-white">
                            {user?.imageUrl ? (
                              <Image
                                src={user.imageUrl}
                                alt={user.fullName ?? "Mi cuenta"}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-[18px] font-bold text-[#005088]">
                                {user?.firstName?.[0] ?? "N"}
                              </span>
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[18px] font-bold text-[#0D1B35]">
                              {user?.fullName ?? "Mi cuenta"}
                            </p>
                            <p className="truncate text-[15px] text-[#667085]">
                              {user?.primaryEmailAddress?.emailAddress ?? ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="px-3 py-3">
                        <Link
                          href="/cuenta"
                          onClick={closeMenus}
                          className="flex w-full items-center gap-4 rounded-[20px] px-4 py-4 text-left text-[15px] font-semibold text-[#667085] transition-colors duration-150 hover:bg-[#F7F2EB] hover:text-[#0D1B35]"
                        >
                          <User size={18} />
                          <span>Mi cuenta</span>
                        </Link>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="mt-2 flex w-full items-center gap-4 rounded-[20px] border border-[#0D1B35]/8 px-4 py-4 text-left text-[15px] font-semibold text-[#667085] transition-colors duration-150 hover:bg-[#F7F2EB] hover:text-[#0D1B35]"
                        >
                          <LogOut size={18} />
                          <span>Cerrar sesión</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button
                  aria-label="Iniciar sesión"
                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                    scrolled || lightBg
                      ? "text-[#005088] hover:text-[#003d6b] hover:bg-[#005088]/8"
                      : "text-white hover:text-white/80 hover:bg-white/10"
                  }`}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </SignInButton>
            )}
          </div>

          <button
            aria-label="Menú"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2.5 rounded-xl transition-colors duration-200 ${
              scrolled || lightBg
                ? "text-[#005088] hover:text-[#003d6b]"
                : "text-white hover:text-white/80"
            }`}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#FEF7ED] border-t border-[#0D1B35]/8 overflow-hidden"
          >
            <div className="px-8 py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-[16px] font-semibold text-[#005088] hover:text-[#003d6b] transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Cuenta mobile */}
              <div className="pt-2 border-t border-[#005088]/10">
                {isSignedIn ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="relative h-10 w-10 overflow-hidden rounded-full bg-white ring-2 ring-[#E8503A]/60">
                        {user?.imageUrl ? (
                          <Image
                            src={user.imageUrl}
                            alt={user.fullName ?? "Mi cuenta"}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-[14px] font-bold text-[#005088]">
                            {user?.firstName?.[0] ?? "N"}
                          </span>
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold text-[#005088]">
                          {user?.fullName ?? "Mi cuenta"}
                        </p>
                        <p className="truncate text-[13px] text-[#667085]">
                          {user?.primaryEmailAddress?.emailAddress ?? ""}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/cuenta"
                      onClick={closeMenus}
                      className="flex items-center gap-3 text-[15px] font-semibold text-[#005088] transition-colors hover:text-[#003d6b]"
                    >
                      <User size={16} />
                      <span>Mi cuenta</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center gap-3 text-[15px] font-semibold text-[#E8503A] transition-colors hover:text-[#C43B28]"
                    >
                      <LogOut size={16} />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                ) : (
                  <SignInButton mode="modal">
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="text-[16px] font-semibold text-[#E8503A] hover:text-[#C43B28] transition-colors"
                    >
                      Iniciar sesión
                    </button>
                  </SignInButton>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
