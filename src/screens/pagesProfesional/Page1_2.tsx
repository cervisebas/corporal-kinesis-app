import { decode } from "base-64";
import React, { PureComponent, createRef, useEffect, useState } from "react";
import { Component, ReactNode } from "react";
import { DeviceEventEmitter, Dimensions, EmitterSubscription, FlatList, ListRenderItemInfo, RefreshControl, StyleProp, StyleSheet, ToastAndroid, View, ViewStyle } from "react-native";
import { ActivityIndicator, Appbar, Button, Dialog, Divider, List, Paragraph, Portal, Snackbar, Text, TouchableRipple } from "react-native-paper";
import ImageView from "react-native-image-viewing";
import { Account, Comment, Exercise, HostServer, Options, Training } from "../../scripts/ApiCorporal";
import { commentsData, dataExercise, dataListUsers, DetailsTrainings, trainings, userData } from "../../scripts/ApiCorporal/types";
import { Global } from "../../scripts/Global";
import CombinedTheme from "../../Theme";
import { CustomItemList2, CustomShowError } from "../components/Components";
import ViewMoreDetails from "./pages/viewMoreDetails2";
import AddNewAccount from "./pages/addNewAccount";
import AddTraining from "./pages/addTraining";
import SearchClient from "./pages/searchClient";
import SelectClient from "./pages/selectClient";
import SetCommentUser from "./pages/setCommentUser";
import ViewClietDetails from "./pages/viewClientDetails";
import ViewComments from "./pages/viewComments";
import ViewTraining from "./pages/viewTraining";
import EditClientProfessional, { EditClientProfessionalRef } from "./pages/editClient";
import CustomCard2 from "../components/CustomCard2";
import LoadingComponent, { LoadingComponentRef } from "../components/LoadingComponent";
import AlertDialog, { AlertDialogRef } from "../components/AlertDialog";
import CustomSnackbar, { CustomSnackbarRef } from "../components/CustomSnackbar";

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
    viewImageShow: boolean;
};

/*export default class Page1 extends Component<IProps, IState> {
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
            showUserSelect: false,
            viewImageShow: false
        };
        this._renderItem = this._renderItem.bind(this);
        this._openEditClient = this._openEditClient.bind(this);
    }
    private reserve1 = { id: '-1', date: { value: '-', status: -1, difference: undefined }, session_number: { value: '-', status: -1, difference: undefined }, rds: { value: '-', status: -1, difference: undefined }, rpe: { value: '-', status: -1, difference: undefined }, pulse: { value: '-', status: -1, difference: undefined }, repetitions: { value: '-', status: -1, difference: undefined }, kilage: { value: '-', status: -1, difference: undefined }, tonnage: { value: '-', status: -1, difference: undefined }, exercise: { name: 'No disponible', status: -1, description: '' } };
    private detailsClientDataDefault = { id: '', name: '', email: '', birthday: '', dni: '', phone: '', experience: '', image: '', type: '', num_trainings: '' };
    private event: EmitterSubscription | null = null;
    private refEditClientProfessional = createRef<EditClientProfessionalRef>();

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
                            var filter = data.filter((vals)=>{
                                if (opt.viewDev) {
                                    if (vals.id == '1') return false;
                                }
                                if (opt.viewAdmins1) {
                                    if (vals.permission !== '0') return false;                                    
                                }
                                return true;
                            });
                            this.setState({ isLoading: false, userList2: filter });
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

    _openEditClient() {
        this.refEditClientProfessional.current?.open();
    }

    _getItemLayout(_i: any, index: number) { return { length: 64, offset: 64 * index, index }; }
    _keyExtractor(item: dataListUsers, _i: number) { return `p1-admin-${item.id}`; }
    _ItemSeparatorComponent() { return(<Divider />); }
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
                    contentContainerStyle={{ flex: (this.state.isLoading || this.state.isError || this.state.userList.length == 0)? 3: undefined }}
                    refreshControl={<RefreshControl colors={[CombinedTheme.colors.accent]} refreshing={this.state.refreshing} onRefresh={()=>this.setState({ refreshing: true }, ()=>this.loadData())} />}
                    ItemSeparatorComponent={this._ItemSeparatorComponent}
                    ListEmptyComponent={(this.state.isLoading)? <ShowLoading />: (this.state.isError)? <CustomShowError message={this.state.messageError} />: <></>}
                    ListHeaderComponent={<ButtonsHeaderList load={(this.state.isError)? false: !this.state.isLoading} click1={()=>this.openAddTraining()} click2={()=>this.setState({ showSearchClient: true })}/>}
                    ListFooterComponent={(!this.state.isLoading)? <TouchableRipple onPress={()=>this.setState({ showAddNewUser: true })}><List.Item title={'Añadir nuevo usuario'} left={(props)=><List.Icon {...props} icon="account-plus" />} /></TouchableRipple>: <></>}
                    renderItem={this._renderItem}
                />
                <AddNewAccount show={this.state.showAddNewUser} close={()=>this.setState({ showAddNewUser: false })} />
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
                    showExternalSnackbar={(text, after)=>this.setState({ showSnackBar: true, textSnackBar: text }, ()=>(after)&&after())}
                    viewImage={()=>this.setState({ viewImageShow: true })}
                    openEditClient={this._openEditClient}
                />
                {(this.state.detailsClientView)&&<>
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
                    <ImageView
                        images={[{ uri: `${HostServer}/images/accounts/${decode(this.state.detailsClientData.image)}` }]}
                        imageIndex={0}
                        visible={this.state.viewImageShow}
                        onRequestClose={()=>this.setState({ viewImageShow: false })}
                    />
                </>}
                {(this.state.showAddTraining)&&<SelectClient
                    visible={this.state.showUserSelect}
                    close={()=>this.setState({ showUserSelect: false })}
                    dataUser={this.state.userList3}
                    onSelect={(data)=>this.setState({ addTrainingUserSelect: data, showUserSelect: false })}
                />}
                <EditClientProfessional ref={this.refEditClientProfessional} />
                <Snackbar visible={this.state.showSnackBar} style={{ backgroundColor: '#1663AB' }} onDismiss={()=>this.setState({ showSnackBar: false })}><Text>{this.state.textSnackBar}</Text></Snackbar>
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
}*/

