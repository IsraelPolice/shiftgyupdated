import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useModernTheme } from '../ui/ThemeProvider';
import { useLanguage } from '../../contexts/LanguageContext';
import { FloatingActionToolbar } from '../ui/FloatingActionToolbar';
import { FloatingChatBubble } from '../ui/FloatingChatBubble';

interface ModernLayoutWrapperProps {
  children: ReactNode;
  showFloatingActions?: boolean;
  showChatBubble?: boolean;
  className?: string;
}

export function ModernLayoutWrapper({ 
  children, 
  showFloatingActions = true,
  showChatBubble = true,
  className = '' 
}: ModernLayoutWrapperProps) {
  const { colors, spacing } = useModernTheme();
  const { isRTL } = useLanguage();

  const layoutStyles = {
    minHeight: '100vh',
    backgroundColor: colors.neutral[50],
    direction: isRTL ? 'rtl' : 'ltr',
    fontFamily: isRTL ? 'Heebo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
  };

  const contentStyles = {
    position: 'relative' as const,
    zIndex: 1,
  };

  return (
    <motion.div
      style={layoutStyles}
      className={`modern-layout-wrapper ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Pattern */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, ${colors.primary[100]} 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, ${colors.secondary[100]} 0%, transparent 50%)`,
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      {/* Main Content */}
      <div style={contentStyles}>
        {children}
      </div>

      {/* Floating Elements */}
      {showFloatingActions && (
        <FloatingActionToolbar position={isRTL ? 'right' : 'left'} />
      )}
      
      {showChatBubble && (
        <FloatingChatBubble position={isRTL ? 'bottom-left' : 'bottom-right'} />
      )}
    </motion.div>
  );
}