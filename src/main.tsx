import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './i18n'; // Initialize i18n
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { PresenceProvider } from './contexts/PresenceContext';
import { BreakProvider } from './contexts/BreakContext';
import { ReportsProvider } from './contexts/ReportsContext';
import { UpgradeProvider } from './contexts/UpgradeContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { EventsProvider } from './contexts/EventsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { HybridWorkProvider } from './contexts/HybridWorkContext';
import { AIProvider } from './contexts/AIContext';
import { TutorialProvider } from './contexts/TutorialContext';
import { ModernThemeProvider } from './components/ui/ThemeProvider';
import { CompanySettingsProvider } from './contexts/CompanySettingsContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <UpgradeProvider>
            <ModernThemeProvider>
              <CompanySettingsProvider>
                <CurrencyProvider>
                  <SettingsProvider>
                    <ThemeProvider>
                      <AccessibilityProvider>
                        <PresenceProvider>
                          <EventsProvider>
                            <HybridWorkProvider>
                              <AIProvider>
                                <TutorialProvider>
                                  <BreakProvider>
                                    <ReportsProvider>
                                      <App />
                                    </ReportsProvider>
                                  </BreakProvider>
                                </TutorialProvider>
                              </AIProvider>
                            </HybridWorkProvider>
                          </EventsProvider>
                        </PresenceProvider>
                      </AccessibilityProvider>
                    </ThemeProvider>
                  </SettingsProvider>
                </CurrencyProvider>
              </CompanySettingsProvider>
            </ModernThemeProvider>
          </UpgradeProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);