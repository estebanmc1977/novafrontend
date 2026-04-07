"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  medusa,
  type MedusaSubscription,
  type MedusaPaymentMethod,
} from "@/lib/medusa";
import { PRODUCT_META } from "@/lib/product-meta";
import {
  Repeat,
  Pause,
  Play,
  X,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  ShieldCheck,
  Plus,
  Loader2,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(n);
}

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

const FREQ_LABELS: Record<number, string> = {
  30: "Mensual",
  60: "Bimestral",
  90: "Trimestral",
};

const STATUS_CONFIG = {
  active: {
    label: "Activa",
    bg: "#ECFDF5",
    color: "#059669",
    icon: <CheckCircle2 size={13} />,
  },
  paused: {
    label: "Pausada",
    bg: "#FFF7ED",
    color: "#D97706",
    icon: <Pause size={13} />,
  },
  cancelled: {
    label: "Cancelada",
    bg: "#FEF2F2",
    color: "#DC2626",
    icon: <X size={13} />,
  },
} as const;

// ─── Mock data (mientras backend no está listo) ───────────────────────────────

const MOCK_SUBSCRIPTIONS: MedusaSubscription[] = [
  {
    id: "sub_energy_01",
    status: "active",
    interval_days: 30,
    next_delivery_at: new Date(Date.now() + 12 * 86400000).toISOString(),
    product_title: "Energy",
    variant_id: "var_energy",
    unit_price: 600,
    quantity: 1,
    created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
  },
  {
    id: "sub_sleep_01",
    status: "active",
    interval_days: 60,
    next_delivery_at: new Date(Date.now() + 28 * 86400000).toISOString(),
    product_title: "Sleep",
    variant_id: "var_sleep",
    unit_price: 637,
    quantity: 1,
    created_at: new Date(Date.now() - 32 * 86400000).toISOString(),
  },
];

