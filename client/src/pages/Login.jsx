import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Factory, Eye, EyeOff, Loader2, Shield, TrendingUp, Users, ArrowLeft, Mail, CheckCircle, AlertTriangle } from 'lucide-react';
import { authAPI } from '../lib/api';

const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // State for general error messages (401/Network)
    const [error, setError] = useState('');
    // State for field-specific validation errors (422)
    const [fieldErrors, setFieldErrors] = useState({});
    
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [resetError, setResetError] = useState('');

    if (isAuthenticated) {
        const from = location.state?.from?.pathname || '/dashboard';
        return <Navigate to={from} replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear errors when the user types
        if (error) setError('');
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});

        try {
            const result = await login(formData); 
            
            // --- 1. HANDLE GENERAL LOGIN FAILURE (e.g., Wrong Password/401) ---
            if (!result.success) {
                // Catches the robust message from AuthContext (e.g., "Invalid email or password...")
                setError(result.error || 'Login failed due to an unknown issue.');
                return; 
            }
            
            // --- 2. HANDLE PASSWORD CHANGE REQUIREMENT ---
            if (result.requirePasswordChange) {
                if (!result.token || !result.userId) {
                    setError('Temporary login failed due to missing user identification data from the server.');
                    setLoading(false);
                    return;
                }
                
                sessionStorage.setItem('tempToken', result.token);
                sessionStorage.setItem('tempUserId', result.userId); 
                
                window.location.href = '/change-password-first-login';
                return;
            }
            
            // Standard success continues naturally.

        } catch (err) {
            // --- 3. HANDLE FIELD VALIDATION ERRORS (422) ---
            const resData = err.response?.data;

            if (err.response?.status === 422 && resData?.errors && Array.isArray(resData.errors)) {
                
                const newErrors = {};
                resData.errors.forEach(error => {
                    newErrors[error.field] = error.message;
                });
                setFieldErrors(newErrors);
                
                setError('Please review and correct the validation errors below.');
            } else {
                // Catch any unexpected thrown errors (network, etc.)
                setError(resData?.message || 'A critical network error occurred. Please try again.');
            }

        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setResetLoading(true);
        setResetError('');

        try {
            // Assuming authAPI.forgotPassword throws on failure
            await authAPI.forgotPassword?.(resetEmail); 
            setResetSuccess(true);
        } catch (err) {
            setResetError(
                err.response?.data?.message || 
                'Failed to send reset email. Please try again or contact support.'
            );
        } finally {
            setResetLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleBackToLogin = () => {
        setShowForgotPassword(false);
        setResetEmail('');
        setResetSuccess(false);
        setResetError('');
    };
    
    const hasFieldErrors = Object.keys(fieldErrors).length > 0;

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Left Side - Branding (no changes) */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url(/assets/factory-background.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-400/95 via-blue-900/90 to-slate-600"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTQgMTZ2Mmgydi0yaC0yem00LTR2Mmgydi0iaC0yem00LTR2Mmgydi0iaC0yem00LTR2Mmgydi0iaC0yem00LTR2Mmgydi0iaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
            </div>

            <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-12 text-white">
                <div>
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="p-2 bg-blue-500 rounded-lg">
                            <Factory className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">SAGMECOM</h1>
                            <p className="text-sm text-blue-200">Industrial Management System</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6 mt-16">
                        <h2 className="text-4xl font-bold leading-tight">
                            Streamline Your<br />Factory Operations
                        </h2>
                        <p className="text-lg text-slate-300 max-w-md">
                            Comprehensive industrial storage and inventory management platform designed for modern manufacturing facilities.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Shield className="h-5 w-5 text-blue-400" />
                            <span className="text-sm font-semibold">Secure</span>
                        </div>
                        <p className="text-xs text-slate-400">Enterprise-grade security</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="h-5 w-5 text-green-400" />
                            <span className="text-sm font-semibold">Efficient</span>
                        </div>
                        <p className="text-xs text-slate-400">Real-time analytics</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-purple-400" />
                            <span className="text-sm font-semibold">Collaborative</span>
                        </div>
                        <p className="text-xs text-slate-400">Team management</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login/Forgot Password Form */}
            <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center space-x-3 mb-8 text-white">
                        <div className="p-2 bg-blue-500 rounded-lg">
                            <Factory className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">SAGMECOM</h1>
                            <p className="text-xs text-blue-200">Industrial Management</p>
                        </div>
                    </div>

                    <Card className="border-slate-200 dark:border-slate-700 shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
                        {!showForgotPassword ? (
                            // Login Form
                            <>
                                <CardHeader className="text-center space-y-2">
                                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                                    <CardDescription>
                                        Sign in to access your factory dashboard
                                    </CardDescription>
                                </CardHeader>
                                
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Error Display for ALL errors (401/422/Network) */}
                                        {(error || hasFieldErrors) && (
                                            <Alert variant="destructive">
                                                <AlertTriangle className="h-4 w-4" />
                                                <AlertTitle>Login Failed</AlertTitle>
                                                <AlertDescription>{error}</AlertDescription>
                                            </Alert>
                                        )}
                                        
                                        {/* Email Input */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="admin@sagmecom.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                className="h-11"
                                                autoComplete="email"
                                                aria-invalid={!!fieldErrors.email}
                                            />
                                            {fieldErrors.email && (
                                                <p className="text-sm font-medium text-red-500 mt-1">
                                                    {fieldErrors.email}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Password Input */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Enter your password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={loading}
                                                    className="pr-10 h-11"
                                                    autoComplete="current-password"
                                                    aria-invalid={!!fieldErrors.password}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={togglePasswordVisibility}
                                                    disabled={loading}
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                    <span className="sr-only">
                                                        {showPassword ? 'Hide password' : 'Show password'}
                                                    </span>
                                                </Button>
                                            </div>
                                            {fieldErrors.password && (
                                                <p className="text-sm font-medium text-red-500 mt-1">
                                                    {fieldErrors.password}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <Button 
                                            type="submit" 
                                            className="w-full h-11 bg-blue-600 hover:bg-blue-700" 
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Signing in...
                                                </>
                                            ) : (
                                                'Sign In'
                                            )}
                                        </Button>
                                    </form>
                                    
                                    <div className="mt-4 text-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPassword(true)}
                                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    
                                </CardContent>
                            </>
                        ) : (
                            // Forgot Password Form (no changes)
                            <>
                                <CardHeader className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleBackToLogin}
                                            className="p-0 h-auto hover:bg-transparent"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                                    </div>
                                    <CardDescription>
                                        {!resetSuccess 
                                            ? "Enter your email address and we'll send you a link to reset your password."
                                            : "Check your email for the reset link."
                                        }
                                    </CardDescription>
                                </CardHeader>
                                
                                <CardContent>
                                    {!resetSuccess ? (
                                        <form onSubmit={handleForgotPassword} className="space-y-4">
                                            {resetError && (
                                                <Alert variant="destructive">
                                                    <AlertDescription>{resetError}</AlertDescription>
                                                </Alert>
                                            )}
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="reset-email">Email Address</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="reset-email"
                                                        type="email"
                                                        placeholder="admin@sagmecom.com"
                                                        value={resetEmail}
                                                        onChange={(e) => setResetEmail(e.target.value)}
                                                        required
                                                        disabled={resetLoading}
                                                        className="h-11 pl-10"
                                                        autoComplete="email"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <Button 
                                                type="submit" 
                                                className="w-full h-11 bg-blue-600 hover:bg-blue-700" 
                                                disabled={resetLoading}
                                            >
                                                {resetLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    'Send Reset Link'
                                                )}
                                            </Button>
                                        </form>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex flex-col items-center justify-center py-6 space-y-4">
                                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                                </div>
                                                <div className="text-center space-y-2">
                                                    <p className="font-medium">Reset link sent!</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        We've sent a password reset link to <span className="font-medium">{resetEmail}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <Button 
                                                onClick={handleBackToLogin}
                                                variant="outline"
                                                className="w-full h-11"
                                            >
                                                Back to Sign In
                                            </Button>
                                        </div>
                                    )}
                                    
                                    {!resetSuccess && (
                                        <div className="mt-6 text-center">
                                            <p className="text-sm text-muted-foreground">
                                                Remember your password?{' '}
                                                <button
                                                    type="button"
                                                    onClick={handleBackToLogin}
                                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                                                >
                                                    Sign in
                                                </button>
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </>
                        )}
                    </Card>

                    <p className="mt-6 text-center text-xs text-slate-300">
                        © 2025 Sagmecom. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;