import React from "react";
import { ITREXRoles } from "../../constants/ITREXRoles";
import { ScreenHome } from "./ScreenHome";

export const ScreenHomeStudent: React.FC = () => {
    return (
        <>
            <ScreenHome userRole={ITREXRoles.ROLE_STUDENT}></ScreenHome>
        </>
    );
};
