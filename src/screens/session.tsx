import { decode } from "base-64";
import moment from "moment";
import React, { Component } from "react";
import { Dimensions, KeyboardAvoidingView, Modal, StyleSheet, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { Button, Dialog, Paragraph, Portal, Provider as PaperProvider, Text, TextInput } from "react-native-paper";
import SplashScreen from "react-native-splash-screen";
import { Logo } from "../assets/icons";
import { Account } from "../scripts/ApiCorporal";
import CombinedTheme from "../Theme";

type IProps = {
    visible: boolean;
    close: ()=>any;
    setLoading: (view: boolean, text: string)=>any;
    setLoadData: (data: boolean)=>any;
};
type IState = {
    // Session
    sessionEmail: string;
    sessionPassword: string;

    sessionAlertEmail: boolean;
    sessionAlertPassword: boolean;

    // Register
    registerName: string;
    registerEmail: string;
    registerPassword: string;
    registerConfirmPassword: string;
    registerDni: string;
    registerDate: string;
    registerTel: string;

    registerAlertName: boolean;
    registerAlertEmail: boolean;
    registerAlertPassword: boolean;
    registerAlertConfirmPassword: boolean;
    registerAlertDni: boolean;
    registerAlertDate: boolean;
    registerAlertTel: boolean;

    // Interfaz
    viewModalDate: boolean;
    actualDatePicker: Date;
    actualDate: string;
    viewPanel: number;

    // Dialog
    dialogShow: boolean;
    dialogTitle: string;
    dialogText: string;
    dialogShowContinue: boolean;
};

const { width, height } = Dimensions.get('window');

export class Session extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        var date = new Date();
        this.state = {
            sessionEmail: '',
            sessionPassword: '',
            
            sessionAlertEmail: false,
            sessionAlertPassword: false,

            registerName: '',
            registerEmail: '',
            registerPassword: '',
            registerConfirmPassword: '',
            registerDni: '',
            registerDate: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
            registerTel: '',

            registerAlertName: false,
            registerAlertEmail: false,
            registerAlertPassword: false,
            registerAlertConfirmPassword: false,
            registerAlertDni: false,
            registerAlertDate: false,
            registerAlertTel: false,

            viewModalDate: false,
            actualDatePicker: date,
            actualDate: '',
            viewPanel: 1,

            dialogShow: false,
            dialogTitle: '',
            dialogText: '',
            dialogShowContinue: false
        };
    }
    closeModal() {
        var date = new Date();
        this.setState({ sessionEmail: '', sessionPassword: '', sessionAlertEmail: false, sessionAlertPassword: false, registerName: '', registerEmail: '', registerPassword: '', registerConfirmPassword: '', registerDni: '', registerDate: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`, registerTel: '', registerAlertName: false, registerAlertEmail: false, registerAlertPassword: false, registerAlertConfirmPassword: false, registerAlertDni: false, registerAlertDate: false, registerAlertTel: false, viewModalDate: false, actualDatePicker: date, actualDate: '', viewPanel: 1, dialogShow: false, dialogTitle: '', dialogText: '', dialogShowContinue: false });
    }
    calcYears(date: string) {
        var dateProcess = moment(date, 'DD/MM/YYYY').toDate();
        var now = new Date();
        var birthday = new Date(dateProcess);
        var year = now.getFullYear() - birthday.getFullYear();
        var m = now.getMonth() - birthday.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birthday.getDate())) { year--; }
        return year;
    }
    verifyDataRegister(): Promise<boolean> {
        return new Promise((resolve)=>{
            this.setState({ registerAlertName: false, registerAlertEmail: false, registerAlertPassword: false, registerAlertConfirmPassword: false, registerAlertDni: false, registerAlertDate: false, registerAlertTel: false });
            var reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (this.state.registerName.length <= 4) {
                this.setState({ registerAlertName: true, dialogShow: true, dialogTitle: '¡¡Atención!!', dialogText: 'El nombre ingresado es demasiado corto.' });
                return resolve(false);
            }
            if (!reg.test(this.state.registerEmail)) {
                this.setState({ registerAlertEmail: true, dialogShow: true, dialogTitle: '¡¡Atención!!', dialogText: 'El Email ingresado no es válido.' });
                return resolve(false);
            }
            if (this.state.registerPassword.length < 8) {
                this.setState({ registerAlertPassword: true, dialogShow: true, dialogTitle: '¡¡Atención!!', dialogText: 'La contraseña ingresada es muy corta.\nLa longitud no puede ser menor a 8 caracteres.' });
                return resolve(false);
            }
            if (this.state.registerPassword != this.state.registerConfirmPassword) {
                this.setState({ registerAlertConfirmPassword: true, dialogShow: true, dialogTitle: '¡¡Atención!!', dialogText: 'Las contraseñas ingresadas son distintas.' });
                return resolve(false);
            }
            if (this.state.registerDni.length != 8) {
                this.setState({ registerAlertDni: true, dialogShow: true, dialogTitle: '¡¡Atención!!', dialogText: 'El D.N.I ingresado no es válido.' });
                return resolve(false);
            }
            if (this.calcYears(this.state.registerDate) < 12) {
                this.setState({ registerAlertDate: true, dialogShow: true, dialogTitle: '¡¡Atención!!', dialogText: 'No tienes la edad suficiente para registrarte.\nLa edad mínima para participar es de 12 años.' });
                return resolve(false);
            }
            if (this.state.registerTel.length < 10 || this.state.registerTel.length > 13) {
                this.setState({ registerAlertTel: true, dialogShow: true, dialogTitle: '¡¡Atención!!', dialogText: 'El número de teléfono ingresado no es válido.\nLa longitud mínima de un número de teléfono debe de ser de 10 caracteres y no puede pasar de los 13.' });
                return resolve(false);
            }
            return resolve(true);
        });
    }
    verifyDataSession(): Promise<boolean> {
        return new Promise((resolve)=>{
            this.setState({ sessionAlertEmail: false, sessionAlertPassword: false });
            var reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (!reg.test(this.state.sessionEmail)) {
                this.setState({ sessionAlertEmail: true, dialogShow: true, dialogTitle: '¡¡Atención!!', dialogText: 'El Email ingresado no es válido.' });
                return resolve(false);
            }
            if (this.state.sessionPassword.length < 8) {
                this.setState({ sessionAlertPassword: true, dialogShow: true, dialogTitle: '¡¡Atención!!', dialogText: 'La contraseña ingresada es muy corta.' });
                return resolve(false);
            }
            return resolve(true);
        });
    }
    async goRegister() {
        this.props.setLoading(true, 'Registrándose como nuevo usuario...');
        var verify = await this.verifyDataRegister();
        if (!verify) return this.props.setLoading(false, '');
        Account.create(this.state.registerName, this.state.registerEmail, this.state.registerPassword, this.state.registerDate, this.state.registerDni, this.state.registerTel).then((value)=>{
            this.props.setLoading(false, '');
            if (!value) return this.setState({ dialogShow: true, dialogTitle: 'Oh no...', dialogText: 'Ocurrió inesperadamente un error desconocido, nosotros lo arreglaremos lo más rápido posible. Intente registrarse nuevamente más tarde.' });
            this.setState({
                dialogShow: true,
                dialogTitle: 'Se registro correctamente',
                dialogText: 'Se registro su usuario correctamente, luego de presionar en “Continuar” le llevaremos a la ventana de inicio de sesión donde deberá de colocar los datos que ingreso en el registro para acceder a su cuenta.',
                dialogShowContinue: true
            });
        }).catch((data)=>{
            this.props.setLoading(false, '');
            this.setState({
                dialogShow: true,
                dialogTitle: data.cause,
                dialogText: 'Intente nuevamente realizar esta acción más tarde.',
            });
        });
    }
    async goSession() {
        this.props.setLoading(true, 'Iniciando sesión...');
        var verify = await this.verifyDataSession();
        if (!verify) return this.props.setLoading(false, '');
        Account.open(this.state.sessionEmail, this.state.sessionPassword).then((value)=>{
            this.props.setLoading(false, '');
            this.props.setLoadData(true);
            var email: string = decode(value.email);
            setTimeout(()=>{
                this.props.setLoading(true, `Accediendo como "${email.slice(0, 5)}...${email.slice(email.indexOf('@'), email.length)}"...`);
                SplashScreen.show();
            }, 128);
            setTimeout(()=>{
                this.props.setLoading(false, '');
                this.props.close();
                setTimeout(()=>SplashScreen.hide(), 128);
            }, 2176);
        }).catch((data)=>{
            this.props.setLoading(false, '');
            this.setState({
                dialogShow: true,
                dialogTitle: data.cause,
                dialogText: 'Intente nuevamente realizar esta acción más tarde.',
            });
        });
    }
    render(): React.ReactNode {
        return(<Modal visible={this.props.visible} onDismiss={()=>this.closeModal()} onRequestClose={()=>this.props.close()} animationType={'none'} hardwareAccelerated={true} transparent={false}>
            <PaperProvider theme={CombinedTheme}>
                <KeyboardAvoidingView behavior={'height'} keyboardVerticalOffset={0}>
                    <View style={styles.contain}>
                        {(this.state.viewPanel == 1)? <View style={styles.card}>
                            <Logo width={128} height={128} />
                            <View style={styles.form}>
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    label={'Email o teléfono'}
                                    textContentType={'emailAddress'}
                                    value={this.state.sessionEmail}
                                    keyboardType={'email-address'}
                                    onChangeText={(text)=>this.setState({ sessionEmail: text.replace(/\ /gi, '') })} />
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    secureTextEntry={true}
                                    label={'Contraseña'}
                                    value={this.state.sessionPassword}
                                    textContentType={'password'}
                                    onChangeText={(text)=>this.setState({ sessionPassword: text })} />
                            </View>
                            <View style={styles.formButtons}>
                                <Button onPress={()=>this.goSession()} mode={'contained'}>Iniciar Sesión</Button>
                                <Button onPress={()=>this.setState({ viewPanel: 2 })} style={{ marginTop: 8 }}>Registrarse</Button>
                            </View>
                        </View>
                        : <View style={styles.card}>
                            <Text style={{ fontSize: 28, color: '#ED7035', textAlign: 'center' }}>{'Bienvenid@ a \nCorporal Kinesis App'}</Text>
                            <View style={styles.form2}>
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    label={'Nombre y apellido'}
                                    textContentType={'nickname'}
                                    error={this.state.registerAlertName}
                                    keyboardType={'default'}
                                    value={this.state.registerName}
                                    onChangeText={(text)=>this.setState({ registerName: text })} />
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    label={'Correo electrónico'}
                                    textContentType={'emailAddress'}
                                    error={this.state.registerAlertEmail}
                                    keyboardType={'email-address'}
                                    value={this.state.registerEmail}
                                    onChangeText={(text)=>this.setState({ registerEmail: text.replace(/\ /gi, '') })} />
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    secureTextEntry={true}
                                    label={'Contraseña'}
                                    textContentType={'password'}
                                    error={this.state.registerAlertPassword}
                                    value={this.state.registerPassword}
                                    onChangeText={(text)=>this.setState({ registerPassword: text })} />
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    secureTextEntry={true}
                                    label={'Confirmar contraseña'}
                                    textContentType={'password'}
                                    error={this.state.registerAlertConfirmPassword}
                                    value={this.state.registerConfirmPassword}
                                    onChangeText={(text)=>this.setState({ registerConfirmPassword: text })} />
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    label={'D.N.I'}
                                    keyboardType={'numeric'}
                                    error={this.state.registerAlertDni}
                                    value={this.state.registerDni}
                                    onChangeText={(text)=>this.setState({ registerDni: text })} />
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    label={'Fecha de nacimiento'}
                                    error={this.state.registerAlertDate}
                                    value={this.state.registerDate}
                                    editable={false}
                                    right={<TextInput.Icon name="calendar-range" onPress={()=>this.setState({ viewModalDate: true })} />} />
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    label={'Número de teléfono'}
                                    textContentType={'telephoneNumber'}
                                    keyboardType={'phone-pad'}
                                    error={this.state.registerAlertTel}
                                    value={this.state.registerTel}
                                    onChangeText={(text)=>this.setState({ registerTel: text })} />
                            </View>
                            <View style={styles.formButtons}>
                                <Button onPress={()=>this.goRegister()} mode={'contained'}>Registrarse</Button>
                                <Button onPress={()=>this.setState({ viewPanel: 1 })} style={{ marginTop: 8 }}>¿Ya estas registrado?</Button>
                            </View>
                        </View>}
                    </View>
                </KeyboardAvoidingView>
                <Portal>
                    <Dialog visible={this.state.viewModalDate} dismissable={false}>
                        <Dialog.Title>Fecha de nacimiento</Dialog.Title>
                        <Dialog.Content>
                            <DatePicker
                                date={this.state.actualDatePicker}
                                mode={'date'}
                                fadeToColor={'#323335'}
                                textColor={'#FFFFFF'}
                                onDateChange={(date)=>this.setState({ actualDatePicker: date, actualDate: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` })}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={()=>this.setState({ viewModalDate: false })}>Cancelar</Button>
                            <Button onPress={()=>this.setState({ registerDate: this.state.actualDate, viewModalDate: false })}>Aceptar</Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog visible={this.state.dialogShow} dismissable={false}>
                        <Dialog.Title>{this.state.dialogTitle}</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>{this.state.dialogText}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            {(!this.state.dialogShowContinue) && <Button onPress={()=>this.setState({ dialogShow: false })}>Cerrar</Button>}
                            {(this.state.dialogShowContinue) &&<Button onPress={()=>{
                                var date = new Date();
                                this.setState({ dialogShow: false, dialogTitle: '', dialogText: '', dialogShowContinue: false });
                                this.props.setLoading(true, 'Por favor espere...');
                                setTimeout(()=>this.setState({
                                    viewPanel: 1,
                                    registerName: '',
                                    registerEmail: '',
                                    registerPassword: '',
                                    registerConfirmPassword: '',
                                    registerDni: '',
                                    registerDate: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
                                    registerTel: ''
                                }), 1024);
                                setTimeout(()=>this.props.setLoading(false, ''), 1152);
                            }}>Continuar</Button>}
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </PaperProvider>
        </Modal>);
    }
}

const styles = StyleSheet.create({
    contain: {
        width: '100%',
        height: '100%',
        backgroundColor: '#0B0C0E',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        width: (width - 64),
        padding: 16,
        backgroundColor: '#1663AB',
        alignItems: 'center',
        borderRadius: 8
    },
    textInput: {
        height: 52,
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 4,
        marginTop: 4,
    },
    form: {
        height: 136,
        width: (width - 80),
        marginTop: 8
    },
    form2: {
        height: 468,
        width: (width - 80),
        marginTop: 8
    },
    formButtons: {
        marginTop: 16,
        marginBottom: 8
    }
});