import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Calendar, 
  Users, 
  Settings, 
  Download,
  Upload,
  Filter,
  Search,
  X
} from 'lucide-react';
import { useModernTheme } from './ThemeProvider';
import { useLanguage } from '../../contexts/LanguageContext';
import { ModernButton } from './ModernButton';

interface FloatingAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

interface FloatingActionToolbarProps {
  actions?: FloatingAction[];
  position?: 'left' | 'right';
  className?: string;
}

export function FloatingActionToolbar({ 
  actions = [], 
  position = 'left',
  className = '' 
}: FloatingActionToolbarProps) {
  const { colors, shadows, borderRadius, spacing } = useModernTheme();
  const { isRTL, t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const defaultActions: FloatingAction[] = [
    {
      id: 'create',
      icon: <Plus className="w-5 h-5" />,
      label: t('common.add'),
      onClick: () => console.log('Create action'),
      variant: 'primary'
    },
    {
      id: 'calendar',
      icon: <Calendar className="w-5 h-5" />,
      label: 'Calendar',
      onClick: () => console.log('Calendar action'),
      variant: 'secondary'
    },
    {
      id: 'users',
      icon: <Users className="w-5 h-5" />,
      label: 'Team',
      onClick: () => console.log('Users action'),
      variant: 'ghost'
    },
    {
      id: 'filter',
      icon: <Filter className="w-5 h-5" />,
      label: 'Filter',
      onClick: () => console.log('Filter action'),
      variant: 'ghost'
    },
    {
      id: 'export',
      icon: <Download className="w-5 h-5" />,
      label: 'Export',
      onClick: () => console.log('Export action'),
      variant: 'ghost'
    },
  ];

  const allActions = actions.length > 0 ? actions : defaultActions;

  const toolbarStyles = {
    position: 'fixed' as const,
    [position === 'left' ? (isRTL ? 'right' : 'left') : (isRTL ? 'left' : 'right')]: spacing.lg,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 40,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing.sm,
    padding: spacing.md,
    background: `linear-gradient(135deg, ${colors.glass.medium} 0%, ${colors.glass.dark} 100%)`,
    backdropFilter: 'blur(10px)',
    borderRadius: borderRadius['2xl'],
    border: `1px solid ${colors.glass.light}`,
    boxShadow: shadows.glass,
  };

  const toggleButtonStyles = {
    width: '3rem',
    height: '3rem',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[600],
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.lg,
    transition: 'all 0.3s ease',
  };

  return (
    <motion.div
      style={toolbarStyles}
      className={`floating-action-toolbar ${className}`}
      initial={{ opacity: 0, x: position === 'left' ? -100 : 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Toggle Button */}
      <motion.button
        style={toggleButtonStyles}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isExpanded ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </motion.div>
      </motion.button>

      {/* Action Buttons */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col gap-2"
          >
            {allActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <ModernButton
                  variant={action.variant || 'ghost'}
                  size="sm"
                  icon={action.icon}
                  onClick={action.onClick}
                  className="w-full justify-start"
                  title={action.label}
                >
                  <span className="hidden lg:inline">{action.label}</span>
                </ModernButton>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}