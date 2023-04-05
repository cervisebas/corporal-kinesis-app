import React, { createRef, useContext } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import Color from "color";
import { ThemeContext } from "../providers/ThemeProvider";

type IProps = {
    label: string;
    value: string;
    options: {
        label?: string;
        value: string;
    }[];
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    onChange?: (label: string | undefined, value: string)=>void;
};

const refPicker = createRef<Picker<unknown>>();

export default React.memo(function CustomPicker(props: IProps) {
    const { theme } = useContext(ThemeContext);
    //const borderColor = (props.disabled)? theme.colors.surfaceDisabled: theme.colors.outline;
    const borderColor = theme.colors.outline;

    function _openPicker() {
        if (props.disabled) return;
        refPicker.current?.focus();
    }
    function _onChange(_value: any, index: number) {
        if (props.disabled) return;
        const _find = props.options[index];
        if (props.value == _find.value) return;
        props.onChange?.(_find.label, _find.value);
    }

    return(<View style={[styles.outside, props.style]}>
        <TouchableRipple
            onPress={_openPicker}
            style={[styles.content, {
                borderRadius: theme.roundness,
                borderColor,
                backgroundColor: theme.colors.background
            }]}
        >
            <>
                <Text
                    numberOfLines={1}
                    variant={'bodyLarge'}
                    style={styles.label}
                >{props.label}</Text>
                <Picker
                    ref={refPicker}
                    mode={'dropdown'}
                    style={[styles.picker, {
                        color: (props.disabled)? Color(theme.colors.onSurface).alpha(0.5).rgb().string(): theme.colors.onSurface
                    }]}
                    selectedValue={props.value}
                    onValueChange={_onChange}
                    dropdownIconColor={(theme.dark)? ((props.disabled)? Color(theme.colors.onSurface).alpha(0.5).rgb().string(): theme.colors.onSurface): borderColor}
                    enabled={!props.disabled}
                >
                    {props.options.map((_props)=>(<Picker.Item
                        key={_props.value}
                        label={(_props.label)? _props.label: _props.value}
                        value={_props.value}
                    />))}
                </Picker>
            </>
        </TouchableRipple>
    </View>);
});

const styles = StyleSheet.create({
    outside: {
        paddingTop: 6
    },
    content: {
        flex: 1,
        height: 52,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    label: {
        height: '100%',
        textAlignVertical: 'center',
        paddingLeft: 12
    },
    picker: {
        flex: 1,
        height: 52
    }
});