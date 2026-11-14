import { NextResponse } from "next/server";
import { isKvConfigured, redis } from "@/lib/dopamine/kv";
import { clampActions, clampCombo } from "@/lib/dopamine/statsValidation";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const KEY_VISITS = "dopamine:stats:total_visits";
const KEY_NEW_VISITORS = "dopamine:stats:new_visitors";
const KEY_ACTIONS = "dopamine:stats:total_actions";
const KEY_MAX_COMBO = "dopamine:stats:max_combo";

/** 現在値より大きいときだけ上書きする（複数リクエストが同時に来ても安全なように、Redis側で1回のスクリプトとして実行する） */
const SET_IF_GREATER_SCRIPT = `
local current = tonumber(redis.call('GET', KEYS[1]) or '0')
local candidate = tonumber(ARGV[1])
if candidate > current then
  redis.call('SET', KEYS[1], candidate)
  return candidate
end
return current
`;

type Stats = {
  readonly totalVisits: number;
  readonly newVisitors: number;
  readonly totalActions: number;
  readonly maxCombo: number;
  readonly configured: boolean;
};

const EMPTY_STATS: Stats = { totalVisits: 0, newVisitors: 0, totalActions: 0, maxCombo: 0, configured: false };

export async function GET() {
  if (!redis) return NextResponse.json(EMPTY_STATS);
  try {
    const [totalVisits, newVisitors, totalActions, maxCombo] = await redis.mget<
      [number | null, number | null, number | null, number | null]
    >(KEY_VISITS, KEY_NEW_VISITORS, KEY_ACTIONS, KEY_MAX_COMBO);
    return NextResponse.json({
      totalVisits: totalVisits ?? 0,
      newVisitors: newVisitors ?? 0,
      totalActions: totalActions ?? 0,
      maxCombo: maxCombo ?? 0,
      configured: true,
    } satisfies Stats);
  } catch {
    return NextResponse.json(EMPTY_STATS);
  }
}

type Body = {
  readonly visit?: boolean;
  readonly newVisitor?: boolean;
  /** 直近のアクション数（クライアント側でまとめて送る） */
  readonly actions?: number;
  /** 自己ベストを更新したコンボ数（全国記録かどうかはサーバー側で判定する） */
  readonly combo?: number;
};

export async function POST(req: Request) {
  if (!isKvConfigured || !redis) return NextResponse.json(EMPTY_STATS);
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const actionsDelta = clampActions(body.actions);
  const combo = clampCombo(body.combo);

  const pipeline = redis.pipeline();
  if (body.visit) pipeline.incr(KEY_VISITS);
  if (body.newVisitor) pipeline.incr(KEY_NEW_VISITORS);
  if (actionsDelta > 0) pipeline.incrby(KEY_ACTIONS, actionsDelta);

  if (body.visit || body.newVisitor || actionsDelta > 0) {
    try {
      await pipeline.exec();
    } catch {
      return NextResponse.json(EMPTY_STATS);
    }
  }

  if (combo > 0) {
    try {
      await redis.eval(SET_IF_GREATER_SCRIPT, [KEY_MAX_COMBO], [combo]);
    } catch {
      /* コンボ記録の更新に失敗しても、他の集計には影響させない */
    }
  }

  return NextResponse.json({ ok: true });
}
