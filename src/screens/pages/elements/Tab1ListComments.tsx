import React, { useCallback, useContext } from "react";
import { FlatList, ListRenderItemInfo, RefreshControl, View } from "react-native";
import { DetailsTrainings, commentsData } from "../../../scripts/ApiCorporal/types";
import { ThemeContext } from "../../../providers/ThemeProvider";
import HeaderStatistics from "./HeaderStatistics";
import { CustomCardComments, EmptyListComments } from "../../components/Components";
import { NoComment } from "../../../assets/icons";
import { ProgressBar } from "react-native-paper";
import { decode } from "base-64";
import { HostServer } from "../../../scripts/ApiCorporal";
import utf8 from "utf8";
import ImageProfile from "../../../assets/profile.webp";

type IProps = {
    refreshing: boolean;
    loading: boolean;
    data: DetailsTrainings;
    commentsLoading: boolean;
    dataComment: commentsData[];
    onRefresing: ()=>void;
    openDetails: ()=>void;
    goStatistics: (data: number, titleStatistics: string)=>void;
};

const decodeUtf8 = (str: string)=>{
    try {
        return utf8.decode(str);
    } catch {
        return str;
    }
};

export default React.memo(function Tab1ListComments(props: IProps) {
    const { theme } = useContext(ThemeContext);

    const _ListEmptyComponent = useCallback(()=>{
        return((!props.commentsLoading)?<EmptyListComments
        message={'No hay comentarios para mostrar'}
        icon={<NoComment width={96} height={96} />}
        style={{ marginTop: 32 }}
        />: <View><ProgressBar indeterminate={true} /></View>);
    }, [props.commentsLoading]);
    function _keyExtractor(item: commentsData, _index: number) { return `t1-comment-${item.id}`; }
    function _renderItem({ item }: ListRenderItemInfo<commentsData>) {
        return(<CustomCardComments
            key={`t1-user-${item.id}`}
            source={(item.id !== '-1')? { uri: `${HostServer}/images/accounts/${decode(item.accountData.image)}` }: ImageProfile}
            accountName={(item.id !== '-1')? `${decode(item.accountData.name)}`: decode(item.accountData.name)}
            edit={item.edit}
            date={decode(item.date)}
            comment={decodeUtf8(decode(item.comment))}
        />);
    }
    
    return(<View style={{ flex: 1, overflow: 'hidden' }}>
        <FlatList
            data={props.dataComment}
            keyExtractor={_keyExtractor}
            refreshControl={<RefreshControl
                colors={[theme.colors.primary]}
                progressBackgroundColor={theme.colors.elevation.level2}
                refreshing={props.refreshing}
                onRefresh={props.onRefresing}
            />}
            ListHeaderComponent={<HeaderStatistics
                dataShow={props.data}
                showLoading={props.loading}
                goStatistics={props.goStatistics}
                openDetails={props.openDetails}
            />}
            ListEmptyComponent={_ListEmptyComponent}
            renderItem={_renderItem}
        />
    </View>);
});