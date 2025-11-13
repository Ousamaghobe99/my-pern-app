import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Assuming you might have AlertTitle
import { authAPI } from '@/lib/api'; // Ensure this path is correct
import { Loader2, AlertTriangle } from 'lucide-react';

const ChangePasswordFirstLogin = () => {
    // State to hold form values
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    // State for general error messages (e.g., "Current password is incorrect")
    const [error, setError] = useState('');
    // State for field-specific validation errors (from 422 response)a
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Clear field-specific error when the user starts typing in that field
        setFieldErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});
        setSuccess(false);

        const tempToken = sessionStorage.getItem('tempToken');
        const tempUserId = sessionStorage.getItem('tempUserId');

        // Frontend validation checks
        if (!tempToken) {
            setError('Session expired. Please log in again. (Token Missing)');
            setLoading(false);
            return;
        }
        if (!tempUserId) {
            setError('Missing user data. Please log in again. (UserID Missing)');
            setLoading(false);
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('New password and confirmation password do not match.');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                userId: tempUserId,
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            };

            const response = await authAPI.changePasswordFirstLogin(payload, tempToken);
            
            if (response.data.success) {
                setSuccess(true);
                // Clear session items upon success
                sessionStorage.removeItem('tempToken');
                sessionStorage.removeItem('tempUserId');

                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        } catch (err) {
            const resData = err.response?.data;
            
            if (err.response?.status === 422 && resData?.errors && Array.isArray(resData.errors)) {
                // --- 422 VALIDATION ERROR HANDLER ---
                // The backend sends an array of objects like: [{ field: 'newPassword', message: '...' }]
                const newErrors = {};
                resData.errors.forEach(error => {
                    newErrors[error.field] = error.message;
                });
                setFieldErrors(newErrors);
                
                // Display a general message that validation failed
                setError('Please review and correct the errors below.');
            } else {
                // --- GENERAL ERROR HANDLER (401, 500, etc.) ---
                // This catches errors like "Current password is incorrect" (401 from your service)
                setError(resData?.message || 'Failed to update password. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const hasFieldErrors = Object.keys(fieldErrors).length > 0;

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-4">
                <h1 className="text-2xl font-semibold text-center">Change Your Password</h1>
                <p className="text-sm text-gray-500 text-center">
                    Please set a new password before continuing.
                </p>

                {/* --- ERROR DISPLAY --- */}

                {/* Alert for general errors or validation summary */}
                {(error || hasFieldErrors) && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Password Change Failed</AlertTitle>
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
                )}
                
                {success && (
                    <Alert>
                        <AlertDescription>Password updated successfully! Redirecting to login...</AlertDescription>
                    </Alert>
                )}

                {/* --- FORM --- */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Password Input */}
                    <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={passwords.currentPassword}
                            onChange={handleChange}
                            required
                            aria-invalid={!!fieldErrors.currentPassword}
                        />
                        {fieldErrors.currentPassword && (
                            <p className="text-sm font-medium text-red-500 mt-1">
                                {fieldErrors.currentPassword}
                            </p>
                        )}
                    </div>
                    
                    {/* New Password Input */}
                    <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            required
                            aria-invalid={!!fieldErrors.newPassword}
                        />
                        {fieldErrors.newPassword && (
                            <p className="text-sm font-medium text-red-500 mt-1">
                                {fieldErrors.newPassword}
                            </p>
                        )}
                    </div>
                    
                    {/* Confirm New Password Input */}
                    <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            required
                            // Backend may not send an error for confirmPassword, relying on frontend check
                            aria-invalid={!!fieldErrors.confirmPassword} 
                        />
                        {fieldErrors.confirmPassword && (
                            <p className="text-sm font-medium text-red-500 mt-1">
                                {fieldErrors.confirmPassword}
                            </p>
                        )}
                    </div>
                    
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : 'Update Password'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordFirstLogin;