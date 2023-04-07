import React, { PureComponent, useContext, useEffect, useRef, useState } from "react";
import { DeviceEventEmitter, Dimensions, EmitterSubscription, FlatList, ListRenderItemInfo, RefreshControl, StyleSheet, ToastAndroid, View } from "react-native";
import { ActivityIndicator, Appbar, Divider, FAB, Portal } from "react-native-paper";
import { Account, Exercise, HostServer, Options } from "../../scripts/ApiCorporal";
import { commentsData, dataExercise, dataListUsers, DetailsTrainings, trainings, userData } from "../../scripts/ApiCorporal/types";
import CombinedTheme from "../../Theme";
import { decode } from "base-64";
import { CustomItemList2, CustomShowError } from "../components/Components";
import ViewMoreDetails from "./pages/viewMoreDetails2";
import AddNewAccount from "./pages/addNewAccount";
import AddTraining from "./pages/addTraining";
import SearchClient from "./pages/searchClient";
import SelectClient from "./pages/selectClient";
import SetCommentUser from "./pages/setCommentUser";
import ViewClietDetails, { ViewClietDetailsRef } from "./pages/viewClientDetails";
import ViewComments from "./pages/viewComments";
import ViewTraining, { ViewTrainingRef } from "./pages/viewTraining";
import EditClientProfessional, { EditClientProfessionalRef } from "./pages/editClient";
import CustomCard2 from "../components/CustomCard2";
import ImageViewer from "./pages/ImageViewer";
import DeleteUser, { DeleteUserRef } from "./pages/deleteUser";
import { ThemeContext } from "../../providers/ThemeProvider";
import { GlobalRef } from "../../GlobalRef";
import { refProfesional } from "../profesionalRef";


type IProps = {
    navigation: any;
    route: any;
};

