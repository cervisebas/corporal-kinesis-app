import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { CommonActions, DrawerActions } from "@react-navigation/native";
import { decode } from "base-64";
import React, { PureComponent, ReactNode, useContext } from "react";
import { DeviceEventEmitter, Linking, ScrollView, StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Appbar, Avatar, Drawer, Text, Title } from "react-native-paper";
import { HostServer } from "../../scripts/ApiCorporal";
import { storageData } from "../../scripts/ApiCorporal/types";
import CombinedTheme from "../../Theme";
import { ThemeContext } from "../../providers/ThemeProvider";

type IState = {
    nameUser: string;
    pictureUser: string;
    loadingUser: boolean;
    widht: number;
};

export default React.memo(function CustomDrawerNavegation(props: DrawerContentComponentProps) {
    const { theme } = useContext(ThemeContext);
    const borderRadius = theme.roundness * 5;
    
    return(<View style={{
        flex: 1,
        backgroundColor: theme.colors.elevation.level2,
        borderTopRightRadius: borderRadius,
        borderBottomRightRadius: borderRadius
    }}>
        <View style={styles.posterContent}>
            <Text style={styles.posterText} adjustsFontSizeToFit={false}>
                <Text adjustsFontSizeToFit={false} style={{ color: '#1D68AD', fontWeight: 'bold' }}>Corporal</Text>
                <Text adjustsFontSizeToFit={false} style={{ color: '#ED7036', fontWeight: 'bold' }}>Kinesis</Text>
            </Text>
        </View>
        <ScrollView>
            {props.state.routes.map((item, index)=>{
                const { title, drawerLabel, drawerIcon } = props.descriptors[item.key].options;
                const _onPress = ()=>props.navigation.dispatch({
                    ...(index == props.state.index)? DrawerActions.closeDrawer(): CommonActions.navigate(item.name),
                    target: props.state.key
                });
                return(<Drawer.Item
                    key={`drawer-${index}`}
                    label={(drawerLabel??title) as string}
                    icon={drawerIcon as any}
                    active={index == props.state.index}
                    onPress={_onPress}
                />);
            })}
        </ScrollView>
    </View>);
});

const styles = StyleSheet.create({
    posterContent: {
        width: '100%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    posterText: {
        fontSize: 30,
        fontWeight: 'bold'
    }
});

/*export default class CustomDrawerNavegation extends PureComponent<DrawerContentComponentProps, IState> {
    constructor(props: DrawerContentComponentProps) {
        super(props);
        this.state = {
            nameUser: 'Cargando...',
            pictureUser: '',
            loadingUser: false,
            widht: 0
        };
    }
    private devUrl: string ='https://github.com/cervisebas';
    private colors = {
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#FFFFFF',
        activeBackgroundColor: 'rgba(237, 112, 53, 0.9)',
        inactiveBackgroundColor: 'rgba(255, 255, 255, 0)'
    };
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
        return(<View style={{ flex: 1, position: 'relative' }}>
            <DrawerContentScrollView onLayout={({ nativeEvent })=>this.setState({ widht: nativeEvent.layout.width })} {...this.props} style={{ backgroundColor: '#1663AB' }}>
                <View style={{ width: '100%', height: 150, backgroundColor: CombinedTheme.colors.background, position: 'relative', marginBottom: 8, marginTop: -4, overflow: 'hidden' }}>
                    <FastImage source={require('../../assets/background-picture-admin.gif')} style={{ width: '100%', height: '100%', opacity: 0.7 }} resizeMode={'cover'} />
                    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', position: 'absolute', bottom: 18, width: '100%' }}>
                        <Avatar.Image size={46} source={(this.state.loadingUser)? { uri: this.state.pictureUser }: require('../../assets/profile.webp')} style={{ marginLeft: 12 }} />
                        <Title numberOfLines={1} style={{ marginLeft: 12, width: this.state.widht - 78 }}>{this.state.nameUser}</Title>
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
            </DrawerContentScrollView>
            <Appbar style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', backgroundColor: CombinedTheme.colors.accent }}>
                <Appbar.Content title={"Creado por SCApps"} titleStyle={{ fontSize: 17 }} />
                <Appbar.Action icon={'web'} onPress={()=>Linking.openURL(this.devUrl)} />
                <Appbar.Action icon={'information-outline'} onPress={()=>DeviceEventEmitter.emit('open-information')} />
            </Appbar>
        </View>);
    }
}*/