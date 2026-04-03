"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Trash2, Tag, Loader2, CheckCircle2 } from "lucide-react";
import { useCart, type AppliedCoupon } from "@/contexts/CartContext";
import { cartTotals, itemDisplayPrice, FREQ_LABELS, type CartItem } from "@/lib/cart";
import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CouponStatus = "idle" | "loading" | "applied";

interface ToastState {
  message: string;
  visible: boolean;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, visible }: ToastState) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-2.5 bg-[#1D3461] text-white text-[13px] font-semibold px-4 py-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.22)] max-w-[340px] w-max"
          role="alert"
        >
          <span className="text-[#E8503A] flex-shrink-0">✕</span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Coupon Input ─────────────────────────────────────────────────────────────

interface CouponInputProps {
  onApply: (code: string) => void;
  onRemove: () => void;
  status: CouponStatus;
  applied: AppliedCoupon | null;
}

function CouponInput({ onApply, onRemove, status, applied }: CouponInputProps) {
  const [code, setCode] = useState("");

  function handleApply() {
    if (code.trim()) onApply(code.trim());
  }

  // Applied state — show chip
  if (status === "applied" && applied) {
    return (
      <motion.div
        key="applied"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-3.5 py-2.5"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-[#16A34A] flex-shrink-0" />
          <div>
            <p className="text-[12px] font-black text-[#16A34A] tracking-wide">{applied.code}</p>
            <p className="text-[10px] text-[#4ADE80] font-medium">{applied.label} aplicado</p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="w-6 h-6 rounded-lg bg-[#DCFCE7] hover:bg-[#BBF7D0] flex items-center justify-center transition-colors duration-150"
          aria-label="Quitar cupón"
        >
          <X size={11} className="text-[#16A34A]" />
        </button>
      </motion.div>
    );
  }

  // Input state
  return (
    <motion.div
      key="input"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-2"
    >
      <div className="relative flex-1">
        <Tag
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
        />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          placeholder="Código de descuento"
          disabled={status === "loading"}
          className="w-full pl-8 pr-3 py-2.5 text-[13px] font-semibold text-[#1D3461] placeholder:text-[#CBD5E1] placeholder:font-normal bg-white border-2 border-[#E5E7EB] focus:border-[#E8503A] focus:outline-none rounded-xl transition-colors duration-150 disabled:opacity-50 uppercase tracking-wide"
          maxLength={20}
        />
      </div>
      <button
        onClick={handleApply}
        disabled={!code.trim() || status === "loading"}
        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#1D3461] hover:bg-[#0D1B35] disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] text-white text-[12px] font-black rounded-xl transition-all duration-150 min-w-[80px]"
      >
        {status === "loading" ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          "Aplicar"
        )}
      </button>
    </motion.div>
  );
}

