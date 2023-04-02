import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Paragraph, Text } from "react-native-paper";
import CombinedTheme from "../Theme";
import CustomModal from "./components/CustomModal";
import DeviceInfo from "react-native-device-info";
import FastImage from "react-native-fast-image";
import ImageIcon from "../assets/icon3.webp";

type IProps = {
    visible: boolean;
    close: ()=>any;
};
type IState = {};

export default class Information extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<CustomModal visible={this.props.visible} onRequestClose={this.props.close}>
            <View style={{ ...styles.content, backgroundColor: CombinedTheme.colors.background }}>
                <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                    <Appbar.BackAction onPress={this.props.close} />
                    <Appbar.Content title="Información" />
                </Appbar.Header>
                <View style={{ paddingBottom: 16 }}>
                    <View style={{ width: '100%', height: 140, marginTop: 6, flexDirection: 'row', justifyContent: 'center' }}>
                        <View style={{ height: 120, width: 120, marginLeft: 16, marginTop: 10, marginBottom: 10 }}>
                            {(this.props.visible)&&<FastImage
                                source={ImageIcon}
                                style={{ width: '100%', height: '100%' }}
                            />}
                        </View>
                        <View style={{ flex: 3, justifyContent: 'center', flexDirection: 'column', paddingLeft: 16 }}>
                            <Text style={{ fontSize: 20, fontWeight: '600' }}>Corporal Kinesis App</Text>
                            <Text style={{ marginLeft: 8, marginTop: 4 }}>Version {DeviceInfo.getVersion()}</Text>
                        </View>
                    </View>
                    <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 8 }}>
                        <Paragraph style={{ fontSize: 13 }}>
                            Aplicación del centro de entrenamiento Corporal Kinesis orientada al control de cargas externas e internas de los entrenamientos. En esta app encontrarás junto al seguimiento personal de tu entrenamiento un análisis de datos y variables de cada sesión de entrenamiento realizada en el gimnasio. Encontrando variables de importancia como: número de Mesociclo, semana, ejercicios realizados, rango de reps, kilajes, series, repeticiones en reserva, fatiga, agujetas, RPE y valoración subjetiva del esfuerzo, valoración técnica y un montón de gráficos y observaciones realizadas por nuestros entrenadores para mejorar y optimizar al máximo tu entrenamiento. Porque como dice nuestro lema, el esfuerzo no se negocia.Mg.
                            Ortiz Jonathan
                        </Paragraph>
                    </View>
                    <View style={{ width: '100%', alignItems: 'center', marginTop: 16 }}>
                        <Text>Creado por <Text style={{ color: '#ff5733' }}>SCApps</Text></Text>
                    </View>
                </View>
            </View>
        </CustomModal>);
    }
}

const styles = StyleSheet.create({
    content: {
        marginLeft: 8,
        marginRight: 8,
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: "#FFFFFF",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3
    }
});