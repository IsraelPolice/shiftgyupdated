import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { useModernTheme } from './ThemeProvider';
import { useLanguage } from '../../contexts/LanguageContext';

interface ModernButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

export function ModernButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ModernButtonProps) {
  const { colors, typography, spacing, borderRadius, shadows, animations } = useModernTheme();
  const { isRTL } = useLanguage();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary[600],
          color: 'white',
          border: 'none',
          boxShadow: shadows.md,
          '&:hover': {
            backgroundColor: colors.primary[700],
            boxShadow: shadows.lg,
          }
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary[500],
          color: 'white',
          border: 'none',
          boxShadow: shadows.md,
          '&:hover': {
            backgroundColor: colors.secondary[600],
            boxShadow: shadows.lg,
          }
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: colors.neutral[700],
          border: `1px solid ${colors.neutral[300]}`,
          '&:hover': {
            backgroundColor: colors.neutral[100],
            borderColor: colors.neutral[400],
          }
        };
      case 'glass':
        return {
          background: `linear-gradient(135deg, ${colors.glass.light} 0%, ${colors.glass.medium} 100%)`,
          backdropFilter: 'blur(10px)',
          color: colors.neutral[800],
          border: `1px solid ${colors.glass.light}`,
          boxShadow: shadows.glass,
        };
      case 'danger':
        return {
          backgroundColor: colors.error[500],
          color: 'white',
          border: 'none',
          boxShadow: shadows.md,
          '&:hover': {
            backgroundColor: colors.error[600],
            boxShadow: shadows.lg,
          }
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: `${spacing.sm} ${spacing.md}`,
          fontSize: typography.fontSize.sm,
          height: '2rem',
        };
      case 'lg':
        return {
          padding: `${spacing.lg} ${spacing.xl}`,
          fontSize: typography.fontSize.lg,
          height: '3rem',
        };
      default:
        return {
          padding: `${spacing.md} ${spacing.lg}`,
          fontSize: typography.fontSize.base,
          height: '2.5rem',
        };
    }
  };

  const baseStyles = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    borderRadius: borderRadius.lg,
    fontWeight: typography.fontWeight.medium,
    fontFamily: isRTL ? typography.fontFamily.hebrew : typography.fontFamily.sans,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    transition: animations.transition.normal,
    direction: isRTL ? 'rtl' : 'ltr',
  };

  const iconElement = icon && (
    <span className={`icon ${iconPosition === 'right' && isRTL ? 'order-first' : iconPosition === 'left' && isRTL ? 'order-last' : ''}`}>
      {icon}
    </span>
  );

  return (
    <motion.button
      style={baseStyles}
      className={`modern-button ${className}`}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      )}
      {!loading && iconPosition === 'left' && iconElement}
      <span>{children}</span>
      {!loading && iconPosition === 'right' && iconElement}
    </motion.button>
  );
}