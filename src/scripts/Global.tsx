import React, { Component } from "react";
import { View } from "react-native";
import { Button, Dialog, Paragraph, Portal, Text } from "react-native-paper";
import LoadingController from "../components/loading/loading-controller";
import CombinedTheme from "../Theme";

type IProps = {
    loadingView: boolean;
    loadingText: string;
};
type IState = {};

export class Global extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<>
            <LoadingController
                show={this.props.loadingView}
                loadingText={this.props.loadingText}
                backgroundColor={'#323335'}
                indicatorColor={CombinedTheme.colors.accent}
                colorText={CombinedTheme.colors.text}
                borderRadius={8}
            />
        </>);
    }
};

var LoadNow: boolean = false;
var setLoadNow: (data: boolean)=>any = (data)=>LoadNow = data;
export { LoadNow, setLoadNow };