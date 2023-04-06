import React, { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Paragraph, Text } from "react-native-paper";
import CustomModal from "./components/CustomModal";
import DeviceInfo from "react-native-device-info";
import FastImage from "react-native-fast-image";
import ImageIcon from "../assets/icon3.webp";
import { ThemeContext } from "../providers/ThemeProvider";
import statusEffect from "../scripts/StatusEffect";

export type InformationRef = {
    open: ()=>void;
    close: ()=>void;
};

export default React.memo(forwardRef(function Information(_props: any, ref) {
    // Context's
    const { theme } = useContext(ThemeContext);
    // State's
    const [visible, setVisible] = useState(false);

    function open() { setVisible(true); }
    function close() { setVisible(false); }

    useImperativeHandle(ref, ()=>({ open, close }));
    statusEffect([
        { color: theme.colors.background, style: 'light' },
        { color: theme.colors.background, style: 'light' }
    ], visible, undefined, undefined, true);

    return(<CustomModal visible={visible} onRequestClose={close}>
        <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                <Appbar.BackAction onPress={close} />
                <Appbar.Content title="Información" />
            </Appbar.Header>
            <View style={{ paddingBottom: 16 }}>
                <View style={{ width: '100%', height: 140, marginTop: 6, flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ height: 120, width: 120, marginLeft: 16, marginTop: 10, marginBottom: 10 }}>
                        <FastImage
                            source={ImageIcon}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </View>
                    <View style={{ flex: 3, justifyContent: 'center', flexDirection: 'column', paddingLeft: 16 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Corporal Kinesis App</Text>
                        <Text style={{ marginLeft: 8, marginTop: 4 }}>Version {DeviceInfo.getVersion()}</Text>
                    </View>
                </View>
                <View style={{ paddingLeft: 14, paddingRight: 14, marginTop: 8 }}>
                    <Paragraph style={{ textAlign: 'left', width: '100%' }}>
                        {`Aplicación del centro de entrenamiento Corporal Kinesis orientada al control de cargas externas e internas de los entrenamientos. En esta app encontrarás junto al seguimiento personal de tu entrenamiento un análisis de datos y variables de cada sesión de entrenamiento realizada en el gimnasio. Encontrando variables de importancia como: número de Mesociclo, semana, ejercicios realizados, rango de reps, kilajes, series, repeticiones en reserva, fatiga, agujetas, RPE y valoración subjetiva del esfuerzo, valoración técnica y un montón de gráficos y observaciones realizadas por nuestros entrenadores para mejorar y optimizar al máximo tu entrenamiento. Porque como dice nuestro lema, el esfuerzo no se negocia.\n\n* Mg. Ortiz Jonathan`}
                    </Paragraph>
                </View>
                <View style={{ width: '100%', alignItems: 'center', marginTop: 16 }}>
                    <Text style={styles.contentBrand}>Creado por <Text style={styles.brand}>{"SCDEV"}</Text></Text>
                </View>
            </View>
        </View>
    </CustomModal>);
}));

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    contentBrand: {
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Organetto-Bold'
    },
    brand: {
        color: '#ff5733',
        fontFamily: 'Organetto-Bold'
    }
});