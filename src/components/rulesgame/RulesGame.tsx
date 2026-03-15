import React from "react";
import { useTranslation } from "react-i18next";

interface RulesGameProps {
    onClickBack: () => void;
}

const RulesGame: React.FC<RulesGameProps> = ({ onClickBack }) => {
    const { t } = useTranslation();

    const handleClickBack = () => {
        onClickBack();
    }

    return (
        <>
            <h3>{t('rules.title')}</h3>
            <div className="rules">
                <p><u>{t('rules.header')}</u> <br />
                {t('rules.p1')}</p>
                <p>{t('rules.p2')}</p>
                <p>{t('rules.p3')}</p>
                <p><u>{t('rules.p4_header')} </u><br />
                {t('rules.p4_text')}
                </p>
                <p><u>{t('rules.p5_header')}</u> <br />
                {t('rules.p5_text')}</p>

                <p><u>{t('rules.p6_header')}</u> <br />
                    {t('rules.p6_item1')}<br />
                    {t('rules.p6_item2')}<br />
                    {t('rules.p6_item3')}<br />
                </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                <button className='login' onClick={handleClickBack}>{t('rules.back')}</button>
            </div>
        </>
    )
}

export default RulesGame;
