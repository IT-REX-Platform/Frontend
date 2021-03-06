import i18n from "../locales";

export type ILocalizationContext = {
    t(scope: i18n.Scope, options?: i18n.TranslateOptions): string;
    locale: string;
    setLocale(arg0: string): void;
};
