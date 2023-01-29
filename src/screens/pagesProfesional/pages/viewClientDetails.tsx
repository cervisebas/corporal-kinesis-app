import { decode } from "base-64";
import React, { Component, PureComponent, ReactNode } from "react";
import { DeviceEventEmitter, Image, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Appbar, Provider as PaperProvider, Divider, Text, Card, IconButton, Button, Snackbar, Portal, Dialog, Paragraph } from "react-native-paper";
import { Account, Comment, HostServer, Training } from "../../../scripts/ApiCorporal";
import { commentsData, trainings, userData } from "../../../scripts/ApiCorporal/types";
import CombinedTheme from "../../../Theme";
import CustomModal from "../../components/CustomModal";
import DialogError from "../../components/DialogError";
import { calcYears } from "../../../scripts/Utils";
import ImageProfile from '../../../assets/profile.webp';

type IProps = {
    goLoading: (show: boolean, text?: string)=>any;
    openAllComment: (data: commentsData[])=>any;
    openAllTrainings: (data: trainings[], accountId: string)=>any;
    showExternalSnackbar: (text: string)=>any;
    viewImage: ()=>any;
    openEditClient: (data: userData)=>void;
};
type IState = {
    visible: boolean;
    userData: userData | undefined;
    errorView: boolean;
    errorTitle: string;
    errorMessage: string;
    showSnackBar: boolean;
    textSnackBar: string;
    showQuestionDeleteUser: boolean;
};

