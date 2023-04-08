import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { CommonActions, DrawerActions } from "@react-navigation/native";
import React, { useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Drawer, Text } from "react-native-paper";
import { ThemeContext } from "../../providers/ThemeProvider";
import Color from "color";

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
        <View style={styles.brandContent}>
            <Text style={[styles.textSubBrand, { color: Color(theme.colors.onSurface).alpha(0.54).rgb().string() }]}>from</Text>
            <Text style={styles.textBrand}>SCAPPS</Text>
        </View>
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
    },
    textSubBrand: {
        //color: '#3a3a3a',
        fontWeight: 'normal',
        fontSize: 13
    },
    textBrand: {
        color: '#ff5733',
        fontSize: 18,
        fontFamily: 'Organetto-Bold'
    },
    brandContent: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    }
});