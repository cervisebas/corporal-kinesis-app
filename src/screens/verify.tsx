import React, { Component } from "react";
import { View, Modal, ImageBackground, StyleSheet, Dimensions } from "react-native";
import { Text, Provider as PaperProvider, ActivityIndicator } from "react-native-paper";
import CombinedTheme from "../Theme";
import Logo from '../assets/logo3.svg';
import CustomModal from "./components/CustomModal";

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
    }
    private animOverText: any = undefined;
    componentDidMount() {
        this.animOverText = setInterval(()=>this.setState({ overflowText: (this.state.overflowText.length == 0)? '.': (this.state.overflowText.length == 1)? '..': (this.state.overflowText.length == 2)? '...': '' }), 512);
    }
    componentWillUnmount() {
        clearInterval(this.animOverText);
        this.animOverText = null;
        this.setState({ overflowText: '' });
    }
    componentDidUpdate() {
        if (this.props.visible) {
            if (this.animOverText == undefined) {
                this.animOverText = setInterval(()=>this.setState({ overflowText: (this.state.overflowText.length == 0)? '.': (this.state.overflowText.length == 1)? '..': (this.state.overflowText.length == 2)? '...': '' }), 512);
            }
        } else {
            if (this.animOverText !== undefined) {
                clearInterval(this.animOverText);
                this.animOverText = undefined;
            }
        }
    }
    render(): React.ReactNode {
        return(<CustomModal visible={this.props.visible} animationIn={'fadeIn'} animationOut={'fadeOut'}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background, position: 'relative' }}>
                    {(this.props.visible)&&<ImageBackground source={require('../assets/background-theme.png')}>
                        <View style={{ ...styles.contain, width: '100%', height: '100%' }}>
                            <Logo width={'70%'} />
                        </View>
                        <View style={{ ...styles.contentIndicator, width: '100%', marginBottom: 100 }}>
                            <ActivityIndicator animating size={'large'} />
                            {(this.props.textShow)&&<Text style={styles.textIndicator}>{this.props.textShow}</Text>}
                        </View>
                    </ImageBackground>}
                </View>
            </PaperProvider>
        </CustomModal>);
    }
}
const styles = StyleSheet.create({
    contain: {
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
        marginTop: 12
    }
});