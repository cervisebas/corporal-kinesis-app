import { decode } from "base-64";
import moment from "moment";
import React, { Component } from "react";
import { DeviceEventEmitter, Dimensions, KeyboardAvoidingView, StyleSheet, View, TextInput as NativeTextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button, Dialog, Paragraph, Portal, Provider as PaperProvider, Text, TextInput } from "react-native-paper";
import { Logo } from "../assets/icons";
import { Account } from "../scripts/ApiCorporal";
import { setLoadNow } from "../scripts/Global";
import CombinedTheme from "../Theme";
import CustomModal from "./components/CustomModal";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

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
    actualDatePicker: Date;
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
            registerDate: moment(date).format('DD/MM/YYYY'),
            registerTel: '',

            registerAlertName: false,
            registerAlertEmail: false,
            registerAlertPassword: false,
            registerAlertConfirmPassword: false,
            registerAlertDni: false,
            registerAlertDate: false,
            registerAlertTel: false,

            actualDatePicker: date,
            viewPanel: 1,

            dialogShow: false,
            dialogTitle: '',
            dialogText: '',
            dialogShowContinue: false
        };
    }
    
    // Inputs
    private sessionInputEmail: NativeTextInput | null = null;
    private sessionInputPassword: NativeTextInput | null = null;
    private registerInputName: NativeTextInput | null = null;
    private registerInputEmail: NativeTextInput | null = null;
    private registerInputPassword: NativeTextInput | null = null;
    private registerInputConfirmPassword: NativeTextInput | null = null;
    private registerInputDNI: NativeTextInput | null = null;
    private registerInputPhone: NativeTextInput | null = null;

    closeModal() {
        var date = new Date();
        this.setState({ sessionEmail: '', sessionPassword: '', sessionAlertEmail: false, sessionAlertPassword: false, registerName: '', registerEmail: '', registerPassword: '', registerConfirmPassword: '', registerDni: '', registerDate: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`, registerTel: '', registerAlertName: false, registerAlertEmail: false, registerAlertPassword: false, registerAlertConfirmPassword: false, registerAlertDni: false, registerAlertDate: false, registerAlertTel: false, actualDatePicker: date, viewPanel: 1, dialogShow: false, dialogTitle: '', dialogText: '', dialogShowContinue: false });
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
                setLoadNow(true);
                DeviceEventEmitter.emit('nowVerify');
                setTimeout(()=>{
                    this.props.setLoading(false, '');
                    this.props.close();
                }, 1024);
            }, 128);
        }).catch((data)=>{
            this.props.setLoading(false, '');
            this.setState({
                dialogShow: true,
                dialogTitle: data.cause,
                dialogText: 'Intente nuevamente realizar esta acción más tarde.',
            });
        });
    }
    changeViewPanel(panel: number) {
        switch (panel) {
            case 1:
                this.sessionInputEmail?.clear();
                this.sessionInputPassword?.clear();
                this.setState({ viewPanel: 1 });
                break;
            case 2:
                this.registerInputName?.clear();
                this.registerInputEmail?.clear();
                this.registerInputPassword?.clear();
                this.registerInputConfirmPassword?.clear();
                this.registerInputDNI?.clear();
                this.registerInputPhone?.clear();
                this.setState({ viewPanel: 2 });
                break;
        }
    }
    openDatePicker() {
        DateTimePickerAndroid.open({
            value: this.state.actualDatePicker,
            mode: 'date',
            onChange: ({ type }, date?)=>{
                if (type == 'dismissed') return;
                (date)&&this.setState({
                    actualDatePicker: moment(date).toDate(),
                    registerDate: moment(date).format('DD/MM/YYYY')
                });
            }
        });
    }
    render(): React.ReactNode {
        return(<CustomModal visible={this.props.visible} style={{ backgroundColor: '#0B0C0E' }} animationIn={'fadeIn'} animationOut={'fadeOut'}>
            <PaperProvider theme={CombinedTheme}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior={'height'} keyboardVerticalOffset={0}>
                        <View style={styles.contain}>
                            <View style={{ ...styles.card, display: (this.state.viewPanel == 1)? 'flex': 'none' }}>
                                <Logo width={128} height={128} />
                                <View style={styles.form}>
                                    <TextInput
                                        style={styles.textInput}
                                        mode={'outlined'}
                                        label={'Email o teléfono'}
                                        autoCapitalize={'none'}
                                        textContentType={'emailAddress'}
                                        value={this.state.sessionEmail}
                                        keyboardType={'email-address'}
                                        render={(props)=><NativeTextInput {...props} ref={(ref)=>this.sessionInputEmail = ref} />}
                                        returnKeyType={'next'}
                                        onSubmitEditing={()=>this.sessionInputPassword?.focus()}
                                        onChangeText={(text)=>this.setState({ sessionEmail: text.replace(/\ /gi, '') })}
                                        blurOnSubmit={false} />
                                    <TextInput
                                        style={styles.textInput}
                                        mode={'outlined'}
                                        secureTextEntry={true}
                                        autoCapitalize={'none'}
                                        label={'Contraseña'}
                                        value={this.state.sessionPassword}
                                        textContentType={'password'}
                                        render={(props)=><NativeTextInput {...props} ref={(ref)=>this.sessionInputPassword = ref} />}
                                        returnKeyType={'send'}
                                        onSubmitEditing={()=>this.goSession()}
                                        onChangeText={(text)=>this.setState({ sessionPassword: text })} />
                                </View>
                                <View style={styles.formButtons}>
                                    <Button onPress={()=>this.goSession()} mode={'contained'}>Iniciar Sesión</Button>
                                    <Button onPress={()=>this.setState({ viewPanel: 2 })} style={{ marginTop: 8 }}>Registrarse</Button>
                                </View>
                            </View>
                            <View style={{ ...styles.card, display: (this.state.viewPanel == 2)? 'flex': 'none' }}>
                                <Text style={{ fontSize: 28, color: '#ED7035', textAlign: 'center' }}>{'Bienvenid@ a \nCorporal Kinesis App'}</Text>
                                <View style={styles.form2}>
                                    <TextInput
                                        style={styles.textInput}
                                        mode={'outlined'}
                                        label={'Nombre y apellido'}
                                        textContentType={'nickname'}
                                        error={this.state.registerAlertName}
                                        keyboardType={'default'}
                                        render={(props)=><NativeTextInput {...props} ref={(ref)=>this.registerInputName = ref} />}
                                        returnKeyType={'next'}
                                        onSubmitEditing={()=>this.registerInputEmail?.focus()}
                                        value={this.state.registerName}
                                        onChangeText={(text)=>this.setState({ registerName: text })} />
                                    <TextInput
                                        style={styles.textInput}
                                        mode={'outlined'}
                                        label={'Correo electrónico'}
                                        autoCapitalize={'none'}
                                        textContentType={'emailAddress'}
                                        error={this.state.registerAlertEmail}
                                        keyboardType={'email-address'}
                                        render={(props)=><NativeTextInput {...props} ref={(ref)=>this.registerInputEmail = ref} />}
                                        returnKeyType={'next'}
                                        onSubmitEditing={()=>this.registerInputPassword?.focus()}
                                        value={this.state.registerEmail}
                                        onChangeText={(text)=>this.setState({ registerEmail: text.replace(/\ /gi, '') })} />
                                    <TextInput
                                        style={styles.textInput}
                                        mode={'outlined'}
                                        secureTextEntry={true}
                                        label={'Contraseña'}
                                        autoCapitalize={'none'}
                                        textContentType={'password'}
                                        error={this.state.registerAlertPassword}
                                        render={(props)=><NativeTextInput {...props} ref={(ref)=>this.registerInputPassword = ref} />}
                                        returnKeyType={'next'}
                                        onSubmitEditing={()=>this.registerInputConfirmPassword?.focus()}
                                        value={this.state.registerPassword}
                                        onChangeText={(text)=>this.setState({ registerPassword: text })} />
                                    <TextInput
                                        style={styles.textInput}
                                        mode={'outlined'}
                                        secureTextEntry={true}
                                        autoCapitalize={'none'}
                                        label={'Confirmar contraseña'}
                                        textContentType={'password'}
                                        error={this.state.registerAlertConfirmPassword}
                                        render={(props)=><NativeTextInput {...props} ref={(ref)=>this.registerInputConfirmPassword = ref} />}
                                        returnKeyType={'next'}
                                        onSubmitEditing={()=>this.registerInputDNI?.focus()}
                                        value={this.state.registerConfirmPassword}
                                        onChangeText={(text)=>this.setState({ registerConfirmPassword: text })} />
                                    <TextInput
                                        style={styles.textInput}
                                        mode={'outlined'}
                                        label={'D.N.I'}
                                        keyboardType={'numeric'}
                                        error={this.state.registerAlertDni}
                                        render={(props)=><NativeTextInput {...props} ref={(ref)=>this.registerInputDNI = ref} />}
                                        returnKeyType={'next'}
                                        onSubmitEditing={()=>this.openDatePicker()}
                                        value={this.state.registerDni}
                                        onChangeText={(text)=>this.setState({ registerDni: text })} />
                                    <TextInput
                                        style={styles.textInput}
                                        mode={'outlined'}
                                        label={'Fecha de nacimiento'}
                                        error={this.state.registerAlertDate}
                                        value={this.state.registerDate}
                                        editable={false}
                                        right={<TextInput.Icon name="calendar-range" onPress={()=>this.openDatePicker()} />} />
                                    <TextInput
                                        style={styles.textInput}
                                        mode={'outlined'}
                                        label={'Número de teléfono'}
                                        textContentType={'telephoneNumber'}
                                        keyboardType={'phone-pad'}
                                        error={this.state.registerAlertTel}
                                        render={(props)=><NativeTextInput {...props} ref={(ref)=>this.registerInputPhone = ref} />}
                                        returnKeyType={'send'}
                                        onSubmitEditing={()=>this.goRegister()}
                                        value={this.state.registerTel}
                                        onChangeText={(text)=>this.setState({ registerTel: text })} />
                                </View>
                                <View style={styles.formButtons}>
                                    <Button onPress={()=>this.goRegister()} mode={'contained'}>Registrarse</Button>
                                    <Button onPress={()=>this.setState({ viewPanel: 1 })} style={{ marginTop: 8 }}>¿Ya estas registrado?</Button>
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
                <Portal>
                    <Dialog visible={this.state.dialogShow} dismissable={true} onDismiss={()=>this.setState({ dialogShow: false })}>
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
                                    registerDate: moment(date).format('DD/MM/YYYY'),
                                    registerTel: ''
                                }), 1024);
                                setTimeout(()=>this.props.setLoading(false, ''), 1152);
                            }}>Continuar</Button>}
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </PaperProvider>
        </CustomModal>);
    }
}

const styles = StyleSheet.create({
    contain: {
        width: '100%',
        height: '100%',
        backgroundColor: '#0B0C0E',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2
    },
    card: {
        width: (width - 64),
        padding: 16,
        backgroundColor: '#1663AB',
        alignItems: 'center',
        borderRadius: 8
    },
    textInput: {
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 4,
        marginTop: 4
    },
    form: {
        width: (width - 80),
        marginTop: 8
    },
    form2: {
        width: (width - 80),
        marginTop: 8
    },
    formButtons: {
        marginTop: 16,
        marginBottom: 8
    }
});