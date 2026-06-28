// lib/navigation.ts

import { AppRouterInstance } from "next/navigation";

let lastRoute: string | null = null;
let navigating = false;

export function navigateOnce(router: AppRouterInstance, path: string) {
  if (navigating) return;
  if (lastRoute === path) return;

  navigating = true;
  lastRoute = path;

  router.push(path);

  setTimeout(() => {
    navigating = false;
  }, 300);
}
