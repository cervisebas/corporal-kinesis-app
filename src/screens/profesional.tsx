import { DrawerNavigationOptions, createDrawerNavigator } from "@react-navigation/drawer";
import React, { forwardRef, useImperativeHandle } from "react";
import { View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomDrawerNavegation from "./components/CustomDrawerNavegation";

import Page1 from "./pagesProfesional/Page1";
import Page2 from "./pagesProfesional/Page2";
import Page3 from "./pagesProfesional/Page3";
import PageOptions from "./pagesProfesional/PageOptions";

type IProps = {
    navigation: any;
};
export type ProfesionalRef = {
    logOut: ()=>void;
};

const Drawer = createDrawerNavigator();
const _screenOptions: DrawerNavigationOptions = {
    headerShown: false,
    drawerStyle: {
        backgroundColor: 'transparent'
    }
};

export default React.memo(forwardRef(function Profesional(props: IProps, ref: React.Ref<ProfesionalRef>) {
    function logOut() { return props.navigation.navigate('c'); }
    useImperativeHandle(ref, ()=>({ logOut }));
    return(<View style={{ flex: 2 }}>
        <Drawer.Navigator initialRouteName="Inicio" screenOptions={_screenOptions} drawerContent={(props)=><CustomDrawerNavegation {...props} />}>
            <Drawer.Screen
                name="Inicio"
                component={Page1}
                options={{ drawerLabel: 'Inicio', drawerIcon: (props)=><Icon {...props} name={'home-outline'} /> }}
            />
            <Drawer.Screen
                name="Lista de ejercicios"
                component={Page3}
                options={{ drawerLabel: 'Lista de ejercicios', drawerIcon: (props)=><Icon {...props} name={'format-list-bulleted-type'} /> }}
            />
            <Drawer.Screen
                name="Administradores"
                component={Page2}
                options={{ drawerLabel: 'Administradores', drawerIcon: (props)=><Icon {...props} name={'shield-crown-outline'} /> }}
            />
            <Drawer.Screen
                name="Opciones"
                component={PageOptions}
                options={{ drawerLabel: 'Opciones', drawerIcon: (props)=><Icon {...props} name={'cog-outline'} /> }}
            />
        </Drawer.Navigator>
    </View>);
}));