export default class ViewClietDetails extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            userData: undefined,
            errorView: false,
            errorTitle: '',
            errorMessage: '',
            showSnackBar: false,
            textSnackBar: '',
            showQuestionDeleteUser: false
        };
        this.close = this.close.bind(this);
        this.showQuestionDeleteUser = this.showQuestionDeleteUser.bind(this);
        this.deleteClient = this.deleteClient.bind(this);
        this.getAllTrainings = this.getAllTrainings.bind(this);
        this.goAllComments = this.goAllComments.bind(this);
        this._openEditClient = this._openEditClient.bind(this);
    }
    private deleteClient() {
        this.props.goLoading(true, 'Borrando información del cliente...');
        Account.admin_delete(this.state.userData!.id)
            .then(()=>{
                this.props.goLoading(false);
                this.close();
                this.props.showExternalSnackbar('Usuario borrado correctamente.');
                DeviceEventEmitter.emit('adminPage1Reload');
            })
            .catch((error)=>{
                this.props.goLoading(false, '');
                this.setState({ errorView: true, errorTitle: 'Ocurrio un error', errorMessage: error.cause });
            });
    }
    private goAllComments() {
        this.props.goLoading(true, 'Obteniendo información...');
        Comment.admin_getAllAccount(this.state.userData!.id)
            .then((value)=>{
                this.props.goLoading(false);
                this.props.openAllComment(value.reverse());
            })
            .catch((error)=>this.setState({ errorView: true, errorTitle: 'Ocurrio un error...', errorMessage: error.cause }));
    }
    private getAllTrainings() {
        this.props.goLoading(true, 'Obteniendo información...');
        Training.admin_getAllAccount(this.state.userData!.id)
            .then((value)=>{
                this.props.goLoading(false);
                this.props.openAllTrainings(value.reverse(), this.state.userData!.id);
            })
            .catch((error)=>{
                this.props.goLoading(false);
                this.setState({ errorView: true, errorTitle: 'Ocurrio un error...', errorMessage: error.cause });
            });
    }
    private processTextTraining(num: string): string {
        if (num == '0') return 'Ningún ejercicio evaluado';
        if (num == '1') return '1 ejercicio evaluado';
        return `${num}  ejercicios evaluados`; 
    }
    showQuestionDeleteUser() {
        this.setState({ showQuestionDeleteUser: true });
    }
    _openEditClient() {
        this.props.openEditClient(this.state.userData!);
    }

    // Controller
    open(userData: userData) {
        this.setState({ visible: true, userData });
    }
    close() {
        this.setState({ visible: false });
    }

    render(): ReactNode {
        return(<CustomModal visible={this.state.visible} onClose={this.close} onRequestClose={this.close}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={this.close} />
                        <Appbar.Content title={(this.state.userData)? decode(this.state.userData.name): ''} />
                        <Appbar.Action icon={'pencil'} onPress={this._openEditClient} />
                        <Appbar.Action icon={'trash-can-outline'} onPress={this.showQuestionDeleteUser} />
                    </Appbar.Header>
                    <ScrollView style={{ flex: 2, overflow: 'hidden', paddingBottom: 16 }}>
                        <View style={{ padding: 20, height: 140, width: '100%', flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.imageProfile} onPress={()=>this.props.viewImage()}>
                                <Image style={{ width: '100%', height: '100%' }} source={{ uri: (this.state.userData)? `${HostServer}/images/accounts/${decode(this.state.userData.image)}`: ImageProfile }} />
                            </TouchableOpacity>
                            <View style={styles.textProfile}>
                                <Text style={{ fontSize: 20 }}>{(this.state.userData)? decode(this.state.userData.name): ''}</Text>
                                <Text style={{ marginTop: 8, marginLeft: 12, color: 'rgba(255, 255, 255, 0.7)' }}>
                                    <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>Experiencia: </Text>
                                    {(this.state.userData)? decode(this.state.userData.experience): ''}
                                </Text>
                            </View>
                        </View>
                        <Divider />
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ margin: 14, marginLeft: 18, fontSize: 18 }}>Más información:</Text>
                            <View style={{ flexDirection: 'column' }}>
                                <PointItemList textA="Ejercicios" textB={(this.state.userData)? this.processTextTraining(this.state.userData.num_trainings): ''} />
                                <PointItemList textA="Cumpleaños" textB={(this.state.userData)? `${decode(this.state.userData.birthday)} (${calcYears(decode(this.state.userData.birthday))} años)`: ''} />
                                <PointItemList textA="E-Mail" textB={(this.state.userData)? decode(this.state.userData.email): ''} />
                                <PointItemList textA="Teléfono" textB={(this.state.userData)? decode(this.state.userData.phone): ''} />
                                <PointItemList textA="D.N.I" textB={(this.state.userData)? decode(this.state.userData.dni): ''} />
                            </View>
                        </View>
                        <Divider />
                        <View>
                            {(this.state.userData)&&<Card style={{ margin: 16, display: (this.state.userData.type == '1')? 'flex': 'none' }}>
                                <Card.Title title="Medios de contacto:" />
                                <Card.Content>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                                        <IconButton color="#15b2f7" animated icon={'phone'} style={styles.buttonsContacts} onPress={()=>Linking.openURL(`tel:+549${decode(this.state.userData!.phone)}`)}/>
                                        <IconButton color="#eb5c23" animated icon={'message'} style={styles.buttonsContacts} onPress={()=>Linking.openURL(`sms:+549${decode(this.state.userData!.phone)}`)}/>
                                        <IconButton color="#25D366" animated icon={'whatsapp'} style={styles.buttonsContacts} onPress={()=>Linking.openURL(`whatsapp://send?phone=+549${decode(this.state.userData!.phone)}`)}/>
                                        <IconButton color="#ffce00" animated icon={'email'} style={styles.buttonsContacts} onPress={()=>Linking.openURL(`mailto:${decode(this.state.userData!.email)}`)}/>
                                    </View>
                                </Card.Content>
                            </Card>}
                            <Button icon={'dumbbell'} onPress={this.getAllTrainings} mode={'contained'} style={{ marginLeft: 16, marginRight: 16, marginTop: (this.state.userData)? (this.state.userData.type == '1')? 0: 16: 16 }} labelStyle={{ color: '#FFFFFF' }}>
                                Ver rendimiento
                            </Button>
                            <Button icon={'comment-text-multiple-outline'} onPress={this.goAllComments} mode={'contained'} style={{ marginLeft: 16, marginRight: 16, marginTop: 16 }} labelStyle={{ color: '#FFFFFF' }}>
                                Ver todos los comentarios
                            </Button>
                        </View>
                        <Portal>
                            <Dialog visible={this.state.showQuestionDeleteUser}>
                                <Dialog.Title>¡¡Advertencia!!</Dialog.Title>
                                <Dialog.Content>
                                    <Paragraph>{'¿Estás de acuerdo que quieres borrar este usuario junto a toda su información?\n\nEsta acción no se podrá deshacer luego de una vez realizada.'}</Paragraph>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button onPress={()=>this.setState({ showQuestionDeleteUser: false })}>Cancelar</Button>
                                    <Button onPress={()=>this.setState({ showQuestionDeleteUser: false }, this.deleteClient)}>Aceptar</Button>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>
                        <DialogError show={this.state.errorView} close={()=>this.setState({ errorView: false })} title={this.state.errorTitle} message={this.state.errorMessage} />
                        <Snackbar visible={this.state.showSnackBar} style={{ backgroundColor: '#1663AB' }} onDismiss={()=>this.setState({ showSnackBar: false })}><Text>{this.state.textSnackBar}</Text></Snackbar>
                    </ScrollView>
                </View>
            </PaperProvider>
        </CustomModal>);
    }
};
const styles = StyleSheet.create({
    imageProfile: {
        borderRadius: 100,
        height: 90,
        width: 90,
        margin: 5,
        overflow: 'hidden',
        shadowColor: "#FFFFFF",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6
    },
    textProfile: {
        flex: 3,
        paddingLeft: 16,
        paddingTop: 18
    },
    buttonsContacts: {
        marginLeft: 12,
        marginRight: 12
    }
});

type IProps2 = { textA: string; textB: string };
class PointItemList extends PureComponent<IProps2> {
    constructor(props: IProps2) {
        super(props);
    }
    render(): React.ReactNode {
        return(<Text style={{ marginTop: 8, marginLeft: 32, flexDirection: 'row', alignItems: 'center' }}>
            <Text>{'\u2B24'}    </Text>
            <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>{this.props.textA}: </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{this.props.textB}</Text>
        </Text>);
    }
};