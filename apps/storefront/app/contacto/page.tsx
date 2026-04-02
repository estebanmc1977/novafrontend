"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: "", email: "", asunto: "", mensaje: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <Navbar lightBg />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 px-6 text-center" style={{ background: "#FEF7ED" }}>
          <div className="max-w-2xl mx-auto">
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="text-[#3CBFAB] font-semibold text-sm uppercase tracking-widest mb-4">Soporte</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-6xl font-bold text-[#005088] mb-4">Estamos aquí para ayudarte</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#6B7280] text-lg">Respondemos en menos de 24 horas en días hábiles.</motion.p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-6 bg-[#FAF7F2]">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="lg:col-span-3">
              {sent ? (
                <div className="bg-white rounded-3xl p-10 shadow-[0_4px_20px_rgba(13,27,53,0.06)] border border-[#005088]/6 text-center flex flex-col gap-4 items-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#C9D849]/20 flex items-center justify-center text-3xl">✅</div>
                  <h2 className="text-2xl font-bold text-[#005088]">¡Mensaje enviado!</h2>
                  <p className="text-[#6B7280]">Te responderemos en menos de 24 horas a <strong>{form.email}</strong></p>
                  <button onClick={() => { setSent(false); setForm({ nombre: "", email: "", asunto: "", mensaje: "" }); }}
                    className="mt-2 text-sm text-[#3CBFAB] hover:underline font-medium">Enviar otro mensaje</button>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(13,27,53,0.06)] border border-[#005088]/6">
                  <h2 className="text-2xl font-bold text-[#005088] mb-6">Envíanos un mensaje</h2>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-[#6B7280] mb-2">Nombre</label>
                        <input required type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre"
                          className="w-full px-4 py-3 rounded-xl border border-[#005088]/10 text-sm text-[#005088] placeholder-[#0D1B35]/30 focus:outline-none focus:border-[#3CBFAB]/60 focus:ring-2 focus:ring-[#3CBFAB]/10 transition-all duration-200 bg-[#FAF7F2]" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#6B7280] mb-2">Email</label>
                        <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@correo.com"
                          className="w-full px-4 py-3 rounded-xl border border-[#005088]/10 text-sm text-[#005088] placeholder-[#0D1B35]/30 focus:outline-none focus:border-[#3CBFAB]/60 focus:ring-2 focus:ring-[#3CBFAB]/10 transition-all duration-200 bg-[#FAF7F2]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#6B7280] mb-2">Asunto</label>
                      <select required value={form.asunto} onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#005088]/10 text-sm text-[#005088] focus:outline-none focus:border-[#3CBFAB]/60 focus:ring-2 focus:ring-[#3CBFAB]/10 transition-all duration-200 bg-[#FAF7F2] appearance-none">
                        <option value="" disabled>Selecciona un asunto</option>
                        <option value="pedido">Pedido</option>
                        <option value="suscripcion">Suscripción</option>
                        <option value="producto">Producto</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#6B7280] mb-2">Mensaje</label>
                      <textarea required rows={5} value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} placeholder="Cuéntanos en qué podemos ayudarte..."
                        className="w-full px-4 py-3 rounded-xl border border-[#005088]/10 text-sm text-[#005088] placeholder-[#0D1B35]/30 focus:outline-none focus:border-[#3CBFAB]/60 focus:ring-2 focus:ring-[#3CBFAB]/10 transition-all duration-200 bg-[#FAF7F2] resize-none" />
                    </div>
                    <button type="submit"
                      className="w-full py-4 bg-[#3CBFAB] text-white font-semibold rounded-xl hover:bg-[#2da898] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_16px_rgba(60,191,171,0.3)]">
                      Enviar mensaje
                    </button>
                  </form>
                </div>
              )}
            </motion.div>

            {/* Contact info */}
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2 flex flex-col gap-5">
              {[
                { icon: "✉️", title: "Email", value: "hola@novapatch.care", link: "mailto:hola@novapatch.care" },
                { icon: "🕐", title: "Horario de atención", value: "Lunes – Viernes\n9:00 AM – 6:00 PM (CDMX)", link: null },
                { icon: "📱", title: "Redes sociales", value: "@novapatch.care\n@novapatch", link: null },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(13,27,53,0.05)] border border-[#005088]/6 flex gap-4">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">{item.title}</p>
                    {item.link ? (
                      <a href={item.link} className="text-sm font-semibold text-[#3CBFAB] hover:underline">{item.value}</a>
                    ) : (
                      <p className="text-sm font-semibold text-[#005088] whitespace-pre-line">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="bg-[#EAF5FB] rounded-2xl p-6 border border-[#5BA8D5]/20">
                <p className="text-sm font-semibold text-[#1D3461] mb-1">¿Tienes una pregunta frecuente?</p>
                <p className="text-sm text-[#6B7280] mb-4">Puede que ya tengamos la respuesta.</p>
                <a href="/faq" className="text-sm font-semibold text-[#3CBFAB] hover:underline">Ver preguntas frecuentes →</a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
