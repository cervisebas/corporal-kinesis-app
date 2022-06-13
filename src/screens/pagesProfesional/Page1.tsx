import { decode } from "base-64";
import React, { PureComponent } from "react";
import { Component, ReactNode } from "react";
import { DeviceEventEmitter, Dimensions, EmitterSubscription, FlatList, ListRenderItemInfo, RefreshControl, StyleProp, StyleSheet, ToastAndroid, View, ViewStyle } from "react-native";
import { ActivityIndicator, Appbar, Button, Dialog, Divider, List, Paragraph, Portal, Snackbar, Text, TouchableRipple } from "react-native-paper";
import { Account, Comment, Exercise, Options, Training } from "../../scripts/ApiCorporal";
import { commentsData, dataExercise, dataListUsers, DetailsTrainings, trainings, userData } from "../../scripts/ApiCorporal/types";
import { Global } from "../../scripts/Global";
import CombinedTheme from "../../Theme";
import { CustomCard2, CustomItemList2, CustomShowError } from "../components/Components";
import ViewMoreDetails from "../pages/pages/viewMoreDetails";
import AddNewAccount from "./pages/addNewAccount";
import AddTraining from "./pages/addTraining";
import SearchClient from "./pages/searchClient";
import SelectClient from "./pages/selectClient";
import SetCommentUser from "./pages/setCommentUser";
import ViewClietDetails from "./pages/viewClientDetails";
import ViewComments from "./pages/viewComments";
import ViewTraining from "./pages/viewTraining";

