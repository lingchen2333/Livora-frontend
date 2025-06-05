export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userRoles");
  localStorage.removeItem("userId");
  window.location.href = "/login";
};
