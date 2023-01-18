import React, { forwardRef, useImperativeHandle, useState } from "react";
import { StyleSheet, View } from "react-native";
import CustomModal from "../../components/CustomModal";
import CombinedTheme from "../../../Theme";
import { Appbar, TextInput } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

type IProps = {};
export type EditClientProfessionalRef = {
    open: ()=>void;
};

export default React.memo(forwardRef(function EditClientProfessional(_props: IProps, ref: React.Ref<EditClientProfessionalRef>) {
    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');
    const [dni, setDNI] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    function close() {
        setVisible(false);
    }
    function open() {
        setVisible(true);
    }

    useImperativeHandle(ref, ()=>({ open }));

    return(<CustomModal visible={visible} onRequestClose={close}>
        <View style={styles.content}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={close} />
                <Appbar.Content title={'Editar usuario'} />
            </Appbar.Header>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollView}>
                <TextInput label={'Nombre y Apellido'} style={styles.textInput} mode={'outlined'} value={name} onChangeText={setName} autoCapitalize={'words'} keyboardType={'default'} textContentType={'name'} blurOnSubmit={false} />
                <TextInput label={'D.N.I'} style={styles.textInput} mode={'outlined'} value={dni} onChangeText={setDNI} keyboardType={'numeric'} blurOnSubmit={false} />
                <TextInput label={'Teléfono'} style={styles.textInput} mode={'outlined'} value={phone} onChangeText={setPhone} keyboardType={'phone-pad'} textContentType={'telephoneNumber'} blurOnSubmit={false} />
                <TextInput label={'E-Mail'} style={styles.textInput} mode={'outlined'} value={email} onChangeText={setEmail} autoCapitalize={'none'} keyboardType={'email-address'} textContentType={'emailAddress'} blurOnSubmit={false} />
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
    }
});