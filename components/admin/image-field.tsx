"use client";

import { useEffect, useState } from "react";

/**
 * Image picker for the product/category forms. Lets the admin either upload a
 * file (sent as `image_file`) or paste a path/URL (sent as `image`), with a
 * live preview. The server action uploads the file when present and otherwise
 * keeps the text value.
 */
export default function ImageField({
  defaultValue,
  label = "Image",
}: {
  defaultValue?: string;
  label?: string;
}) {
  const [pathValue, setPathValue] = useState(defaultValue ?? "");
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Revoke the object URL when the chosen file changes / on unmount.
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const preview = filePreview ?? (pathValue.trim() || null);

  return (
    <div>
      <span className="mb-1.5 block text-sm text-charcoal-soft">{label}</span>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-blush-deep/50 bg-blush/30">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Aperçu" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xs text-mauve">
              Aperçu
            </span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            type="file"
            name="image_file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setFilePreview(file ? URL.createObjectURL(file) : null);
            }}
            className="block w-full text-sm text-charcoal-soft file:mr-3 file:rounded-full file:border-0 file:bg-rosegold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-rosegold-dark"
          />
          <input
            type="text"
            name="image"
            value={pathValue}
            onChange={(e) => setPathValue(e.target.value)}
            placeholder="ou chemin / URL : /products/mon-image.jpg"
            className="h-11 w-full rounded-xl border border-blush-deep/60 bg-white/70 px-4 text-sm focus:border-rosegold focus:outline-none"
          />
          <p className="text-xs text-mauve">
            Téléchargez une image (JPEG, PNG, WebP — 8 Mo max) ou collez un chemin / URL.
            Le fichier téléchargé remplace le chemin saisi.
          </p>
        </div>
      </div>
    </div>
  );
}
