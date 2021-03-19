import * as React from "react";
import { StyleSheet } from "react-native";
import Select from "react-select";
import { dark } from "../../constants/themes/dark";

interface DropdownProps {
    options?: any;
    defaultValue?: any;
    menuPortalTarget?: any;
    menuPosition?: any;
    onChange?: (event: string) => any;
}

export const DropDown: React.FC<DropdownProps> = (props) => {
    return (
        <Select
            options={props.options}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
            menuPortalTarget={props.menuPortalTarget}
            menuPosition={props.menuPosition}
            theme={(theme) => ({
                ...theme,
                borderRadius: 5,
                background: dark.theme.grey,
                colors: {
                    ...theme.colors,
                    primary25: dark.Opacity.darkBlue1,
                    primary: dark.Opacity.pink,
                },
            })}
            styles={{
                container: () => ({
                    width: 200,
                    marginLeft: "5px",
                }),
            }}
        />
    );
};

const styles = StyleSheet.create({});
