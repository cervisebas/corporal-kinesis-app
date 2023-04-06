import React, { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { DeviceEventEmitter, Dimensions, ScrollView, StyleSheet, TouchableHighlight, View } from "react-native";
import FastImage, { Source } from "react-native-fast-image";
import { Appbar, TextInput } from "react-native-paper";
import { infoAccount } from "../../../scripts/ApiCorporal/types";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import CustomModal from "../../components/CustomModal";
import moment from "moment";
import { decode, encode } from "base-64";
import { Account, HostServer } from "../../../scripts/ApiCorporal";
import { launchImageLibrary } from "react-native-image-picker";
import ImageProfile from "../../../assets/profile.webp";
import { ThemeContext } from "../../../providers/ThemeProvider";
import { GlobalRef } from "../../../GlobalRef";

type IProps = {
    visible: boolean;
    close: ()=>any;
    datas: infoAccount | undefined;
    showLoading: (show: boolean, text: string)=>any;
    showSnackBar: (show: boolean, text: string)=>any;
};
export type EditAccountRef = {
    open: (datas: infoAccount)=>void;
    close: ()=>void;
};

export default React.memo(forwardRef(function EditAccount(_props: any, ref: React.Ref<EditAccountRef>) {
    const { width } = Dimensions.get('window');
    // Context's
    const { theme } = useContext(ThemeContext);
    // State's
    const [visible, setVisible] = useState(false);
    const [formName, setFormName] = useState('');
    const [formBirthday, setFormBirthday] = useState('');
    const [formDni, setFormDni] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formImage, setFormImage] = useState<{ uri: string; type: string; name: string; } | undefined>(undefined);
    const [viewImage, setViewImage] = useState<number | Source>(ImageProfile);
    const [actualDate, setActualDate] = useState<Date>(new Date());

    function pickImage() {
        launchImageLibrary({ mediaType: 'photo', maxWidth: 512, maxHeight: 512, quality: 0.7 }).then((value)=>{
            if (!value.assets) return;
            setFormImage({
                uri: (value.assets[0].uri)? value.assets[0].uri: '',
                type: (value.assets[0].type)? value.assets[0].type: '',
                name: (value.assets[0].fileName)? value.assets[0].fileName: ''
            });
            setViewImage({ uri: value.assets[0].uri });
        });
    }
    function viewDatePicker() {
        DateTimePickerAndroid.open({
            value: actualDate,
            mode: 'date',
            onChange: ({ type }, date?)=>{
                if (type == 'dismissed') return;
                if (!date) return;
                setActualDate(moment(date).toDate());
                setFormBirthday(moment(date).format('DD/MM/YYYY'));
            }
        });
    }
    function modifyNow() {
        GlobalRef.current?.loadingController(true, 'Enviando datos...');
        const formData = new FormData();
        formData.append('name', encode(formName));
        formData.append('dni', encode(formDni));
        formData.append('birthday', encode(formBirthday));
        formData.append('phone', encode(formPhone));
        (formImage)&&formData.append('image', formImage);
        Account.modify(formData).then(()=>{
            GlobalRef.current?.loadingController(false);
            GlobalRef.current?.showSimpleAlert('Datos modificados con éxito.', '');
            close();
            DeviceEventEmitter.emit('tab1reload');
            DeviceEventEmitter.emit('tab2reload');
        }).catch((err)=>{
            GlobalRef.current?.loadingController(false);
            GlobalRef.current?.showSimpleAlert('Ocurrió un error', err.cause);
            close();
        });
    }

    function close() { setVisible(false); }
    function open(datas: infoAccount) {
        setFormName(decode(datas.name));
        setFormBirthday(decode(datas.birthday));
        setFormDni(decode(datas.dni));
        setFormPhone(decode(datas.phone));
        setViewImage({ uri: `${HostServer}/images/accounts/${decode(datas.image)}` });
        setActualDate(moment(decode(datas.birthday), 'DD/MM/YYYY').toDate());
        setVisible(true);
    }
    useImperativeHandle(ref, ()=>({ open, close }));

    return(<CustomModal visible={visible} onRequestClose={close}>
        <View style={[styles.content,  { backgroundColor: theme.colors.background }]}>
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                <Appbar.BackAction onPress={close} />
                <Appbar.Content title="Editar datos" />
                <Appbar.Action icon={'check'} onPress={modifyNow} />
            </Appbar.Header>
            <ScrollView>
                <View style={{ width: '100%', height: 180, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableHighlight underlayColor={'#FFFFFF'} activeOpacity={0.8} onPress={pickImage} style={[styles.imageTouch, { borderColor: theme.colors.outline }]}>
                        <View>
                            {(viewImage)&&<FastImage
                                source={viewImage}
                                style={{ width: '100%', height: '100%' }}
                            />}
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={{ flex: 1 }}>
                    <TextInput
                        style={[styles.textInput, { width: (width - 32) }]}
                        mode={'outlined'}
                        label={'Nombre y apellido'}
                        keyboardType={'default'}
                        value={formName}
                        onChangeText={setFormName} />
                    <TextInput
                        style={[styles.textInput, { width: (width - 32) }]}
                        mode={'outlined'}
                        label={'DNI'}
                        keyboardType={'numeric'}
                        value={formDni}
                        onChangeText={setFormDni} />
                    <TextInput
                        style={[styles.textInput, { width: (width - 32) }]}
                        mode={'outlined'}
                        label={'Teléfono'}
                        keyboardType={'phone-pad'}
                        value={formPhone}
                        onChangeText={setFormPhone} />
                    <TextInput
                        style={[styles.textInput, { width: (width - 32) }]}
                        mode={'outlined'}
                        label={'Fecha de nacimiento'}
                        keyboardType={'phone-pad'}
                        value={formBirthday}
                        editable={false}
                        right={<TextInput.Icon icon={'calendar-outline'} onPress={viewDatePicker} />} />
                </View>
            </ScrollView>
        </View>
    </CustomModal>);
}));

const styles = StyleSheet.create({
    textInput: {
        //width: (width - 32),
        margin: 8
    },
    content: {
        flex: 1
    },
    imageTouch: {
        margin: 10,
        height: 160,
        width: 160,
        position: 'relative',
        borderRadius: 160,
        overflow: 'hidden',
        borderWidth: 2
    }
});