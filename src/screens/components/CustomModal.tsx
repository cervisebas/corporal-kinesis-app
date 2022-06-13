import React, { Component } from "react";
import { Dimensions, StyleProp, View, ViewStyle } from "react-native";
import Modal from "react-native-modal";
import DeviceDimensions from 'react-native-extra-dimensions-android';

type ExtractProps<TComponentOrTProps> = TComponentOrTProps extends React.Component<infer TProps, any> ? TProps : TComponentOrTProps;
type IProps = {
    visible: boolean;
    onShow?: ()=>any;
    onClose?: ()=>any;
    animationIn?: ExtractProps<Modal>['animationIn'];
    animationOut?: ExtractProps<Modal>['animationOut'];
    onRequestClose?: ()=>any;
    style?: StyleProp<ViewStyle>;
    transparent?: boolean;
};
type IState = {};

const { width } = Dimensions.get('window');
const height = DeviceDimensions.get('REAL_WINDOW_HEIGHT');

export default class CustomModal extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    onShow() { if (this.props.onShow) this.props.onShow(); }
    onRequestClose() { if (this.props.onRequestClose) this.props.onRequestClose(); }
    onClose() { if (this.props.onClose) this.props.onClose(); }
    render(): React.ReactNode {
        return(<Modal
            isVisible={this.props.visible}
            animationIn={(this.props.animationIn)? this.props.animationIn: 'fadeInUp'}
            animationInTiming={250}
            animationOut={(this.props.animationOut)? this.props.animationOut: 'fadeOutDown'}
            animationOutTiming={250}
            onBackButtonPress={()=>this.onRequestClose()}
            onBackdropPress={()=>this.onRequestClose()}
            onModalWillShow={()=>this.onShow()}
            onModalHide={()=>this.onClose()}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            backdropOpacity={(this.props.transparent)? 0: undefined}
            backdropColor={'#121212'}
            deviceWidth={width}
            deviceHeight={height}
            style={[this.props.style, { margin: 0 }]}>
            {this.props.children}
        </Modal>);
    }
}