import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import LogoIcon from './logo.svg';

const Logo = (props: { width?: number, height?: number, fillColor?: string, style?: StyleProp<ViewStyle> })=> {
    var width: number = (props.width == undefined)? 64: props.width;
    var height: number = (props.height == undefined)? 64: props.height;
    return(<LogoIcon width={width} height={height} style={props.style} />);
};

export {
    Logo
};