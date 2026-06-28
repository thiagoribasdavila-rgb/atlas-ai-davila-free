let lastRoute = "";

export function canNavigate(route: string) {
  if (typeof window === "undefined") return true;

  const current = window.location.pathname;

  if (current === route || lastRoute === route) return false;

  lastRoute = route;
  return true;
}
