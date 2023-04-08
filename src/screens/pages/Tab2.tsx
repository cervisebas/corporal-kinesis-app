import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode } from "base-64";
import React, { useContext, useEffect, useState } from "react";
import { DeviceEventEmitter, Dimensions, EmitterSubscription, ScrollView, StyleSheet, ToastAndroid, TouchableHighlight, View } from "react-native";
import FastImage, { Source } from "react-native-fast-image";
import { ActivityIndicator, Appbar, Divider, Text } from "react-native-paper";
import { Account, HostServer } from "../../scripts/ApiCorporal";
import { storageData } from '../../scripts/ApiCorporal/types';
import { CardButton1 } from "../components/Components";
import ImageProfile from "../../assets/profile.webp";
import { ThemeContext } from "../../providers/ThemeProvider";
import { GlobalRef } from "../../GlobalRef";
import { refEditAccount } from "../clientRefs";
import { refChangeLog, refInformation } from "../../ExtraContentsRefs";
import DeviceInfo from "react-native-device-info";

var event: EmitterSubscription | undefined = undefined;
export default React.memo(function Tab2(props: { focused: boolean; }) {
    // Context's
    const { theme } = useContext(ThemeContext);
    // State's
    const [viewImage, setViewImage] = useState<Source | number>(ImageProfile);
    const [viewName, setViewName] = useState<string>('Cargando...');
    const [viewSurname, setViewSurname] = useState<string>('-');
    const [loading, setLoading] = useState(true);
    // Variables
    const { width } = Dimensions.get('window');

    function openImage() {
        if (loading) return ToastAndroid.show('Espere por favor...', ToastAndroid.SHORT);
        if (typeof viewImage == 'number') return ToastAndroid.show('No se puede abrir...', ToastAndroid.SHORT);
        GlobalRef.current?.showImageViewer(viewImage.uri!);
    }
    function openEditAccount() {
        GlobalRef.current?.loadingController(true, 'Cargando información...');
        Account.getInfo().then((value)=>{
            if (value) refEditAccount.current?.open(value);
            GlobalRef.current?.loadingController(false);
        }).catch((err)=>{
            GlobalRef.current?.showSimpleAlert(err.cause, '');
            GlobalRef.current?.loadingController(false);
        });
    }
    function loadData(re?: boolean) {
        if (re !== true) setLoading(true);
        AsyncStorage.getItem('account_session').then((value)=>{
            if (!value) return setViewName('Error!!!');
            var datas: storageData = JSON.parse(decode(String(value)));
            setViewImage({ uri: `${HostServer}/images/accounts/${decode(datas.image)}` });
            setViewName(decode(datas.name));
            setViewSurname(decode(datas.email));
            setLoading(false);
        });
    }
    function logout() {
        GlobalRef.current?.loadingController(true, 'Cerrando sesión...');
        AsyncStorage.removeItem('account_session').then(()=>setTimeout(()=>{
            DeviceEventEmitter.emit('nowVerify');
            DeviceEventEmitter.emit('goToHome');
            GlobalRef.current?.loadingController(false);
        }, 1200));
    }
    function _onLogout() { GlobalRef.current?.showDoubleAlert('¿Estás seguro que quieres cerrar sesión?', '', logout); }
    function _openChangeLog() { refChangeLog.current?.open(); }
    function _openInformation() { refInformation.current?.open(); }

    useEffect(()=>{ loadData(true); }, [props.focused]);
    useEffect(()=>{
        event = DeviceEventEmitter.addListener('tab2reload', loadData);
        loadData();
        return ()=>{
            event?.remove();
        };
    }, []);

    return(<View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
            <Appbar.Content title={"Mi cuenta"} />
        </Appbar.Header>
        <View style={{ flex: 1 }}>
            <View style={styles.contentProfile}>
                <TouchableHighlight underlayColor={'#FFFFFF'} activeOpacity={0.8} onPress={openImage} style={styles.touchableImage}>
                    <View style={{ flex: 1 }}>
                        <FastImage source={viewImage} style={{ width: '100%', height: '100%' }} />
                        {(loading)&&<View style={styles.loadingContent}>
                            <ActivityIndicator animating size={'large'} />
                        </View>}
                    </View>
                </TouchableHighlight>
                <View style={{ height: '100%', width: (width - 120), justifyContent: 'center', flexDirection: 'column' }}>
                    <Text numberOfLines={1} style={{ fontSize: 18 }}>{viewName}</Text>
                    <Text numberOfLines={1} style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.6)', marginLeft: 10, marginTop: 4 }}>{viewSurname}</Text>
                </View>
            </View>
            <Divider />
            <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
                <CardButton1 title={'EDITAR DATOS'} icon={'pencil-outline'} onPress={openEditAccount} />
                <CardButton1 title={'VER LISTA DE CAMBIOS'} icon={'note-text-outline'} onPress={_openChangeLog} />
                <CardButton1 title={'INFORMACION'} icon={'information-outline'} onPress={_openInformation} />
                <CardButton1 title={'CERRAR SESIÓN'} icon={'logout'} color="red" onPress={_onLogout} />
                <Text style={{ width: '100%', textAlign: 'center', marginTop: 32 }}>Version {DeviceInfo.getVersion()}</Text>
            </ScrollView>
        </View>
    </View>);
});

const styles = StyleSheet.create({
    contentProfile: {
        width: '100%',
        height: 120,
        marginTop: 8,
        flexDirection: 'row'
    },
    touchableImage: {
        margin: 10,
        height: 100,
        width: 100,
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#000000'
    },
    loadingContent: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        alignItems: 'center',
        justifyContent: 'center'
    }
});