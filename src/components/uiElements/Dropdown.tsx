/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Select from "react-select";
import { dark } from "../../constants/themes/dark";

interface DropdownProps {
    options?: any;
    defaultValue?: any;
    menuPortalTarget?: any;
    menuPosition?: any;
    onChange?: (event: any) => any;
}

export const DropDown: React.FC<DropdownProps> = (props) => {
    const dropDownStyles = React.useMemo(
        () => ({
            option: (theme: any) => ({
                ...theme,
                color: "black",
                padding: 15,
            }),
            control: (theme: any) => ({
                ...theme,
                width: "100%",
                minWidth: 300,
                background: dark.Opacity.blueGreen,
            }),
            menu: (theme: any) => ({
                ...theme,
                overflow: "hidden",
                border: "2px solid #307580",
                opacity: 0.95,
            }),
            singleValue: (theme: any) => ({
                ...theme,
                color: "white",
                fontWeight: "bold",
            }),
        }),
        []
    );
    return (
        <Select
            options={props.options}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
            menuPortalTarget={props.menuPortalTarget}
            menuPosition={props.menuPosition}
            theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                    ...theme.colors,
                    primary25: dark.Opacity.pink,
                    primary: dark.Opacity.blueGreen,
                },
            })}
            styles={dropDownStyles}
        />
    );
};
