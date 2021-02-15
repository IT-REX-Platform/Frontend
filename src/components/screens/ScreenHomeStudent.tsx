import { Text, View } from "react-native";

import React from "react";
import { LocalizationContext } from "../../App";
import i18n from "../../locales";

export const ScreenHomeStudent: React.FC = () => {
    const { t } = React.useContext(LocalizationContext);

    return (
        <View>
            <Text>{i18n.t("itrex.homeStudentText")}</Text>
        </View>
    );
};
