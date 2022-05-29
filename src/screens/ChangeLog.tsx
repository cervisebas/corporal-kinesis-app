import React, { Component } from "react";
import CustomModal from "./components/CustomModal";
import { JSON } from '../scripts/ChangeLog';
import { Dimensions, View } from "react-native";
import { Appbar, Colors } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import { CustomItemList6 } from "./components/Components";
import { ChangeLogSystem } from "../scripts/ApiCorporal";
import CombinedTheme from "../Theme";

type IProps = {
    visible: boolean;
    close: ()=>any;
};
type IState = {
    data: JSON[]
};

export class ChangeLog extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            data: []
        };
    }
    dataLoad() {
        var data = ChangeLogSystem.getFullData();
        this.setState({ data });
    }
    render(): React.ReactNode {
        return(<CustomModal visible={this.props.visible} style={{ marginRight: 16, marginLeft: 16, marginTop: 32, marginBottom: 32, borderRadius: 8, overflow: 'hidden' }} onShow={()=>this.dataLoad()} onRequestClose={()=>this.props.close()}>
            <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                    <Appbar.BackAction onPress={()=>this.props.close()} />
                    <Appbar.Content title={`Lista de cambios`}/>
                </Appbar.Header>
                <View style={{ flex: 2 }}>
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item, index })=><CustomItemList6
                            key={index.toString()}
                            title={`V${item.version}`}
                            style={[(index == 0)? { borderWidth: 2, borderColor: Colors.green500 }: undefined, (index == (this.state.data.length - 1))? { marginBottom: 8 }: undefined]}
                            subtitle={item.date}
                            message={ChangeLogSystem.tranform_changes(item.changes)}
                        />}
                    />
                </View>
            </View>
        </CustomModal>);
    }
}