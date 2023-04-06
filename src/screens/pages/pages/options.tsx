import React, { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { DeviceEventEmitter, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import CustomModal from "../../components/CustomModal";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CardButton1 } from "../../components/Components";
import { ThemeContext } from "../../../providers/ThemeProvider";
import statusEffect from "../../../scripts/StatusEffect";
import { GlobalRef } from "../../../GlobalRef";
import { refChangeLog, refInformation } from "../../../ExtraContentsRefs";

export type OptionsRef = {
    open: ()=>void;
};

export default React.memo(forwardRef(function Options(_props: any, ref: React.Ref<OptionsRef>) {
    // Context's
    const { theme } = useContext(ThemeContext);
    // State's
    const [visible, setVisible] = useState(false);
    
    function close() { setVisible(false); }
    function open() { setVisible(true); }

    function logout() {
        GlobalRef.current?.loadingController(true, 'Cerrando sesión...');
        AsyncStorage.removeItem('account_session').then(()=>setTimeout(()=>{
            DeviceEventEmitter.emit('nowVerify');
            DeviceEventEmitter.emit('goToHome');
            GlobalRef.current?.loadingController(false);
            close();
        }, 1200));
    }
    function _onLogout() { GlobalRef.current?.showDoubleAlert('¿Estás seguro que quieres cerrar sesión?', '', logout); }
    function _openChangeLog() { refChangeLog.current?.open(); }
    function _openInformation() { refInformation.current?.open(); }

    useImperativeHandle(ref, ()=>({ open }));

    statusEffect([
        { color: theme.colors.background, style: 'light' },
        { color: theme.colors.background, style: 'light' }
    ], visible, undefined, undefined, true);

    return(<CustomModal visible={visible} onRequestClose={close}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                <Appbar.BackAction onPress={close} />
                <Appbar.Content title="Opciones" />
            </Appbar.Header>
            <View style={{ flex: 2 }}>
                <CardButton1 title={'VER LISTA DE CAMBIOS'} icon={'note-text-outline'} onPress={_openChangeLog} />
                <CardButton1 title={'INFORMACION'} icon={'information-outline'} onPress={_openInformation} />
                <CardButton1 title={'CERRAR SESIÓN'} icon={'logout'} color="red" onPress={_onLogout} />
                <Text style={{ width: '100%', textAlign: 'center', marginTop: 32 }}>Version {DeviceInfo.getVersion()}</Text>
            </View>
        </View>
    </CustomModal>);
}));