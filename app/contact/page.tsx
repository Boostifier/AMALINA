"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rosegold">
          Contactez-nous
        </p>
        <h1 className="mt-4 font-serif text-5xl text-charcoal">
          Une question, une envie ?
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-charcoal-soft">
          Notre équipe est à votre écoute pour vous conseiller et vous
          accompagner.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Info */}
        <div className="space-y-8">
          {[
            { label: "E-mail", value: "contact@amalina-market.tn" },
            { label: "Téléphone", value: "+216 00 000 000" },
            { label: "Horaires", value: "Lun – Sam · 9h à 19h" },
            { label: "Réseaux", value: "Instagram · Facebook : @amalinamarket" },
          ].map((info) => (
            <div key={info.label}>
              <p className="text-xs font-semibold uppercase tracking-widest text-mauve">
                {info.label}
              </p>
              <p className="mt-1 text-lg text-charcoal">{info.value}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-blush-deep/40 bg-white/60 p-8">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rosegold text-xl text-white">
                ✓
              </div>
              <h2 className="font-serif text-2xl text-charcoal">
                Message envoyé !
              </h2>
              <p className="mt-2 text-sm text-charcoal-soft">
                Merci de nous avoir écrit. Nous vous répondrons dans les plus
                brefs délais.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-5"
            >
              <Field label="Nom complet">
                <input
                  type="text"
                  required
                  className="h-12 w-full rounded-xl border border-blush-deep/60 bg-ivory px-4 text-sm focus:border-rosegold focus:outline-none"
                />
              </Field>
              <Field label="E-mail">
                <input
                  type="email"
                  required
                  className="h-12 w-full rounded-xl border border-blush-deep/60 bg-ivory px-4 text-sm focus:border-rosegold focus:outline-none"
                />
              </Field>
              <Field label="Message">
                <textarea
                  required
                  rows={5}
                  className="w-full rounded-xl border border-blush-deep/60 bg-ivory px-4 py-3 text-sm focus:border-rosegold focus:outline-none"
                />
              </Field>
              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-rosegold px-8 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rosegold-dark"
              >
                Envoyer le message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-mauve">
        {label}
      </span>
      {children}
    </label>
  );
}
