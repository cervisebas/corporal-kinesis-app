import { encode } from 'base-64';
import moment from 'moment';
import React, { Component } from 'react';
import { DeviceEventEmitter, Dimensions, KeyboardAvoidingView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Button, Appbar, Avatar, Portal, TextInput, Provider as PaperProvider, Dialog, Snackbar, Text, Paragraph } from 'react-native-paper';
import { Account } from '../../../scripts/ApiCorporal';
import CombinedTheme from '../../../Theme';
import CustomModal from '../../components/CustomModal';
import ImageProfile from "../../../assets/profile.webp";

const { width } = Dimensions.get('window');

type IProps = {};
type IState = {
    visible: boolean;

    name: string;
    dni: string;
    date: string;
    actualDate: Date;

    alertName: boolean;
    alertDni: boolean;
    alertDate: boolean;

    viewModalDate: boolean;

    textButton: string;

    isLoading: boolean;

    viewSnackbar: boolean;

    dialogErrorView: boolean;
    dialogErrorMessage: string;
};
export default class AddNewAccount extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            name: '',
            dni: '',
            date: moment(new Date()).format('DD/MM/YYYY'),
            actualDate: new Date(),
            alertName: false,
            alertDni: false,
            alertDate: false,
            viewModalDate: false,
            textButton: 'Crear ahora',
            isLoading: false,
            viewSnackbar: false,
            dialogErrorView: false,
            dialogErrorMessage: ''
        };
        this.close = this.close.bind(this);
    }
    close() {
        if (this.state.isLoading) return ToastAndroid.show('Espere...', ToastAndroid.SHORT);
        this.setState({
            visible: false,
            name: '',
            dni: '',
            date: moment(new Date()).format('DD/MM/YYYY'),
            actualDate: new Date(),
            alertName: false,
            alertDni: false,
            alertDate: false,
        });
    }
    calcYears(date: string): number {
        var dateProcess = moment(date, 'DD/MM/YYYY').toDate();
        var now = new Date();
        var birthday = new Date(dateProcess);
        var year = now.getFullYear() - birthday.getFullYear();
        var m = now.getMonth() - birthday.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birthday.getDate())) { year--; }
        return year;
    }
    verifyData(): Promise<boolean> {
        return new Promise((resolve)=>{
            if (this.state.name.length < 5) {
                this.setState({ alertName: true });
                return resolve(false);
            }
            if (this.state.dni.length != 8) {
                this.setState({ alertDni: true });
                return resolve(false);
            }
            if (this.calcYears(this.state.date) < 12) {
                this.setState({ alertDate: true });
                return resolve(false);
            }
            return resolve(true);
        });
    }
    createNow() {
        this.setState({ isLoading: true });
        this.verifyData().then((verify)=>{
            if (!verify) return this.setState({ isLoading: false });
            Account.admin_create(encode(this.state.name), encode(this.state.dni), encode(this.state.date))
                .then(()=>this.setState({ name: '', dni: '', date: moment(new Date()).format('DD/MM/YYYY'), actualDate: new Date(), viewSnackbar: true, isLoading: false }, ()=>DeviceEventEmitter.emit('adminPage1Reload')))
                .catch((error)=>this.setState({ dialogErrorView: true, dialogErrorMessage: error.cause, isLoading: false }));
        });
    }

    // Controller
    open() { this.setState({ visible: true }); }

    render(): React.ReactNode {
        return(<CustomModal visible={this.state.visible} onRequestClose={this.close} animationIn={'slideInLeft'} animationOut={'slideOutRight'}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={this.close}/>
                        <Appbar.Content title={'Añadir nuevo usuario'} />
                    </Appbar.Header>
                    <KeyboardAvoidingView style={{ flex: 2 }} behavior={'height'} keyboardVerticalOffset={0}>
                        <ScrollView style={{ flex: 3 }}>
                            <View style={{ width, alignItems: 'center', paddingTop: 18 }}>
                                <Avatar.Image size={156} source={ImageProfile} />
                            </View>
                            <View style={{ flex: 4, marginTop: 32 }}>
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    label={'Nombre y apellido'}
                                    textContentType={'nickname'}
                                    error={this.state.alertName}
                                    keyboardType={'default'}
                                    value={this.state.name}
                                    disabled={this.state.isLoading}
                                    onChangeText={(text)=>this.setState({ name: text, alertName: false })} />
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    label={'D.N.I'}
                                    keyboardType={'numeric'}
                                    error={this.state.alertDni}
                                    value={this.state.dni}
                                    disabled={this.state.isLoading}
                                    onChangeText={(text)=>this.setState({ dni: text.replace(/\ /gi, '').replace(/\./gi, '').replace(/\,/gi, '').replace(/\-/gi, ''), alertDni: false })} />
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    label={'Fecha de nacimiento'}
                                    error={this.state.alertDate}
                                    value={this.state.date}
                                    disabled={this.state.isLoading}
                                    editable={false}
                                    right={<TextInput.Icon icon="calendar-range" disabled={this.state.isLoading} onPress={()=>this.setState({ viewModalDate: true })} />} />
                                <Button mode={'contained'} loading={this.state.isLoading} onPress={()=>(!this.state.isLoading)? this.createNow(): ToastAndroid.show('Espere...', ToastAndroid.SHORT)} style={{ marginTop: 8, marginLeft: 16, marginRight: 16 }}>
                                    {this.state.textButton}
                                </Button>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    <Portal>
                        <Dialog visible={this.state.viewModalDate} dismissable={true} onDismiss={()=>this.setState({ viewModalDate: false })}>
                            <Dialog.Title>Fecha de nacimiento</Dialog.Title>
                            <Dialog.Content>
                                {<DatePicker
                                    date={this.state.actualDate}
                                    mode={'date'}
                                    fadeToColor={'#323335'}
                                    textColor={'#FFFFFF'}
                                    onDateChange={(date)=>this.setState({ actualDate: date })}
                                />}
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={()=>this.setState({ viewModalDate: false })}>Cancelar</Button>
                                <Button onPress={()=>this.setState({ date: moment(this.state.actualDate).format('DD/MM/YYYY'), alertDate: false, viewModalDate: false })}>Aceptar</Button>
                            </Dialog.Actions>
                        </Dialog>
                        <Dialog visible={this.state.dialogErrorView} dismissable={false}>
                            <Dialog.Title>Ocurrio un error</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>{this.state.dialogErrorMessage}</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={()=>this.setState({ dialogErrorView: false })}>Aceptar</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <Snackbar visible={this.state.viewSnackbar} onDismiss={()=>this.setState({ viewSnackbar: false })} style={{ backgroundColor: '#1663AB' }} duration={3500}>
                        <Text>Usuario creado correctamente.</Text>
                    </Snackbar>
                </View>
            </PaperProvider>
        </CustomModal>);
    }
};

const styles = StyleSheet.create({
    textInput: {
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 4,
        marginTop: 4,
    }
});