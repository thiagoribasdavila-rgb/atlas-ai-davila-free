export type User = {
  id: string;
  name: string;
  role: "admin" | "corretor";
};

const KEY = "crm_user";

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
}

export function login(name: string) {
  const user: User = {
    id: crypto.randomUUID(),
    name,
    role: "corretor",
  };

  localStorage.setItem(KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(KEY);
}
