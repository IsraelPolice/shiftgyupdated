import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, HelpCircle } from 'lucide-react';
import { useModernTheme } from './ThemeProvider';
import { useLanguage } from '../../contexts/LanguageContext';

interface FloatingChatBubbleProps {
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

export function FloatingChatBubble({ 
  position = 'bottom-right',
  className = '' 
}: FloatingChatBubbleProps) {
  const { colors, shadows, borderRadius, spacing, animations } = useModernTheme();
  const { isRTL, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const bubbleStyles = {
    position: 'fixed' as const,
    [position.includes('right') ? (isRTL ? 'left' : 'right') : (isRTL ? 'right' : 'left')]: spacing.lg,
    bottom: spacing.lg,
    zIndex: 50,
  };

  const chatButtonStyles = {
    width: '3.5rem',
    height: '3.5rem',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[600],
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.xl,
    transition: animations.transition.normal,
  };

  const chatWindowStyles = {
    width: '20rem',
    height: '24rem',
    backgroundColor: 'white',
    borderRadius: borderRadius.xl,
    boxShadow: shadows.xl,
    border: `1px solid ${colors.neutral[200]}`,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    marginBottom: spacing.md,
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending logic here
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <motion.div
      style={bubbleStyles}
      className={`floating-chat-bubble ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={chatWindowStyles}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Header */}
            <div 
              style={{
                padding: spacing.md,
                backgroundColor: colors.primary[600],
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <HelpCircle className="w-5 h-5" />
                <span style={{ fontWeight: 600 }}>
                  {isRTL ? 'תמיכה' : 'Support'}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: spacing.xs,
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              style={{
                flex: 1,
                padding: spacing.md,
                backgroundColor: colors.neutral[50],
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <MessageCircle className="w-12 h-12 text-gray-400 mb-4" />
              <h3 style={{ 
                fontSize: '1rem', 
                fontWeight: 600, 
                color: colors.neutral[800],
                marginBottom: spacing.sm 
              }}>
                {isRTL ? 'איך נוכל לעזור?' : 'How can we help?'}
              </h3>
              <p style={{ 
                fontSize: '0.875rem', 
                color: colors.neutral[600],
                lineHeight: 1.5 
              }}>
                {isRTL 
                  ? 'שלח לנו הודעה ונחזור אליך בהקדם'
                  : 'Send us a message and we\'ll get back to you soon'
                }
              </p>
            </div>

            {/* Input Area */}
            <div 
              style={{
                padding: spacing.md,
                borderTop: `1px solid ${colors.neutral[200]}`,
                display: 'flex',
                gap: spacing.sm,
              }}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isRTL ? 'הקלד הודעה...' : 'Type a message...'}
                style={{
                  flex: 1,
                  padding: spacing.sm,
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: borderRadius.md,
                  fontSize: '0.875rem',
                  outline: 'none',
                  direction: isRTL ? 'rtl' : 'ltr',
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                style={{
                  padding: spacing.sm,
                  backgroundColor: colors.primary[600],
                  color: 'white',
                  border: 'none',
                  borderRadius: borderRadius.md,
                  cursor: message.trim() ? 'pointer' : 'not-allowed',
                  opacity: message.trim() ? 1 : 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        style={chatButtonStyles}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </motion.div>
      </motion.button>
    </motion.div>
  );
}