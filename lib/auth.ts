export function setToken(token: string) {
  document.cookie = `token=${token}; path=/; max-age=86400`;
}

export function logout() {
  document.cookie = "token=; path=/; max-age=0";
}
