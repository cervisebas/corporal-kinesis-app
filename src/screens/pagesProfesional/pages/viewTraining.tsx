import React, { Component, ReactNode, createRef } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";
import { Button, Appbar, Dialog, Paragraph, Portal, Provider as PaperProvider } from "react-native-paper";
import { NoList } from "../../../assets/icons";
import { Training } from "../../../scripts/ApiCorporal";
import { commentsData, DetailsTrainings, trainings } from "../../../scripts/ApiCorporal/types";
import CombinedTheme from "../../../Theme";
import { EmptyListComments } from "../../components/Components";
import CustomModal from "../../components/CustomModal";
import CustomSnackbar, { CustomSnackbarRef } from "../../components/CustomSnackbar";
import CustomItemList5 from "../../components/CustomItemList5";

type IProps = {
    goLoading: (visible: boolean, message?: string)=>any;
    goMoreDetails: (training: DetailsTrainings, comment: commentsData | undefined)=>any;
};
type IState = {
    visible: boolean;
    trainings: trainings[];
    accountId: string;

    confirmView: boolean;
    actualId: string;
};

export default class ViewTraining extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            trainings: [],
            accountId: '-1',
            confirmView: false,
            actualId: '0'
        };
        this.close = this.close.bind(this);
        this.deleteTraining = this.deleteTraining.bind(this);
        this._renderItem = this._renderItem.bind(this);
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
                this.setState({ trainings: value.reverse() });
            })
            .catch((error)=>{
                this.props.goLoading(false);
                this.refCustomSnackbar.current?.open(error.cause);
            });
    }

    // Flatlist
    _getItemLayout(_data: any, index: number) {
        return {
            length: 182,
            offset: 182 * index,
            index
        };
    }
    _renderItem({ item }: ListRenderItemInfo<trainings>) {
        return(<CustomItemList5
            key={`viewT-admin-${item.id}`}
            data={item}
            deleteButton={()=>this.setState({ confirmView: true, actualId: item.id })}
            viewButton={()=>this.goMoreDetails(item.id)}
        />);
    }

    // Controller
    open(trainings: trainings[], accountId: string) {
        this.setState({
            visible: true,
            trainings,
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
                        <FlatList
                            data={this.state.trainings}
                            extraData={this.state}
                            keyExtractor={(item)=>`viewT-admin-${item.id}`}
                            contentContainerStyle={(this.state.trainings.length == 0)? { flex: 3, paddingBottom: 12 }: undefined}
                            ListEmptyComponent={<this.listEmptyComponent />}
                            getItemLayout={this._getItemLayout}
                            renderItem={this._renderItem}
                        />
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