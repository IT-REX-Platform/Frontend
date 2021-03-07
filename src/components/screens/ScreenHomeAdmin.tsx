import React from "react";
import { ScreenHome } from "./ScreenHome";
import { ITREXRoles } from "../../constants/ITREXRoles";

export const ScreenHomeAdmin: React.FC = () => {
    return (
        <>
            <ScreenHome userRole={ITREXRoles.ROLE_ADMIN}></ScreenHome>
        </>
    );
};
