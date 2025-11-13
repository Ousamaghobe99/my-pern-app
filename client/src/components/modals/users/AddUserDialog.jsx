import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { validateUserField } from "@/lib/userValidation";

export const AddUserDialog = ({ isOpen, onClose, newUser, setNewUser, onSubmit, isLoading, formOptions }) => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  if (!formOptions) return null;

  // Validate field on blur
  const handleBlur = (fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    const error = validateUserField(fieldName, newUser[fieldName]);
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  // Clear error when user starts typing
  const handleChange = (fieldName, value) => {
    setNewUser({ ...newUser, [fieldName]: value });
    if (touchedFields[fieldName]) {
      const error = validateUserField(fieldName, value);
      setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    const allFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'matricule', 'roleId'];
    const newTouched = {};
    const newErrors = {};
    
    allFields.forEach(field => {
      newTouched[field] = true;
      const error = validateUserField(field, newUser[field]);
      if (error) newErrors[field] = error;
    });
    
    setTouchedFields(newTouched);
    setFieldErrors(newErrors);

    // If there are client-side errors, don't submit
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    // Submit the form and get result
    const result = await onSubmit(newUser);
    
    // Handle result
    if (result?.success) {
      // Success - reset and close
      setFieldErrors({});
      setTouchedFields({});
    } else if (result?.error) {
      // Backend error - show which field has the problem
      const errorMessage = result.error.toLowerCase();
      
      // Check if error mentions specific field
      if (errorMessage.includes('email')) {
        setFieldErrors(prev => ({ ...prev, email: result.error }));
        setTouchedFields(prev => ({ ...prev, email: true }));
      } else if (errorMessage.includes('matricule')) {
        setFieldErrors(prev => ({ ...prev, matricule: result.error }));
        setTouchedFields(prev => ({ ...prev, matricule: true }));
      }
      // General error is already shown via toast from handleCreateUser
    }
  };

  const handleClose = () => {
    setFieldErrors({});
    setTouchedFields({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
          {/* First Name */}
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={newUser.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              placeholder="John"
              className={touchedFields.firstName && fieldErrors.firstName ? 'border-red-500' : ''}
            />
            {touchedFields.firstName && fieldErrors.firstName && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={newUser.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              placeholder="Doe"
              className={touchedFields.lastName && fieldErrors.lastName ? 'border-red-500' : ''}
            />
            {touchedFields.lastName && fieldErrors.lastName && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.lastName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={newUser.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="john@example.com"
              className={touchedFields.email && fieldErrors.email ? 'border-red-500' : ''}
            />
            {touchedFields.email && fieldErrors.email && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={newUser.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              onBlur={() => handleBlur('phoneNumber')}
              placeholder="+216 12 345 678"
              className={touchedFields.phoneNumber && fieldErrors.phoneNumber ? 'border-red-500' : ''}
            />
            {touchedFields.phoneNumber && fieldErrors.phoneNumber && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.phoneNumber}
              </p>
            )}
            {!fieldErrors.phoneNumber && (
              <p className="text-xs text-muted-foreground mt-1">Minimum 10 digits required</p>
            )}
          </div>

          {/* Matricule */}
          <div>
            <Label htmlFor="matricule">Matricule *</Label>
            <Input
              id="matricule"
              value={newUser.matricule}
              onChange={(e) => handleChange('matricule', e.target.value.toUpperCase())}
              onBlur={() => handleBlur('matricule')}
              placeholder="ABC123"
              className={touchedFields.matricule && fieldErrors.matricule ? 'border-red-500' : ''}
            />
            {touchedFields.matricule && fieldErrors.matricule && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.matricule}
              </p>
            )}
            {!fieldErrors.matricule && (
              <p className="text-xs text-muted-foreground mt-1">Uppercase letters and numbers only (3-20 chars)</p>
            )}
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role">Role *</Label>
            <Select
              onValueChange={(value) => handleChange('roleId', value)}
              value={newUser.roleId}
            >
              <SelectTrigger className={touchedFields.roleId && fieldErrors.roleId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.roleOptions.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touchedFields.roleId && fieldErrors.roleId && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.roleId}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};