export default React.memo(function Page1(props: IProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [mError, setMerror] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [userList, setUserList] = useState<dataListUsers[]>([]);
    const [excList, setExcList] = useState<dataExercise[]>([]);
    // Variables
    var completeList: dataListUsers[] = [];
    var event: EmitterSubscription | undefined = undefined;
    var actualIDAccount: string = '-1';
    // Ref's
    const refEditClientProfessional = createRef<EditClientProfessionalRef>();
    const refViewClietDetails = createRef<ViewClietDetails>();
    const refLoadingComponent = createRef<LoadingComponentRef>();
    const refAlertDialog = createRef<AlertDialogRef>();
    const refViewTraining = createRef<ViewTraining>();
    const refViewMoreDetails = createRef<ViewMoreDetails>();
    const refCustomSnackbar = createRef<CustomSnackbarRef>();

    /* ##### FlatList ##### */
    function _getItemLayout(_i: any, index: number) { return {length: 64, offset: 64 * index, index}; }
    function _keyExtractor(item: dataListUsers, _i: number) { return `p1-admin-${item.id}`; }
    function _ItemSeparatorComponent() { return(<Divider />); }
    function _renderItem({ item }: ListRenderItemInfo<dataListUsers>) {
        return(<CustomItemList2
            key={`p1-admin-${item.id}`}
            image={item.image}
            title={decode(item.name)}
            onPress={()=>openViewDetailsClient(item.id)}
            actionDelete={()=>undefined}
            actionComment={()=>undefined}
        />);
    }
    /* #################### */

    function setErrAlert(error: any) {
        setError(true);
        setMerror(error.cause);
        setLoading(false);
        setRefresh(false);
    }
    function loadData() {
        if (!refresh) setLoading(true);
        setError(false);
        Account.admin_getListUser()
            .then((data)=>{
                completeList = data;
                Options.getAll()
                    .then((opt)=>{
                        var filter = data.filter((vals)=>{
                            if (opt.viewDev) if (vals.id == '1') return false;
                            if (opt.viewAdmins1) if (vals.permission !== '0') return false;
                            return true;
                        });
                        Exercise.getAll()
                            .then((data2)=>{
                                setExcList(data2);
                                setUserList(filter);
                                setLoading(false);
                                setRefresh(false);
                            })
                            .catch(setErrAlert);
                    })
                    .catch(()=>{
                        setUserList(data);
                        setLoading(false);
                    });
            })
            .catch(setErrAlert);
    }
    function loadingController(visible: boolean, message?: string): void { return refLoadingComponent.current?.controller(visible, message); }

    function refreshing() {
        setRefresh(true);
        loadData();
    }

    // Functions
    function _openEditClient(data: userData) {
        refEditClientProfessional.current?.open(data);
    }
    function openViewDetailsClient(id: string) {
        loadingController(true, 'Cargando datos del usuario...');
        Account.admin_getUserData(id)
            .then((data)=>{
                loadingController(false);
                actualIDAccount = id;
                refViewClietDetails.current?.open(data);
            })
            .catch((error)=>{
                refLoadingComponent.current?.controller(false);
                refAlertDialog.current?.open('Ocurrio un error', error.cause);
            })
    }
    function _reopenViewClient() {
        refViewClietDetails.current?.close();
        openViewDetailsClient(actualIDAccount);
    }

    function _openAllTrainings(trainings: trainings[], accountId: string) {
        refViewTraining.current?.open(trainings, accountId);
    }
    function _goMoreDetails(training: DetailsTrainings, comment?: commentsData) {
        refViewMoreDetails.current?.open(training, comment);
    }
    function _controllerSnackbar(text: string) {
        refCustomSnackbar.current?.open(text);
    }

    /* ##### UseEffects ##### */
    useEffect(()=>{
        event = DeviceEventEmitter.addListener('adminPage1Reload', loadData);
        loadData();
        return ()=>{
            event?.remove();
        };
    }, []);

    return(<View style={{ flex: 1 }}>
        <Appbar style={{ backgroundColor: '#1663AB', height: 56 }}>
            <Appbar.Action icon="menu" onPress={props.navigation.openDrawer} />
            <Appbar.Content title={'Inicio'}  />
        </Appbar>
        <View style={{ flex: 2, overflow: 'hidden' }}>
            <FlatList
                data={userList}
                extraData={userList}
                keyExtractor={_keyExtractor}
                getItemLayout={_getItemLayout}
                contentContainerStyle={{ flex: (loading || error || userList.length == 0)? 3: undefined }}
                refreshControl={<RefreshControl colors={[CombinedTheme.colors.accent]} refreshing={refresh} onRefresh={refreshing} />}
                ItemSeparatorComponent={_ItemSeparatorComponent}
                ListEmptyComponent={(loading)? <ShowLoading />: (error)? <CustomShowError message={mError} />: undefined}
                ListHeaderComponent={<ButtonsHeaderList load={!loading || error} click1={()=>undefined} click2={()=>undefined}/>}
                ListFooterComponent={(!loading)? <TouchableRipple onPress={()=>undefined}><List.Item title={'Añadir nuevo usuario'} left={(props)=><List.Icon {...props} icon="account-plus" />} /></TouchableRipple>: undefined}
                renderItem={_renderItem}
            />
            <EditClientProfessional ref={refEditClientProfessional} finish={_reopenViewClient} />
            <ViewClietDetails
                ref={refViewClietDetails}
                goLoading={loadingController}
                openAllComment={(data)=>undefined}
                openAllTrainings={_openAllTrainings}
                showExternalSnackbar={_controllerSnackbar}
                viewImage={()=>undefined}
                openEditClient={_openEditClient}
            />
            <ViewTraining
                ref={refViewTraining}
                goLoading={loadingController}
                goMoreDetails={_goMoreDetails}
            />
            <ViewMoreDetails ref={refViewMoreDetails} />
            <LoadingComponent ref={refLoadingComponent} />
            <CustomSnackbar ref={refCustomSnackbar} />
            <Portal>
                <AlertDialog ref={refAlertDialog} />
            </Portal>
        </View>
    </View>);
});

