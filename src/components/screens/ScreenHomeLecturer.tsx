import { Button, Text, View } from "react-native";

import React from "react";
import { CreateCourseComponent } from "../CreateCourseComponent";
import { useNavigation } from "@react-navigation/native";
import { NavigationRoutes } from "../../constants/NavigationRoutes";

export const ScreenHomeLecturer: React.FC = () => {
    const navigation = useNavigation();

    return (
        <View>
            <CreateCourseComponent />
            <Button
                title="Go to Upload Video"
                onPress={() => navigation.navigate(NavigationRoutes.ROUTE_UPLOAD_VIDEO)}
            />
        </View>
    );
};
