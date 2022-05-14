import { decode } from "base-64";
import React, { Component, ReactNode } from "react";
import { FlatList, View } from "react-native";
import { Button, Appbar, Dialog, Paragraph, Portal, Snackbar, Provider as PaperProvider } from "react-native-paper";
import { NoList } from "../../../assets/icons";
import { Training } from "../../../scripts/ApiCorporal";
import { commentsData, DetailsTrainings, trainings } from "../../../scripts/ApiCorporal/types";
import CombinedTheme from "../../../Theme";
import { CustomItemList5, EmptyListComments } from "../../components/Components";
import CustomModal from "../../components/CustomModal";

type IProps = {
    visible: boolean;
    trainings: trainings[];
    accountId: string;
    close: ()=>any;
    goLoading: (show: boolean, message: string, after: ()=>any)=>any;
    reload: ()=>any;
    goMoreDetails: (training: DetailsTrainings, comment: commentsData | undefined)=>any;
};
type IState = {
    confirmView: boolean;
    actualId: string;

    snackbarVisible: boolean;
    snackbarText: string;
};

export default class ViewTraining extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            confirmView: false,
            actualId: '0',
            snackbarVisible: false,
            snackbarText: ''
        };
    }
    listEmptyComponent() { return(<View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}><EmptyListComments icon={<NoList width={96} height={96} />} message={'No hay ejercicios cargados...'} /></View>); }
    deleteTraining() {
        this.props.goLoading(true, 'Borrando ejercicio (esto puede tardar)...', ()=>
            Training.admin_delete(this.state.actualId)
                .then(()=>this.props.goLoading(false, '', ()=>this.setState({ snackbarVisible: true, snackbarText: 'Ejercicio borrado correctamente...' }, ()=>this.props.reload())))
                .catch((error)=>this.props.goLoading(false, '', ()=>this.setState({ snackbarVisible: true, snackbarText: error.cause })))
        );
    }
    goMoreDetails(idTraining: string) {
        this.props.goLoading(true, 'Obteniendo información (esto puede tardar)...', ()=>
            Training.admin_getEspecificTraining(idTraining, this.props.accountId)
                .then((data)=>this.props.goLoading(false, '', ()=>this.props.goMoreDetails(data.t, data.c)))
                .catch((error)=>this.props.goLoading(false, '', ()=>this.setState({ snackbarVisible: true, snackbarText: error.cause })))
        );
    }
    render(): ReactNode {
        return(<CustomModal visible={this.props.visible} onRequestClose={()=>this.props.close()}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={()=>this.props.close()} />
                        <Appbar.Content title={'Rendimiento'} />
                    </Appbar.Header>
                    <View style={{ flex: 2 }}>
                        <FlatList
                            data={this.props.trainings}
                            keyExtractor={(item)=>item.id}
                            contentContainerStyle={{ flex: (this.props.trainings.length == 0)? 3: undefined, paddingBottom: (this.props.trainings.length != 0)? 12: undefined }}
                            ListEmptyComponent={<this.listEmptyComponent />}
                            getItemLayout={(_data, index)=>({
                                length: 182,
                                offset: 182 * index,
                                index
                            })}
                            renderItem={({ item, index })=>
                                <CustomItemList5
                                    key={index}
                                    data={item}
                                    deleteButton={()=>this.setState({ confirmView: true, actualId: item.id })}
                                    viewButton={()=>this.goMoreDetails(item.id)}
                                />
                            }
                        />
                        <Portal>
                            <Dialog visible={this.state.confirmView} onDismiss={()=>this.setState({ confirmView: false })}>
                                <Dialog.Title>Advertencia de confirmación</Dialog.Title>
                                <Dialog.Content>
                                    <Paragraph>¿Estas seguro que quieres borrar este comentario?</Paragraph>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button onPress={()=>this.setState({ confirmView: false })}>Cancelar</Button>
                                    <Button onPress={()=>this.setState({ confirmView: false }, ()=>this.deleteTraining())}>Aceptar</Button>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>
                        <Snackbar visible={this.state.snackbarVisible} style={{ backgroundColor: '#1663AB' }} onDismiss={()=>this.setState({ snackbarVisible: false })}>{this.state.snackbarText}</Snackbar>
                    </View>
                </View>
            </PaperProvider>
        </CustomModal>);
    }
}