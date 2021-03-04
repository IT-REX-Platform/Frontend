import React from "react";
import { LocalizationContext } from "../Context";
import { ScreenHome } from "./ScreenHome";
import { ITREXRoles } from "../../constants/ITREXRoles";

export const ScreenHomeAdmin: React.FC = () => {
    React.useContext(LocalizationContext);

    return (
        <>
            <ScreenHome userRole={ITREXRoles.ROLE_ADMIN}></ScreenHome>
        </>
    );
};
