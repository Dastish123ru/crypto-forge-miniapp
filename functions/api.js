// functions/api.js

/**
 * GET /api?tg=<telegram_username>
 * возвращает JSON: { balance: number, lastTs: number }
 */
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const tg  = url.searchParams.get("tg") || "";
  const bal = await env.USER_BALANCES.get(`bal:${tg}`)  || "0";
  const ts  = await env.USER_BALANCES.get(`ts:${tg}`)   || "0";

  return new Response(JSON.stringify({
    balance: Number(bal),
    lastTs:  Number(ts),
  }), {
    headers: { "Content-Type": "application/json" }
  });
}

/**
 * POST /api
 * Тело запроса: { tg: string, amount: number }
 * Сохраняет новые баланс и timestamp.
 */
export async function onRequestPost({ request, env }) {
  const { tg, amount } = await request.json();
  await env.USER_BALANCES.put(`bal:${tg}`,  String(amount));
  await env.USER_BALANCES.put(`ts:${tg}`,   String(Date.now()));
  return new Response(null, { status: 204 });
}
