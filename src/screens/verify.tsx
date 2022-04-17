import React, { Component } from "react";
import { View, Modal, ImageBackground, StyleSheet, Dimensions } from "react-native";
import { Text, Provider as PaperProvider } from "react-native-paper";
import CombinedTheme from "../Theme";
import Logo from '../assets/logo3.svg';

type IProps = {
    visible: boolean;
    textShow: string;
    showAnimText: boolean;
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
    private animOverText: any = 0;
    componentDidMount() {
        this.animOverText = setInterval(()=>this.setState({ overflowText: (this.state.overflowText.length == 0)? '.': (this.state.overflowText.length == 1)? '..': (this.state.overflowText.length == 2)? '...': '' }), 512);
    }
    componentWillUnmount() {
        clearInterval(this.animOverText);
        this.setState({ overflowText: '' });
    }
    render(): React.ReactNode {
        return(<Modal visible={this.props.visible} animationType={'none'} hardwareAccelerated={true} transparent={false}>
            <PaperProvider theme={CombinedTheme}>
                    <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background, position: 'relative' }}>
                        <ImageBackground source={require('../assets/background-theme.png')}>
                            <View style={{ ...styles.contain, width: Dimensions.get('window').width, height: Dimensions.get('window').height }}>
                                <Logo width={'70%'} />
                            </View>
                            <View style={{ ...styles.contentIndicator, width: Dimensions.get('window').width }}>
                                <Text style={styles.textIndicator}>{this.props.textShow}{(this.props.showAnimText) && this.state.overflowText}</Text>
                            </View>
                        </ImageBackground>
                    </View>
            </PaperProvider>
        </Modal>);
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
        height: 160,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    textIndicator: {
        color: '#FFFFFF',
        fontSize: 20
    }
});