export type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  ownerId: string;
};

const KEY = "crm_properties";

export function getProperties(): Property[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function saveProperty(p: Property) {
  const items = getProperties();
  localStorage.setItem(KEY, JSON.stringify([...items, p]));
}
