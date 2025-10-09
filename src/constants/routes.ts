/**
 * アプリケーション全体で使用するルート定数
 */

export const ROUTES = {
  HOME: "/",
  STAMPS: "/stamps",
  MAP: "/map",
  QUIZ: "/quiz",
  SCAN: "/scan",
  SCAN_SUCCESS: "/scan/success",
  SCAN_FAIL: "/scan/fail",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = (typeof ROUTES)[RouteKey];

