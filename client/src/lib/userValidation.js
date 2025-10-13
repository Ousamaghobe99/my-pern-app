import { isValidEmail, isValidPhoneNumber } from './utils'

/**
 * Validate complete user data
 * @param {Object} userData - User data object
 * @returns {Array} Array of error messages
 */
export function validateUserData(userData) {
  const errors = []

  // First name validation
  if (!userData?.firstName?.trim()) {
    errors.push('First name is required')
  } else if (userData.firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters')
  } else if (userData.firstName.trim().length > 50) {
    errors.push('First name must not exceed 50 characters')
  }

  // Last name validation
  if (!userData?.lastName?.trim()) {
    errors.push('Last name is required')
  } else if (userData.lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters')
  } else if (userData.lastName.trim().length > 50) {
    errors.push('Last name must not exceed 50 characters')
  }

  // Email validation
  if (!userData?.email?.trim()) {
    errors.push('Email is required')
  } else if (!isValidEmail(userData.email)) {
    errors.push('Invalid email format')
  } else if (userData.email.length > 100) {
    errors.push('Email must not exceed 100 characters')
  }

  // Phone number validation
  if (!userData?.phoneNumber?.trim()) {
    errors.push('Phone number is required')
  } else if (!isValidPhoneNumber(userData.phoneNumber)) {
    errors.push('Invalid phone number format (minimum 10 digits)')
  }

  // Role validation
  if (!userData?.roleId) {
    errors.push('Role is required')
  }

  return errors
}

/**
 * Validate individual user fields in real-time
 * @param {string} field - Field name to validate
 * @param {any} value - Field value
 * @returns {string|null} Error message or null if valid
 */
export function validateUserField(field, value) {
  switch (field) {
    case 'firstName':
      if (!value?.trim()) return 'First name is required'
      if (value.trim().length < 2) return 'First name must be at least 2 characters'
      if (value.trim().length > 50) return 'First name must not exceed 50 characters'
      return null

    case 'lastName':
      if (!value?.trim()) return 'Last name is required'
      if (value.trim().length < 2) return 'Last name must be at least 2 characters'
      if (value.trim().length > 50) return 'Last name must not exceed 50 characters'
      return null

    case 'email':
      if (!value?.trim()) return 'Email is required'
      if (!isValidEmail(value)) return 'Invalid email format'
      if (value.length > 100) return 'Email must not exceed 100 characters'
      return null

    case 'phoneNumber':
      if (!value?.trim()) return 'Phone number is required'
      if (!isValidPhoneNumber(value)) return 'Invalid phone number format'
      return null

    case 'roleId':
      if (!value) return 'Role is required'
      return null

    default:
      return null
  }
}

/**
 * Format user data for API submission
 * Trims whitespace and normalizes values
 * @param {Object} userData - User data to format
 * @returns {Object} Formatted user data
 */
export function formatUserData(userData) {
  return {
    firstName: userData.firstName?.trim() || '',
    lastName: userData.lastName?.trim() || '',
    email: userData.email?.trim().toLowerCase() || '',
    phoneNumber: userData.phoneNumber?.trim() || '',
    roleId: userData.roleId || ''
  }
}

/**
 * Sanitize user data for safe display
 * Removes sensitive fields
 * @param {Object} user - User object to sanitize
 * @returns {Object} Sanitized user data
 */
export function sanitizeUserData(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    matricule: user.matricule,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

/**
 * Validate multiple fields at once
 * Returns object with field-level errors
 * @param {Object} userData - User data object
 * @returns {Object} Object with field names as keys and error messages as values
 */
export function validateUserFields(userData) {
  const fieldErrors = {}

  const fields = ['firstName', 'lastName', 'email', 'phoneNumber', 'roleId']

  fields.forEach(field => {
    const error = validateUserField(field, userData[field])
    if (error) {
      fieldErrors[field] = error
    }
  })

  return fieldErrors
}

/**
 * Check if user data has any validation errors
 * @param {Object} userData - User data object
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidUserData(userData) {
  const errors = validateUserData(userData)
  return errors.length === 0
}

/**
 * Validate email uniqueness (would need backend check)
 * This is a placeholder - actual implementation should check backend
 * @param {string} email - Email to validate
 * @param {Array} existingUsers - Array of existing users
 * @returns {boolean} True if email is unique
 */
export function isEmailUnique(email, existingUsers = []) {
  return !existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase())
}

/**
 * Validate phone number uniqueness
 * @param {string} phoneNumber - Phone number to validate
 * @param {Array} existingUsers - Array of existing users
 * @returns {boolean} True if phone is unique
 */
export function isPhoneUnique(phoneNumber, existingUsers = []) {
  const normalized = phoneNumber.replace(/\D/g, '')
  return !existingUsers.some(user => {
    const existingPhone = user.phoneNumber.replace(/\D/g, '')
    return existingPhone === normalized
  })
}

/**
 * Get field-level error messages
 * Useful for displaying errors next to form inputs
 * @param {Object} userData - User data object
 * @returns {Object} Object with field names and their error messages
 */
export function getUserFieldErrors(userData) {
  return validateUserFields(userData)
}