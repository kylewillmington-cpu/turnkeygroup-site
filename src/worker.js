// TurnKey Group – website worker.
// Serves the static site from ./public and handles the launch sign-up forms
// (TurnKey Pro and TurnKey Services) at /api/notify, replacing Netlify Forms.
// Free Workers plan: hard daily request limit, no usage charges.
import { EmailMessage } from "cloudflare:email";

const FORMS = { "pro-launch": "TurnKey Pro", "services-launch": "TurnKey Services", "atlas-waitlist": "ATLAS Core" };
// Extra fields the ATLAS Core application sends (each trimmed to 300 characters).
const ATLAS_FIELDS = ["name", "business", "phone", "properties", "channel_manager", "other_systems", "pricing", "channels", "operation", "wants", "mode", "estimate", "consent"];
const TO = "kyle@turnkeybnbs.com.au";
const FROM = "notify@turnkeygroup.com.au";
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/notify") return notify(request, env);
    return env.ASSETS.fetch(request);
  },
};

async function notify(request, env) {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
  if (Number(request.headers.get("content-length") || 0) > 6000) return new Response("Too large", { status: 413 });

  let data;
  try { data = Object.fromEntries(await request.formData()); }
  catch { return new Response("Bad request", { status: 400 }); }

  const form = String(data["form-name"] || "");
  const email = String(data.email || "").trim().toLowerCase();
  const wantsHtml = (request.headers.get("accept") || "").includes("text/html");
  const back = form === "services-launch" ? "/services/" : form === "atlas-waitlist" ? "/atlas/" : "/pro/";

  if (data["bot-field"]) return done(wantsHtml, back); // bots fill the hidden field
  if (!FORMS[form] || !EMAIL_RE.test(email)) return new Response("Please enter a valid email address.", { status: 400 });
  const atlas = form === "atlas-waitlist";
  if (atlas && data.consent !== "yes") return new Response("Please agree to be contacted.", { status: 400 });
  const clean = (v) => String(v || "").replace(/[\r\n]+/g, " ").trim().slice(0, 300);

  const division = FORMS[form];
  const when = new Date().toISOString();
  console.log(JSON.stringify({ event: "signup", form, email, when })); // also kept in Workers logs

  const raw = [
    `From: TurnKey Group website <${FROM}>`,
    `To: ${TO}`,
    `Reply-To: ${email}`,
    `Subject: ${atlas ? `New ATLAS Core application: ${clean(data.name) || email}` : `New ${division} launch sign-up`}`,
    `Message-ID: <${crypto.randomUUID()}@turnkeygroup.com.au>`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "",
    atlas ? "Someone applied for ATLAS Core and joined the waiting list." : `Someone asked to be emailed when ${division} launches.`,
    "",
    `Email: ${email}`,
    ...(atlas ? ATLAS_FIELDS.map((k) => `${k.replace(/_/g, " ")}: ${clean(data[k])}`) : []),
    `Form: ${form}`,
    `Time (UTC): ${when}`,
    "",
    atlas ? "They agreed to be contacted about ATLAS Core by email or phone (see the consent text on the page)." : "They agreed to one launch email (see the consent text on the page).",
  ].join("\r\n");

  try {
    await env.EMAIL.send(new EmailMessage(FROM, TO, raw));
  } catch (e) {
    console.error(JSON.stringify({ event: "email_failed", form, email, error: String(e) }));
    return new Response("Sorry, that didn't go through.", { status: 502 });
  }
  return done(wantsHtml, back);
}

function done(wantsHtml, back) {
  if (wantsHtml) return Response.redirect(`https://turnkeygroup.com.au${back}?subscribed=1#notify`, 303);
  return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
}
