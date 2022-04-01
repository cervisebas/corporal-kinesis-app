import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { CommonActions, DrawerActions } from "@react-navigation/native";
import React, { Component, ReactNode } from "react";
import { Alert, Dimensions, Linking, View } from "react-native";
import { Avatar, Text, Title } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CombinedTheme from "../../Theme";

const { width, height } = Dimensions.get('window');

type IState = {};
export default class CustomDrawerNavegation extends Component<DrawerContentComponentProps, IState> {
    constructor(props: DrawerContentComponentProps) {
        super(props);
    }
    private devUrl: string ='https://github.com/cervisebas';
    private colors = {
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#FFFFFF',
        activeBackgroundColor: 'rgba(237, 112, 53, 0.9)',
        inactiveBackgroundColor: 'rgba(255, 255, 255, 0)'
    };
    render(): ReactNode {
        return(<DrawerContentScrollView {...this.props} style={{ backgroundColor: '#1663AB' }}>
            <View style={{ width: '100%', height: 150, backgroundColor: CombinedTheme.colors.background, position: 'relative', marginBottom: 8, marginTop: -4 }}>
                <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', position: 'absolute', bottom: 18, width: '100%' }}>
                    <Avatar.Image size={46} source={require('../../assets/profile.png')} style={{ marginLeft: 12 }} />
                    <Title numberOfLines={1} style={{ marginLeft: 12 }}>Nombre de la cuenta personal</Title>
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