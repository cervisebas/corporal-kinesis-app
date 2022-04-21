import React, { Component } from "react";
import { View } from "react-native";
import { Appbar } from "react-native-paper";
import WorkInProgress from "../components/workInProgress";

type IProps = {};
type IState = {};

export class Tab4 extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<View style={{ flex: 1 }}>
            <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                <Appbar.Content title="Pagos" />
            </Appbar.Header>
            <View style={{ flex: 2 }}>
                <WorkInProgress />
            </View>
        </View>);
    }
}