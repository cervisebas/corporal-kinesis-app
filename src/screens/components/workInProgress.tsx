import React, { PureComponent } from "react";
import { View } from "react-native";
import LottieView from 'lottie-react-native';
import { Text } from "react-native-paper";

type IProps = {};
type IState = {
    overflowText: string;
};

export default class WorkInProgress extends PureComponent<IProps, IState> {
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
        this.animOverText = 0;
        clearInterval(this.animOverText);
        this.setState({ overflowText: '' });
    }
    render(): React.ReactNode {
        return(<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <LottieView
                    style={{ width: '45%' }}
                    source={require('../../assets/inProgress.json')}
                    autoPlay={true}
                    loop={true}
                />
                <Text style={{ fontSize: 20, marginTop: 32 }}>Trabajo en proceso{this.state.overflowText}</Text>
            </View>
        </View>);
    }
}