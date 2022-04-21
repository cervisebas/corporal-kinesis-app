import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { CommonActions, DrawerActions } from "@react-navigation/native";
import { decode } from "base-64";
import React, { Component, ReactNode } from "react";
import { Image, Linking, View } from "react-native";
import { Avatar, Title } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { HostServer } from "../../scripts/ApiCorporal";
import { storageData } from "../../scripts/ApiCorporal/types";
import CombinedTheme from "../../Theme";

type IState = {
    nameUser: string;
    pictureUser: string;
    loadingUser: boolean;
};
export default class CustomDrawerNavegation extends Component<DrawerContentComponentProps, IState> {
    constructor(props: DrawerContentComponentProps) {
        super(props);
        this.state = {
            nameUser: 'Cargando...',
            pictureUser: '',
            loadingUser: false
        };
    }
    private devUrl: string ='https://github.com/cervisebas';
    private colors = {
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#FFFFFF',
        activeBackgroundColor: 'rgba(237, 112, 53, 0.9)',
        inactiveBackgroundColor: 'rgba(255, 255, 255, 0)'
    };
    componentWillUnmount() {
        this.setState({
            nameUser: 'Cargando...',
            pictureUser: '',
            loadingUser: false
        });
    }
    componentDidMount() {
        AsyncStorage.getItem('account_session').then((value)=>{
            var datas: storageData = JSON.parse(decode(String(value)));
            this.setState({
                nameUser: decode(datas.name),
                pictureUser: `${HostServer}/images/accounts/${decode(datas.image)}`,
                loadingUser: true
            });
        }).catch(()=>this.setState({ nameUser: 'Error al cargar...' }));
    }
    render(): ReactNode {
        return(<DrawerContentScrollView {...this.props} style={{ backgroundColor: '#1663AB' }}>
            <View style={{ width: '100%', height: 150, backgroundColor: CombinedTheme.colors.background, position: 'relative', marginBottom: 8, marginTop: -4, overflow: 'hidden' }}>
                <Image source={require('../../assets/background-picture-admin.gif')} style={{ width: '100%', height: '100%', opacity: 0.7 }} resizeMode={'cover'} />
                <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', position: 'absolute', bottom: 18, width: '100%' }}>
                    <Avatar.Image size={46} source={(this.state.loadingUser)? { uri: this.state.pictureUser }: require('../../assets/profile.png')} style={{ marginLeft: 12 }} />
                    <Title numberOfLines={1} style={{ marginLeft: 12 }}>{this.state.nameUser}</Title>
                </View>
            </View>
            {this.props.state.routes.map((item, index)=>{
                const { title, drawerLabel, drawerIcon } = this.props.descriptors[item.key].options;
                return(<DrawerItem
                    key={index}
                    label={(drawerLabel !== undefined)? drawerLabel: (title !== undefined)? title: item.name}
                    icon={drawerIcon}
                    {...this.colors}
                    focused={index == this.props.state.index}
                    onPress={()=>this.props.navigation.dispatch({ ...(index == this.props.state.index)? DrawerActions.closeDrawer(): CommonActions.navigate(item.name), target: this.props.state.key })}
                />);
            })}
            <DrawerItem
                label={'Creado por SCApps'}
                {...this.colors}
                inactiveTintColor={'#ff5733'}
                style={{ marginTop: 8 }}
                icon={(props)=><Icon {...props} name={'code-tags'} />}
                onPress={()=>Linking.openURL(this.devUrl)}
            />
        </DrawerContentScrollView>);
    }
};