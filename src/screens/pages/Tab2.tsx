import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode } from "base-64";
import React, { Component } from "react";
import { DeviceEventEmitter, Dimensions, EmitterSubscription, ToastAndroid, TouchableHighlight, View } from "react-native";
import FastImage, { Source } from "react-native-fast-image";
import { ActivityIndicator, Appbar, Divider, Snackbar, Text } from "react-native-paper";
import { Account, HostServer } from "../../scripts/ApiCorporal";
import { infoAccount, storageData } from '../../scripts/ApiCorporal/types';
import { LoadNow } from "../../scripts/Global";
import { CardButton1 } from "../components/Components";
import ImageView from "react-native-image-viewing";
import { ImageSource } from "react-native-vector-icons/Icon";
import EditAccount from "./pages/editAccount";
import ImageProfile from "../../assets/profile.webp";
import { ThemeContext } from "../../providers/ThemeProvider";

type IProps = {
    showLoading: (show: boolean, text: string)=>any;
    openOptions: ()=>any;
};
type IState = {
    viewImage: number | Source;
    viewName: string;
    viewSurname: string;

    viewImageShow: boolean;
    viewImageSource: ImageSource[] | undefined;

    editVisible: boolean;
    editData: infoAccount | undefined;

    snakbarVisible: boolean;
    snackbarText: string;

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
            viewImageShow: false,
            viewImageSource: undefined,
            editVisible: false,
            editData: undefined,
            snakbarVisible: false,
            snackbarText: '',
            isLoading: false
        };
        this.openEditAccount = this.openEditAccount.bind(this);
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
        if (LoadNow && !this.state.isLoading) setTimeout(()=>this.loadData(), 500);
        this.event = DeviceEventEmitter.addListener('tab2reload', ()=>this.setState({ isLoading: false }, ()=>this.loadData()));
    }
    componentWillUnmount() {
        this.event?.remove();
    }
    openImage() {
        if (this.state.isLoading) {
            var srcImage: any = this.state.viewImage;
            this.setState({
                viewImageSource: [srcImage],
                viewImageShow: true
            });
        } else {
            ToastAndroid.show('Espere por favor...', ToastAndroid.SHORT);
        }
    }
    openEditAccount() {
        this.props.showLoading(true, 'Cargando información...');
        Account.getInfo().then((value)=>{
            (value)&&this.setState({
                editVisible: true,
                editData: value
            }, ()=>this.props.showLoading(false, ''));
        }).catch((err)=>this.setState({
            snakbarVisible: true,
            snackbarText: err.cause
        }, ()=>this.props.showLoading(false, '')));
    }
    render(): React.ReactNode {
        const { theme } = this.context;
        return(<View style={{ flex: 1 }}>
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                <Appbar.Content title={"Mi cuenta"} />
                <Appbar.Action icon={'cog'} onPress={this.props.openOptions} />
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
                <Snackbar
                    visible={this.state.snakbarVisible}
                    duration={7000}
                    style={{ backgroundColor: '#1663AB' }}
                    onDismiss={()=>this.setState({ snakbarVisible: false })}
                    action={{ label: 'OCULTAR', onPress: ()=>this.setState({ snakbarVisible: false }) }}>
                    <Text>{this.state.snackbarText}</Text>
                </Snackbar>
                {/* MODALS */}
                {(this.state.viewImageSource)&&<ImageView
                    images={this.state.viewImageSource}
                    imageIndex={0}
                    visible={this.state.viewImageShow}
                    onRequestClose={()=>this.setState({ viewImageShow: false })}
                />}
                <EditAccount
                    visible={this.state.editVisible}
                    close={()=>this.setState({ editVisible: false, editData: undefined })}
                    datas={this.state.editData}
                    showLoading={this.props.showLoading}
                    showSnackBar={(s, t)=>this.setState({ snakbarVisible: s, snackbarText: t })}
                />
            </View>
        </View>);
    }
}