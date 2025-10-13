// Authentication utilities
export const getStoredToken = () => {
  return localStorage.getItem('authToken');
};

export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setAuthData = (token, user) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  const token = getStoredToken();
  const user = getStoredUser();
  return !!(token && user);
};

export const hasPermission = (permission) => {
  const user = getStoredUser();
  if (!user || !user.role || !user.role.permissions) return false;
  
  // Administrator has all permissions
  if (user.role.name === 'Administrator') return true;
  
  // Check if user has the specific permission
  return user.role.permissions.some(p => p.name === permission);
};

export const hasRole = (role) => {
  const user = getStoredUser();
  if (!user || !user.role) return false;
  
  return user.role.name === role;
};

export const hasAnyRole = (roles) => {
  const user = getStoredUser();
  if (!user || !user.role) return false;
  
  return roles.includes(user.role.name);
};

export const getUserRole = () => {
  const user = getStoredUser();
  return user?.role?.name || null;
};

export const getUserPermissions = () => {
  const user = getStoredUser();
  return user?.role?.permissions?.map(p => p.name) || [];
};

