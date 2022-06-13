import { decode } from "base-64";
import React, { PureComponent } from "react";
import { Component, ReactNode } from "react";
import { DeviceEventEmitter, EmitterSubscription, FlatList, RefreshControl, ToastAndroid, View } from "react-native";
import { ActivityIndicator, Appbar, Divider } from "react-native-paper";
import { Options, Permission } from "../../scripts/ApiCorporal";
import { permissionItem } from "../../scripts/ApiCorporal/types";
import { Global } from "../../scripts/Global";
import CombinedTheme from "../../Theme";
import { CustomItemList3, CustomShowError } from "../components/Components";
import ChangePermissionsUser from "./pages/changePermissionsUser";

type IProps = {
    navigation: any;
    route: any;
};
type IState = {
    userList: permissionItem[];
    isLoading: boolean;
    isError: boolean;
    messageError: string;
    refreshing: boolean;

    viewChangePermission: boolean;
    dataChangePermission: {
        id: string;
        name: string;
        image: string;
        birthday: string;
        actualStatus: string;
    } | undefined;

    loadingView: boolean;
    loadingText: string;

    oldList: permissionItem[];
    isFilter: boolean;
};

export default class Page2 extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            userList: [],
            isLoading: true,
            isError: false,
            messageError: '',
            refreshing: false,
            viewChangePermission: false,
            dataChangePermission: undefined,
            loadingView: false,
            loadingText: '',
            oldList: [],
            isFilter: false
        };
    }
    private event: EmitterSubscription | null = null;
    componentWillUnmount() {
        this.event?.remove();
        this.event = null;
        this.setState({
            userList: [],
            isLoading: true,
            isError: false,
            messageError: '',
            refreshing: false,
            dataChangePermission: undefined,
            loadingText: '',
            oldList: [],
            isFilter: false
        });
    }
    componentDidMount() {
        this.loadData();
        this.event = DeviceEventEmitter.addListener('adminPage2Reload', ()=>this.loadData());
    }
    loadData() {
        this.setState({ userList: [], isLoading: true, isFilter: false, isError: false, messageError: '' }, ()=>{
            Permission.getAll()
                .then((list)=>this.setState({ userList: list, isLoading: false }, ()=>Options.getAll().then((vals)=>(vals.activeFilters)&&this.goFilter())))
                .catch((error)=>this.setState({ userList: [], isLoading: false, isError: true, messageError: error.cause }));
            if (this.state.refreshing) this.setState({ refreshing: false });
        }); 
    }
    adminTag(type: string): string {
        var tag: string = '';
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
    goFilter() {
        if (this.state.isLoading) return ToastAndroid.show('Espere...', ToastAndroid.SHORT);
        if (this.state.isFilter) return this.setState({ userList: this.state.oldList }, ()=>this.setState({ oldList: [], isFilter: false }));
        this.setState({ oldList: this.state.userList }, ()=>this.setState({ isLoading: true, userList: [] }, ()=>{
            var newUserList: permissionItem[] = [];
            this.state.oldList.forEach((element)=>(element.permission == '4')&&newUserList.push(element));
            this.state.oldList.forEach((element)=>(element.permission == '3')&&newUserList.push(element));
            this.state.oldList.forEach((element)=>(element.permission == '2')&&newUserList.push(element));
            this.state.oldList.forEach((element)=>(element.permission == '1')&&newUserList.push(element));
            this.state.oldList.forEach((element)=>(element.permission == '0')&&newUserList.push(element));
            this.setState({ userList: newUserList, isFilter: true, isLoading: false });
        }));
    }

    /*###### FlatList Control ######*/
    _getItemLayout(_i: any, index: number) { return { length: 72, offset: 72 * index, index }; }
    _keyExtractor(item: permissionItem, _i: number) { return `p2-admin-${item.id}`; }
    /*##############################*/

    render(): ReactNode {
        return(<View style={{ flex: 1 }}>
            <Appbar style={{ backgroundColor: '#1663AB', height: 56 }}>
                <Appbar.Action icon="menu" onPress={()=>this.props.navigation.openDrawer()} />
                <Appbar.Content title={'Administradores'}  />
                <Appbar.Action icon={'account-filter-outline'} onPress={()=>this.goFilter()} />
            </Appbar>
            <View style={{ flex: 2, overflow: 'hidden' }}>
                <FlatList
                    data={this.state.userList}
                    keyExtractor={this._keyExtractor}
                    getItemLayout={this._getItemLayout}
                    removeClippedSubviews={true}
                    contentContainerStyle={{ flex: (this.state.isLoading || this.state.isError)? 3: undefined }}
                    ItemSeparatorComponent={(props)=><Divider {...props} />}
                    refreshControl={<RefreshControl colors={[CombinedTheme.colors.accent]} refreshing={this.state.refreshing} onRefresh={()=>this.setState({ refreshing: true }, ()=>this.loadData())} />}
                    ListEmptyComponent={(this.state.isLoading)? <ShowLoading />: (this.state.isError)? <CustomShowError message={this.state.messageError} />: <></>}
                    renderItem={({ item })=><CustomItemList3
                        key={`p2-admin-${item.id}`}
                        subtitle={this.adminTag(item.permission)}
                        type={item.permission}
                        image={item.accountData.image}
                        title={decode(item.accountData.name)}
                        onPress={()=>this.setState({
                            viewChangePermission: true,
                            dataChangePermission: {
                                id: item.idUser,
                                name: item.accountData.name,
                                image: item.accountData.image,
                                birthday: item.accountData.birthday,
                                actualStatus: item.permission
                            }
                        })}
                    />}
                />
                <Global loadingView={this.state.loadingView} loadingText={this.state.loadingText} />
                <ChangePermissionsUser
                    visible={this.state.viewChangePermission}
                    infoUser={this.state.dataChangePermission}
                    close={()=>this.setState({ viewChangePermission: false })}
                    closeComplete={()=>setTimeout(()=>this.setState({ dataChangePermission: undefined }), 300)}
                    showLoading={(visible, text, after)=>this.setState({ loadingView: visible, loadingText: text }, ()=>(after)&&after())}
                />
            </View>
        </View>);
    }
}

class ShowLoading extends PureComponent {
    constructor(props: any) { super(props); }
    render(): React.ReactNode {
        return(<View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={'large'} color={CombinedTheme.colors.accent} />
        </View>);
    }
}