import React, { forwardRef, useContext, useImperativeHandle, useState } from "react";
import CustomModal from "./components/CustomModal";
import { JSON } from '../scripts/ChangeLog';
import { ListRenderItemInfo, StyleSheet, View } from "react-native";
import { Appbar, Divider } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import { ChangeLogSystem } from "../scripts/ApiCorporal";
import { ThemeContext } from "../providers/ThemeProvider";
import statusEffect from "../scripts/StatusEffect";
import CustomListChanges from "./components/CustomListChanges";

export type ChangeLogRef = {
    open: ()=>void;
    close: ()=>void;
};

export default React.memo(forwardRef(function ChangeLog(_props: any, ref: React.Ref<ChangeLogRef>) {
    // Context's
    const { theme } = useContext(ThemeContext);
    // State's
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState(ChangeLogSystem.getFullData());

    function _renderItem({ item }: ListRenderItemInfo<JSON>) {
        return(<CustomListChanges
            key={`changelog-${item.version}`}
            version={item.version}
            date={item.date}
            changes={item.changes}
        />);
        /*return(<CustomItemList6
            key={`changelog-${item.version}`}
            title={`V${item.version}`}
            style={[
                (index == 0)? { borderWidth: 2, borderColor: MD2Colors.green500 }: undefined,
                (index == (data.length - 1))? { marginBottom: 8 }: undefined]
            }
            subtitle={item.date}
            message={ChangeLogSystem.tranform_changes(item.changes)}
        />);*/
    }
    function _keyExtractor(item: JSON, _index: number) {
        return `changelog-${item.version}`;
    }
    function _ItemSeparatorComponent() {
        return(<Divider />);
    }

    function close() { setVisible(false); }
    function open() { setVisible(true); }

    useImperativeHandle(ref, ()=>({ open, close }));
    statusEffect([
        { color: theme.colors.background, style: 'light' },
        { color: theme.colors.background, style: 'light' }
    ], visible, undefined, undefined, true);

    return(<CustomModal visible={visible} onRequestClose={close}>
        <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                <Appbar.BackAction onPress={close} />
                <Appbar.Content title={`Lista de cambios`}/>
            </Appbar.Header>
            <View style={{ flex: 2 }}>
                <FlatList
                    data={data}
                    keyExtractor={_keyExtractor}
                    renderItem={_renderItem}
                    ItemSeparatorComponent={_ItemSeparatorComponent}
                />
            </View>
        </View>
    </CustomModal>);
}));

const styles = StyleSheet.create({
    content: {
        flex: 1
    }
});