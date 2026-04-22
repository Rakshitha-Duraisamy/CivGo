import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to CivGo",
      "submit_complaint": "Submit Complaint",
      "dashboard": "Dashboard",
      "reports": "Reports",
    }
  },
  ta: {
    translation: {
      "welcome": "சிவ்-கோவுக்கு வரவேற்கிறோம்",
      "submit_complaint": "புகாரை சமர்ப்பிக்கவும்",
      "dashboard": "முகப்புப் பலகை",
      "reports": "அறிக்கைகள்",
    }
  },
  hi: {
    translation: {
      "welcome": "CivGo में आपका स्वागत है",
      "submit_complaint": "शिकायत दर्ज करें",
      "dashboard": "डैशबोर्ड",
      "reports": "रिपोर्ट",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
