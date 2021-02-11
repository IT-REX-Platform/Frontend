import { ReactElement } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { loggerFactory } from "../logger/LoggerConfig";
import { NavigationRoutes } from "./constants/NavigationRoutes";
import { Button, Linking } from "react-native";
import i18n from "./locales/index";
import * as Localization from "expo-localization";
import DrawerNavigator from "./constants/DrawNavigation";
import React from "react";

const loggerService = loggerFactory.getLogger("service.App");

export const LocalizationContext = React.createContext({});

function App(): ReactElement {
    Linking.addEventListener("login", (url) => {
        loggerService.trace("URL" + url);
    });

    // Language Switch (save locale as const)
    const [locale, setLocale] = React.useState(Localization.locale);
    i18n.locale = locale;
    const localizationContext = React.useMemo(
        () => ({
            t: (scope: i18n.Scope, options: i18n.TranslateOptions | undefined) => i18n.t(scope, { locale, ...options }),
            locale,
            setLocale,
        }),
        [locale]
    );

    return (
        <LocalizationContext.Provider value={localizationContext}>
            <NavigationContainer linking={NavigationRoutes.linking}>
                <DrawerNavigator />
                {locale == "en" || locale == "en-GB" || locale == "en-US" ? (
                    <Button title={i18n.t("itrex.switchLangDE")} onPress={() => setLocale("de-DE")} color="#4FAFA7" />
                ) : (
                    <Button title={i18n.t("itrex.switchLangEN")} onPress={() => setLocale("en")} color="#4FAFA7" />
                )}
            </NavigationContainer>
        </LocalizationContext.Provider>
    );
}
export default App;
