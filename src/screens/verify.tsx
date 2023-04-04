import React, { Component, useContext } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import CustomModal from "./components/CustomModal";
import FastImage from "react-native-fast-image";
import LogoImage from "../assets/logo.webp";
import { getForPercentScale } from "../scripts/Utils";
import LinearGradient from "react-native-linear-gradient";
import statusEffect from "../scripts/StatusEffect";
import { ThemeContext } from "../providers/ThemeProvider";

type IProps = {
    visible: boolean;
    textShow: string | undefined;
};

export default React.memo(function Verify(props: IProps) {
    const { theme } = useContext(ThemeContext);

    statusEffect(
        [{ color: '#100E20', style: 'light' }, { color: '#1663AB', style: 'light' }],
        props.visible,
        [{ color: theme.colors.background, style: 'light' }, { color: theme.colors.elevation.level2, style: 'light' }]
    );
    return(<CustomModal visible={props.visible} animationIn={'fadeIn'} animationOut={'fadeOut'}>
        <View style={{ flex: 1, backgroundColor: '#000000', position: 'relative' }}>
            <LinearGradient style={{ flex: 1 }} colors={['#100E20', '#15122A', '#1663AB']}>
                <View style={[styles.contain, { width: '100%', height: '100%' }]}>
                    <FastImage
                        source={LogoImage}
                        resizeMode={'contain'}
                        style={getForPercentScale(Dimensions.get('window').width, 925, 1160, 65)}
                    />
                </View>
                <View style={[styles.contentIndicator, { width: '100%', marginBottom: 100 }]}>
                    <ActivityIndicator animating size={'large'} />
                    {(props.textShow)&&<Text style={styles.textIndicator}>{props.textShow}</Text>}
                </View>
            </LinearGradient>
        </View>
    </CustomModal>);
});

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column'
    },
    textIndicator: {
        color: '#FFFFFF',
        fontSize: 16,
        marginTop: 24
    }
});