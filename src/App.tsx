import { ReactElement } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { loggerFactory } from "../logger/LoggerConfig";
import { NavigationRoutes } from "./constants/navigators/NavigationRoutes";
import { Button, Linking, TouchableOpacity, Text, StyleSheet, ImageBackground } from "react-native";
import i18n from "./locales/index";
import * as Localization from "expo-localization";
import DrawerNavigator from "./constants/navigators/DrawNavigation";
import React from "react";
import { dark } from "./constants/themes/dark";

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
            <ImageBackground source={require("./constants/images/Background_forest.svg")} style={styles.image}>
                <NavigationContainer linking={NavigationRoutes.linking}>
                    <DrawerNavigator />
                    {locale == "en" || locale == "en-GB" || locale == "en-US" ? (
                        <>
                            <TouchableOpacity onPress={() => setLocale("de-DE")} style={styles.appButtonContainer}>
                                <Text style={styles.buttonText}>{i18n.t("itrex.switchLangDE")}</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity onPress={() => setLocale("en")} style={styles.appButtonContainer}>
                                <Text style={styles.buttonText}>{i18n.t("itrex.switchLangEN")}</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </NavigationContainer>
            </ImageBackground>
        </LocalizationContext.Provider>
    );
}

const styles = StyleSheet.create({
    appButtonContainer: {
        elevation: 8,
        backgroundColor: dark.theme.blueGreen,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    buttonText: {
        alignContent: "center",
        textAlign: "center",
        fontSize: 15,
        color: dark.theme.darkBlue1,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
});

export default App;
