import React, { Component, ReactNode } from "react";
import { decode } from "base-64";
import { Modal, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Appbar, Searchbar, Provider as PaperProvider } from "react-native-paper";
import { dataListUsers } from "../../../scripts/ApiCorporal/types";
import Settings from "../../../Settings";
import CombinedTheme from "../../../Theme";
import { CustomItemList2 } from "../../components/Components";
import filter from 'lodash.filter';

type IProps = {
    show: boolean;
    close: ()=>any;
    listUsers: dataListUsers[];
    goDetailsClient: (idClient: string)=>any;
};
type IState = {
    searchQuery: string;
    listUsers: dataListUsers[];
};
export default class SearchClient extends Component<IProps, IState> {
    constructor(props : IProps) {
        super(props);
        this.state = {
            searchQuery: '',
            listUsers: []
        };
    }
    static contextType = Settings;
    onChangeSearch(Query: string) {
        const formattedQuery = Query.toLowerCase();
        const data = filter(this.props.listUsers, (user)=>this.contains(decode(user.name).toLowerCase(), formattedQuery));
        this.setState({ searchQuery: Query, listUsers: data });
    }
    contains(nameUser: string, query: string) {
        if (nameUser.includes(query) || nameUser.includes(query) || nameUser.includes(query)) {
            return true;
        }
        return false;
    }
    loadData() { this.setState({ listUsers: this.props.listUsers }); }
    render(): ReactNode {
        const { getSettings } = this.context;
        return(<Modal visible={this.props.show} transparent={false} hardwareAccelerated={true} animationType={getSettings.animations} onShow={()=>this.loadData()} onRequestClose={()=>this.props.close()}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={()=>this.props.close()} />
                        <Appbar.Content title={'Buscar cliente'} />
                    </Appbar.Header>
                    <View style={{ flex: 2 }}>
                        <FlatList
                            data={this.state.listUsers}
                            renderItem={({ item, index })=><CustomItemList2
                                key={index}
                                title={decode(item.name)}
                                image={item.image}
                                onPress={()=>this.props.goDetailsClient(item.id)}
                            />}
                            ListHeaderComponent={<Searchbar
                                value={this.state.searchQuery}
                                style={{ margin: 8 }}
                                placeholder={'Escribe para buscar...'}
                                onChangeText={(query: string)=>this.onChangeSearch(query)}
                            />}
                        />
                    </View>
                </View>
            </PaperProvider>
        </Modal>);
    }
}