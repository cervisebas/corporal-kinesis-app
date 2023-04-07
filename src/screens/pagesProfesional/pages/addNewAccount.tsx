import { encode } from 'base-64';
import moment from 'moment';
import React, { forwardRef, useContext, useImperativeHandle, useState } from 'react';
import { DeviceEventEmitter, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Appbar, Avatar, TextInput } from 'react-native-paper';
import { Account } from '../../../scripts/ApiCorporal';
import CustomModal from '../../components/CustomModal';
import ImageProfile from "../../../assets/profile.webp";
import { ThemeContext } from '../../../providers/ThemeProvider';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { calcYears } from '../../../scripts/Utils';
import { GlobalRef } from '../../../GlobalRef';

export type AddNewAccountRef = {
    open: ()=>void;
};

export default React.memo(forwardRef(function AddNewAccount(_props: any, ref: React.Ref<AddNewAccountRef>) {
    const { width } = Dimensions.get('window');
    //Context's
    const { theme } = useContext(ThemeContext);
    // State's
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [dni, setDni] = useState('');
    const [date, setDate] = useState(moment().format('DD/MM/YYYY'));
    const [actualDate, setActualDate] = useState(new Date());

    function clean() {
        setName('');
        setDni('');
        setDate(moment().format('DD/MM/YYYY'));
        setActualDate(new Date());
    }
    function verifyData() {
        if (name.length < 5) {
            GlobalRef.current?.showSimpleAlert('Coloca un nombre valido por favor.', '');
            return false;
        }
        if (dni.length != 8) {
            GlobalRef.current?.showSimpleAlert('Coloca un D.N.I valido por favor.', '');
            return false;
        }
        if (parseInt(calcYears(date)) < 12) {
            GlobalRef.current?.showSimpleAlert('Coloca una fecha de nacimiento valida por favor.', '');
            return false;
        }
        return true;
    }
    function createNow() {
        setLoading(true);
        if (!verifyData()) return setLoading(false);
        Account.admin_create(encode(name), encode(dni), encode(date))
            .then(()=>{
                const _name = name;
                GlobalRef.current?.showSimpleAlert('Enhorabuena', `Se creo el perfil de “${_name}” correctamente, ya puedes visualizarlo en la lista de usuarios.`)
                clean();
                setLoading(false);
                DeviceEventEmitter.emit('adminPage1Reload');
            })
            .catch((error)=>{
                setLoading(false);
                GlobalRef.current?.showSimpleAlert('Ocurrio un error', error.cause);
            });
    }
    function _openDatePicker() {
        DateTimePickerAndroid.open({
            value: actualDate,
            mode: 'date',
            onChange: ({ type }, date)=>{
                if (type == 'dismissed') return;
                if (!date) return;
                setActualDate(date);
                setDate(moment(date).format('DD/MM/YYYY'));
            }
        });
    }
    function _setDni(text: string) {
        const regex = /[0-9]/g;
        let numeros = text.match(regex);
        setDni(numeros!.join(""));
    }

    function close() { setVisible(false); }
    function open() { setVisible(true); }

    useImperativeHandle(ref, ()=>({ open }));

    return(<CustomModal visible={visible} onRequestClose={(!loading)? close: undefined}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                <Appbar.BackAction onPress={(!loading)? close: undefined}/>
                <Appbar.Content title={'Añadir nuevo usuario'} />
            </Appbar.Header>
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
                        keyboardType={'default'}
                        value={name}
                        editable={!loading}
                        onChangeText={setName} />
                    <TextInput
                        style={styles.textInput}
                        mode={'outlined'}
                        label={'D.N.I'}
                        keyboardType={'numeric'}
                        value={dni}
                        editable={!loading}
                        onChangeText={_setDni} />
                    <TextInput
                        style={styles.textInput}
                        mode={'outlined'}
                        label={'Fecha de nacimiento'}
                        value={date}
                        editable={false}
                        right={<TextInput.Icon
                            icon={'calendar-range'}
                            onPress={(!loading)? _openDatePicker: undefined}
                        />}
                    />
                    <Button
                        mode={'contained'}
                        loading={loading}
                        onPress={(!loading)? createNow: undefined}
                        style={{ marginTop: 8, marginLeft: 16, marginRight: 16 }}
                        children={(loading)? 'Enviando...': 'Crear ahora'}
                    />
                </View>
            </ScrollView>
        </View>
    </CustomModal>);
}));

const styles = StyleSheet.create({
    textInput: {
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 4,
        marginTop: 4,
    }
});