const { width } = Dimensions.get('window');

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
    userList2: dataListUsers[];
    userList3: dataListUsers[];
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
    viewComments: boolean;
    dataComments: commentsData[];
    excercisesList: dataExercise[];
    viewTrainigsDetails: boolean;
    dataTrainigsDetails: trainings[];
    viewMoreDetailsVisible: boolean;
    viewMoreDetailsTraining: DetailsTrainings;
    viewMoreDetailsComment: commentsData | undefined;
    addTrainingUserSelect: { id: string; name: string; } | undefined;
    showUserSelect: boolean;
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
            userList2: [],
            userList3: [],
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
            idActualSendComment: '',
            viewComments: false,
            dataComments: [],
            excercisesList: [],
            viewTrainigsDetails: false,
            dataTrainigsDetails: [],
            viewMoreDetailsVisible: false,
            viewMoreDetailsTraining: this.reserve1,
            viewMoreDetailsComment: undefined,
            addTrainingUserSelect: undefined,
            showUserSelect: false
        };
        this._renderItem = this._renderItem.bind(this);
    }
    private reserve1 = { id: '-1', date: { value: '-', status: -1, difference: undefined }, session_number: { value: '-', status: -1, difference: undefined }, rds: { value: '-', status: -1, difference: undefined }, rpe: { value: '-', status: -1, difference: undefined }, pulse: { value: '-', status: -1, difference: undefined }, repetitions: { value: '-', status: -1, difference: undefined }, kilage: { value: '-', status: -1, difference: undefined }, tonnage: { value: '-', status: -1, difference: undefined }, exercise: { name: 'No disponible', status: -1, description: '' } };
    private detailsClientDataDefault = { id: '', name: '', email: '', birthday: '', dni: '', phone: '', experience: '', image: '', type: '', num_trainings: '' };
    private event: EmitterSubscription | null = null;
    componentDidMount() {
        this.loadData();
        this.event = DeviceEventEmitter.addListener('adminPage1Reload', ()=>this.loadData());
    }
    componentWillUnmount() {
        this.setState({
            isLoading: true,
            isError: false,
            messageError: '',
            userList: [],
            userList2: [],
            userList3: [],
            refreshing: false,
            loadingText: '',
            errorTitle: '',
            errorMessage: '',
            detailsClientData: this.detailsClientDataDefault,
            textSnackBar: '',
            idActualDeleteClient: '',
            idActualSendComment: '',
            dataComments: [],
            excercisesList: [],
            dataTrainigsDetails: [],
            viewMoreDetailsTraining: this.reserve1,
            viewMoreDetailsComment: undefined
        });
        this.event?.remove();
        this.event = null;
    }
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
                .then((data)=>{
                    this.setState({ userList: data });
                    Options.getAll()
                        .then((opt)=>{
                            var filter = data.filter((vals)=>vals.permission == '0');
                            (opt.viewAdmins1)? this.setState({ isLoading: false, userList2: filter }): this.setState({ isLoading: false, userList2: data });
                            (opt.viewAdmins2)? this.setState({ userList3: filter }): this.setState({ userList3: data });
                        })
                        .catch(()=>this.setState({ isLoading: false, userList2: data }));
                })
                .catch((error)=>this.setState({ isError: true, isLoading: false, messageError: error.cause }));
            Exercise.getAll()
                .then((data)=>this.setState({ excercisesList: data }))
                .catch((error)=>this.setState({ isError: true, isLoading: false, messageError: error.cause }));
            if (this.state.refreshing) this.setState({ refreshing: false });
        });
    }
    reloadDataComment() {
        this.setState({ loadingView: true, loadingText: 'Obteniendo información...' }, ()=>
            Comment.admin_getAllAccount(this.state.detailsClientData.id)
                .then((value)=>this.setState({ dataComments: value.reverse(), loadingView: false, loadingText: '' }))
                .catch((error)=>this.setState({ errorView: true, errorTitle: 'Ocurrio un error', errorMessage: error.cause }))
        );
    }
    reloadDataTraining() {
        this.setState({ loadingView: true, loadingText: 'Obteniendo información...' }, ()=>
            Training.admin_getAllAccount(this.state.detailsClientData.id)
                .then((value)=>this.setState({ dataTrainigsDetails: value.reverse(), loadingView: false, loadingText: '' }))
                .catch((error)=>this.setState({ errorView: true, errorTitle: 'Ocurrio un error', errorMessage: error.cause }))
        );
    }
    openAddTraining() {
        if (this.state.excercisesList.length !== 0)
            this.setState({ showAddTraining: true });
        else
            this.setState({ errorView: true, errorTitle: '¡¡¡Atención!!!', errorMessage: 'Debes añadir ejercicios en la lista antes de realizar cargas.' });
    }

    /*###### FlatList Control ######*/
    _getItemLayout(_i: any, index: number) { return { length: 64, offset: 64 * index, index }; }
    _keyExtractor(item: dataListUsers, _i: number) { return `p1-admin-${item.id}`; }
    _renderItem({ item }: ListRenderItemInfo<dataListUsers>) {
        return(<CustomItemList2
            key={`p1-admin-${item.id}`}
            image={item.image}
            title={decode(item.name)}
            onPress={()=>this.goDetailsClient(item.id)}
            actionDelete={()=>this.setState({ idActualDeleteClient: item.id, showQuestionDeleteUser: true })}
            actionComment={()=>this.setState({ idActualSendComment: item.id, showSendComment: true })}
        />);
    }
    /*##############################*/

    render(): ReactNode {
        return(<View style={{ flex: 1 }}>
            <Appbar style={{ backgroundColor: '#1663AB', height: 56 }}>
                <Appbar.Action icon="menu" onPress={()=>this.props.navigation.openDrawer()} />
                <Appbar.Content title={'Inicio'}  />
            </Appbar>
            <View style={{ flex: 2, overflow: 'hidden' }}>
                <FlatList
                    data={this.state.userList2}
                    keyExtractor={this._keyExtractor}
                    getItemLayout={this._getItemLayout}
                    removeClippedSubviews={true}
                    contentContainerStyle={{ flex: (this.state.isLoading || this.state.isError || this.state.userList.length == 0)? 3: undefined }}
                    refreshControl={<RefreshControl colors={[CombinedTheme.colors.accent]} refreshing={this.state.refreshing} onRefresh={()=>this.setState({ refreshing: true }, ()=>this.loadData())} />}
                    ItemSeparatorComponent={()=><Divider />}
                    ListEmptyComponent={(this.state.isLoading)? <ShowLoading />: (this.state.isError)? <CustomShowError message={this.state.messageError} />: <></>}
                    ListHeaderComponent={<ButtonsHeaderList load={(this.state.isError)? false: !this.state.isLoading} click1={()=>this.openAddTraining()} click2={()=>this.setState({ showSearchClient: true })}/>}
                    ListFooterComponent={(!this.state.isLoading)? <TouchableRipple onPress={()=>this.setState({ showAddNewUser: true })}><List.Item title={'Añadir nuevo usuario'} left={(props)=><List.Icon {...props} icon="account-plus" />} /></TouchableRipple>: <></>}
                    renderItem={this._renderItem}
                />
                <AddNewAccount show={this.state.showAddNewUser} close={()=>this.setState({ showAddNewUser: false })} />
                <Snackbar visible={this.state.showSnackBar} style={{ backgroundColor: '#1663AB' }} onDismiss={()=>this.setState({ showSnackBar: false })}><Text>{this.state.textSnackBar}</Text></Snackbar>
                <AddTraining
                    show={this.state.showAddTraining}
                    listUsers={this.state.userList}
                    close={()=>this.setState({ showAddTraining: false })}
                    listExercise={this.state.excercisesList}
                    userSelect={this.state.addTrainingUserSelect}
                    openUserSelect={()=>this.setState({ showUserSelect: true })}
                    clearUserSelect={()=>this.setState({ addTrainingUserSelect: undefined })} />
                <SearchClient show={this.state.showSearchClient} listUsers={this.state.userList} goDetailsClient={(idClient)=>this.goDetailsClient(idClient)} close={()=>this.setState({ showSearchClient: false })} showLoading={(visible, message, after)=>this.setState({ loadingView: visible, loadingText: message }, ()=>(after)&&after())} showSnackOut={(text)=>this.setState({ showSnackBar: true, textSnackBar: text })} />
                <Global loadingView={this.state.loadingView} loadingText={this.state.loadingText} />
                <ViewClietDetails
                    show={this.state.detailsClientView}
                    close={()=>this.setState({ detailsClientView: false })}
                    completeClose={()=>setTimeout(()=>this.setState({ detailsClientData: this.detailsClientDataDefault }), 600)}
                    userData={this.state.detailsClientData}
                    goLoading={(show, text, after)=>this.setState({ loadingView: show, loadingText: text }, ()=>(after)&&after())}
                    openAllComment={(data)=>this.setState({ dataComments: data, viewComments: true })}
                    openAllTrainings={(data)=>this.setState({ dataTrainigsDetails: data, viewTrainigsDetails: true })}
                    showExternalSnackbar={(text, after)=>this.setState({ showSnackBar: true, textSnackBar: text }, ()=>(after)&&after())} />
                <ViewComments show={this.state.viewComments} close={()=>this.setState({ viewComments: false })} closeComplete={()=>setTimeout(()=>this.setState({ dataComments: [] }), 600)} data={this.state.dataComments} reloadData={()=>this.reloadDataComment()} goLoading={(show, text, after)=>this.setState({ loadingView: show, loadingText: text }, ()=>(after)&&after())} />
                <ViewTraining
                    visible={this.state.viewTrainigsDetails}
                    trainings={this.state.dataTrainigsDetails}
                    close={()=>this.setState({ viewTrainigsDetails: false })}
                    goLoading={(show, message, after)=>this.setState({ loadingView: show, loadingText: message }, ()=>(after)&&after())}
                    reload={()=>this.reloadDataTraining()}
                    goMoreDetails={(training, comment)=>this.setState({ viewMoreDetailsVisible: true, viewMoreDetailsTraining: training, viewMoreDetailsComment: comment })}
                    accountId={this.state.detailsClientData.id} />
                <ViewMoreDetails
                    visible={this.state.viewMoreDetailsVisible}
                    close={()=>this.setState({ viewMoreDetailsVisible: false, viewMoreDetailsTraining: this.reserve1, viewMoreDetailsComment: undefined })}
                    dataShow={this.state.viewMoreDetailsTraining}
                    commentData={this.state.viewMoreDetailsComment} />
                <SelectClient
                    visible={this.state.showUserSelect}
                    close={()=>this.setState({ showUserSelect: false })}
                    dataUser={this.state.userList3}
                    onSelect={(data)=>this.setState({ addTrainingUserSelect: data, showUserSelect: false })} />
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
                    <Dialog visible={this.state.errorView} onDismiss={()=>this.setState({ errorView: false })}>
                        <Dialog.Title>{this.state.errorTitle}</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>{this.state.errorMessage}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={()=>this.setState({ errorView: false })}>Aceptar</Button>
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
}

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
    private styleCard: StyleProp<ViewStyle> = {
        width: '100%',
        marginTop: 12,
        backgroundColor: '#ED7035',
        height: 56
    };
    render(): React.ReactNode {
        return(<View style={{ ...styles.cardRowContent, width: width }}>
            <View style={{ ...styles.cardContents, paddingLeft: 8, paddingRight: 5 }}>
                <CustomCard2
                    style={this.styleCard}
                    icon={'plus'}
                    title={'Cargar'}
                    onPress={()=>(this.props.load)? this.props.click1(): ToastAndroid.show('No se puede abrir este apartado en este momento...', ToastAndroid.SHORT)}/>
            </View>
            <View style={{ ...styles.cardContents, paddingLeft: 5, paddingRight: 8 }}>
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