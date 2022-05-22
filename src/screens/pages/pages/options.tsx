import React, { Component } from "react";
import { BackHandler, DeviceEventEmitter, ToastAndroid, View } from "react-native";
import { Appbar, Text, Provider as PaperProvider, List, Avatar, Card, Button, Portal, Dialog } from "react-native-paper";
import CombinedTheme from "../../../Theme";
import CustomModal from "../../components/CustomModal";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode } from "base-64";
import { HostServer } from "../../../scripts/ApiCorporal";
import { storageData } from "../../../scripts/ApiCorporal/types";
import SplashScreen from "react-native-splash-screen";
import { CardButton1 } from "../../components/Components";

type IProps = {
    show: boolean;
    close: ()=>any;
    showLoading: (show: boolean, text: string)=>any;
};
type IState = {
    userInfo: {
        name: string;
        image: string;
    };
    loading: boolean;

    // Dialog close
    showDialog: boolean;
};
export default class Options extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            userInfo: {
                name: 'Cargando información...',
                image: ''
            },
            loading: false,
            showDialog: false
        };
    }
    componentWillUnmount() {
        this.setState({
            userInfo: {
                name: 'Cargando información...',
                image: ''
            },
            loading: false,
            showDialog: false
        });
    }
    loadInfo() {
        AsyncStorage.getItem('account_session').then((value)=>{
            var datas: storageData = JSON.parse(decode(String(value)));
            this.setState({
                userInfo: {
                    name: decode(datas.name),
                    image: `${HostServer}/images/accounts/${decode(datas.image)}`
                },
                loading: true
            });
        }).catch(()=>this.setState({ userInfo: { name: 'Error al cargar...', image: '' } }));
    }
    closeSession() {
        this.props.showLoading(true, 'Cerrando sesión, espere por favor...');
        AsyncStorage.removeItem('account_session').then(()=>setTimeout(()=>{
            SplashScreen.show();
            ToastAndroid.show('La aplicación se cerrará en 3 segundos.', ToastAndroid.LONG);
            setTimeout(()=>BackHandler.exitApp(), 3000);
        }, 1200));
    }
    editInfoUser() {
        ToastAndroid.show('Función en desarrollo...', ToastAndroid.SHORT);
    }
    render(): React.ReactNode {
        return(<CustomModal visible={this.props.show} onShow={()=>this.loadInfo()} onRequestClose={()=>this.props.close()}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={()=>this.props.close()} />
                        <Appbar.Content title="Opciones" />
                    </Appbar.Header>
                    <View style={{ flex: 2 }}>
                        <Card style={{ marginTop: 16, marginLeft: 8, marginRight: 8 }} onPress={()=>this.editInfoUser()}>
                            <Card.Content>
                                <List.Item
                                    title={this.state.userInfo.name}
                                    description={'Toca aquí para editar'}
                                    left={(props)=><Avatar.Image {...props} size={64} source={(!this.state.loading)? require('../../../assets/profile.png'): { uri: this.state.userInfo.image }} />}
                                />
                            </Card.Content>
                        </Card>
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
}