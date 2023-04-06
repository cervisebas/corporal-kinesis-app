import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode } from "base-64";
import React, { Component } from "react";
import { DeviceEventEmitter, Dimensions, EmitterSubscription, ToastAndroid, TouchableHighlight, View } from "react-native";
import FastImage, { Source } from "react-native-fast-image";
import { ActivityIndicator, Appbar, Divider, Text } from "react-native-paper";
import { Account, HostServer } from "../../scripts/ApiCorporal";
import { storageData } from '../../scripts/ApiCorporal/types';
import { LoadNow } from "../../scripts/Global";
import { CardButton1 } from "../components/Components";
import ImageProfile from "../../assets/profile.webp";
import { ThemeContext } from "../../providers/ThemeProvider";
import { GlobalRef } from "../../GlobalRef";
import { refEditAccount, refOptions } from "../clientRefs";

type IProps = {};
type IState = {
    viewImage: number | Source;
    viewName: string;
    viewSurname: string;
    isLoading: boolean;
};

const { width } = Dimensions.get('window');

export class Tab2 extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            viewName: 'Cargando...',
            viewSurname: '-',
            viewImage: ImageProfile,
            isLoading: false
        };
        this.openEditAccount = this.openEditAccount.bind(this);
        this.loadData = this.loadData.bind(this);
    }
    private event: EmitterSubscription | null = null;
    static contextType = ThemeContext;
    loadData() {
        AsyncStorage.getItem('account_session').then((value)=>{
            if (!value) return this.setState({ viewName: 'Error!!!' });
            var datas: storageData = JSON.parse(decode(String(value)));
            this.setState({
                viewImage: { uri: `${HostServer}/images/accounts/${decode(datas.image)}` },
                viewName: decode(datas.name),
                viewSurname: decode(datas.email),
                isLoading: true
            });
        });
    }
    componentDidMount() {
        if (LoadNow && !this.state.isLoading) setTimeout(this.loadData, 500);
        this.event = DeviceEventEmitter.addListener('tab2reload', ()=>this.setState({ isLoading: false }, this.loadData));
    }
    componentWillUnmount() {
        this.event?.remove();
    }
    openImage() {
        if (!this.state.isLoading) return ToastAndroid.show('Espere por favor...', ToastAndroid.SHORT);
        if (typeof this.state.viewImage == 'number') return ToastAndroid.show('No se puede abrir...', ToastAndroid.SHORT);
        GlobalRef.current?.showImageViewer(this.state.viewImage.uri!);
    }
    openEditAccount() {
        GlobalRef.current?.loadingController(true, 'Cargando información...');
        Account.getInfo().then((value)=>{
            if (value) refEditAccount.current?.open(value);
            GlobalRef.current?.loadingController(false);
        }).catch((err)=>{
            GlobalRef.current?.showSimpleAlert(err.cause, '');
            GlobalRef.current?.loadingController(false);
        });
    }
    openOptions() { refOptions.current?.open(); }
    render(): React.ReactNode {
        const { theme } = this.context;
        return(<View style={{ flex: 1 }}>
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                <Appbar.Content title={"Mi cuenta"} />
                <Appbar.Action icon={'cog'} onPress={this.openOptions} />
            </Appbar.Header>
            <View style={{ flex: 2 }}>
                <View style={{ width: '100%', height: 120, marginTop: 8, flexDirection: 'row' }}>
                    <TouchableHighlight underlayColor={'#FFFFFF'} activeOpacity={0.8} onPress={()=>this.openImage()} style={{ margin: 10, height: 100, width: 100, position: 'relative', borderRadius: 10, overflow: 'hidden' }}>
                        <View>
                            <FastImage
                                source={this.state.viewImage}
                                style={{
                                    width: '100%',
                                    height: '100%'
                                }}
                            />
                            {(!this.state.isLoading)&&<View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, .5)', alignItems: 'center', justifyContent: 'center' }}>
                                <ActivityIndicator animating size={'small'} />
                            </View>}
                        </View>
                    </TouchableHighlight>
                    <View style={{ height: '100%', width: (width - 120), justifyContent: 'center', flexDirection: 'column' }}>
                        <Text numberOfLines={1} style={{ fontSize: 18 }}>{this.state.viewName}</Text>
                        <Text numberOfLines={1} style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.6)', marginLeft: 10, marginTop: 4 }}>{this.state.viewSurname}</Text>
                    </View>
                </View>
                <Divider />
                <View>
                    <CardButton1 title={'EDITAR DATOS'} icon={'pencil-outline'} onPress={()=>this.openEditAccount()} />
                </View>
            </View>
        </View>);
    }
}