import { Redis } from "@upstash/redis";

/**
 * サイト全体の集計カウンター用のRedisクライアント。
 * Vercel KV / Upstash Marketplace のどちらの環境変数名でも動くようにする
 * （接続前のローカル開発やプレビューでは null を返し、呼び出し側で吸収する）。
 */
const url =
  process.env.KV_REST_API_URL ??
  process.env.UPSTASH_REDIS_REST_URL ??
  process.env.REDIS_URL;
const token =
  process.env.KV_REST_API_TOKEN ??
  process.env.UPSTASH_REDIS_REST_TOKEN ??
  process.env.REDIS_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;

export const isKvConfigured = redis !== null;