// ─── Item de carrito ──────────────────────────────────────────────────────────

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQty, removeItem } = useCart();
  const displayPrice = itemDisplayPrice(item);
  const isSub = item.mode === "sub";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.22 }}
      className="flex gap-3 items-start py-4 border-b border-black/[0.06] last:border-0"
    >
      {/* Imagen */}
      <div
        className="relative w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
        style={{ background: item.bg }}
      >
        <Image src={item.image} alt={item.title} fill className="object-contain p-1" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[14px] font-bold text-[#1D3461] leading-tight">{item.title}</p>
            {isSub ? (
              <span
                className="inline-block mt-0.5 text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                style={{ background: item.color }}
              >
                SUB · {FREQ_LABELS[item.freq]}
              </span>
            ) : (
              <span className="text-[11px] text-[#9CA3AF]">Compra única</span>
            )}
          </div>
          <button
            onClick={() => removeItem(item.slug, item.mode, item.freq)}
            className="text-[#CBD5E1] hover:text-[#E8503A] transition-colors duration-150 flex-shrink-0 mt-0.5"
            aria-label="Eliminar"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Precio + qty */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 bg-[#F3F4F6] rounded-lg p-0.5">
            <button
              onClick={() => updateQty(item.slug, item.mode, item.freq, -1)}
              className="w-6 h-6 rounded-md flex items-center justify-center text-[#374151] hover:bg-white hover:shadow-sm transition-all duration-150 text-[13px] font-bold"
            >
              −
            </button>
            <span className="w-5 text-center text-[13px] font-bold text-[#1D3461]">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQty(item.slug, item.mode, item.freq, +1)}
              className="w-6 h-6 rounded-md flex items-center justify-center text-[#374151] hover:bg-white hover:shadow-sm transition-all duration-150 text-[13px] font-bold"
            >
              +
            </button>
          </div>

          <div className="text-right">
            <p className="text-[15px] font-black text-[#1D3461]">
              ${displayPrice * item.quantity}
              <span className="text-[11px] font-normal text-[#9CA3AF] ml-0.5">MXN</span>
            </p>
            {isSub && item.quantity === 1 && (
              <p className="text-[10px] text-[#9CA3AF] line-through">${item.price}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Estado vacío ─────────────────────────────────────────────────────────────

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-[#FFF0ED] flex items-center justify-center">
        <ShoppingBag size={28} className="text-[#E8503A]" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-[15px] font-bold text-[#1D3461]">Tu carrito está vacío</p>
        <p className="text-[13px] text-[#9CA3AF] mt-1 leading-relaxed">
          Agrega un parche y empieza tu rutina.
        </p>
      </div>
      <Link
        href="/tienda"
        onClick={onClose}
        className="mt-2 inline-flex items-center gap-2 bg-[#E8503A] text-white font-bold text-[14px] px-6 py-3 rounded-full hover:bg-[#C43B28] transition-colors duration-200"
      >
        Ver productos
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

// ─── Coupon logic (mock — swap with real Medusa call when backend is ready) ───

// To wire to Medusa: POST /store/carts/:cartId/discounts { code }
// Remove: DELETE /store/carts/:cartId/discounts/:code
async function applyDiscountCode(code: string): Promise<AppliedCoupon> {
  // Simula latencia de red (~800ms)
  await new Promise((r) => setTimeout(r, 850));

  // Códigos de prueba — reemplazar con respuesta real de Medusa
  const MOCK_CODES: Record<string, { discountPct: number; label: string }> = {
    NOVA20: { discountPct: 20, label: "20% de descuento" },
    BIENVENIDO: { discountPct: 15, label: "15% de descuento" },
    PATCH10: { discountPct: 10, label: "10% de descuento" },
  };

  const entry = MOCK_CODES[code.toUpperCase()];
  if (!entry) throw new Error("Cupón inválido o expirado");

  return { code: code.toUpperCase(), ...entry };
}

// ─── Drawer principal ─────────────────────────────────────────────────────────

export default function CartDrawer() {
  const { items, isOpen, closeCart, coupon: appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const { savings, total } = cartTotals(items);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const hasSubs = items.some((i) => i.mode === "sub");

  // Coupon UI state (loading flag — applied/idle derived from context)
  const [couponLoading, setCouponLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });

  const couponStatus: CouponStatus = couponLoading ? "loading" : appliedCoupon ? "applied" : "idle";

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3500);
  }, []);

  const handleApply = useCallback(async (code: string) => {
    setCouponLoading(true);
    try {
      const coupon = await applyDiscountCode(code);
      applyCoupon(coupon);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al aplicar el cupón");
    } finally {
      setCouponLoading(false);
    }
  }, [applyCoupon, showToast]);

  const handleRemove = useCallback(() => {
    removeCoupon();
  }, [removeCoupon]);

  // Totales con descuento
  const discountAmount = appliedCoupon
    ? Math.round(total * (appliedCoupon.discountPct / 100))
    : 0;
  const finalTotal = total - discountAmount;

  return (
    <>
      <Toast {...toast} />

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
              onClick={closeCart}
            />

            {/* Panel */}
            <motion.aside
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-full sm:w-[420px] bg-white shadow-[-8px_0_48px_rgba(0,0,0,0.12)] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06]">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[#E8503A]" />
                  <h2 className="text-[16px] font-black text-[#005088]">
                    Tu carrito
                    {count > 0 && (
                      <span className="ml-1.5 text-[12px] font-bold text-[#9CA3AF]">({count})</span>
                    )}
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="w-8 h-8 rounded-xl bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center transition-colors duration-150"
                  aria-label="Cerrar carrito"
                >
                  <X size={15} className="text-[#374151]" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-5">
                {items.length === 0 ? (
                  <EmptyCart onClose={closeCart} />
                ) : (
                  <motion.div layout className="py-2">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <CartItemRow key={`${item.slug}-${item.mode}-${item.freq}`} item={item} />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <AnimatePresence>
                {items.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className="border-t border-black/[0.06] px-5 py-5 flex flex-col gap-3"
                    style={{ background: "#FAFAFA" }}
                  >
                    {/* Ahorro suscripción */}
                    {hasSubs && savings > 0 && (
                      <div className="flex items-center justify-between bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-4 py-2.5">
                        <p className="text-[12px] font-semibold text-[#16A34A]">
                          🎉 Ahorro con suscripción
                        </p>
                        <p className="text-[13px] font-black text-[#16A34A]">−${savings} MXN</p>
                      </div>
                    )}

                    {/* ── Cupón ── */}
                    <div className="flex flex-col gap-2">
                      <CouponInput
                        onApply={handleApply}
                        onRemove={handleRemove}
                        status={couponStatus}
                        applied={appliedCoupon}
                      />
                    </div>

                    {/* Totales */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[13px]">
                        <span className="text-[#6B7280]">Subtotal</span>
                        <span className="font-semibold text-[#1D3461]">${total} MXN</span>
                      </div>

                      {/* Línea de descuento — aparece cuando hay cupón */}
                      <AnimatePresence>
                        {appliedCoupon && discountAmount > 0 && (
                          <motion.div
                            key="discount-line"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="flex justify-between text-[13px] py-0.5">
                              <span className="text-[#16A34A] font-semibold flex items-center gap-1">
                                <Tag size={11} />
                                {appliedCoupon.code}
                              </span>
                              <span className="font-bold text-[#16A34A]">−${discountAmount} MXN</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex justify-between text-[13px]">
                        <span className="text-[#6B7280]">Envío</span>
                        <span className="font-semibold text-[#16A34A]">Gratis</span>
                      </div>

                      <div className="flex justify-between text-[16px] font-black text-[#005088] pt-1 border-t border-black/[0.06]">
                        <span>Total</span>
                        <motion.span
                          key={finalTotal}
                          initial={{ scale: 1.08, color: "#16A34A" }}
                          animate={{ scale: 1, color: "#005088" }}
                          transition={{ duration: 0.3 }}
                        >
                          ${finalTotal} MXN
                        </motion.span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="w-full flex items-center justify-center gap-2 bg-[#E8503A] hover:bg-[#C43B28] text-white font-bold text-[15px] py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,80,58,0.35)] shadow-[0_4px_12px_rgba(232,80,58,0.2)]"
                    >
                      Ir a pagar
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {["🔒 Pago seguro", "Visa", "MC", "OXXO", "SPEI"].map((b) => (
                        <span key={b} className="text-[10px] text-[#9CA3AF] font-medium bg-[#F3F4F6] px-2 py-0.5 rounded-md">
                          {b}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
