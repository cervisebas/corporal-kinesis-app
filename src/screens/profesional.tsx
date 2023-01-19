import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomDrawerNavegation from "./components/CustomDrawerNavegation";

import Page1 from "./pagesProfesional/Page1_2";
import Page2 from "./pagesProfesional/Page2";
import Page3 from "./pagesProfesional/Page3";
import PageOptions from "./pagesProfesional/PageOptions";

type IProps = {
    navigation: any;
};

const Drawer = createDrawerNavigator();

export default React.memo(function Profesional (props: IProps) {
    function logout() { return props.navigation.navigate('c'); }
    return(<View style={{ flex: 2 }}>
        <Drawer.Navigator initialRouteName="Inicio" screenOptions={{ headerShown: false }} drawerContent={(props)=><CustomDrawerNavegation {...props} />}>
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
        <FAB
            style={styles.fab}
            icon={'logout'}
            onPress={logout}
        />
    </View>);
});

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 8,
    },
});