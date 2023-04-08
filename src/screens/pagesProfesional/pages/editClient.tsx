import React, { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import CustomModal from "../../components/CustomModal";
import { Appbar, Button, TextInput } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { userData } from "../../../scripts/ApiCorporal/types";
import { decode, encode } from "base-64";
import { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import moment from "moment";
import { Account } from "../../../scripts/ApiCorporal";
import { ThemeContext } from "../../../providers/ThemeProvider";
import { GlobalRef } from "../../../GlobalRef";

type IProps = {
    finish: ()=>void;
};
export type EditClientProfessionalRef = {
    open: (data: userData)=>void;
};

export default React.memo(forwardRef(function EditClientProfessional(_props: IProps, ref: React.Ref<EditClientProfessionalRef>) {
    // Context's
    const { theme } = useContext(ThemeContext);
    // State's
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [dni, setDNI] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [aDate, setADate] = useState(new Date());
    const [id, setId] = useState('-1');
    const [datas, setDatas] = useState<userData | undefined>(undefined);

    function close() {
        if (loading) return ToastAndroid.show('No se puede cerrar en este momento.', ToastAndroid.SHORT);
        setVisible(false);
    }
    function open(data: userData) {
        setName(decode(data.name));
        setDNI(decode(data.dni));
        setPhone(decode(data.phone));
        let birth = decode(data.birthday);
        setBirthday(birth);
        setADate(moment(birth, 'DD/MM/YYYY').toDate());
        setEmail(decode(data.email));
        setId(data.id);
        setDatas(data);
        setVisible(true);
    }

    function setStatePassword() {
        setShowPassword(!showPassword);
    }
    function hidenPassword() {
        setShowPassword(false);
    }
    function rightPassword() {
        return(<TextInput.Icon
            icon={(showPassword)? 'eye-off-outline': 'eye-outline'}
            forceTextInputFocus={true}
            disabled={loading}
            onPress={(!loading)? setStatePassword: undefined}
        />);
    }
    function rightBithday() {
        return(<TextInput.Icon
            icon={'calendar-outline'}
            forceTextInputFocus={true}
            disabled={loading}
            onPress={(!loading)? openDatePicker: undefined}
        />);
    }

    function onChangeDate(event: DateTimePickerEvent, date?: Date | undefined) {
        if (event.type == 'dismissed') return;
        setADate(date!);
        setBirthday(moment(date!).format('DD/MM/YYYY'));
    }
    function openDatePicker() {
        DateTimePickerAndroid.open({
            value: aDate,
            mode: 'date',
            onChange: onChangeDate
        });
    }

    function restoreData() {
        setName(decode(datas!.name));
        setDNI(decode(datas!.dni));
        setPhone(decode(datas!.phone));
        let birth = decode(datas!.birthday);
        setBirthday(birth);
        setADate(moment(birth, 'DD/MM/YYYY').toDate());
        setEmail(decode(datas!.email));
    }

    function getModifyData(): false | FormData {
        let modify: number = 0;
        if (name !== datas!.name) modify += 1;
        if (dni !== datas!.dni) modify += 1;
        if (phone !== datas!.phone) modify += 1;
        if (birthday !== datas!.birthday) modify += 1;
        if (email !== datas!.email) modify += 1;

        if (modify == 0) return false;

        const formData = new FormData();
        formData.append('idEdit', id);
        if (name !== datas!.name) formData.append('name', encode(name));
        if (dni !== datas!.dni) formData.append('dni', encode(dni));
        if (phone !== datas!.phone) formData.append('phone', encode(phone));
        if (birthday !== datas!.birthday) formData.append('birthday', encode(birthday));
        if (email !== datas!.email) formData.append('email', encode(email));
        return formData;
    }

    async function sendEditing() {
        setLoading(true);
        try {
            const getData = getModifyData();
            if (!getData) {
                setLoading(false);
                return GlobalRef.current?.showSimpleAlert('No se detecto ningun dato a modificar.', '');
            }
            await Account.admin_modify(getData);
            setLoading(false);
            setVisible(false);
            _props.finish();
            ToastAndroid.show('Usuario editado con exito.', ToastAndroid.SHORT);
        } catch (error: any) {
            setLoading(false);
            GlobalRef.current?.showSimpleAlert('Ocurrió un error inesperado', error.cause??'');
        }
    }

    useImperativeHandle(ref, ()=>({ open }));

    return(<CustomModal visible={visible} onRequestClose={close}>
        <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
            <Appbar.Header style={[styles.header, { backgroundColor: theme.colors.background }]}>
                <Appbar.BackAction onPress={close} />
                <Appbar.Content title={'Editar usuario'} />
                <Appbar.Action icon={'restore'} onPress={restoreData} />
            </Appbar.Header>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollView}>
                <TextInput label={'Nombre y Apellido'} disabled={loading} style={styles.textInput} mode={'outlined'} value={name} onChangeText={setName} autoCapitalize={'words'} keyboardType={'default'} textContentType={'name'} blurOnSubmit={false} />
                <TextInput label={'D.N.I'} disabled={loading} style={styles.textInput} mode={'outlined'} value={dni} onChangeText={setDNI} keyboardType={'numeric'} blurOnSubmit={false} />
                <TextInput label={'Teléfono'} disabled={loading} style={styles.textInput} mode={'outlined'} value={phone} onChangeText={setPhone} keyboardType={'phone-pad'} textContentType={'telephoneNumber'} blurOnSubmit={false} />
                <TextInput label={'E-Mail'} disabled={loading} style={styles.textInput} mode={'outlined'} value={email} onChangeText={setEmail} autoCapitalize={'none'} keyboardType={'email-address'} textContentType={'emailAddress'} blurOnSubmit={false} />
                <TextInput label={'Fecha de nacimiento'} disabled={loading} style={styles.textInput} mode={'outlined'} value={birthday} editable={false} blurOnSubmit={false} right={rightBithday()} />
                <TextInput label={'Contraseña'} disabled={loading} style={styles.textInput} mode={'outlined'} value={password} onChangeText={setPassword} autoCapitalize={'none'} secureTextEntry={!showPassword} textContentType={'newPassword'} blurOnSubmit={false} onBlur={hidenPassword} right={rightPassword()} />
                <View style={styles.buttonContent}>
                    <Button
                        mode={'contained'}
                        style={styles.buttonSend}
                        loading={loading}
                        disabled={loading}
                        onPress={sendEditing}
                    >Enviar</Button>
                </View>
            </ScrollView>
        </View>
    </CustomModal>);
}));

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#1663AB'
    },
    content: {
        flex: 1
    },
    scrollView: {
        paddingTop: 12,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 24
    },
    textInput: {
        marginBottom: 8
    },
    buttonContent: {
        marginTop: 12,
        width: '100%',
        alignItems: 'center'
    },
    buttonSend: {
        width: 120
    }
});