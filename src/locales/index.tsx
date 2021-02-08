import i18n from "i18n-js";

import { en } from "./en";
import { de } from "./de";

// mapping of language codes to files (en/de)
i18n.translations = {
    default: en,
    "de-DE": de,
    de: de,
    "en-US": en,
    "en-GB": en,
    en: en,
};

i18n.fallbacks = true;

export default i18n;
