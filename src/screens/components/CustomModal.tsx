import React, { Component } from "react";
import { Dimensions, StyleProp, StyleSheet, ViewStyle, ScaledSize } from "react-native";
import Modal from "react-native-modal";

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
    backdropColor?: string;
    backdropTransitionOutTiming?: number;
    backdropTransitionInTiming?: number;
    transparent?: boolean;
    useBackdrop?: boolean;
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
};
type IState = {
    width: number;
    height: number;
};

export default class CustomModal extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            width: 0,
            height: 0
        };
        this.onShow = this.onShow.bind(this);
        this.onRequestClose = this.onRequestClose.bind(this);
        this.onClose = this.onClose.bind(this);
        this.resize = this.resize.bind(this);
    }
    private _isMount: boolean = false;
    componentDidMount(): void {
        this._isMount = true;
        this.setState(Dimensions.get("window"));
        Dimensions.addEventListener("change", this.resize)
    }
    componentWillUnmount(): void {
        this._isMount = false;
    }
    resize({ window }: { window: ScaledSize; screen: ScaledSize; }) {
        if (this._isMount) this.setState(window);
    }
    onShow() {
        if (this.props.onShow && this._isMount) this.props.onShow();
        this.setState(Dimensions.get("window"));
    }
    onRequestClose() {
        if (this.props.onRequestClose && this._isMount) this.props.onRequestClose();
    }
    onClose() {
        if (this.props.onClose && this._isMount) this.props.onClose();
    }
    render(): React.ReactNode {
        return(<Modal
            isVisible={this.props.visible}
            // Animation In
            animationIn={(this.props.removeAnimationIn)? { from: { opacity: 1 }, to: { opacity: 1 } }: (this.props.animationIn)? this.props.animationIn: 'slideInRight'}
            animationInTiming={(this.props.removeAnimationIn)? 0: (!this.props.animationInTiming)? 250: this.props.animationInTiming}
            // Animation Out
            animationOut={(this.props.removeAnimationOut)? { from: { opacity: 0 }, to: { opacity: 0 } }: (this.props.animationOut)? this.props.animationOut: 'slideOutLeft'}
            animationOutTiming={(this.props.removeAnimationOut)? 0: (!this.props.animationOutTiming)? 250: this.props.animationOutTiming}
            // Others parameters
            backdropTransitionOutTiming={this.props.backdropTransitionOutTiming}
            backdropTransitionInTiming={this.props.backdropTransitionInTiming}
            backdropColor={this.props.backdropColor}
            backdropOpacity={(this.props.transparent)? 0: undefined}
            onBackButtonPress={this.onRequestClose}
            onBackdropPress={this.onRequestClose}
            onModalWillShow={this.onShow}
            onModalHide={this.onClose}
            deviceWidth={this.state.width}
            deviceHeight={this.state.height}
            hasBackdrop={this.props.useBackdrop}
            coverScreen={false}
            supportedOrientations={['portrait', 'landscape']}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            hideModalContentWhileAnimating={true}
            //backdropColor={(isDark)? 'gray': 'black'}
            style={[this.props.style, styles.modal]}>
            {this.props.children}
        </Modal>);
    }
}

const styles = StyleSheet.create({
    modal: {
        margin: 0
    }
});