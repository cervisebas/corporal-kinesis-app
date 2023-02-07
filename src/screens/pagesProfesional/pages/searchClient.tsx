import React, { PureComponent, ReactNode } from "react";
import { decode } from "base-64";
import { ListRenderItemInfo, NativeSyntheticEvent, StyleSheet, TextInputSubmitEditingEventData, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Appbar, Searchbar, Provider as PaperProvider, Divider } from "react-native-paper";
import { dataListUsers } from "../../../scripts/ApiCorporal/types";
import CombinedTheme from "../../../Theme";
import { CustomItemList2 } from "../../components/Components";
import filter from 'lodash.filter';
import CustomModal from "../../components/CustomModal";

type IProps = {
    deleteAccount: (id: string)=>void;
    sendComment: (id: string)=>void;

    goDetailsClient: (idClient: string)=>void;
    showLoading: (visible: boolean, message?: string)=>void;
    showSnackOut: (text: string)=>void;
};
type IState = {
    visible: boolean;
    listUsers: dataListUsers[];
    searchQuery: string;
    listSearch: dataListUsers[];
};
export default class SearchClient extends PureComponent<IProps, IState> {
    constructor(props : IProps) {
        super(props);
        this.state = {
            visible: false,
            listUsers: [],
            listSearch: [],
            searchQuery: ''
        };
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.goSearch = this.goSearch.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this.close = this.close.bind(this);
    }
    onChangeSearch(Query: string) {
        if (this.state.searchQuery.length > Query.length) return this.setState({ searchQuery: Query, listUsers: this.state.listUsers });
        this.setState({ searchQuery: Query });
    }
    goSearch({ nativeEvent: { text } }: NativeSyntheticEvent<TextInputSubmitEditingEventData>) {
        const formattedQuery = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const data = filter(this.state.listUsers, (user)=>this.contains(decode(user.name).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), formattedQuery));
        this.setState({ listSearch: data });
    }
    contains(nameUser: string, query: string) {
        if (nameUser.includes(query) || nameUser.includes(query) || nameUser.includes(query)) return true;
        return false;
    }
    _goToDelete(id: string) {
        this.props.deleteAccount(id);
        this.close();
    }
    _goToComment(id: string) {
        this.props.sendComment(id);
        this.close();
    }

    /*###### FlatList Control ######*/
    _getItemLayout(_i: any, index: number) { return { length: 64, offset: 64 * index, index }; }
    _keyExtractor(item: dataListUsers, _i: number) { return `p1-admin-${item.id}`; }
    _ItemSeparatorComponent() { return(<Divider />); }
    _renderItem({ item }: ListRenderItemInfo<dataListUsers>) {
        return(<CustomItemList2
            key={`p1-admin-${item.id}`}
            title={decode(item.name)}
            image={item.image}
            onPress={()=>this.props.goDetailsClient(item.id)}
            actionDelete={()=>this._goToDelete(item.id)}
            actionComment={()=>this._goToComment(item.id)}
        />);
    }    
    /*##############################*/


    open(listUsers: dataListUsers[]) {
        this.setState({
            visible: true,
            listUsers,
            listSearch: listUsers
        });
        console.log(listUsers.length);
    }
    close() {
        this.setState({ visible: false });
    }

    render(): ReactNode {
        return(<CustomModal visible={this.state.visible} onRequestClose={this.close}>
            <PaperProvider theme={CombinedTheme}>
                <View style={styles.content}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={this.close} />
                        <Appbar.Content title={'Buscar cliente'} />
                    </Appbar.Header>
                    <View style={{ flex: 2 }}>
                        <FlatList
                            data={this.state.listSearch}
                            keyExtractor={this._keyExtractor}
                            getItemLayout={this._getItemLayout}
                            ItemSeparatorComponent={this._ItemSeparatorComponent}
                            ListHeaderComponent={<Searchbar
                                value={this.state.searchQuery}
                                style={styles.flatlistSearch}
                                placeholder={'Escribe para buscar...'}
                                onChangeText={this.onChangeSearch}
                                onSubmitEditing={this.goSearch}
                            />}
                            renderItem={this._renderItem}
                        />
                    </View>
                </View>
            </PaperProvider>
        </CustomModal>);
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: CombinedTheme.colors.background
    },
    flatlistSearch: {
        marginTop: 8, marginLeft: 8, marginRight: 8, marginBottom: 12
    }
});