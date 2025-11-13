import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';
import { getStoredToken, getStoredUser, setAuthData, clearAuthData } from '../lib/auth';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored auth data on mount
        const storedToken = getStoredToken();
        const storedUser = getStoredUser();
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
        }
        
        setLoading(false);
    }, []);

    /**
     * Helper function to check for HTTP 422 Validation Errors
     * @param {object} error The Axios error object
     */
    const isValidationError = (error) => {
        return (
            error.response?.status === 422 && 
            Array.isArray(error.response.data?.errors)
        );
    };

    /**
     * Helper function to extract a robust error message from the Axios error object
     * @param {object} error The Axios error object
     * @param {string} defaultMessage A default message for general failures
     */
    const getErrorMessage = (error, defaultMessage) => {
        if (error.response) {
            // Error from server (401, 403, 500, etc.)
            return error.response.data?.message || defaultMessage;
        } else if (error.request) {
            // Request made but no response received (Network/Timeout)
            return 'Could not connect to the server. Please check your internet connection.';
        } else {
            // Something happened in setting up the request that triggered an Error
            return error.message || defaultMessage;
        }
    }


    const login = async (credentials) => {
        try {
            console.log('=== AuthContext.login START ===');
            const response = await authAPI.login(credentials);
            
            const data = response.data.data;
            
            // 1. Check for the temporary password flag first
            if (data.requirePasswordChange) {
                return { 
                    success: true, 
                    requirePasswordChange: true, 
                    token: data.token, // Temporary token
                    userId: data.userId 
                };
            }

            // 2. Standard login success
            const { user: userData, token: authToken } = data;
            
            setAuthData(authToken, userData);
            setToken(authToken);
            setUser(userData);
            
            return { success: true, user: userData };
            
        } catch (error) {
            // If it's a 422 validation error, THROW the original error 
            // so the component's catch block can parse field errors.
            if (isValidationError(error)) {
                throw error; 
            }

            // For all other errors (401, 500, network), RETURN a clean failure object.
            const message = getErrorMessage(
                error, 
                'Invalid email or password. Please check your credentials and try again.'
            );
                
            return { success: false, error: message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const { user: newUser, token: authToken } = response.data.data;
            
            setAuthData(authToken, newUser);
            setToken(authToken);
            setUser(newUser);
            
            return { success: true, user: newUser };
            
        } catch (error) {
            if (isValidationError(error)) {
                throw error;
            }

            const message = getErrorMessage(
                error,
                'Registration failed. Please try again later.'
            );
                
            return { success: false, error: message };
        }
    };

    const logout = () => {
        clearAuthData();
        setToken(null);
        setUser(null);
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await authAPI.updateProfile(profileData);
            const updatedUser = response.data.data;
            
            setAuthData(token, updatedUser);
            setUser(updatedUser);
            
            return { success: true, user: updatedUser };
        } catch (error) {
             if (isValidationError(error)) {
                 throw error;
            }
            const message = getErrorMessage(error, 'Profile update failed');
            return { success: false, error: message };
        }
    };

    const changePassword = async (passwordData) => {
        try {
            await authAPI.changePassword(passwordData);
            return { success: true };
        } catch (error) {
            const message = getErrorMessage(error, 'Password change failed');
            return { success: false, error: message };
        }
    };

    const hasPermission = (permission) => {
        if (!user || !user.role || !user.role.permissions) return false;
        
        // Administrator has all permissions
        if (user.role.name === 'Administrator') return true;
        
        // Check if user has the specific permission
        return user.role.permissions.some(p => p.name === permission);
    };

    const hasRole = (role) => {
        if (!user || !user.role) return false;
        return user.role.name === role;
    };

    const hasAnyRole = (roles) => {
        if (!user || !user.role) return false;
        return roles.includes(user.role.name);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        hasPermission,
        hasRole,
        hasAnyRole,
        isAuthenticated: !!(token && user),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};