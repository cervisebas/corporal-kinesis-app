import { decode } from "base-64";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DeviceEventEmitter, EmitterSubscription, FlatList, ListRenderItemInfo, RefreshControl, View } from "react-native";
import { ActivityIndicator, Appbar, Divider } from "react-native-paper";
import { Options, Permission } from "../../scripts/ApiCorporal";
import { permissionItem } from "../../scripts/ApiCorporal/types";
import { CustomShowError } from "../components/Components";
import ChangePermissionsUser from "./pages/changePermissionsUser";
import { ThemeContext } from "../../providers/ThemeProvider";
import { waitTo } from "../../scripts/Utils";
import CustomItemList3 from "../components/CustomItemList3";

type IProps = {
    navigation: any;
    route: any;
};

type DataChangePermission = {
    id: string;
    name: string;
    image: string;
    birthday: string;
    actualStatus: string;
};

var event: EmitterSubscription | undefined = undefined;
export default React.memo(function Page2(props: IProps) {
    // Context's
    const { theme } = useContext(ThemeContext);
    // State's
    const [userList, setUserList] = useState<permissionItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [messageError, setMessageError] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [oldList, setOldList] = useState<permissionItem[]>([]);
    const [isFilter, setIsFilter] = useState(false);
    // Ref's
    const refChangePermissionsUser = useRef<ChangePermissionsUser>(null);

    function _loadData() {
        setIsLoading(true);
        setIsFilter(false);
        setIsError(false);
        Permission.getAll()
            .then((list)=>{
                setUserList(list);
                setIsLoading(false);
                Options.getAll().then((vals)=>{
                    if (vals.activeFilters) _goFilter();
                });
                setRefreshing(false);
            })
            .catch((error)=>{
                setIsLoading(false);
                setIsError(true);
                setMessageError(error.cause);
                setRefreshing(false); 
            });
    }
    function _adminTag(type: string): string {
        let tag: string = '';
        switch (type) {
            case '0':
                tag = 'Cliente';
                break;
            case '1':
                tag = 'Entrenador';
                break;
            case '2':
                tag = 'Entrenador y editor';
                break;
            case '3':
                tag = 'Entrenador y administrador';
                break;
            case '4':
                tag = 'Administrador total';
                break;
        }
        return tag;
    }
    async function _goFilter() {
        if (isFilter) {
            setUserList(oldList);
            setIsFilter(false);
            return;
        }
        setOldList(userList.slice());
        setIsLoading(true);
        setUserList(userList.sort((a, b)=>(parseInt(b.permission) - parseInt(a.permission))));
        await waitTo(1000);
        setIsFilter(true);
        setIsLoading(false);
    }
    function openDetails(data: DataChangePermission) {
        refChangePermissionsUser.current?.open(data);
    }

    // FlatList
    function _getItemLayout(_i: any, index: number) { return { length: 84, offset: 84 * index, index }; }
    function _keyExtractor(item: permissionItem, _i: number) { return `p2-admin-${item.id}`; }
    function _ItemSeparatorComponent(props: any) { return(<Divider {...props} />); }
    function _renderItem({ item }: ListRenderItemInfo<permissionItem>) {
        return(<CustomItemList3
            key={`p2-admin-${item.id}`}
            subtitle={_adminTag(item.permission)}
            type={item.permission}
            image={item.accountData.image}
            title={decode(item.accountData.name)}
            onPress={()=>openDetails({
                id: item.idUser,
                name: item.accountData.name,
                image: item.accountData.image,
                birthday: item.accountData.birthday,
                actualStatus: item.permission
            })}
        />);
    }
    
    function _refresh() {
        setRefreshing(true);
        _loadData();
    }

    useEffect(()=>{
        event = DeviceEventEmitter.addListener('adminPage2Reload', _loadData);
        _loadData();
        return ()=>{
            event?.remove();
        };
    }, []);

    return(<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Appbar style={{ backgroundColor: theme.colors.background }}>
            <Appbar.Action icon="menu" onPress={props.navigation.openDrawer} />
            <Appbar.Content title={'Administradores'}  />
            <Appbar.Action animated={true} icon={(isFilter)? 'filter-outline': 'account-filter-outline'} onPress={(!isLoading)? _goFilter: undefined} />
        </Appbar>
        <View style={{ flex: 2, overflow: 'hidden' }}>
            <FlatList
                data={userList}
                keyExtractor={_keyExtractor}
                getItemLayout={_getItemLayout}
                contentContainerStyle={{ flex: (isLoading || isError)? 3: undefined }}
                ItemSeparatorComponent={_ItemSeparatorComponent}
                refreshControl={<RefreshControl
                    colors={[theme.colors.primary]}
                    progressBackgroundColor={theme.colors.elevation.level2}
                    refreshing={refreshing} onRefresh={_refresh}
                />}
                ListEmptyComponent={(isLoading)? <ShowLoading />: (isError)? <CustomShowError message={messageError} />: undefined}
                renderItem={_renderItem}
            />
        </View>
        <ChangePermissionsUser ref={refChangePermissionsUser} />
    </View>);
});

const ShowLoading = React.memo(function ShowLoading() {
    const { theme } = useContext(ThemeContext);
    return(<View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={'large'} color={theme.colors.primary} />
    </View>);
});