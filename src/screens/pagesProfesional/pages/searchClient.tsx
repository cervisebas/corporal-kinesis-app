import React, { PureComponent, ReactNode, forwardRef, useContext, useImperativeHandle, useState } from "react";
import { decode } from "base-64";
import { Keyboard, ListRenderItemInfo, NativeSyntheticEvent, StyleSheet, TextInputSubmitEditingEventData, View } from "react-native";
import { FlatList, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Appbar, Searchbar, Provider as PaperProvider, Divider } from "react-native-paper";
import { dataListUsers } from "../../../scripts/ApiCorporal/types";
import CombinedTheme from "../../../Theme";
import { CustomItemList2 } from "../../components/Components";
import filter from 'lodash.filter';
import CustomModal from "../../components/CustomModal";
import { ThemeContext } from "../../../providers/ThemeProvider";

type IProps = {
    deleteAccount: (id: string)=>void;
    sendComment: (id: string)=>void;

    goDetailsClient: (idClient: string)=>void;
    showLoading: (visible: boolean, message?: string)=>void;
    showSnackOut: (text: string)=>void;
};

export type SearchClientRef = {
    open: (listUsers: dataListUsers[])=>void;
};

export default React.memo(forwardRef(function SearchClient(props: IProps, ref: React.Ref<SearchClientRef>) {
    // Context's
    const { theme } = useContext(ThemeContext);
    // State's
    const [visible, setVisible] = useState(false);
    const [listUsers, setListUsers] = useState<dataListUsers[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [listSearch, setListSearch] = useState<dataListUsers[]>([]);

    function onChangeSearch(Query: string) {
        if (searchQuery.length > Query.length) {
            setSearchQuery(Query);
            setListSearch(listUsers);
            return;
        }
        setSearchQuery(Query);
    }
    function goSearch({ nativeEvent: { text } }: NativeSyntheticEvent<TextInputSubmitEditingEventData>) {
        const formattedQuery = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const data = filter(listUsers, (user)=>contains(decode(user.name).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), formattedQuery));
        setListSearch(data);
    }
    function contains(nameUser: string, query: string) {
        if (nameUser.includes(query) || nameUser.includes(query) || nameUser.includes(query)) return true;
        return false;
    }
    function _goToDelete(id: string) {
        props.deleteAccount(id);
        close();
    }
    function _goToComment(id: string) {
        props.sendComment(id);
        close();
    }

    function _getItemLayout(_i: any, index: number) { return { length: 64, offset: 64 * index, index }; }
    function _keyExtractor(item: dataListUsers, _i: number) { return `p1-admin-${item.id}`; }
    function _ItemSeparatorComponent() { return(<Divider />); }
    function _renderItem({ item }: ListRenderItemInfo<dataListUsers>) {
        return(<CustomItemList2
            key={`p1-admin-${item.id}`}
            title={decode(item.name)}
            image={item.image}
            onPress={()=>props.goDetailsClient(item.id)}
            actionDelete={()=>_goToDelete(item.id)}
            actionComment={()=>_goToComment(item.id)}
        />);
    }

    function close() { setVisible(false); }
    function open(_listUsers: dataListUsers[]) {
        setListUsers(_listUsers);
        setListSearch(_listUsers.slice());
        setSearchQuery('');
        setVisible(true);
    }

    useImperativeHandle(ref, ()=>({ open }));

    return(<CustomModal visible={visible} onRequestClose={close}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <TouchableWithoutFeedback style={{ width: '100%', height: '100%' }} onPress={Keyboard.dismiss} accessible={false}>
                <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                    <Appbar.BackAction onPress={close} />
                    <Appbar.Content title={'Buscar cliente'} />
                </Appbar.Header>
                <View style={{ flex: 2 }}>
                    <FlatList
                        data={listSearch}
                        keyExtractor={_keyExtractor}
                        getItemLayout={_getItemLayout}
                        ItemSeparatorComponent={_ItemSeparatorComponent}
                        ListHeaderComponent={<Searchbar
                            value={searchQuery}
                            style={styles.flatlistSearch}
                            placeholder={'Escribe para buscar...'}
                            onChangeText={onChangeSearch}
                            onSubmitEditing={goSearch}
                        />}
                        renderItem={_renderItem}
                    />
                </View>
            </TouchableWithoutFeedback>
        </View>
    </CustomModal>);
}));

const styles = StyleSheet.create({
    flatlistSearch: {
        marginTop: 8,
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 12
    }
});