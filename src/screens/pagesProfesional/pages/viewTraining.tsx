import React, { Component, ReactNode, createRef } from "react";
import { View } from "react-native";
import { Button, Appbar, Dialog, Paragraph, Portal, Provider as PaperProvider } from "react-native-paper";
import { NoList } from "../../../assets/icons";
import { Training } from "../../../scripts/ApiCorporal";
import { commentsData, DetailsTrainings, trainings } from "../../../scripts/ApiCorporal/types";
import CombinedTheme from "../../../Theme";
import { EmptyListComments } from "../../components/Components";
import CustomModal from "../../components/CustomModal";
import CustomSnackbar, { CustomSnackbarRef } from "../../components/CustomSnackbar";
import { decode } from "base-64";
import { MaterialTopTabNavigationOptions, createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ViewTrainingPage from "./viewTrainingPage";


type dataTabTraining = {
    id: string;
    title: string;
    data: trainings[];
};

type IProps = {
    goLoading: (visible: boolean, message?: string)=>any;
    goMoreDetails: (training: DetailsTrainings, comment: commentsData | undefined)=>any;
};
type IState = {
    visible: boolean;
    tabData: dataTabTraining[];
    //trainings: trainings[];
    accountId: string;

    confirmView: boolean;
    actualId: string;
};

const Tab = createMaterialTopTabNavigator();
const screenOptions: MaterialTopTabNavigationOptions = {
    lazy: true,
    lazyPreloadDistance: 1,
    swipeEnabled: true,
    tabBarScrollEnabled: true,
    tabBarStyle: { backgroundColor: '#1663AB' }
};

export default class ViewTraining extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            tabData: [],
            accountId: '-1',
            confirmView: false,
            actualId: '0'
        };
        this.close = this.close.bind(this);
        this.deleteTraining = this.deleteTraining.bind(this);
        this._deleteItem = this._deleteItem.bind(this);
        this._renderTab = this._renderTab.bind(this);
        this.goMoreDetails = this.goMoreDetails.bind(this);
    }
    private refCustomSnackbar = createRef<CustomSnackbarRef>();
    
    listEmptyComponent() { return(<View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}><EmptyListComments icon={<NoList width={96} height={96} />} message={'No hay ejercicios cargados...'} /></View>); }
    deleteTraining() {
        this.props.goLoading(true, 'Borrando ejercicio...');
        Training.admin_delete(this.state.actualId)
            .then(()=>{
                this.props.goLoading(false);
                this.refCustomSnackbar.current?.open('Ejercicio borrado correctamente...');
                this.refresh();
            })
            .catch((error)=>{
                this.props.goLoading(false);
                this.refCustomSnackbar.current?.open(error.cause);
            });
    }
    goMoreDetails(idTraining: string) {
        this.props.goLoading(true, 'Obteniendo información...');
        Training.admin_getEspecificTraining(idTraining, this.state.accountId)
            .then((data)=>{
                this.props.goLoading(false);
                this.props.goMoreDetails(data.t, data.c);
            })
            .catch((error)=>{
                this.props.goLoading(false);
                this.refCustomSnackbar.current?.open(error.cause);
            });
    }
    refresh() {
        this.props.goLoading(true, 'Obteniendo información...');
        Training.admin_getAllAccount(this.state.accountId)
            .then((value)=>{
                this.props.goLoading(false);
                this.setState({ tabData: this.processData(value.reverse()) });
            })
            .catch((error)=>{
                this.props.goLoading(false);
                this.refCustomSnackbar.current?.open(error.cause);
            });
    }
    processData(data: trainings[]) {
        const tabData: dataTabTraining[] = [];
        data.forEach((value)=>{
            const findIndex = tabData.findIndex((a)=>a.id == value.exercise.id);
            if (findIndex == -1) return tabData.push({
                id: value.exercise.id,
                title: decode(value.exercise.name),
                data: [value]
            });
            tabData[findIndex].data.push(value);
        });
        return tabData;
    }

    _deleteItem(id: string) { this.setState({ actualId: id, confirmView: true }); }
    _renderTab(value: dataTabTraining) {
        return(<Tab.Screen
            key={`tab-training-${value.id}`}
            name={`${value.title} (${value.data.length})`}
            children={()=><ViewTrainingPage
                data={value.data}
                goMoreDetails={this.goMoreDetails}
                deleteItem={this._deleteItem}
            />}
        />);
    }

    // Controller
    open(trainings: trainings[], accountId: string) {
        const tabData = this.processData(trainings);
        this.setState({
            visible: true,
            tabData,
            accountId
        });
    }
    close() { this.setState({ visible: false }); }

    render(): ReactNode {
        return(<CustomModal visible={this.state.visible} onRequestClose={this.close}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={this.close} />
                        <Appbar.Content title={'Rendimiento'} />
                    </Appbar.Header>
                    <View style={{ flex: 2 }}>
                        {(this.state.tabData.length !== 0)? <Tab.Navigator screenOptions={screenOptions}>
                            {this.state.tabData.map(this._renderTab)}
                        </Tab.Navigator>: <this.listEmptyComponent />}
                        <Portal>
                            <Dialog visible={this.state.confirmView} onDismiss={()=>this.setState({ confirmView: false })}>
                                <Dialog.Title>Advertencia de confirmación</Dialog.Title>
                                <Dialog.Content>
                                    <Paragraph>¿Estas seguro que quieres borrar este comentario?</Paragraph>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button onPress={()=>this.setState({ confirmView: false })}>Cancelar</Button>
                                    <Button onPress={()=>this.setState({ confirmView: false }, this.deleteTraining)}>Aceptar</Button>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>
                        <CustomSnackbar ref={this.refCustomSnackbar} />
                    </View>
                </View>
            </PaperProvider>
        </CustomModal>);
    }
}