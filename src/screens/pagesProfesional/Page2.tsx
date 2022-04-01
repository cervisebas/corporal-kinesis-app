import React from "react";
import { Component, ReactNode } from "react";
import { View } from "react-native";
import { Appbar } from "react-native-paper";

type IProps = {
    navigation: any;
    route: any;
};
type IState = {};

export default class Page2 extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): ReactNode {
        return(<View style={{ flex: 1 }}>
            <Appbar style={{ backgroundColor: '#1663AB', height: 56 }}>
                <Appbar.Action icon="menu" onPress={()=>this.props.navigation.openDrawer()} />
                <Appbar.Content title={'Administradores'}  />
            </Appbar>
        </View>);
    }
}