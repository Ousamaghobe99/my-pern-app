import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// ============================================
// DATE FORMATTING UTILITIES
// ============================================

export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return '';
  
  return format(parsedDate, formatString);
};

export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return '';
  
  return formatDistanceToNow(parsedDate, { addSuffix: true });
};

export function parseDateString(dateStr) {
  if (!dateStr) return null;
  const isoStr = dateStr.replace(" ", "T");
  const d = new Date(isoStr);
  return isNaN(d.getTime()) ? null : d;
}

// ============================================
// STATUS COLOR UTILITIES
// ============================================

export const getStatusColor = (status) => {
  const statusColors = {
    // Interface statuses
    'Available': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'InUse': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'UnderMaintenance': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'Retired': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    'Disposed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    
    // Maintenance statuses
    'Open': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'InProgress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Closed': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    'OnHold': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    
    // Priority levels
    'Low': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'High': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'Critical': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
};

// ============================================
// NUMBER FORMATTING UTILITIES
// ============================================

export const formatNumber = (number) => {
  if (typeof number !== 'number') return '0';
  return new Intl.NumberFormat().format(number);
};

export const formatPercentage = (value, total) => {
  if (!total || total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
};

// ============================================
// TEXT UTILITIES
// ============================================

export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// ============================================
// VALIDATION UTILITIES
// ============================================

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};

export const isValidPhoneNumber = (phoneNumber) => {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  return digitsOnly.length >= 10;
};

export const isStrongPassword = (password) => {
  if (!password || password.length < 8) return false;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;
};

// ============================================
// SEARCH AND FILTER UTILITIES
// ============================================

export const searchItems = (items, searchTerm, searchFields) => {
  if (!searchTerm) return items;
  
  const lowercaseSearch = searchTerm.toLowerCase();
  
  return items.filter(item => 
    searchFields.some(field => {
      const value = getNestedValue(item, field);
      return value && value.toString().toLowerCase().includes(lowercaseSearch);
    })
  );
};

export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// ============================================
// SORT UTILITIES
// ============================================

export const sortItems = (items, sortField, sortDirection = 'asc') => {
  return [...items].sort((a, b) => {
    const aValue = getNestedValue(a, sortField);
    const bValue = getNestedValue(b, sortField);
    
    if (aValue === bValue) return 0;
    
    const comparison = aValue < bValue ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });
};

// ============================================
// USER UTILITIES
// ============================================

export function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return password;
}

export function generateMatricule() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${year}${random}`;
}

export function formatFullName(firstName, lastName) {
  return `${firstName} ${lastName}`.trim();
}

export function formatPhoneNumber(phoneNumber) {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
  
  if (digitsOnly.length === 11) {
    return `+${digitsOnly.slice(0, 1)} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }
  
  return phoneNumber;
}

export function getUserInitials(firstName, lastName) {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
}

export function canDeleteUser(user) {
  if (user?.role?.name === 'Super Admin') {
    return {
      canDelete: false,
      reason: 'Super Admin users cannot be deleted'
    };
  }
  
  if (user?.hasActiveSessions) {
    return {
      canDelete: false,
      reason: 'Cannot delete user with active sessions'
    };
  }
  
  return { canDelete: true, reason: '' };
}