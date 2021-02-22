import { Button, Text, View } from "react-native";

import React from "react";
import { CreateCourseComponent } from "../CreateCourseComponent";
import { useNavigation } from "@react-navigation/native";
import { NavigationRoutes } from "../../constants/NavigationRoutes";
import { LocalizationContext } from "../../App";
import i18n from "../../locales";

const courseId = "af45cc33-5ea8-45aa-b878-7105f24343a2"; // TODO: get course ID from context.

export const ScreenHomeLecturer: React.FC = () => {
    const navigation = useNavigation();
    const { t } = React.useContext(LocalizationContext);

    return (
        <View>
            <Text>{i18n.t("itrex.homeLecturerText")}</Text>
            <CreateCourseComponent />
            <Button
                title={i18n.t("itrex.videoPool")}
                onPress={() => navigation.navigate(NavigationRoutes.ROUTE_VIDEO_POOL, { courseId })}
            />
        </View>
    );
};
