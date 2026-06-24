import "server-only";
import { randomUUID } from "crypto";
import { createAdminClient, PRODUCT_IMAGE_BUCKET } from "./admin";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const MAX_BYTES = 8 * 1024 * 1024; // keep in sync with serverActions.bodySizeLimit

export class UploadError extends Error {}

/**
 * Uploads an image to the public `product-images` bucket and returns its public
 * URL. `folder` namespaces the object (e.g. "products/" or "categories/").
 * Throws {@link UploadError} with a user-friendly French message on failure.
 * Requires SUPABASE_SERVICE_ROLE_KEY (createAdminClient bypasses RLS).
 */
export async function uploadImage(file: File, folder = ""): Promise<string> {
  if (file.type && !ALLOWED.includes(file.type)) {
    throw new UploadError("Format d'image non pris en charge (JPEG, PNG, WebP, AVIF ou GIF).");
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError("L'image est trop volumineuse (8 Mo maximum).");
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}${randomUUID()}.${ext || "jpg"}`;

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    throw new UploadError(
      "Le téléchargement d'images n'est pas configuré (clé service-role manquante)."
    );
  }

  const opts = { contentType: file.type || undefined, upsert: true };

  let { error } = await admin.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, file, opts);

  // The bucket may not exist yet (storage migration not applied). The
  // service-role client can create it, so create it public and retry once.
  if (error && /bucket not found/i.test(error.message)) {
    await admin.storage.createBucket(PRODUCT_IMAGE_BUCKET, {
      public: true,
      fileSizeLimit: "8MB",
    });
    ({ error } = await admin.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .upload(path, file, opts));
  }

  if (error) {
    // Surface the underlying reason — this page is admin-only.
    throw new UploadError(`Le téléchargement de l'image a échoué : ${error.message}`);
  }

  const { data } = admin.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
