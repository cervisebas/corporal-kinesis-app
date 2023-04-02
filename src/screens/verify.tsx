import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import CustomModal from "./components/CustomModal";
import FastImage from "react-native-fast-image";
import LogoImage from "../assets/logo.webp";
import { getForPercentScale } from "../scripts/Utils";
import LinearGradient from "react-native-linear-gradient";

type IProps = {
    visible: boolean;
    textShow: string | undefined;
};
type IState = {
    overflowText: string;
};

export class VerifyScreen extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            overflowText: ''
        };
        this.updateOverflowText = this.updateOverflowText.bind(this);
    }
    private animOverText: any = undefined;
    componentDidMount() {
        this.animOverText = setInterval(this.updateOverflowText, 512);
    }
    componentWillUnmount() {
        clearInterval(this.animOverText);
    }
    updateOverflowText() {
        if (this.props.visible) {
            let overflowTextState = this.state.overflowText;
            let overflowText = (overflowTextState.length == 0)? '.': (overflowTextState.length == 1)? '..': (overflowTextState.length == 2)? '...': '';
            this.setState({ overflowText });
        }
    }
    render(): React.ReactNode {
        return(<CustomModal visible={this.props.visible} animationIn={'fadeIn'} animationOut={'fadeOut'}>
            <View style={{ flex: 1, backgroundColor: '#000000', position: 'relative' }}>
                <LinearGradient style={{ flex: 1 }} colors={['#100E20', '#15122A', '#1663AB']}>
                    <View style={[styles.contain, { width: '100%', height: '100%' }]}>
                        <FastImage
                            source={LogoImage}
                            resizeMode={'contain'}
                            style={getForPercentScale(Dimensions.get('window').width, 925, 1160, 70)}
                        />
                    </View>
                    <View style={[styles.contentIndicator, { width: '100%', marginBottom: 100 }]}>
                        <ActivityIndicator animating size={'large'} />
                        {(this.props.textShow)&&<Text style={styles.textIndicator}>{this.props.textShow}</Text>}
                    </View>
                </LinearGradient>
            </View>
        </CustomModal>);
    }
}
const styles = StyleSheet.create({
    contain: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column'
    },
    textIndicator: {
        color: '#FFFFFF',
        fontSize: 16,
        marginTop: 24
    }
});