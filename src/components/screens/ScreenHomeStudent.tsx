import React from "react";
import { ITREXRoles } from "../../constants/ITREXRoles";
import { LocalizationContext } from "../Context";
import { ScreenHome } from "./ScreenHome";

export const ScreenHomeStudent: React.FC = () => {
    React.useContext(LocalizationContext);
    return (
        <>
            <ScreenHome userRole={ITREXRoles.ROLE_STUDENT}></ScreenHome>
        </>
    );
};
