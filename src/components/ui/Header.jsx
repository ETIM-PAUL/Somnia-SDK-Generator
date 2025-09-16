import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      name: 'Contract Input',
      path: '/contract-input-dashboard',
      icon: 'FileCode',
      description: 'Smart contract validation and verification'
    },
    {
      name: 'SDK Configuration',
      path: '/sdk-configuration',
      icon: 'Settings',
      description: 'Language selection and generation parameters'
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 px-4 md:px-20 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 mr-8">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Icon name="Code2" size={20} color="white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground leading-none">
              Somnia SDK
            </span>
            <span className="text-xs text-muted-foreground leading-none mt-0.5">
              Generator
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 flex-1">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon 
                name={item?.icon} 
                size={16} 
                color="currentColor" 
                strokeWidth={2}
              />
              <span>{item?.name}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="ghost" size="sm" iconName="HelpCircle" iconPosition="left">
            Help
          </Button>
          <Button variant="outline" size="sm" iconName="Github" iconPosition="left">
            GitHub
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            iconName={isMobileMenuOpen ? "X" : "Menu"}
          />
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="px-6 py-4 space-y-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                <Icon 
                  name={item?.icon} 
                  size={18} 
                  color="currentColor" 
                  strokeWidth={2}
                />
                <div className="flex flex-col">
                  <span>{item?.name}</span>
                  <span className="text-xs opacity-75">{item?.description}</span>
                </div>
              </Link>
            ))}
            
            {/* Mobile Actions */}
            <div className="pt-4 mt-4 border-t border-border space-y-2">
              <Button 
                variant="ghost" 
                size="sm" 
                fullWidth 
                iconName="HelpCircle" 
                iconPosition="left"
              >
                Help & Documentation
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                fullWidth 
                iconName="Github" 
                iconPosition="left"
              >
                View on GitHub
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;