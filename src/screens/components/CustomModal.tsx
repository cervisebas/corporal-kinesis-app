import React, { Component } from "react";
import { Dimensions, StyleProp, View, ViewStyle } from "react-native";
import Modal from "react-native-modal";
import DeviceDimensions from 'react-native-extra-dimensions-android';

type ExtractProps<TComponentOrTProps> = TComponentOrTProps extends React.Component<infer TProps, any> ? TProps : TComponentOrTProps;
type IProps = {
    visible: boolean;
    onShow?: ()=>any;
    onClose?: ()=>any;
    onRequestClose?: ()=>any;
    animationIn?: ExtractProps<Modal>['animationIn'];
    animationOut?: ExtractProps<Modal>['animationOut'];
    removeAnimationIn?: boolean;
    removeAnimationOut?: boolean;
    animationInTiming?: number;
    animationOutTiming?: number;
    style?: StyleProp<ViewStyle>;
    transparent?: boolean;
    coverScreen?: boolean;
};
type IState = {};

const { width } = Dimensions.get('window');
const height = DeviceDimensions.get('REAL_WINDOW_HEIGHT');

export default class CustomModal extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<Modal
            isVisible={this.props.visible}
            // Animation In
            animationIn={(this.props.removeAnimationIn)? { from: { opacity: 1 }, to: { opacity: 1 } }: (this.props.animationIn)? this.props.animationIn: 'fadeInUp'}
            animationInTiming={(this.props.removeAnimationIn)? 0: (!this.props.animationInTiming)? 250: this.props.animationInTiming}
            // Animation Out
            animationOut={(this.props.removeAnimationOut)? { from: { opacity: 0 }, to: { opacity: 0 } }: (this.props.animationOut)? this.props.animationOut: 'fadeOutDown'}
            animationOutTiming={(this.props.removeAnimationOut)? 0: (!this.props.animationOutTiming)? 250: this.props.animationOutTiming}
            // Others
            onBackButtonPress={this.props.onRequestClose}
            onBackdropPress={this.props.onRequestClose}
            onModalWillShow={this.props.onShow}
            onModalHide={this.props.onClose}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            backdropOpacity={(this.props.transparent)? 0: undefined}
            backdropColor={'#121212'}
            deviceWidth={width}
            deviceHeight={height}
            coverScreen={this.props.coverScreen}
            style={[this.props.style, { margin: 0 }]}>
            {this.props.children}
        </Modal>);
    }
}