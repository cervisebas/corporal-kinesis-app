import { decode } from "base-64";
import { stringify } from "qs";
import React, { PureComponent } from "react";
import { Component, ReactNode } from "react";
import { Dimensions, FlatList, RefreshControl, StyleProp, StyleSheet, ToastAndroid, View, ViewStyle } from "react-native";
import { ActivityIndicator, Appbar, List, Portal } from "react-native-paper";
import { Account } from "../../scripts/ApiCorporal";
import { dataListUsers, userData } from "../../scripts/ApiCorporal/types";
import { Global } from "../../scripts/Global";
import CombinedTheme from "../../Theme";
import { CustomCard2, CustomItemList2, CustomShowError } from "../components/Components";
import DialogError from "../components/DialogError";
import AddTraining from "./pages/addTraining";
import SearchClient from "./pages/searchClient";
import ViewClietDetails from "./pages/viewClientDetails";

const { width } = Dimensions.get('window');
const percent = (px: number, per: number)=>(per * px)/100;

type IProps = {
    navigation: any;
    route: any;
};
type IState = {
    showAddTraining: boolean;
    showSearchClient: boolean;
    isLoading: boolean;
    isError: boolean;
    messageError: string;
    userList: dataListUsers[];
    refreshing: boolean;
    loadingView: boolean;
    loadingText: string;
    errorView: boolean;
    errorTitle: string;
    errorMessage: string;
    detailsClientView: boolean;
    detailsClientData: userData;
};

export default class Page1 extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            showAddTraining: false,
            showSearchClient: false,
            isLoading: true,
            isError: false,
            messageError: '',
            userList: [],
            refreshing: false,
            loadingView: false,
            loadingText: '',
            errorView: false,
            errorTitle: '',
            errorMessage: '',
            detailsClientView: false,
            detailsClientData: this.detailsClientDataDefault
        };
    }
    private detailsClientDataDefault = { id: '', name: '', email: '', birthday: '', dni: '', phone: '', experience: '', image: '' };
    componentDidMount() { this.loadData(); }
    componentWillUnmount() { this.setState({ showAddTraining: false, showSearchClient: false, isLoading: true, isError: false, messageError: '', userList: [], refreshing: false, loadingView: false, loadingText: '', }); }
    goDetailsClient(idClient: string) {
        this.setState({ loadingView: true, loadingText: 'Cargando datos del usuario...' }, ()=>
            Account.admin_getUserData(idClient)
                .then((dataUser)=>this.setState({ loadingView: false, loadingText: '', detailsClientView: true, detailsClientData: dataUser }))
                .catch((error)=>this.setState({ loadingView: false, loadingText: '', errorView: true, errorTitle: 'Ocurrio un error', errorMessage: error.cause }))
        );
    }
    loadData() {
        this.setState({ isLoading: true, isError: false, userList: [] }, ()=>{
            Account.admin_getListUser()
                .then((data)=>this.setState({ isLoading: false, userList: data }))
                .catch((error)=>this.setState({ isError: true, isLoading: false, messageError: error.cause }));
            if (this.state.refreshing) this.setState({ refreshing: false });
        });
    }
    render(): ReactNode {
        return(<View style={{ flex: 1 }}>
            <Appbar style={{ backgroundColor: '#1663AB', height: 56 }}>
                <Appbar.Action icon="menu" onPress={()=>this.props.navigation.openDrawer()} />
                <Appbar.Content title={'Inicio'}  />
            </Appbar>
            <View style={{ flex: 2, overflow: 'hidden' }}>
                <FlatList
                    data={this.state.userList}
                    contentContainerStyle={{ flex: 3 }}
                    refreshControl={<RefreshControl colors={[CombinedTheme.colors.accent]} refreshing={this.state.refreshing} onRefresh={()=>this.setState({ refreshing: true }, ()=>this.loadData())} />}
                    ListEmptyComponent={(this.state.isLoading)? <ShowLoading />: (this.state.isError)? <CustomShowError message={this.state.messageError} />: <></>}
                    ListHeaderComponent={<ButtonsHeaderList load={(this.state.isError)? false: !this.state.isLoading} click1={()=>this.setState({ showAddTraining: true })} click2={()=>this.setState({ showSearchClient: true })}/>}
                    renderItem={({ item, index })=><CustomItemList2 key={index} image={item.image} title={decode(item.name)} onPress={()=>this.goDetailsClient(item.id)} />}
                />
            </View>
            <DialogError show={this.state.errorView} close={()=>this.setState({ errorView: false })} title={this.state.errorTitle} message={this.state.errorMessage} />
            <AddTraining show={this.state.showAddTraining} listUsers={this.state.userList} close={()=>this.setState({ showAddTraining: false })} />
            <SearchClient show={this.state.showSearchClient} listUsers={this.state.userList} goDetailsClient={(idClient)=>this.goDetailsClient(idClient)} close={()=>this.setState({ showSearchClient: false })} />
            <Global loadingView={this.state.loadingView} loadingText={this.state.loadingText} />
            <ViewClietDetails show={this.state.detailsClientView} close={()=>this.setState({ detailsClientView: false, detailsClientData: this.detailsClientDataDefault })} userData={this.state.detailsClientData} />
        </View>);
    }
};

class ShowLoading extends PureComponent {
    constructor(props: any) { super(props); }
    render(): React.ReactNode {
        return(<View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={'large'} color={CombinedTheme.colors.accent} />
        </View>);
    }
}
class ButtonsHeaderList extends PureComponent<{ load: boolean; click1: ()=>any; click2: ()=>any; }> {
    constructor(props: any) { super(props); }
    private styleCard: StyleProp<ViewStyle> = { width: percent(width, 50) - 18, marginTop: 18, backgroundColor: '#ED7035', height: 56 };
    render(): React.ReactNode {
        return(<View style={{ ...styles.cardRowContent, width: width }}>
            <View style={styles.cardContents}>
                <CustomCard2
                    style={this.styleCard}
                    icon={'plus'}
                    title={'Cargar'}
                    onPress={()=>(this.props.load)? this.props.click1(): ToastAndroid.show('No se puede abrir este apartado en este momento...', ToastAndroid.SHORT)}/>
            </View>
            <View style={styles.cardContents}>
                <CustomCard2
                    style={this.styleCard}
                    icon={'magnify'}
                    title={'Buscar'}
                    onPress={()=>(this.props.load)? this.props.click2(): ToastAndroid.show('No se puede abrir este apartado en este momento...', ToastAndroid.SHORT)}/>
            </View>
        </View>);
    }
};

const styles = StyleSheet.create({
    cardRowContent: {
        flexDirection: 'row',
        paddingBottom: 16
    },
    cardContents: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '50%'
    }
});