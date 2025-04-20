import React, { useEffect } from "react";
import Cookies from 'js-cookie';
import localeEn from "@/dictionaries/en.json";
import localeZh from "@/dictionaries/zh.json";

const i18nContext = React.createContext({
  lang: 'en',
  messages: localeEn,
} as {
  lang: string;
  messages: Record<string, any>;
});

export function I18nProvider({ children, locale }: { children: React.ReactNode; locale: string }) {

  const localeMap: Record<string, any> = {
    'en': localeEn,
    'zh': localeZh,
  }
  const [messages, setMessages] = React.useState(localeMap[locale] || localeEn);

  useEffect(() => {
    Cookies.set('lang', locale, { expires: 7, path: '/' });
  })

  return (
    <i18nContext.Provider value={{lang: locale, messages}}>
      {children}
    </i18nContext.Provider>
  );
}

export function useI18n() {
  const { lang, messages} = React.useContext(i18nContext);
  
  return {
    lang,
    trans(key: string, replace: Record<string, any> = {}) {
      const str = messages[key] || key;
      const parts = Object.keys(replace).reduce((acc: (string | React.ReactNode)[], replaceKey) => {
        const newParts: (string | React.ReactNode)[] = [];
        acc.forEach(part => {
          if (typeof part === 'string') {
            const regex = new RegExp(`{{${replaceKey}}}`, 'g');
            const splitParts = part.split(regex);
            splitParts.forEach((splitPart, index) => {
              newParts.push(splitPart);
              if (index < splitParts.length - 1) {
                newParts.push(replace[replaceKey]);
              }
            });
          } else {
            newParts.push(part);
          }
        });
        return newParts;
      }, [str]);

      return parts.length > 1 ? <>{...parts}</> : parts[0];
    }
  }
}
