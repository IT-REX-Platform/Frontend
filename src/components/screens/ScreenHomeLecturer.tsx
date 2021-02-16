import { Button, Text, View } from "react-native";

import React from "react";
import { CreateCourseComponent } from "../CreateCourseComponent";
import { useNavigation } from "@react-navigation/native";
import { NavigationRoutes } from "../../constants/NavigationRoutes";
import { LocalizationContext } from "../../App";
import i18n from "../../locales";

export const ScreenHomeLecturer: React.FC = () => {
    const navigation = useNavigation();
    const { t } = React.useContext(LocalizationContext);

    return (
        <View>
            <Text>{i18n.t("itrex.homeLecturerText")}</Text>
            <CreateCourseComponent />
            <Button
                title="Go to Upload Video"
                onPress={() => navigation.navigate(NavigationRoutes.ROUTE_UPLOAD_VIDEO)}
            />
        </View>
    );
};
