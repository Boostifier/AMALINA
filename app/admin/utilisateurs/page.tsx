import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth";
import { setUserAdmin, deleteUser } from "@/app/actions/admin";
import ConfirmSubmit from "@/components/admin/confirm-submit";
import { formatDate } from "@/lib/orders";
import type { ProfileRow } from "@/lib/supabase/types";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const me = await getCurrentUser();
  const supabase = await createClient();

  const [{ data: profilesData }, { data: ordersData }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("orders").select("user_id"),
  ]);

  const profiles = (profilesData ?? []) as ProfileRow[];

  // Email lives in auth.users, only reachable with the service-role key.
  const emails = new Map<string, string>();
  try {
    const admin = createAdminClient();
    const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    for (const u of data?.users ?? []) emails.set(u.id, u.email ?? "");
  } catch {
    // Service key not configured — fall back to showing profiles without emails.
  }

  const orderCounts = new Map<string, number>();
  for (const o of ordersData ?? []) {
    if (o.user_id) orderCounts.set(o.user_id, (orderCounts.get(o.user_id) ?? 0) + 1);
  }

  const errorMessage =
    error === "self-admin"
      ? "Vous ne pouvez pas modifier votre propre statut administrateur."
      : error === "self-delete"
        ? "Vous ne pouvez pas supprimer votre propre compte."
        : null;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-charcoal">Utilisateurs</h1>

      {errorMessage && (
        <p className="rounded-xl bg-rosegold/10 px-4 py-3 text-sm text-rosegold-dark">
          {errorMessage}
        </p>
      )}

      {profiles.length === 0 ? (
        <p className="rounded-2xl border border-blush-deep/40 bg-white/60 p-6 text-charcoal-soft">
          Aucun utilisateur pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-blush-deep/40 bg-white/60">
          <table className="w-full text-sm">
            <thead className="text-left text-mauve">
              <tr className="border-b border-blush-deep/30">
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Téléphone</th>
                <th className="px-4 py-3 text-right font-medium">Commandes</th>
                <th className="px-4 py-3 font-medium">Inscrit le</th>
                <th className="px-4 py-3 font-medium">Rôle</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => {
                const isSelf = me?.id === p.id;
                return (
                  <tr key={p.id} className="border-b border-blush-deep/20 last:border-0">
                    <td className="px-4 py-3 text-charcoal">
                      {p.full_name || "—"}
                      {isSelf && <span className="ml-2 text-xs text-mauve">(vous)</span>}
                    </td>
                    <td className="px-4 py-3 text-charcoal-soft">{emails.get(p.id) || "—"}</td>
                    <td className="px-4 py-3 text-charcoal-soft">{p.phone || "—"}</td>
                    <td className="px-4 py-3 text-right text-charcoal-soft">
                      {orderCounts.get(p.id) ?? 0}
                    </td>
                    <td className="px-4 py-3 text-charcoal-soft">{formatDate(p.created_at)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          p.is_admin
                            ? "bg-rosegold/15 text-rosegold-dark"
                            : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        {p.is_admin ? "Administrateur" : "Client"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isSelf ? (
                        <span className="block text-right text-xs text-mauve">—</span>
                      ) : (
                        <div className="flex justify-end gap-3">
                          <form action={setUserAdmin}>
                            <input type="hidden" name="id" value={p.id} />
                            <input
                              type="hidden"
                              name="is_admin"
                              value={p.is_admin ? "false" : "true"}
                            />
                            <ConfirmSubmit
                              confirm={
                                p.is_admin
                                  ? `Retirer les droits administrateur à ${p.full_name || "cet utilisateur"} ?`
                                  : `Donner les droits administrateur à ${p.full_name || "cet utilisateur"} ?`
                              }
                              className="text-charcoal-soft transition-colors hover:text-rosegold disabled:opacity-50"
                            >
                              {p.is_admin ? "Retirer admin" : "Promouvoir"}
                            </ConfirmSubmit>
                          </form>
                          <form action={deleteUser}>
                            <input type="hidden" name="id" value={p.id} />
                            <ConfirmSubmit
                              confirm={`Supprimer définitivement le compte de ${p.full_name || "cet utilisateur"} ? Cette action est irréversible.`}
                              className="text-rose-600 transition-colors hover:text-rose-700 disabled:opacity-50"
                            >
                              Supprimer
                            </ConfirmSubmit>
                          </form>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
