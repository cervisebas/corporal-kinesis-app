import React, { forwardRef, useImperativeHandle, useState } from "react";
import { StyleSheet, View } from "react-native";
import CustomModal from "../../components/CustomModal";
import CombinedTheme from "../../../Theme";
import { Appbar, Button, TextInput } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { userData } from "../../../scripts/ApiCorporal/types";
import { decode } from "base-64";
import { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import moment from "moment";

type IProps = {};
export type EditClientProfessionalRef = {
    open: (data: userData)=>void;
};

export default React.memo(forwardRef(function EditClientProfessional(_props: IProps, ref: React.Ref<EditClientProfessionalRef>) {
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

    function close() {
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

    useImperativeHandle(ref, ()=>({ open }));

    return(<CustomModal visible={visible} onRequestClose={close}>
        <View style={styles.content}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={close} />
                <Appbar.Content title={'Editar usuario'} />
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
        flex: 1,
        backgroundColor: CombinedTheme.colors.background
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