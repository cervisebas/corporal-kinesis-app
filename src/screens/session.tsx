import moment from "moment";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Dimensions, KeyboardAvoidingView, StyleSheet, View, TextInput as NativeTextInput, TouchableWithoutFeedback, Keyboard, BackHandler } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Logo } from "../assets/icons";
import { Account } from "../scripts/ApiCorporal";
import CustomModal from "./components/CustomModal";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { GlobalRef } from "../GlobalRef";
import { calcYears, waitTo } from "../scripts/Utils";

type IProps = {
    setLoading: (view: boolean, text: string)=>any;
    reVerify: ()=>void;
};
export type SessionRef = {
    open: ()=>void;
    close: ()=>void;
};

export default React.memo(forwardRef(function Session(props: IProps, ref: React.Ref<SessionRef>) {
    const { width } = Dimensions.get('window');
    // State's
    const [visible, setVisible] = useState(false);
    const [sessionEmail, setSessionEmail] = useState('');
    const [sessionPassword, setSessionPassword] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
    const [registerDni, setRegisterDni] = useState('');
    const [registerDate, setRegisterDate] = useState(moment().format('DD/MM/YYYY'));
    const [registerTel, setRegisterTel] = useState('');
    const [actualDatePicker, setActualDatePicker] = useState(new Date());
    const [viewPanel, setViewPanel] = useState(1);
    // Ref's
    const refSessionInputEmail = useRef<NativeTextInput>(null);
    const refSessionInputPassword = useRef<NativeTextInput>(null);
    const refRegisterInputName = useRef<NativeTextInput>(null);
    const refRegisterInputEmail = useRef<NativeTextInput>(null);
    const refRegisterInputPassword = useRef<NativeTextInput>(null);
    const refRegisterInputConfirmPassword = useRef<NativeTextInput>(null);
    const refRegisterInputDNI = useRef<NativeTextInput>(null);
    const refRegisterInputPhone = useRef<NativeTextInput>(null);

    function changeViewPanel() {
        const panel = (viewPanel == 1)? 2: 1;
        switch (panel) {
            case 1:
                setSessionEmail('');
                setSessionPassword('');
                break;
            case 2:
                setRegisterName('');
                setRegisterEmail('');
                setRegisterPassword('');
                setRegisterConfirmPassword('');
                setRegisterDate(moment().format('DD/MM/YYYY'));
                setRegisterDni('');
                setRegisterTel('');
                break;
        }
        setViewPanel(panel);
    }
    function openDatePicker() {
        DateTimePickerAndroid.open({
            value: actualDatePicker,
            mode: 'date',
            onChange: ({ type }, date?)=>{
                if (type == 'dismissed') return;
                if (!date) return;
                setActualDatePicker(moment(date).toDate());
                setRegisterDate(moment(date).format('DD/MM/YYYY'));
            }
        });
    }

    function verifyDataRegister(): Promise<boolean> {
        return new Promise((resolve)=>{
            const reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (registerName.length <= 4) {
                GlobalRef.current?.showSimpleAlert('¡¡Atención!!', 'El nombre ingresado es demasiado corto.');
                return resolve(false);
            }
            if (!reg.test(registerEmail)) {
                GlobalRef.current?.showSimpleAlert('¡¡Atención!!', 'El Email ingresado no es válido.');
                return resolve(false);
            }
            if (registerPassword.length < 8) {
                GlobalRef.current?.showSimpleAlert('¡¡Atención!!', 'La contraseña ingresada es muy corta.\nLa longitud no puede ser menor a 8 caracteres.');
                return resolve(false);
            }
            if (registerPassword !== registerConfirmPassword) {
                GlobalRef.current?.showSimpleAlert('¡¡Atención!!', 'Las contraseñas ingresadas son distintas.');
                return resolve(false);
            }
            if (registerDni.length != 8) {
                GlobalRef.current?.showSimpleAlert('¡¡Atención!!', 'El D.N.I ingresado no es válido.');
                return resolve(false);
            }
            if (parseInt(calcYears(registerDate)) < 12) {
                GlobalRef.current?.showSimpleAlert('¡¡Atención!!', 'No tienes la edad suficiente para registrarte.\nLa edad mínima para participar es de 12 años.');
                return resolve(false);
            }
            if (registerTel.length < 10 || registerTel.length > 13) {
                GlobalRef.current?.showSimpleAlert('¡¡Atención!!', 'El número de teléfono ingresado no es válido.\nLa longitud mínima de un número de teléfono debe de ser de 10 caracteres y no puede pasar de los 13.');
                return resolve(false);
            }
            return resolve(true);
        });
    }
    function verifyDataSession(): Promise<boolean> {
        return new Promise((resolve)=>{
            var reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (!reg.test(sessionEmail)) {
                GlobalRef.current?.showSimpleAlert('¡¡Atención!!', 'El Email ingresado no es válido.');
                return resolve(false);
            }
            if (sessionPassword.length < 8) {
                GlobalRef.current?.showSimpleAlert('¡¡Atención!!', 'La contraseña ingresada es muy corta.');
                return resolve(false);
            }
            return resolve(true);
        });
    }
    async function goRegister() {
        Keyboard.dismiss();
        GlobalRef.current?.loadingController(true, 'Registrándose como nuevo usuario...');
        const verify = await verifyDataRegister();
        if (!verify) return GlobalRef.current?.loadingController(false);
        Account.create(registerName, registerEmail, registerPassword, registerDate, registerDni, registerTel).then((value)=>{
            GlobalRef.current?.loadingController(false);
            if (!value) return GlobalRef.current?.showSimpleAlert('Oh no...', 'Ocurrió inesperadamente un error desconocido, nosotros lo arreglaremos lo más rápido posible. Intente registrarse nuevamente más tarde.');
            GlobalRef.current?.showDoubleAlert('Se registro correctamente', 'Se registro su usuario correctamente, luego de presionar en “Continuar” le llevaremos a la ventana de inicio de sesión donde deberá de colocar los datos que ingreso en el registro para acceder a su cuenta.', async function goOpenSession() {
                GlobalRef.current?.loadingController(true, 'Por favor espere...');
                changeViewPanel();
                await waitTo(1000);
                GlobalRef.current?.loadingController(false);
            });
        }).catch((data)=>{
            GlobalRef.current?.loadingController(false);
            GlobalRef.current?.showSimpleAlert('Ocurrió un error', data.cause);
        });
    }
    async function goSession() {
        Keyboard.dismiss();
        GlobalRef.current?.loadingController(true, 'Iniciando sesión...');
        const verify = await verifyDataSession();
        if (!verify) return GlobalRef.current?.loadingController(false);
        Account.open(sessionEmail, sessionPassword).then(()=>{
            GlobalRef.current?.loadingController(false);
            props.reVerify();
            setSessionEmail('');
            setSessionPassword('');
            setVisible(false);
        }).catch((data)=>{
            GlobalRef.current?.loadingController(false);
            GlobalRef.current?.showSimpleAlert('Ocurrió un error', data.cause);
        });
    }

    function open() { setVisible(true); }
    function close() { setVisible(false); }
    
    useImperativeHandle(ref, ()=>({ open, close }));
    
    return(<CustomModal visible={visible} animationIn={'fadeIn'} animationOut={'fadeOut'} onRequestClose={BackHandler.exitApp}>
        <View style={{ flex: 1, backgroundColor: '#0B0C0E', position: 'relative' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={'height'} keyboardVerticalOffset={0}>
                    <View style={styles.contain}>
                        <View style={[styles.card, { width: (width - 64), display: (viewPanel == 1)? 'flex': 'none' }]}>
                            <Logo width={128} height={128} />
                            <View style={[styles.form, { width: (width - 80) }]}>
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    label={'Email o teléfono'}
                                    autoCapitalize={'none'}
                                    textContentType={'emailAddress'}
                                    value={sessionEmail}
                                    keyboardType={'email-address'}
                                    render={(props)=><NativeTextInput {...props} ref={refSessionInputEmail} />}
                                    returnKeyType={'next'}
                                    onSubmitEditing={()=>refSessionInputPassword.current?.focus()}
                                    onChangeText={(text)=>setSessionEmail(text.replace(/\ /gi, ''))}
                                    blurOnSubmit={false} />
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    secureTextEntry={true}
                                    autoCapitalize={'none'}
                                    label={'Contraseña'}
                                    value={sessionPassword}
                                    textContentType={'password'}
                                    render={(props)=><NativeTextInput {...props} ref={refSessionInputPassword} />}
                                    returnKeyType={'send'}
                                    onSubmitEditing={goSession}
                                    onChangeText={setSessionPassword} />
                            </View>
                            <View style={styles.formButtons}>
                                <Button onPress={goSession} mode={'contained'}>Iniciar Sesión</Button>
                                <Button onPress={changeViewPanel} style={{ marginTop: 8 }}>Registrarse</Button>
                            </View>
                        </View>
                        <View style={[styles.card, { width: (width - 64), display: (viewPanel == 2)? 'flex': 'none' }]}>
                            <Text style={{ fontSize: 28, color: '#ED7035', textAlign: 'center' }}>{'Bienvenid@ a \nCorporal Kinesis App'}</Text>
                            <View style={[styles.form, { width: (width - 80) }]}>
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    label={'Nombre y apellido'}
                                    textContentType={'nickname'}
                                    keyboardType={'default'}
                                    render={(props)=><NativeTextInput {...props} ref={refRegisterInputName} />}
                                    returnKeyType={'next'}
                                    onSubmitEditing={()=>refRegisterInputEmail.current?.focus()}
                                    value={registerName}
                                    onChangeText={setRegisterName} />
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    label={'Correo electrónico'}
                                    autoCapitalize={'none'}
                                    textContentType={'emailAddress'}
                                    keyboardType={'email-address'}
                                    render={(props)=><NativeTextInput {...props} ref={refRegisterInputEmail} />}
                                    returnKeyType={'next'}
                                    onSubmitEditing={()=>refRegisterInputPassword.current?.focus()}
                                    value={registerEmail}
                                    onChangeText={(text)=>setRegisterEmail(text.replace(/\ /gi, ''))} />
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    secureTextEntry={true}
                                    label={'Contraseña'}
                                    autoCapitalize={'none'}
                                    textContentType={'password'}
                                    render={(props)=><NativeTextInput {...props} ref={refRegisterInputPassword} />}
                                    returnKeyType={'next'}
                                    onSubmitEditing={()=>refRegisterInputConfirmPassword.current?.focus()}
                                    value={registerPassword}
                                    onChangeText={setRegisterPassword} />
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    secureTextEntry={true}
                                    autoCapitalize={'none'}
                                    label={'Confirmar contraseña'}
                                    textContentType={'password'}
                                    render={(props)=><NativeTextInput {...props} ref={refRegisterInputConfirmPassword} />}
                                    returnKeyType={'next'}
                                    onSubmitEditing={()=>refRegisterInputDNI.current?.focus()}
                                    value={registerConfirmPassword}
                                    onChangeText={setRegisterConfirmPassword} />
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    label={'D.N.I'}
                                    keyboardType={'numeric'}
                                    render={(props)=><NativeTextInput {...props} ref={refRegisterInputDNI} />}
                                    returnKeyType={'next'}
                                    onSubmitEditing={openDatePicker}
                                    value={registerDni}
                                    onChangeText={setRegisterDni} />
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    label={'Fecha de nacimiento'}
                                    value={registerDate}
                                    editable={false}
                                    right={<TextInput.Icon icon="calendar-range" onPress={openDatePicker} />} />
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    label={'Número de teléfono'}
                                    textContentType={'telephoneNumber'}
                                    keyboardType={'phone-pad'}
                                    render={(props)=><NativeTextInput {...props} ref={refRegisterInputPhone} />}
                                    returnKeyType={'send'}
                                    onSubmitEditing={goRegister}
                                    value={registerTel}
                                    onChangeText={setRegisterTel} />
                            </View>
                            <View style={styles.formButtons}>
                                <Button onPress={goRegister} mode={'contained'}>Registrarse</Button>
                                <Button onPress={changeViewPanel} style={{ marginTop: 8 }}>¿Ya estas registrado?</Button>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </View>
    </CustomModal>);
}));

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
        //width: (width - 64),
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
        //width: (width - 80),
        marginTop: 8
    },
    formButtons: {
        marginTop: 16,
        marginBottom: 8
    }
});