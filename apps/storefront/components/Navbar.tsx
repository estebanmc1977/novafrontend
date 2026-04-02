"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { CART_UPDATED_EVENT, getCartItemCount } from "@/lib/cart";
import { useCart } from "@/contexts/CartContext";
import { novapatchAppearance } from "@/lib/clerk-theme";

const navLinks = [
  { label: "Tienda", href: "/tienda" },
  { label: "Suscripciones", href: "/suscripciones" },
  { label: "Nosotros", href: "/nosotros" },
];

export default function Navbar({ lightBg = false }: { lightBg?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { openCart } = useCart();
  const { isSignedIn } = useUser();

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
              <div className="pl-1">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    ...novapatchAppearance,
                    elements: {
                      ...novapatchAppearance.elements,
                      avatarBox: "h-8 w-8 ring-2 ring-offset-1 ring-[#E8503A]/60",
                    },
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="Mis suscripciones"
                      labelIcon={
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      }
                      href="/cuenta/suscripciones"
                    />
                  </UserButton.MenuItems>
                </UserButton>
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
                  <div className="flex items-center gap-3">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        ...novapatchAppearance,
                        elements: {
                          ...novapatchAppearance.elements,
                          avatarBox: "h-8 w-8 ring-2 ring-offset-1 ring-[#E8503A]/60",
                        },
                      }}
                    >
                      <UserButton.MenuItems>
                        <UserButton.Link
                          label="Mis suscripciones"
                          labelIcon={
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          }
                          href="/cuenta/suscripciones"
                        />
                      </UserButton.MenuItems>
                    </UserButton>
                    <span className="text-[14px] font-semibold text-[#005088]">Mi cuenta</span>
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
