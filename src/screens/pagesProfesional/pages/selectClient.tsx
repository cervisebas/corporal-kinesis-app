import { decode } from "base-64";
import filter from "lodash.filter";
import React, { Component } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, View } from "react-native";
import { Appbar, Divider, List, Searchbar } from "react-native-paper";
import { dataListUsers } from "../../../scripts/ApiCorporal/types";
import CombinedTheme from "../../../Theme";
import { CustomShowError } from "../../components/Components";
import CustomModal from "../../components/CustomModal";

type IProps = {
    dataUser: dataListUsers[];
    onSelect: (data: { id: string, name: string })=>void;
};
type IState = {
    visible: boolean;
    searchQuery: string;
    listUsers: dataListUsers[];
};


export default class SelectClient extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            listUsers: [],
            searchQuery: ''
        };
        this._renderItem = this._renderItem.bind(this);
        this.loadData = this.loadData.bind(this);
        this.close = this.close.bind(this);
    }

    /*###### Search Control ######*/
    onChangeSearch(Query: string) {
        if (this.state.searchQuery.length > Query.length) return this.setState({ searchQuery: Query, listUsers: this.props.dataUser });
        this.setState({ searchQuery: Query });
    }
    goSearch(Query: string) {
        const formattedQuery = Query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const data = filter(this.props.dataUser, (user)=>this.contains(decode(user.name).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), formattedQuery));
        this.setState({ listUsers: data });
    }
    contains(nameUser: string, query: string) {
        if (nameUser.includes(query) || nameUser.includes(query) || nameUser.includes(query)) {
            return true;
        }
        return false;
    }
    
    /*###### FlatList Control ######*/
    _getItemLayout(_i: any, index: number) { return { length: 64, offset: 64 * index, index }; }
    _keyExtractor(item: dataListUsers, _i: number) { return `sel1-admin-${item.id}`; }
    _renderItem({ item }: ListRenderItemInfo<dataListUsers>) {
        return(<List.Item
            title={decode(item.name)}
            left={(props)=><List.Icon {...props} icon={'account-outline'} />}
            onPress={()=>this.select(item)}
        />);
    }
    /*##############################*/
    select(item: dataListUsers) {
        this.props.onSelect({ id: item.id, name: decode(item.name) });
        this.close();
    }

    loadData() {
        this.setState({
            listUsers: this.props.dataUser,
            searchQuery: ''
        });
    }

    componentDidUpdate() {
        if (!this.state.visible && this.state.listUsers.length !== 0) {
            this.setState({ listUsers: [] });
        }
    }

    // Controller
    open() { this.setState({ visible: true }); }
    close() { this.setState({ visible: false }); }

    render(): React.ReactNode {
        return(<CustomModal visible={this.state.visible} onShow={this.loadData} onRequestClose={this.close} animationIn={'slideInLeft'} animationOut={'slideOutRight'}>
            <View style={{ ...styles.content, backgroundColor: CombinedTheme.colors.background }}>
                <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                    <Appbar.BackAction onPress={this.close} />
                    <Appbar.Content title={'Seleccionar cliente'} />
                </Appbar.Header>
                <View>
                    {(this.state.visible)&&<FlatList
                        data={this.state.listUsers}
                        keyExtractor={this._keyExtractor}
                        getItemLayout={this._getItemLayout}
                        removeClippedSubviews={true}
                        ListHeaderComponent={<Searchbar
                            value={this.state.searchQuery}
                            style={{ marginTop: 8, marginLeft: 8, marginRight: 8, marginBottom: 12 }}
                            placeholder={'Escribe para buscar...'}
                            onChangeText={(query: string)=>this.onChangeSearch(query)}
                            onSubmitEditing={({ nativeEvent })=>this.goSearch(nativeEvent.text)}
                        />}
                        contentContainerStyle={{ flex: (this.props.dataUser.length == 0)? 3: undefined }}
                        ItemSeparatorComponent={()=><Divider />}
                        ListEmptyComponent={<CustomShowError message={'Lista vacia'} />}
                        renderItem={this._renderItem}
                    />}
                </View>
            </View>
        </CustomModal>);
    }
}

const styles = StyleSheet.create({
    content: {
        marginLeft: 8,
        marginRight: 8,
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: "#FFFFFF",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        maxHeight: '90%'
    }
});