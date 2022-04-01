import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import LogoIcon from './logo.svg';
import AlertIcon from './alertIcon.svg';
import NoCommentIcon from './no-comment.svg';
import NoListIcon from './no-list.svg';

const Logo = (props: { width?: number, height?: number, fillColor?: string, style?: StyleProp<ViewStyle> })=> {
    var width: number = (props.width == undefined)? 64: props.width;
    var height: number = (props.height == undefined)? 64: props.height;
    return(<LogoIcon width={width} height={height} style={props.style} />);
};
const Alert = (props: { width?: number, height?: number, fillColor?: string, style?: StyleProp<ViewStyle> })=> {
    var width: number = (props.width == undefined)? 64: props.width;
    var height: number = (props.height == undefined)? 64: props.height;
    return(<AlertIcon width={width} height={height} style={props.style} />);
};
const NoComment = (props: { width?: number, height?: number, fillColor?: string, style?: StyleProp<ViewStyle> })=> {
    var width: number = (props.width == undefined)? 64: props.width;
    var height: number = (props.height == undefined)? 64: props.height;
    return(<NoCommentIcon width={width} height={height} style={props.style} />);
};
const NoList = (props: { width?: number, height?: number, fillColor?: string, style?: StyleProp<ViewStyle> })=> {
    var width: number = (props.width == undefined)? 64: props.width;
    var height: number = (props.height == undefined)? 64: props.height;
    return(<NoListIcon width={width} height={height} style={props.style} />);
};

export {
    Logo,
    Alert,
    NoComment,
    NoList
};