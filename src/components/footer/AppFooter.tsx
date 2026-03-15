import React from 'react';
import { useTranslation } from 'react-i18next';

interface Language {
    code: string;
    label: string;
}

const AppFooter: React.FC = () => {
    const { t, i18n } = useTranslation();

    const languages: Language[] = [
        { code: 'cs', label: 'CZ' },
        { code: 'en', label: 'EN' },
        { code: 'sk', label: 'SK' },
        { code: 'de', label: 'DE' },
        { code: 'fr', label: 'FR' },
        { code: 'es', label: 'ES' },
        { code: 'pl', label: 'PL' }
    ];

    const currentLang = (i18n.language || 'en').split('-')[0];

    return (
        <div className="footer">
            <span>{t('app.footer')}</span>
            <div className="footer-lang-container">
                {languages.map((lang, index) => (
                    <span key={lang.code}>
                        <span
                            className={`footer-lang ${currentLang === lang.code ? 'active' : ''}`}
                            onClick={() => i18n.changeLanguage(lang.code)}
                        >
                            {lang.label}
                        </span>
                        {index < languages.length - 1 && <span className="lang-separator">|</span>}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default AppFooter;
