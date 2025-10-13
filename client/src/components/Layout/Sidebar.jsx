import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  MapPin,
  Wrench,
  Users,
  Settings,
  BarChart3,
  Factory,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '../ui/button';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      permission: null
    },
    {
      title: 'Interfaces',
      href: '/interfaces',
      icon: Package,
      permission: 'interface:read'
    },
    {
      title: 'Locations',
      href: '/locations',
      icon: MapPin,
      permission: 'location:read'
    },
    {
      title: 'Maintenance',
      href: '/maintenance',
      icon: Wrench,
      permission: 'maintenance:read'
    },
    {
      title: 'Users',
      href: '/users',
      icon: Users,
      permission: 'user:read'
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      permission: 'reports:read'
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      permission: null
    }
  ];

  const filteredNavigation = navigationItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-2 p-6 border-b border-sidebar-border">
            <Factory className="h-8 w-8 text-sidebar-primary" />
            <div>
              <h1 className="text-lg font-semibold text-sidebar-foreground">
                Factory Storage
              </h1>
              <p className="text-xs text-sidebar-foreground/60">
                Management System
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center">
                <User className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user?.role?.name}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

