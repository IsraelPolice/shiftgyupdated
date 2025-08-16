import React from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import AccessibilityButton from './AccessibilityButton';
import AccessibilityWidget from './AccessibilityWidget';

export default function AccessibilityManager() {
  const { isWidgetVisible, showWidget, hideWidget } = useAccessibility();
  
  return (
    <>
      {isWidgetVisible ? (
        <AccessibilityWidget onClose={hideWidget} />
      ) : (
        <AccessibilityButton onClick={showWidget} />
      )}
    </>
  );
}