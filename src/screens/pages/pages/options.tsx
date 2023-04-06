import React, { Component, forwardRef, useContext, useImperativeHandle, useState } from "react";
import { DeviceEventEmitter, ToastAndroid, View } from "react-native";
import { Appbar, Text, Provider as PaperProvider, Button, Portal, Dialog } from "react-native-paper";
import CombinedTheme from "../../../Theme";
import CustomModal from "../../components/CustomModal";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CardButton1 } from "../../components/Components";
import { ThemeContext } from "../../../providers/ThemeProvider";
import statusEffect from "../../../scripts/StatusEffect";
import { GlobalRef } from "../../../GlobalRef";

type IProps = {
    show: boolean;
    close: ()=>any;
    showLoading: (show: boolean, text: string)=>any;
};
type IState = {
    loading: boolean;
    // Dialog close
    showDialog: boolean;
};
/*export default class Options extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            loading: false,
            showDialog: false
        };
    }
    closeSession() {
        this.props.showLoading(true, 'Cerrando sesión, espere por favor...');
        AsyncStorage.removeItem('account_session').then(()=>setTimeout(()=>{
            DeviceEventEmitter.emit('nowVerify');
            DeviceEventEmitter.emit('goToHome');
            this.props.close();
            this.props.showLoading(false, '');
        }, 1200));
    }
    editInfoUser() {
        ToastAndroid.show('Función en desarrollo...', ToastAndroid.SHORT);
    }
    render(): React.ReactNode {
        return(<CustomModal visible={this.props.show} onRequestClose={()=>this.props.close()}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={()=>this.props.close()} />
                        <Appbar.Content title="Opciones" />
                    </Appbar.Header>
                    <View style={{ flex: 2 }}>
                        <CardButton1 title={'VER LISTA DE CAMBIOS'} icon={'note-text-outline'} onPress={()=>DeviceEventEmitter.emit('openChangeLog')} />
                        <CardButton1 title={'INFORMACION'} icon={'information-outline'} onPress={()=>DeviceEventEmitter.emit('open-information')} />
                        <CardButton1 title={'CERRAR SESIÓN'} icon={'logout'} color="red" onPress={()=>this.setState({ showDialog: true })} />
                        <Text style={{ width: '100%', textAlign: 'center', marginTop: 32 }}>Version {DeviceInfo.getVersion()}</Text>
                    </View>
                    <Portal>
                    <Dialog visible={this.state.showDialog} dismissable={true} onDismiss={()=>this.setState({ showDialog: false })}>
                        <Dialog.Title>¿Estás seguro que quieres cerrar sesión?</Dialog.Title>
                        <Dialog.Actions>
                            <Button onPress={()=>this.setState({ showDialog: false })}>Cancelar</Button>
                            <Button onPress={()=>this.setState({ showDialog: false }, ()=>this.closeSession())}>Aceptar</Button>
                        </Dialog.Actions>
                    </Dialog>
                    </Portal>
                </View>
            </PaperProvider>
        </CustomModal>);
    }
}*/

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
    function onLogout() {
        GlobalRef.current?.showDoubleAlert('¿Estás seguro que quieres cerrar sesión?', '', logout);
    }
    
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
                <CardButton1 title={'VER LISTA DE CAMBIOS'} icon={'note-text-outline'} onPress={()=>DeviceEventEmitter.emit('openChangeLog')} />
                <CardButton1 title={'INFORMACION'} icon={'information-outline'} onPress={()=>DeviceEventEmitter.emit('open-information')} />
                <CardButton1 title={'CERRAR SESIÓN'} icon={'logout'} color="red" onPress={onLogout} />
                <Text style={{ width: '100%', textAlign: 'center', marginTop: 32 }}>Version {DeviceInfo.getVersion()}</Text>
            </View>
        </View>
    </CustomModal>);
}));