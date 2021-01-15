import React from "react";
import TestComponent from "./src/components/TestComponent";
import { CreateCourseComponent } from "./src/components/CreateCourseComponent";

export default function App(): JSX.Element {
    return (
        <>
            <CreateCourseComponent></CreateCourseComponent>
            <TestComponent></TestComponent>
        </>
    );
}