const MOCK_PAYMENT_METHODS: MedusaPaymentMethod[] = [
  {
    id: "pm_01",
    brand: "Visa",
    last4: "4242",
    exp_month: 12,
    exp_year: 26,
    is_default: true,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: MedusaSubscription["status"] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function FrequencySelector({
  current,
  sub_id,
  onUpdate,
  token,
}: {
  current: 30 | 60 | 90;
  sub_id: string;
  onUpdate: (sub: MedusaSubscription) => void;
  token: string;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function change(days: 30 | 60 | 90) {
    if (days === current) { setOpen(false); return; }
    setLoading(true);
    try {
      const updated = await medusa.subscriptions.updateFrequency(sub_id, days, token);
      onUpdate(updated);
    } catch {
      // mock fallback
      onUpdate({ id: sub_id, interval_days: days } as MedusaSubscription);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className="flex items-center gap-1.5 text-[12px] font-bold text-[#005088] hover:text-[#003d6b] transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <Repeat size={12} />}
        {FREQ_LABELS[current]}
        <ChevronRight size={12} className={`transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 bg-white rounded-xl border border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,0.1)] z-20 overflow-hidden min-w-[140px]"
          >
            {([30, 60, 90] as const).map((d) => (
              <button
                key={d}
                onClick={() => change(d)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] font-semibold hover:bg-[#F3F4F6] transition-colors text-left"
                style={{ color: d === current ? "#E8503A" : "#005088" }}
              >
                {FREQ_LABELS[d]}
                {d === current && <CheckCircle2 size={12} className="text-[#E8503A]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubscriptionCard({
  sub,
  token,
  onUpdate,
}: {
  sub: MedusaSubscription;
  token: string;
  onUpdate: (updated: MedusaSubscription) => void;
}) {
  const [loading, setLoading] = useState<"pause" | "resume" | "cancel" | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const slug = sub.product_title.toLowerCase();
  const meta = PRODUCT_META[slug];

  async function action(type: "pause" | "resume" | "cancel") {
    setLoading(type);
    try {
      let updated: MedusaSubscription;
      if (type === "pause") updated = await medusa.subscriptions.pause(sub.id, token);
      else if (type === "resume") updated = await medusa.subscriptions.resume(sub.id, token);
      else updated = await medusa.subscriptions.cancel(sub.id, token);
      onUpdate(updated);
    } catch {
      // Mock fallback
      const statusMap = { pause: "paused", resume: "active", cancel: "cancelled" } as const;
      onUpdate({ ...sub, status: statusMap[type] });
    } finally {
      setLoading(null);
      setConfirmCancel(false);
    }
  }

  const isCancelled = sub.status === "cancelled";

  return (
    <motion.div
      layout
      className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${
        isCancelled ? "opacity-60 border-[#F3F4F6]" : "border-[#005088]/8 shadow-[0_4px_20px_rgba(0,80,136,0.07)]"
      }`}
    >
      <div className="p-5 flex gap-4">
        {/* Product image */}
        <div
          className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
          style={{ background: meta?.bg ?? "#F3F4F6" }}
        >
          {meta && (
            <div className="relative w-12 h-12">
              <Image
                src={meta.imgSrc}
                alt={sub.product_title}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <p className="text-[16px] font-black text-[#005088] leading-tight">
                NovaPatch {sub.product_title}
              </p>
              <p className="text-[12px] text-[#6B7280] mt-0.5">
                {fmt(sub.unit_price * sub.quantity)} / entrega
              </p>
            </div>
            <StatusBadge status={sub.status} />
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            {/* Frecuencia */}
            {!isCancelled && (
              <FrequencySelector
                current={sub.interval_days}
                sub_id={sub.id}
                token={token}
                onUpdate={onUpdate}
              />
            )}

            {/* Próxima entrega */}
            {sub.status === "active" && (
              <span className="flex items-center gap-1 text-[11px] text-[#6B7280]">
                <Clock size={11} />
                Próxima entrega: {fmtDate(sub.next_delivery_at)}
              </span>
            )}
            {sub.status === "paused" && (
              <span className="flex items-center gap-1 text-[11px] text-[#D97706]">
                <Pause size={11} />
                Envíos pausados
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      {!isCancelled && (
        <div className="px-5 pb-4 flex items-center gap-2 flex-wrap">
          {sub.status === "active" && (
            <button
              onClick={() => action("pause")}
              disabled={loading !== null}
              className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-2 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:border-[#D97706] hover:text-[#D97706] transition-all disabled:opacity-50"
            >
              {loading === "pause" ? <Loader2 size={12} className="animate-spin" /> : <Pause size={12} />}
              Pausar
            </button>
          )}
          {sub.status === "paused" && (
            <button
              onClick={() => action("resume")}
              disabled={loading !== null}
              className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-2 rounded-lg border border-[#E5E7EB] text-[#059669] hover:bg-[#ECFDF5] hover:border-[#059669] transition-all disabled:opacity-50"
            >
              {loading === "resume" ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
              Reanudar
            </button>
          )}

          {/* Cancel confirm */}
          {!confirmCancel ? (
            <button
              onClick={() => setConfirmCancel(true)}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-[#9CA3AF] hover:text-[#DC2626] transition-colors ml-auto"
            >
              <X size={12} />
              Cancelar suscripción
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-auto flex items-center gap-2"
            >
              <span className="text-[11px] text-[#DC2626] font-bold">¿Confirmar cancelación?</span>
              <button
                onClick={() => action("cancel")}
                disabled={loading !== null}
                className="text-[11px] font-black px-3 py-1.5 rounded-lg bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors disabled:opacity-50"
              >
                {loading === "cancel" ? <Loader2 size={11} className="animate-spin" /> : "Sí, cancelar"}
              </button>
              <button
                onClick={() => setConfirmCancel(false)}
                className="text-[11px] font-semibold text-[#6B7280] hover:text-[#005088] transition-colors"
              >
                No
              </button>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function PaymentMethodCard({ pm }: { pm: MedusaPaymentMethod }) {
  const brandColors: Record<string, string> = {
    Visa: "#1A1F71",
    Mastercard: "#EB001B",
    "American Express": "#007BC1",
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#005088]/8 shadow-[0_2px_12px_rgba(0,80,136,0.05)]">
      <div
        className="flex h-10 w-14 items-center justify-center rounded-lg text-[13px] font-black text-white flex-shrink-0"
        style={{ background: brandColors[pm.brand] ?? "#6B7280" }}
      >
        {pm.brand.slice(0, 4)}
      </div>
      <div className="flex-1">
        <p className="text-[13px] font-bold text-[#005088]">
          •••• {pm.last4.slice(-4)}
        </p>
        <p className="text-[11px] text-[#6B7280]">
          Vence {pm.exp_month.toString().padStart(2, "0")}/{pm.exp_year}
        </p>
      </div>
      {pm.is_default && (
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#EBF4FB] text-[#005088]">
          Principal
        </span>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SuscripcionesPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  const [subscriptions, setSubscriptions] = useState<MedusaSubscription[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<MedusaPaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        setSubscriptions(MOCK_SUBSCRIPTIONS);
        setPaymentMethods(MOCK_PAYMENT_METHODS);
        return;
      }
      const [subs, pms] = await Promise.all([
        medusa.subscriptions.list(token),
        medusa.paymentMethods.list(token),
      ]);
      setSubscriptions(subs);
      setPaymentMethods(pms);
    } catch {
      // Backend no disponible → mostrar datos mock
      setSubscriptions(MOCK_SUBSCRIPTIONS);
      setPaymentMethods(MOCK_PAYMENT_METHODS);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (isLoaded && !user) router.replace("/");
    if (isLoaded && user) load();
  }, [isLoaded, user, router, load]);

  function updateSub(updated: MedusaSubscription) {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
    );
  }

  const activeSubs   = subscriptions.filter((s) => s.status === "active");
  const pausedSubs   = subscriptions.filter((s) => s.status === "paused");
  const cancelledSubs = subscriptions.filter((s) => s.status === "cancelled");

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#005088]" />
          <p className="text-[13px] text-[#6B7280]">Cargando tus suscripciones…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <div className="border-b border-[#005088]/8 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[13px] font-semibold text-[#6B7280] hover:text-[#005088] transition-colors"
          >
            <ChevronLeft size={15} />
            Volver
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-[18px] font-black text-[#005088] tracking-[-0.01em]">
              Mis suscripciones
            </h1>
            <p className="text-[12px] text-[#6B7280] mt-0.5">
              {user?.firstName ? `Hola, ${user.firstName}` : user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          <div className="w-[80px]" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">

        {/* ── Suscripciones Activas ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ECFDF5]">
              <CheckCircle2 size={14} className="text-[#059669]" />
            </div>
            <h2 className="text-[15px] font-black text-[#005088]">
              Activas
              <span className="ml-2 text-[12px] font-semibold text-[#6B7280]">
                ({activeSubs.length})
              </span>
            </h2>
          </div>

          {activeSubs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#D1D5DB] p-8 text-center">
              <Package size={28} className="mx-auto text-[#D1D5DB] mb-3" />
              <p className="text-[14px] text-[#9CA3AF]">No tienes suscripciones activas.</p>
              <Link
                href="/tienda"
                className="inline-flex items-center gap-1.5 mt-4 text-[13px] font-bold text-[#E8503A] hover:underline"
              >
                Explorar productos <ChevronRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeSubs.map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  sub={sub}
                  token={""}
                  onUpdate={updateSub}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Pausadas ── */}
        {pausedSubs.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF7ED]">
                <Pause size={14} className="text-[#D97706]" />
              </div>
              <h2 className="text-[15px] font-black text-[#005088]">
                Pausadas
                <span className="ml-2 text-[12px] font-semibold text-[#6B7280]">
                  ({pausedSubs.length})
                </span>
              </h2>
            </div>
            <div className="space-y-3">
              {pausedSubs.map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  sub={sub}
                  token={""}
                  onUpdate={updateSub}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Tarjetas de pago ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EBF4FB]">
                <CreditCard size={14} className="text-[#005088]" />
              </div>
              <h2 className="text-[15px] font-black text-[#005088]">Método de pago</h2>
            </div>
            <Link
              href="/cuenta/tarjetas"
              className="flex items-center gap-1 text-[12px] font-bold text-[#E8503A] hover:underline"
            >
              <Plus size={12} />
              Agregar
            </Link>
          </div>

          <div className="space-y-2">
            {paymentMethods.map((pm) => (
              <PaymentMethodCard key={pm.id} pm={pm} />
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-white border border-[#E5E7EB]">
            <ShieldCheck size={14} className="text-[#3CBFAB] flex-shrink-0" />
            <p className="text-[11px] text-[#6B7280]">
              Tus datos de pago están encriptados y gestionados de forma segura por{" "}
              <span className="font-bold text-[#005088]">Openpay</span>. Novapatch nunca almacena datos de tarjeta.
            </p>
          </div>
        </section>

        {/* ── Canceladas ── */}
        {cancelledSubs.length > 0 && (
          <section>
            <details className="group">
              <summary className="flex items-center gap-2 cursor-pointer list-none mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FEF2F2]">
                  <X size={14} className="text-[#DC2626]" />
                </div>
                <h2 className="text-[14px] font-bold text-[#9CA3AF]">
                  Canceladas ({cancelledSubs.length})
                </h2>
                <ChevronRight size={14} className="text-[#9CA3AF] ml-auto group-open:rotate-90 transition-transform" />
              </summary>
              <div className="space-y-3">
                {cancelledSubs.map((sub) => (
                  <SubscriptionCard
                    key={sub.id}
                    sub={sub}
                    token={""}
                    onUpdate={updateSub}
                  />
                ))}
              </div>
            </details>
          </section>
        )}

        {/* ── Vacío total ── */}
        {subscriptions.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Repeat size={40} className="mx-auto text-[#D1D5DB] mb-4" />
            <h3 className="text-[18px] font-black text-[#005088] mb-2">
              Aún no tienes suscripciones
            </h3>
            <p className="text-[14px] text-[#6B7280] mb-6 max-w-[300px] mx-auto">
              Suscribite a tus parches favoritos y ahorra hasta 20% en cada entrega.
            </p>
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[14px] text-white transition-all hover:brightness-95 active:scale-[0.97]"
              style={{ background: "#E8503A" }}
            >
              Ver suscripciones disponibles
              <ChevronRight size={14} />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
