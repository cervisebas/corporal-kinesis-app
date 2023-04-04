import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import CustomModal from "./components/CustomModal";
import LogoImage from "../assets/logo.webp";
import { Text } from "react-native-paper";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { waitTo } from "../scripts/Utils";
import TextAnimationShake from "../components/TextAnimationShake";
import RNSplashScreen from "react-native-splash-screen";
import { ThemeContext } from "../providers/ThemeProvider";

export default React.memo(function SplashScreen(props: { init: ()=>void; }) {
    const { theme, setThemeStatus } = useContext(ThemeContext);
    const [visible, setVisible] = useState(true);
    const [startText, setStartText] = useState(false);

    // Image Animated
    const logoTX = useSharedValue(0);
    const logoSC = useSharedValue(1);
    const logoStyle = useAnimatedStyle(()=>({
        transform: [
            { translateX: withTiming(logoTX.value, { duration: 300 }) },
            { scale: withSpring(logoSC.value) }
        ]
    }));
    // View Title Animated
    const viewTitleTX = useSharedValue(-20);
    const viewTitleOP = useSharedValue(0);
    const viewTitleStyles = useAnimatedStyle(()=>({
        transform: [{ translateX: withTiming(viewTitleTX.value, { duration: 300 }) }],
        opacity: withTiming(viewTitleOP.value, { duration: 200 })
    }));
    // SCBackground
    const scbackgroundRadius = useSharedValue(300);
    const scbackgroundHeight = useSharedValue('0%');
    const scbackgroundOpacity = useSharedValue(1);
    const scbackgroundStyles = useAnimatedStyle(()=>({ height: scbackgroundHeight.value, opacity: scbackgroundOpacity.value, borderTopLeftRadius: scbackgroundRadius.value, borderTopRightRadius: scbackgroundRadius.value }));

    async function start() {
        await waitTo(1000);
        RNSplashScreen.hide();
        await waitTo(500);
        logoTX.value = -70;
        logoSC.value = 0.8;
        await waitTo(200);
        viewTitleOP.value = 1;
        viewTitleTX.value = 70;
        await waitTo(1500);
        scbackgroundHeight.value = withTiming('100%', { duration: 500, easing: Easing.circle });
        scbackgroundRadius.value = withTiming(0, { duration: 500, easing: Easing.circle });
        await waitTo(450);
        setStartText(true);
        await waitTo(3000);
        props.init();
        setVisible(false);
        setThemeStatus([{ color: '#100E20', style: 'light' }, { color: '#1663AB', style: 'light' }]);
    }
    
    return(<CustomModal visible={visible} removeAnimationIn={true} animationOut={'fadeOut'}>
        <View style={styles.background}>
            <Animated.View style={[styles.viewText, viewTitleStyles]}>
                <Text style={[styles.text, { color: '#1D68AD' }]}>Corporal</Text>
                <Text style={[styles.text, { color: '#ED7036' }]}>Kinesis</Text>
            </Animated.View>
            <Animated.Image
                source={LogoImage}
                resizeMode={'contain'}
                resizeMethod={'auto'}
                style={[styles.logo, logoStyle]}
                onLoad={start}
            />
            <Animated.View style={[styles.scBackground, scbackgroundStyles]}>
                <TextAnimationShake
                    start={startText}
                    value={"</> SCDEV"}
                    styleText={styles.scText}
                    reset={setStartText}
                />
            </Animated.View>
        </View>
    </CustomModal>);
});

const styles = StyleSheet.create({
    background: {
        flex: 1,
        //backgroundColor: '#0f4577',
        backgroundColor: '#0B0C0E',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    logo: {
        position: 'absolute',
        width: 180,
        height: 225.73,
        transform: [
            { translateX: -70 },
            { scale: 0.8 }
        ]
    },
    viewText: {
        position: 'absolute',
        flexDirection: 'column',
        alignItems: 'center',
        transform: [{ translateX: 70 }]
    },
    text: {
        fontSize: 32,
        textTransform: 'uppercase',
        fontWeight: '700',
        overflow: 'visible',
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: {
            width: -1,
            height: -1
        },
        textShadowRadius: 4
    },
    scBackground: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: '#ff5722',
        width: '100%',
        height: '50%',
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scText: {
        color: '#FFFFFF',
        fontSize: 36,
        fontFamily: 'Organetto-Bold'
    }
});