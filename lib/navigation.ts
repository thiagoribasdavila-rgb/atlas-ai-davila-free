let lastRoute = "";

export function navigateOnce(route: string) {
  if (lastRoute === route) return false;

  lastRoute = route;
  return true;
}
