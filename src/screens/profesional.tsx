import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomDrawerNavegation from "./components/CustomDrawerNavegation";

import Page1 from "./pagesProfesional/Page1";
import Page2 from "./pagesProfesional/Page2";

type IProps = {
    navigation: any;
};

const Profesional = (props: IProps) => {
    const Drawer = createDrawerNavigator();
    return(<View style={{ flex: 2 }}>
        <Drawer.Navigator initialRouteName="Inicio" screenOptions={{ headerShown: false }} drawerContent={(props)=><CustomDrawerNavegation {...props} />}>
            <Drawer.Screen
                name="Inicio"
                component={Page1}
                options={{ drawerLabel: 'Inicio', drawerIcon: (props)=><Icon {...props} name={'home-outline'} /> }}
            />
            <Drawer.Screen
                name="Administradores"
                component={Page2}
                options={{ drawerLabel: 'Administradores', drawerIcon: (props)=><Icon {...props} name={'shield-crown-outline'} /> }}
            />
        </Drawer.Navigator>
        <FAB
            style={styles.fab}
            icon={'logout'}
            onPress={()=>props.navigation.navigate('c')}
        />
    </View>);
};

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 8,
    },
});

export default Profesional;