function trimText(value) {
  return String(value ?? "").trim();
}

export async function getPublicRentalContacts(env) {
  let row;
  try {
    row = await env.DB.prepare(
      `SELECT rental_contact_phone, rental_contact_email, rental_contact_wechat, rental_contact_whatsapp
       FROM site_settings WHERE id = 1`,
    ).first();
  } catch {
    row = null;
  }
  if (!row) {
    return { phone: "", email: "", wechat: "", whatsapp: "" };
  }
  return {
    phone: String(row.rental_contact_phone ?? "").trim(),
    email: String(row.rental_contact_email ?? "").trim(),
    wechat: String(row.rental_contact_wechat ?? "").trim(),
    whatsapp: String(row.rental_contact_whatsapp ?? "").trim(),
  };
}

export async function patchAdminRentalContacts(env, body) {
  const phone = trimText(body?.phone);
  const email = trimText(body?.email);
  const wechat = trimText(body?.wechat);
  const whatsapp = trimText(body?.whatsapp);

  await env.DB.prepare(
    `INSERT INTO site_settings (
        id,
        rental_contact_phone,
        rental_contact_email,
        rental_contact_wechat,
        rental_contact_whatsapp,
        updated_at
      ) VALUES (1, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        rental_contact_phone = excluded.rental_contact_phone,
        rental_contact_email = excluded.rental_contact_email,
        rental_contact_wechat = excluded.rental_contact_wechat,
        rental_contact_whatsapp = excluded.rental_contact_whatsapp,
        updated_at = excluded.updated_at`,
  )
    .bind(phone, email, wechat, whatsapp)
    .run();

  return getPublicRentalContacts(env);
}
