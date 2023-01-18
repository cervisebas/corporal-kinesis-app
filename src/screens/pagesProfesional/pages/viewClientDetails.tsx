import { decode } from "base-64";
import moment from "moment";
import React, { Component, PureComponent, ReactNode } from "react";
import { DeviceEventEmitter, Dimensions, Image, Linking, ScrollView, StyleSheet, ToastAndroid, TouchableOpacity, View } from "react-native";
import { Appbar, Provider as PaperProvider, Divider, Text, Card, IconButton, Button, Snackbar, Portal, Dialog, Paragraph } from "react-native-paper";
import { Account, Comment, HostServer, Training } from "../../../scripts/ApiCorporal";
import { commentsData, trainings, userData } from "../../../scripts/ApiCorporal/types";
import CombinedTheme from "../../../Theme";
import CustomModal from "../../components/CustomModal";
import DialogError from "../../components/DialogError";

const { width } = Dimensions.get('window');

type IProps = {
    show: boolean;
    close: ()=>any;
    userData: userData;
    completeClose: ()=>any;
    goLoading: (show: boolean, text: string, after?: ()=>any)=>any;
    openAllComment: (data: commentsData[])=>any;
    openAllTrainings: (data: trainings[])=>any;
    showExternalSnackbar: (text: string, after?: ()=>any)=>any;
    viewImage: ()=>any;
    openEditClient: ()=>void;
};
type IState = {
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
            errorView: false,
            errorTitle: '',
            errorMessage: '',
            showSnackBar: false,
            textSnackBar: '',
            showQuestionDeleteUser: false
        };
    }
    calcYears(date: string): string {
        var dateNow = new Date();
        var processDate = moment(date, 'DD-MM-YYYY').toDate();
        var years = dateNow.getFullYear() - processDate.getFullYear();
        var months = dateNow.getMonth() - processDate.getMonth();
        if (months < 0 || (months === 0 && dateNow.getDate() < processDate.getDate())) years--;
        return String(years);
    }
    deleteClient() {
        this.props.goLoading(true, 'Borrando información del cliente...', ()=>
            Account.admin_delete(this.props.userData.id)
                .then(()=>
                    this.props.goLoading(false, '', ()=>{
                        this.props.close();
                        this.props.showExternalSnackbar('Usuario borrado correctamente.');
                        DeviceEventEmitter.emit('adminPage1Reload');
                    }))
                .catch((error)=>this.props.goLoading(false, '', ()=>this.setState({ errorView: true, errorTitle: 'Ocurrio un error', errorMessage: error.cause })))
        );
    }
    goAllComments() {
        this.props.goLoading(true, 'Obteniendo información...', ()=>
            Comment.admin_getAllAccount(this.props.userData.id)
                .then((value)=>this.props.goLoading(false, '', ()=>this.props.openAllComment(value.reverse())))
                .catch((error)=>this.setState({ errorView: true, errorTitle: 'Ocurrio un error...', errorMessage: error.cause }))
        );
    }
    getAllTrainings() {
        this.props.goLoading(true, 'Obteniendo informació...', ()=>
            Training.admin_getAllAccount(this.props.userData.id)
                .then((value)=>this.props.goLoading(false, '', ()=>this.props.openAllTrainings(value.reverse())))
                .catch((error)=>this.setState({ errorView: true, errorTitle: 'Ocurrio un error...', errorMessage: error.cause }))
        );
    }
    processTextTraining(num: string): string {
        if (num == '0') return 'Ningún ejercicio evaluado';
        if (num == '1') return '1 ejercicio evaluado';
        return `${num}  ejercicios evaluados`; 
    }
    render(): ReactNode {
        return(<CustomModal visible={this.props.show} onClose={()=>this.props.completeClose()} onRequestClose={()=>this.props.close()}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={()=>this.props.close()} />
                        <Appbar.Content title={decode(this.props.userData.name)} />
                        <Appbar.Action icon={'pencil'} onPress={this.props.openEditClient} />
                        <Appbar.Action icon={'trash-can-outline'} onPress={()=>this.setState({ showQuestionDeleteUser: true })} />
                    </Appbar.Header>
                    <ScrollView style={{ flex: 2, overflow: 'hidden', paddingBottom: 16 }}>
                        <View style={{ margin: 20, height: 100, width: (width - 40), flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.imageProfile} onPress={()=>this.props.viewImage()}>
                                <Image style={{ width: '100%', height: '100%' }} source={{ uri: `${HostServer}/images/accounts/${decode(this.props.userData.image)}` }} />
                            </TouchableOpacity>
                            <View style={styles.textProfile}>
                                <Text style={{ fontSize: 20 }}>{decode(this.props.userData.name)}</Text>
                                <Text style={{ marginTop: 8, marginLeft: 12, color: 'rgba(255, 255, 255, 0.7)' }}>
                                    <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>Experiencia: </Text>
                                    {decode(this.props.userData.experience)}
                                </Text>
                            </View>
                        </View>
                        <Divider />
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ margin: 14, marginLeft: 18, fontSize: 18 }}>Más información:</Text>
                            <View style={{ flexDirection: 'column' }}>
                                <PointItemList textA="Ejercicios" textB={this.processTextTraining(this.props.userData.num_trainings)} />
                                <PointItemList textA="Cumpleaños" textB={`${decode(this.props.userData.birthday)} (${this.calcYears(decode(this.props.userData.birthday))} años)`} />
                                <PointItemList textA="E-Mail" textB={decode(this.props.userData.email)} />
                                <PointItemList textA="Teléfono" textB={decode(this.props.userData.phone)} />
                                <PointItemList textA="D.N.I" textB={decode(this.props.userData.dni)} />
                            </View>
                        </View>
                        <Divider />
                        <View>
                            <Card style={{ margin: 16, display: (this.props.userData.type == '1')? 'flex': 'none' }}>
                                <Card.Title title="Medios de contacto:" />
                                <Card.Content>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                                        <IconButton color="#15b2f7" animated icon={'phone'} style={styles.buttonsContacts} onPress={()=>Linking.openURL(`tel:+549${decode(this.props.userData.phone)}`)}/>
                                        <IconButton color="#eb5c23" animated icon={'message'} style={styles.buttonsContacts} onPress={()=>Linking.openURL(`sms:+549${decode(this.props.userData.phone)}`)}/>
                                        <IconButton color="#25D366" animated icon={'whatsapp'} style={styles.buttonsContacts} onPress={()=>Linking.openURL(`whatsapp://send?phone=+549${decode(this.props.userData.phone)}`)}/>
                                        <IconButton color="#ffce00" animated icon={'email'} style={styles.buttonsContacts} onPress={()=>Linking.openURL(`mailto:${decode(this.props.userData.email)}`)}/>
                                    </View>
                                </Card.Content>
                            </Card>
                            <Button icon={'dumbbell'} onPress={()=>this.getAllTrainings()} mode={'contained'} style={{ marginLeft: 16, marginRight: 16, marginTop: (this.props.userData.type == '1')? 0: 16 }} labelStyle={{ color: '#FFFFFF' }}>
                                Ver rendimiento
                            </Button>
                            <Button icon={'comment-text-multiple-outline'} onPress={()=>this.goAllComments()} mode={'contained'} style={{ marginLeft: 16, marginRight: 16, marginTop: 16 }} labelStyle={{ color: '#FFFFFF' }}>
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
                                    <Button onPress={()=>this.setState({ showQuestionDeleteUser: false }, ()=>this.deleteClient())}>Aceptar</Button>
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