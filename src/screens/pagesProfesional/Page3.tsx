import { decode } from "base-64";
import React, { Component, PureComponent, forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"
import { DeviceEventEmitter, EmitterSubscription, FlatList, ListRenderItemInfo, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, ActivityIndicator, Dialog, List, Paragraph, Portal, Button, TouchableRipple, Snackbar, Text, Divider, FAB } from "react-native-paper";
import { Exercise } from "../../scripts/ApiCorporal";
import { dataExercise } from "../../scripts/ApiCorporal/types";
import CombinedTheme from "../../Theme";
import { CustomShowError } from "../components/Components";
import AddNewExercise from "./pages/addNewExcercise";
import { Global } from "../../scripts/Global";
import EditExcercise from "./pages/editExcercise";
import CustomModal from "../components/CustomModal";
import { ThemeContext } from "../../providers/ThemeProvider";
import CustomItemList4 from "../components/CustomItemList4";
import { GlobalRef } from "../../GlobalRef";

type IProps = {
    navigation: any;
    route: any;
};
type IState = {
    list: dataExercise[];
    isLoading: boolean;
    isError: boolean;
    messageError: string;
    refreshing: boolean;
    showAddExercise: boolean;
    viewDescription: boolean;
    titleDescription: string;
    textDescription: string;
    loadingView: boolean;
    loadingText: string;
    showAlert: boolean;
    messageAlert: string;
    viewOk: boolean;
    actualDeleteId: string;
    showEditExercise: boolean;
    dataEditExercise: {
        idExercise: string;
        title: string;
        message: string;
    };
};

export default React.memo(function Page3(props: IProps) {
    // Context's
    const { theme } = useContext(ThemeContext);
    // State's
    const [list, setList] = useState<dataExercise[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [messageError, setMessageError] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    // Ref's
    const refViewDescription = useRef<ViewDescriptionRef>(null);

    // Function's
    function loadData(re?: boolean) {
        setIsError(false);
        if (re === true) setRefreshing(true); else {
            setIsLoading(true);
            setList([]);
        }
        Exercise.getAll()
            .then((_list)=>{
                setList(_list);
                setIsLoading(false);
                setRefreshing(false);
            })
            .catch((error)=>{
                setIsError(true);
                setIsLoading(false);
                setMessageError(error.cause);
            })
    }
    function _refreshing() {
        loadData(true);
    }

    // Actions
    function _viewDescription(_title: string, _description?: string) {
        const _des = _description??'No hay descripción disponible.';
        refViewDescription.current?.open(_title, _des);
    }
    function _onDelete(_idExcercise: string) {
        GlobalRef.current?.showDoubleAlert('¡¡Advertencia!!', '¿Estás seguro/a que quieres borrar este ejercicio?', function deleteNow() {
            GlobalRef.current?.loadingController(true, 'Eliminando ejercicio...');
            Exercise.delete(_idExcercise)
                .then(()=>{
                    GlobalRef.current?.loadingController(false);
                    GlobalRef.current?.showSimpleAlert('Ejercicio eliminado correctamente', '');
                    _refreshing();
                    DeviceEventEmitter.emit('adminPage1Reload');
                })
                .catch((error)=>{
                    GlobalRef.current?.loadingController(false);
                    GlobalRef.current?.showSimpleAlert('Ocurrió un error', error.cause);
                });
        });
    }

    // FlatList
    function _keyExtractor(item: dataExercise) { return `p3-admin-${item.id}`; }
    function _ItemSeparatorComponent(props: any) { return(<Divider {...props} />); }
    function _getItemLayout(_data: dataExercise[] | null | undefined, index: number) {
        return {
            length: 68,
            offset: 68 * index,
            index,
        };
    }
    function _renderItem({ item }: ListRenderItemInfo<dataExercise>) {
        return(<CustomItemList4
            key={`p3-admin-${item.id}`}
            title={decode(item.name)}
            actionViewDescription={()=>_viewDescription(decode(item.name), (decode(item.description) !== 'none')? decode(item.description): undefined)}
            actionDelete={()=>_onDelete(item.id)}
            actionEdit={()=>undefined}
            /*actionEdit={()=>this.setState({
                showEditExercise: true,
                dataEditExercise: {
                    idExercise: item.id,
                    title: item.name,
                    message: item.description
                }
            })}*/
        />);
    }

    useEffect(()=>{
        loadData();
    }, []);

    return(<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Appbar style={{ backgroundColor: theme.colors.background }}>
            <Appbar.Action icon="menu" onPress={props.navigation.openDrawer} />
            <Appbar.Content title={'Lista de ejercicios'}  />
        </Appbar>
        <View style={{ flex: 2, overflow: 'hidden' }}>
            <FlatList
                data={list}
                keyExtractor={_keyExtractor}
                getItemLayout={_getItemLayout}
                contentContainerStyle={{ flex: (isLoading || isError)? 3: undefined, paddingBottom: 16 }}
                refreshControl={<RefreshControl
                    colors={[theme.colors.primary]}
                    progressBackgroundColor={theme.colors.elevation.level2}
                    refreshing={refreshing}
                    onRefresh={_refreshing}
                />}
                ItemSeparatorComponent={_ItemSeparatorComponent}
                ListEmptyComponent={(isLoading)? <ShowLoading />: (isError)? <CustomShowError message={messageError} />: undefined}
                renderItem={_renderItem}
            />
        </View>
        <FAB visible={!isLoading} style={styles.fab} icon={'plus'} onPress={()=>undefined} />
        <ViewDescription ref={refViewDescription} />
        {/*<Portal>
            <Dialog visible={this.state.viewOk} onDismiss={()=>this.setState({ viewOk: false })}>
                <Dialog.Title></Dialog.Title>
                <Dialog.Content>
                    <Paragraph></Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={()=>this.setState({ viewOk: false })}>Cancelar</Button>
                    <Button onPress={()=>this.setState({ viewOk: false }, ()=>this.deleteExcercise(this.state.actualDeleteId))}>Aceptar</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
        <ViewDescription
            visible={this.state.viewDescription}
            close={()=>this.setState({ viewDescription: false })}
            name={this.state.titleDescription}
            description={this.state.textDescription}
        />
        <Snackbar visible={this.state.showAlert} style={{ backgroundColor: '#1663AB' }} onDismiss={()=>this.setState({ showAlert: false })} duration={3000}><Text>{this.state.messageAlert}</Text></Snackbar>
        <Global loadingView={this.state.loadingView} loadingText={this.state.loadingText} />
        <AddNewExercise show={this.state.showAddExercise} close={()=>this.setState({ showAddExercise: false })} />
        <EditExcercise visible={this.state.showEditExercise} data={this.state.dataEditExercise} close={()=>this.setState({ showEditExercise: false })} />*/}
    </View>);
});
/*export default class Page3 extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            list: [],
            isLoading: false,
            isError: false,
            messageError: '',
            refreshing: false,
            showAddExercise: false,
            viewDescription: false,
            titleDescription: '',
            textDescription: '',
            loadingView: false,
            loadingText: '',
            showAlert: false,
            messageAlert: '',
            viewOk: false,
            actualDeleteId: '',
            showEditExercise: false,
            dataEditExercise: {
                idExercise: '0',
                title: '',
                message: ''
            }
        };
        this.loadData = this.loadData.bind(this);
    }
    private event: EmitterSubscription | null = null;
    componentDidMount() {
        this.loadData();
        this.event = DeviceEventEmitter.addListener('adminPage3Reload', this.loadData);
    }
    componentWillUnmount() {
        this.event?.remove();
        this.setState({
            list: [],
            isLoading: false,
            isError: false,
            messageError: '',
            refreshing: false,
            showAddExercise: false,
        });
    }
    loadData() {
        this.setState({ isError: false, isLoading: true, messageError: '', list: [] }, ()=>
            Exercise.getAll()
                .then((list)=>this.setState({ list: list, isLoading: false }, ()=>(this.state.refreshing)&&this.setState({ refreshing: false })))
                .catch((error)=>this.setState({ isError: true, isLoading: false, messageError: error.cause }))
        );
    }
    deleteExcercise(idExcercise: string) {
        this.setState({ loadingView: true, loadingText: 'Eliminando ejercicios...' }, ()=>
            Exercise.delete(idExcercise)
                .then(()=>this.setState({ loadingView: false, loadingText: '', showAlert: true, messageAlert: 'Ejercicio eliminado correctamente...' }, ()=>{ this.loadData(); DeviceEventEmitter.emit('adminPage1Reload'); }))
                .catch((error)=>this.setState({ loadingView: false, loadingText: '', showAlert: true, messageAlert: error.cause }))
        );
    }
    render(): React.ReactNode {
        return(<View style={{ flex: 1 }}>
            <Appbar style={{ backgroundColor: '#1663AB', height: 56 }}>
                <Appbar.Action icon="menu" onPress={()=>this.props.navigation.openDrawer()} />
                <Appbar.Content title={'Lista de ejercicios'}  />
            </Appbar>
            <View style={{ flex: 2, overflow: 'hidden' }}>
                <FlatList
                    data={this.state.list}
                    keyExtractor={(item)=>`p3-admin-${item.id}`}
                    getItemLayout={(_i, index)=>({
                        length: 64,
                        offset: 64 * index,
                        index,
                    })}
                    removeClippedSubviews={true}
                    contentContainerStyle={{
                        flex: (this.state.isLoading || this.state.isError)? 3: undefined,
                        paddingBottom: 90
                    }}
                    refreshControl={<RefreshControl colors={[CombinedTheme.colors.accent]} refreshing={this.state.refreshing} onRefresh={()=>this.setState({ refreshing: true }, ()=>this.loadData())} />}
                    ItemSeparatorComponent={(props)=><Divider {...props} />}
                    ListEmptyComponent={(this.state.isLoading)? <ShowLoading />: (this.state.isError)? <CustomShowError message={this.state.messageError} />: <></>}
                    ListFooterComponent={(!this.state.isLoading)? <TouchableRipple onPress={()=>this.setState({ showAddExercise: true })}><List.Item title={'Añadir nuevo ejercicio'} left={(props)=><List.Icon {...props} icon="plus" />} /></TouchableRipple>: <></>}
                    renderItem={({ item })=><CustomItemList4
                        key={`p3-admin-${item.id}`}
                        title={decode(item.name)}
                        actionViewDescription={()=>this.setState({ titleDescription: decode(item.name), textDescription: (decode(item.description) == 'none')? 'No hay descripción disponible.': decode(item.description), viewDescription: true })}
                        actionDelete={()=>this.setState({ viewOk: true, actualDeleteId: item.id })}
                        actionEdit={()=>this.setState({
                            showEditExercise: true,
                            dataEditExercise: {
                                idExercise: item.id,
                                title: item.name,
                                message: item.description
                            }
                        })}
                    />}
                />
                <Portal>
                    <Dialog visible={this.state.viewOk} onDismiss={()=>this.setState({ viewOk: false })}>
                        <Dialog.Title>¡¡Advertencia!!</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>¿Estás seguro/a que quieres borrar este ejercicio?</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={()=>this.setState({ viewOk: false })}>Cancelar</Button>
                            <Button onPress={()=>this.setState({ viewOk: false }, ()=>this.deleteExcercise(this.state.actualDeleteId))}>Aceptar</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <ViewDescription
                    visible={this.state.viewDescription}
                    close={()=>this.setState({ viewDescription: false })}
                    name={this.state.titleDescription}
                    description={this.state.textDescription}
                />
                <Snackbar visible={this.state.showAlert} style={{ backgroundColor: '#1663AB' }} onDismiss={()=>this.setState({ showAlert: false })} duration={3000}><Text>{this.state.messageAlert}</Text></Snackbar>
                <Global loadingView={this.state.loadingView} loadingText={this.state.loadingText} />
                <AddNewExercise show={this.state.showAddExercise} close={()=>this.setState({ showAddExercise: false })} />
                <EditExcercise visible={this.state.showEditExercise} data={this.state.dataEditExercise} close={()=>this.setState({ showEditExercise: false })} />
            </View>
        </View>);
    }
}*/


const ShowLoading = React.memo(function ShowLoading() {
    const { theme } = useContext(ThemeContext);
    return(<View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={'large'} color={theme.colors.primary} />
    </View>);
});

type ViewDescriptionRef = {
    open: (title: string, description: string)=>void;
};
const ViewDescription = React.memo(forwardRef(function ViewDescription(_props: any, ref: React.Ref<ViewDescriptionRef>) {
    // Context's
    const { theme } = useContext(ThemeContext);
    // State's
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    function _close() { setVisible(false); }
    function open(_title: string, _description: string) {
        setTitle(_title);
        setDescription(_description);
        setVisible(true);
    }
    useImperativeHandle(ref, ()=>({ open }));

    return(<CustomModal visible={visible} onRequestClose={_close}>
        <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                <Appbar.BackAction onPress={_close} />
                <Appbar.Content title={title} />
            </Appbar.Header>
            <ScrollView style={{ paddingLeft: 10, paddingRight: 10 }}>
                <Paragraph style={{ marginTop: 10, marginBottom: 14 }}>{description}</Paragraph>
            </ScrollView>
        </View>
    </CustomModal>);
}));

/*type IProps2 = {
    visible: boolean;
    close: ()=>any;
    name: string;
    description: string;
};
class ViewDescription extends PureComponent<IProps2> {
    constructor(props: IProps2) {
        super(props);
    }
    render(): React.ReactNode {
        return();
    }
}*/

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 8
    }
});