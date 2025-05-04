export function getAccessToken() {
  const token = localStorage.getItem("access_token");
  return token ? JSON.parse(token) : '';
}

export function getUserRole() {
  const cookie = localStorage.getItem("user");
  const user = cookie ? JSON.parse(cookie) : {};
  return user.role || '';
}

export function getUserInfo(){
  const cookie = localStorage.getItem("user");
  const user = cookie ? JSON.parse(cookie) : {};
  return user || '';
}