export default React.memo(function Page1(props: IProps) {
    // Context
    const { theme } = useContext(ThemeContext);
    // State's
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [mError, setMerror] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [userList, setUserList] = useState<dataListUsers[]>([]);
    const [excList, setExcList] = useState<dataExercise[]>([]);
    const [completeList, setCompleteList] = useState<dataListUsers[]>([]);
    // Variables
    const { width } = Dimensions.get('window');
    var event: EmitterSubscription | undefined = undefined;
    var actualIDAccount: string = '-1';
    // Ref's
    const refEditClientProfessional = useRef<EditClientProfessionalRef>(null);
    const refViewClietDetails = useRef<ViewClietDetailsRef>(null);
    const refViewTraining = useRef<ViewTrainingRef>(null);
    const refViewMoreDetails = useRef<ViewMoreDetails>(null);
    const refImageViewer = useRef<ImageViewer>(null);
    const refViewComments = useRef<ViewComments>(null);
    const refSetCommentUser = useRef<SetCommentUser>(null);
    const refAddNewAccount = useRef<AddNewAccount>(null);
    const refDeleteUser = useRef<DeleteUserRef>(null);
    const refSearchClient = useRef<SearchClient>(null);
    const refAddTraining = useRef<AddTraining>(null);
    const refSelectClient = useRef<SelectClient>(null);

    /* ##### FlatList ##### */
    function _getItemLayout(_i: any, index: number) { return { length: 80, offset: 80 * index, index }; }
    function _keyExtractor(item: dataListUsers, _i: number) { return `p1-admin-${item.id}`; }
    function _ItemSeparatorComponent() { return(<Divider />); }
    function _renderItem({ item }: ListRenderItemInfo<dataListUsers>) {
        return(<CustomItemList2
            key={`p1-admin-${item.id}`}
            image={item.image}
            title={decode(item.name)}
            onPress={()=>openViewDetailsClient(item.id)}
            actionDelete={()=>_deleteUser(item.id)}
            actionComment={()=>_openSetComment(item.id)}
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
                setCompleteList(data);
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

    function refreshing() {
        setRefresh(true);
        loadData();
    }

    // Functions
    function _openEditClient(data: userData) {
        refEditClientProfessional.current?.open(data);
    }
    function openViewDetailsClient(id: string) {
        GlobalRef.current?.loadingController(true, 'Cargando datos del usuario...');
        Account.admin_getUserData(id)
            .then((data)=>{
                GlobalRef.current?.loadingController(false);
                actualIDAccount = id;
                refViewClietDetails.current?.open(data);
            })
            .catch((error)=>{
                GlobalRef.current?.loadingController(false);
                GlobalRef.current?.showSimpleAlert('Ocurrio un error', error.cause);
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
    function _openViewImage(src: string) {
        const pSrc = `${HostServer}/images/accounts/${decode(src)}`;
        refImageViewer.current?.open(pSrc);
    }
    function _openAllComments(data: commentsData[], clientId: string) {
        refViewComments.current?.open(data, clientId);
    }
    function _openSetComment(idClient: string) {
        refSetCommentUser.current?.open(idClient);
    }
    function _openAddNewAccount() {
        refAddNewAccount.current?.open();
    }
    function _deleteUser(idClient: string) {
        refDeleteUser.current?.open(idClient);
    }
    function _openSearchView() {
        refSearchClient.current?.open(completeList);
    }
    function _openAddTraining() {
        refAddTraining.current?.open();
    }
    function _updateUserSelect(data: { id: string; name: string; }) {
        refAddTraining.current?.update(data);
    }
    function _openSelectClient() {
        refSelectClient.current?.open();
    }

    function _logout() { refProfesional.current?.logOut(); }

    /* ##### UseEffects ##### */
    useEffect(()=>{
        event = DeviceEventEmitter.addListener('adminPage1Reload', loadData);
        loadData();
        return ()=>{
            event?.remove();
        };
    }, []);

    return(<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Appbar style={{ backgroundColor: theme.colors.background }}>
            <Appbar.Action icon={'menu'} onPress={props.navigation.openDrawer} />
            <Appbar.Content title={'Inicio'}  />
        </Appbar>
        <View style={{ flex: 2, overflow: 'hidden' }}>
            <FlatList
                data={userList}
                extraData={userList}
                keyExtractor={_keyExtractor}
                getItemLayout={_getItemLayout}
                contentContainerStyle={{ flex: (loading || error || userList.length == 0)? 3: undefined, paddingBottom: 160 }}
                refreshControl={<RefreshControl
                    colors={[theme.colors.primary]}
                    progressBackgroundColor={theme.colors.elevation.level2}
                    refreshing={refresh}
                    onRefresh={refreshing}
                />}
                ItemSeparatorComponent={_ItemSeparatorComponent}
                ListEmptyComponent={(loading)? <ShowLoading />: (error)? <CustomShowError message={mError} />: undefined}
                ListHeaderComponent={<ButtonsHeaderList load={!loading || error} click1={_openAddTraining} click2={_openSearchView} />}
                renderItem={_renderItem}
            />
        </View>
        <FAB visible={!loading} icon={'account-plus'} style={styles.fab} onPress={_openAddNewAccount} />
        <FAB style={styles.fab0} icon={'logout'} onPress={_logout} />
        <ViewClietDetails ref={refViewClietDetails} openAllComment={_openAllComments} openAllTrainings={_openAllTrainings} openEditClient={_openEditClient} />
        <EditClientProfessional ref={refEditClientProfessional} finish={_reopenViewClient} />
        <ViewTraining ref={refViewTraining} goMoreDetails={_goMoreDetails} />
        
        <ViewComments ref={refViewComments} goLoading={()=>undefined} />
        <ImageViewer ref={refImageViewer} />
        <ViewMoreDetails ref={refViewMoreDetails} />
        <AddNewAccount ref={refAddNewAccount} />
        <SearchClient
            ref={refSearchClient}
            goDetailsClient={openViewDetailsClient}
            showLoading={()=>undefined}
            showSnackOut={()=>undefined}
            deleteAccount={_deleteUser}
            sendComment={_openSetComment}
        />
        <AddTraining
            ref={refAddTraining}
            listUsers={completeList}
            listExercise={excList}
            openUserSelect={_openSelectClient}
        />
        <SelectClient
            ref={refSelectClient}
            dataUser={completeList}
            onSelect={_updateUserSelect}
        />
        <Portal>
            <SetCommentUser ref={refSetCommentUser} goLoading={()=>undefined} />
            <DeleteUser ref={refDeleteUser} goLoading={()=>undefined} externalSnackbar={()=>undefined} reload={refreshing} />
        </Portal>
    </View>);
});

const ShowLoading = React.memo(function ShowLoading() {
    return(<View style={styles.loadingContent}>
        <ActivityIndicator size={'large'} />
    </View>); 
});

class ButtonsHeaderList extends PureComponent<{ load: boolean; click1: ()=>any; click2: ()=>any; }> {
    constructor(props: any) { super(props); }
    showMessage() {
        ToastAndroid.show('No se puede abrir este apartado en este momento...', ToastAndroid.SHORT);
    }
    render(): React.ReactNode {
        const { width } = Dimensions.get('window');
        return(<View style={[styles.cardRowContent, { width: width }]}>
            <View style={[styles.cardContents, { paddingLeft: 8, paddingRight: 5 }]}>
                <CustomCard2
                    style={styles.styleCard}
                    icon={'plus'}
                    title={'Cargar'}
                    disabled={!this.props.load}
                    onPress={(this.props.load)? this.props.click1: this.showMessage}
                />
            </View>
            <View style={[styles.cardContents, { paddingLeft: 5, paddingRight: 8 }]}>
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
        //backgroundColor: '#ED7035',
        height: 56
    },
    loadingContent: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    fab0: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 8
    },
    fab: {
        position: 'absolute',
        right: 0,
        bottom: 8,
        marginRight: 16,
        marginLeft: 16,
        marginTop: 16,
        marginBottom: 88
    }
});