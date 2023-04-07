import React, { PureComponent, forwardRef, useContext, useImperativeHandle, useState } from "react";
import { DeviceEventEmitter, Image, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Appbar, Divider, Text, Card, IconButton, Button } from "react-native-paper";
import { decode } from "base-64";
import { Account, Comment, HostServer, Training } from "../../../scripts/ApiCorporal";
import { commentsData, trainings, userData } from "../../../scripts/ApiCorporal/types";
import CustomModal from "../../components/CustomModal";
import { calcYears } from "../../../scripts/Utils";
import ImageProfile from '../../../assets/profile.webp';
import { ThemeContext } from "../../../providers/ThemeProvider";
import { GlobalRef } from "../../../GlobalRef";

type IProps = {
    openAllComment: (data: commentsData[], clientId: string)=>any;
    openAllTrainings: (data: trainings[], accountId: string)=>any;
    openEditClient: (data: userData)=>void;
};
export type ViewClietDetailsRef = {
    open: (data: userData)=>void;
    close: ()=>void;
};

export default React.memo(forwardRef(function ViewClietDetails(props: IProps, ref: React.Ref<ViewClietDetailsRef>) {
    // Context
    const { theme } = useContext(ThemeContext);
    // State's
    const [visible, setVisible] = useState(false);
    const [userData, setUserData] = useState<userData | undefined>(undefined);

    function deleteClient() {
        GlobalRef.current?.loadingController(true, 'Borrando información del cliente...');
        Account.admin_delete(userData!.id)
            .then(()=>{
                GlobalRef.current?.loadingController(false);
                close();
                GlobalRef.current?.showSimpleAlert('Usuario borrado correctamente.', '');
                DeviceEventEmitter.emit('adminPage1Reload');
            })
            .catch((error)=>{
                GlobalRef.current?.loadingController(false);
                GlobalRef.current?.showSimpleAlert('Ocurrio un error', error.cause);
            });
    }
    function goAllComments() {
        GlobalRef.current?.loadingController(true, 'Obteniendo información...');
        Comment.admin_getAllAccount(userData!.id)
            .then((value)=>{
                GlobalRef.current?.loadingController(false);
                props.openAllComment(value.reverse(), userData!.id);
            })
            .catch((error)=>{
                GlobalRef.current?.showSimpleAlert('Ocurrio un error', error.cause);
            });
    }
    function getAllTrainings() {
        GlobalRef.current?.loadingController(true, 'Obteniendo información...');
        Training.admin_getAllAccount(userData!.id)
            .then((value)=>{
                GlobalRef.current?.loadingController(false);
                props.openAllTrainings(value.reverse(), userData!.id);
            })
            .catch((error)=>{
                GlobalRef.current?.loadingController(false);
                GlobalRef.current?.showSimpleAlert('Ocurrio un error', error.cause);
            });
    }
    function processTextTraining(num: string) {
        if (num == '0') return 'Ningún ejercicio evaluado';
        if (num == '1') return '1 ejercicio evaluado';
        return `${num}  ejercicios evaluados`; 
    }
    function _onDelete() {
        GlobalRef.current?.showDoubleAlert(
            '¡¡Advertencia!!',
            '¿Estás de acuerdo que quieres borrar este usuario junto a toda su información?\n\nEsta acción no se podrá deshacer luego de una vez realizada.',
            deleteClient
        );
    }
    function _openEditClient() {
        props.openEditClient(userData!);
    }
    function _openViewImage() {
        GlobalRef.current?.showImageViewer(userData!.image);
    }

    // Controller
    function close() { setVisible(false); }
    function open(_data: userData) {
        setUserData(_data);
        setVisible(true);
    }
    
    useImperativeHandle(ref, ()=>({ open, close }));

    return(<CustomModal visible={visible} onRequestClose={close}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                <Appbar.BackAction onPress={close} />
                <Appbar.Content title={(userData)? decode(userData.name): ''} />
                <Appbar.Action icon={'pencil'} onPress={_openEditClient} />
                <Appbar.Action icon={'trash-can-outline'} onPress={_onDelete} />
            </Appbar.Header>
            <ScrollView style={{ flex: 2, overflow: 'hidden', paddingBottom: 16 }}>
                <View style={{ padding: 20, height: 140, width: '100%', flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.imageProfile} onPress={_openViewImage}>
                        <Image style={{ width: '100%', height: '100%' }} source={{ uri: (userData)? `${HostServer}/images/accounts/${decode(userData.image)}`: ImageProfile }} />
                    </TouchableOpacity>
                    <View style={styles.textProfile}>
                        <Text style={{ fontSize: 20 }}>{(userData)? decode(userData.name): ''}</Text>
                        <Text style={{ marginTop: 8, marginLeft: 12, color: 'rgba(255, 255, 255, 0.7)' }}>
                            <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>Experiencia: </Text>
                            {(userData)? decode(userData.experience): ''}
                        </Text>
                    </View>
                </View>
                <Divider />
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ margin: 14, marginLeft: 18, fontSize: 18 }}>Más información:</Text>
                    <View style={{ flexDirection: 'column' }}>
                        <PointItemList textA="Ejercicios" textB={(userData)? processTextTraining(userData.num_trainings): ''} />
                        <PointItemList textA="Cumpleaños" textB={(userData)? `${decode(userData.birthday)} (${calcYears(decode(userData.birthday))} años)`: ''} />
                        <PointItemList textA="E-Mail" textB={(userData)? decode(userData.email): ''} />
                        <PointItemList textA="Teléfono" textB={(userData)? decode(userData.phone): ''} />
                        <PointItemList textA="D.N.I" textB={(userData)? decode(userData.dni): ''} />
                    </View>
                </View>
                <Divider />
                <View>
                    {(userData)&&<Card style={{ margin: 16, display: (userData.type == '1')? 'flex': 'none' }}>
                        <Card.Title title="Medios de contacto:" />
                        <Card.Content>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                                <IconButton iconColor="#15b2f7" animated={true} icon={'phone'} style={styles.buttonsContacts} onPress={()=>Linking.openURL(`tel:+549${decode(userData!.phone)}`)}/>
                                <IconButton iconColor="#eb5c23" animated={true} icon={'message'} style={styles.buttonsContacts} onPress={()=>Linking.openURL(`sms:+549${decode(userData!.phone)}`)}/>
                                <IconButton iconColor="#25D366" animated={true} icon={'whatsapp'} style={styles.buttonsContacts} onPress={()=>Linking.openURL(`whatsapp://send?phone=+549${decode(userData!.phone)}`)}/>
                                <IconButton iconColor="#ffce00" animated={true} icon={'email'} style={styles.buttonsContacts} onPress={()=>Linking.openURL(`mailto:${decode(userData!.email)}`)}/>
                            </View>
                        </Card.Content>
                    </Card>}
                    <Button icon={'dumbbell'} onPress={getAllTrainings} mode={'outlined'} style={{ marginLeft: 16, marginRight: 16, marginTop: (userData)? (userData.type == '1')? 0: 16: 16 }} labelStyle={{ color: '#FFFFFF' }}>
                        Ver rendimiento
                    </Button>
                    <Button icon={'comment-text-multiple-outline'} onPress={goAllComments} mode={'outlined'} style={{ marginLeft: 16, marginRight: 16, marginTop: 16 }} labelStyle={{ color: '#FFFFFF' }}>
                        Ver todos los comentarios
                    </Button>
                </View>
            </ScrollView>
        </View>
    </CustomModal>);
}));

const styles = StyleSheet.create({
    imageProfile: {
        borderRadius: 100,
        height: 90,
        width: 90,
        margin: 5,
        backgroundColor: '#000000',
        overflow: 'hidden'
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