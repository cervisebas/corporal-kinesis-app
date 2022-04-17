import React, { Component } from "react";
import { View } from "react-native";
import { Session } from "./screens/session";
import { VerifyScreen } from "./screens/verify";
import { Global } from "./scripts/Global";

type IProps = {
    // Session
    openSession: boolean;
    closeSession: ()=>any;
    setLoadData: (data: boolean)=>any;

    // Verify
    showVerify: boolean;
    textVerify: string;
    animTextVerify: boolean;
};
type IState = {
    // Loading
    viewLoading: boolean;
    textLoading: string;
};

export class ExtraContents extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            viewLoading: false,
            textLoading: ''
        };
    }
    componentWillUnmount() {
        this.setState({
            viewLoading: false,
            textLoading: ''
        });
    }
    render(): React.ReactNode {
        return(<View>
            <Session
                visible={this.props.openSession}
                close={()=>this.props.closeSession()}
                setLoading={(view, text)=>this.setState({ viewLoading: view, textLoading: text })}
                setLoadData={(data)=>this.props.setLoadData(data)}
            />
            <VerifyScreen
                visible={this.props.showVerify}
                textShow={this.props.textVerify}
                showAnimText={this.props.animTextVerify}
            />
            <Global
                loadingView={this.state.viewLoading}
                loadingText={this.state.textLoading}
            />
        </View>);
    }
}