import { decode } from "base-64";
import React, { PureComponent } from "react";
import { Component, ReactNode } from "react";
import { DeviceEventEmitter, Dimensions, FlatList, RefreshControl, StyleProp, StyleSheet, ToastAndroid, View, ViewStyle } from "react-native";
import { ActivityIndicator, Appbar, Button, Dialog, List, Paragraph, Portal, Snackbar, Text, TouchableRipple } from "react-native-paper";
import { Account, Comment } from "../../scripts/ApiCorporal";
import { dataListUsers, userData } from "../../scripts/ApiCorporal/types";
import { Global } from "../../scripts/Global";
import CombinedTheme from "../../Theme";
import { CustomCard2, CustomItemList2, CustomShowError } from "../components/Components";
import DialogError from "../components/DialogError";
import AddNewAccount from "./pages/addNewAccount";
import AddTraining from "./pages/addTraining";
import SearchClient from "./pages/searchClient";
import SetCommentUser from "./pages/setCommentUser";
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
    showAddNewUser: boolean;
    showSnackBar: boolean;
    textSnackBar: string;
    idActualDeleteClient: string;
    showQuestionDeleteUser: boolean;
    showSendComment: boolean;
    idActualSendComment: string;
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
            detailsClientData: this.detailsClientDataDefault,
            showAddNewUser: false,
            showSnackBar: false,
            textSnackBar: '',
            idActualDeleteClient: '',
            showQuestionDeleteUser: false,
            showSendComment: false,
            idActualSendComment: ''
        };
    }
    private detailsClientDataDefault = { id: '', name: '', email: '', birthday: '', dni: '', phone: '', experience: '', image: '', type: '' };
    componentDidMount() {
        this.loadData();
        DeviceEventEmitter.addListener('adminPage1Reload', ()=>this.loadData());
    }
    componentWillUnmount() { this.setState({ showAddTraining: false, showSearchClient: false, isLoading: true, isError: false, messageError: '', userList: [], refreshing: false, loadingView: false, loadingText: '', }); }
    goDetailsClient(idClient: string) {
        this.setState({ loadingView: true, loadingText: 'Cargando datos del usuario...' }, ()=>
            Account.admin_getUserData(idClient)
                .then((dataUser)=>this.setState({ loadingView: false, loadingText: '', detailsClientView: true, detailsClientData: dataUser }))
                .catch((error)=>this.setState({ loadingView: false, loadingText: '', errorView: true, errorTitle: 'Ocurrio un error', errorMessage: error.cause }))
        );
    }
    deleteClient(idClient: string) {
        this.setState({ loadingView: true, loadingText: 'Borrando información del cliente...' }, ()=>
            Account.admin_delete(idClient)
                .then(()=>this.setState({ loadingView: false, loadingText: '', showSnackBar: true, textSnackBar: 'Usuario borrado correctamente.', idActualDeleteClient: '' }, ()=>this.loadData()))
                .catch((error)=>this.setState({ loadingView: false, loadingText: '', errorView: true, errorTitle: 'Ocurrio un error', errorMessage: error.cause }))
        );
    }
    sendComment(comment: string) {
        this.setState({ loadingView: true, loadingText: 'Enviando mensaje...' }, ()=>
            Comment.admin_create(this.state.idActualSendComment, comment)
                .then(()=>this.setState({ loadingView: false, loadingText: '', showSnackBar: true, textSnackBar: 'Comentario enviado correctamente.', idActualDeleteClient: '' }))
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
                    ListFooterComponent={(!this.state.isLoading)? <TouchableRipple onPress={()=>this.setState({ showAddNewUser: true })}><List.Item title={'Añadir nuevo usuario'} left={(props)=><List.Icon {...props} icon="account-plus" />} /></TouchableRipple>: <></>}
                    renderItem={({ item, index })=><CustomItemList2
                        key={index}
                        image={item.image}
                        title={decode(item.name)}
                        onPress={()=>this.goDetailsClient(item.id)}
                        actionDelete={()=>this.setState({ idActualDeleteClient: item.id, showQuestionDeleteUser: true })}
                        actionComment={()=>this.setState({ idActualSendComment: item.id, showSendComment: true })}
                    />}
                />
                <AddNewAccount show={this.state.showAddNewUser} close={()=>this.setState({ showAddNewUser: false })} />
                <Snackbar visible={this.state.showSnackBar} style={{ backgroundColor: '#1663AB' }} onDismiss={()=>this.setState({ showSnackBar: false })}><Text>{this.state.textSnackBar}</Text></Snackbar>
                <DialogError show={this.state.errorView} close={()=>this.setState({ errorView: false })} title={this.state.errorTitle} message={this.state.errorMessage} />
                <AddTraining show={this.state.showAddTraining} listUsers={this.state.userList} close={()=>this.setState({ showAddTraining: false })} />
                <SearchClient show={this.state.showSearchClient} listUsers={this.state.userList} goDetailsClient={(idClient)=>this.goDetailsClient(idClient)} close={()=>this.setState({ showSearchClient: false })} />
                <Global loadingView={this.state.loadingView} loadingText={this.state.loadingText} />
                <ViewClietDetails show={this.state.detailsClientView} close={()=>this.setState({ detailsClientView: false })} completeClose={()=>this.setState({ detailsClientData: this.detailsClientDataDefault })} userData={this.state.detailsClientData} />
                <Portal>
                    <Dialog visible={this.state.showQuestionDeleteUser}>
                        <Dialog.Title>¡¡Advertencia!!</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>{'¿Estás de acuerdo que quieres borrar este usuario junto a toda su información?\n\nEsta acción no se podrá deshacer luego de una vez realizada.'}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={()=>this.setState({ showQuestionDeleteUser: false })}>Cancelar</Button>
                            <Button onPress={()=>this.setState({ showQuestionDeleteUser: false }, ()=>this.deleteClient(this.state.idActualDeleteClient))}>Aceptar</Button>
                        </Dialog.Actions>
                    </Dialog>
                    <SetCommentUser
                        visible={this.state.showSendComment}
                        close={()=>this.setState({ showSendComment: false, idActualSendComment: '' })}
                        send={(text)=>this.setState({ showSendComment: false }, ()=>this.sendComment(text))}
                    />
                </Portal>
            </View>
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