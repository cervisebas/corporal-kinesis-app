import React from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, View } from "react-native";
import { trainings } from "../../../scripts/ApiCorporal/types";
import CustomItemList5 from "../../components/CustomItemList5";

type IProps = {
    data: trainings[];
    goMoreDetails: (id: string)=>void;
    deleteItem: (id: string)=>void;
};

export default React.memo(function ViewTrainingPage(props: IProps) {
    function _getItemLayout(_data: any, index: number) {
        return {
            length: 182,
            offset: 182 * index,
            index
        };
    }
    function _keyExtractor(data: trainings, _index: number) {
        return `viewT-admin-${data.id}`;
    }
    function _renderItem({ item }: ListRenderItemInfo<trainings>) {
        return(<CustomItemList5
            key={`viewT-admin-${item.id}`}
            data={item}
            deleteButton={()=>props.deleteItem(item.id)}
            viewButton={()=>props.goMoreDetails(item.id)}
        />);
    }


    return(<View style={styles.content}>
        <FlatList
            data={props.data}
            extraData={props}
            contentContainerStyle={styles.flatlist}
            keyExtractor={_keyExtractor}
            getItemLayout={_getItemLayout}
            renderItem={_renderItem}
        />
    </View>);
});

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    flatlist: {
        paddingBottom: 12
    }
});