import { decode } from "base-64";
import React, { Component, PureComponent } from "react"
import { ActivityIndicator, DeviceEventEmitter, EmitterSubscription, FlatList, RefreshControl, View } from "react-native";
import { Appbar, Dialog, List, Paragraph, Portal, Button, TouchableRipple, Snackbar, Text } from "react-native-paper";
import { Exercise } from "../../scripts/ApiCorporal";
import { dataExercise } from "../../scripts/ApiCorporal/types";
import CombinedTheme from "../../Theme";
import { CustomShowError, CustomItemList4 } from "../components/Components";
import AddNewExercise from "./pages/addNewExcercise";
import { Global } from "../../scripts/Global";

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
};

export default class Page3 extends Component<IProps, IState> {
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
            actualDeleteId: ''
        };
    }
    private event: EmitterSubscription | null = null;
    componentDidMount() {
        this.loadData();
        this.event = DeviceEventEmitter.addListener('adminPage3Reload', ()=>this.loadData());
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
                    contentContainerStyle={{ flex: (this.state.isLoading || this.state.isError)? 3: undefined }}
                    refreshControl={<RefreshControl colors={[CombinedTheme.colors.accent]} refreshing={this.state.refreshing} onRefresh={()=>this.setState({ refreshing: true }, ()=>this.loadData())} />}
                    ListEmptyComponent={(this.state.isLoading)? <ShowLoading />: (this.state.isError)? <CustomShowError message={this.state.messageError} />: <></>}
                    ListFooterComponent={(!this.state.isLoading)? <TouchableRipple onPress={()=>this.setState({ showAddExercise: true })}><List.Item title={'Añadir nuevo ejercicio'} left={(props)=><List.Icon {...props} icon="plus" />} /></TouchableRipple>: <></>}
                    renderItem={({ item })=><CustomItemList4
                        title={decode(item.name)}
                        actionViewDescription={()=>this.setState({ titleDescription: `Ver descripción: ${decode(item.name)}`, textDescription: (decode(item.description) == 'none')? 'No hay descripción disponible.': decode(item.description), viewDescription: true })}
                        actionDelete={()=>this.setState({ viewOk: true, actualDeleteId: item.id })}
                    />}
                />
                <Portal>
                    <Dialog visible={this.state.viewDescription}>
                        <Dialog.Title>{this.state.titleDescription}</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>{this.state.textDescription}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={()=>this.setState({ viewDescription: false })}>Cerrar</Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog visible={this.state.viewOk}>
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
                <Snackbar visible={this.state.showAlert} style={{ backgroundColor: '#1663AB' }} onDismiss={()=>this.setState({ showAlert: false })} duration={3000}><Text>{this.state.messageAlert}</Text></Snackbar>
                <Global loadingView={this.state.loadingView} loadingText={this.state.loadingText} />
                <AddNewExercise show={this.state.showAddExercise} close={()=>this.setState({ showAddExercise: false })} />
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