class ShowLoading extends PureComponent {
    constructor(props: any) { super(props); }
    render(): React.ReactNode {
        return(<View style={styles.loadingContent}>
            <ActivityIndicator size={'large'} color={CombinedTheme.colors.accent} />
        </View>);
    }
}

class ButtonsHeaderList extends PureComponent<{ load: boolean; click1: ()=>any; click2: ()=>any; }> {
    constructor(props: any) { super(props); }
    showMessage() {
        ToastAndroid.show('No se puede abrir este apartado en este momento...', ToastAndroid.SHORT);
    }
    render(): React.ReactNode {
        return(<View style={{ ...styles.cardRowContent, width: width }}>
            <View style={{ ...styles.cardContents, paddingLeft: 8, paddingRight: 5 }}>
                <CustomCard2
                    style={styles.styleCard}
                    icon={'plus'}
                    title={'Cargar'}
                    disabled={!this.props.load}
                    onPress={(this.props.load)? this.props.click1: this.showMessage}
                />
            </View>
            <View style={{ ...styles.cardContents, paddingLeft: 5, paddingRight: 8 }}>
                <CustomCard2
                    style={styles.styleCard}
                    icon={'magnify'}
                    title={'Buscar'}
                    disabled={!this.props.load}
                    onPress={(this.props.load)? this.props.click2: this.showMessage}
                />
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
    },
    styleCard: {
        width: '100%',
        marginTop: 12,
        backgroundColor: '#ED7035',
        height: 56
    },
    loadingContent: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    }
});