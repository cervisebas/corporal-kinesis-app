import React, { Component } from "react";
import { Image, View } from "react-native";
import { Appbar, Paragraph, Provider as PaperProvider, Text } from "react-native-paper";
import CombinedTheme from "../Theme";
import CustomModal from "./components/CustomModal";
import DeviceInfo from "react-native-device-info";

type IProps = {
    visible: boolean;
    close: ()=>any;
};
type IState = {};

export default class Information extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<CustomModal visible={this.props.visible} onRequestClose={()=>this.props.close()}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1 }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={()=>this.props.close()} />
                        <Appbar.Content title="Información" />
                    </Appbar.Header>
                    <View style={{ flex: 2, backgroundColor: CombinedTheme.colors.background }}>
                        <View style={{ width: '100%', height: 140, marginTop: 6, flexDirection: 'row', justifyContent: 'center' }}>
                            <Image
                                source={require('../assets/icon3.png')}
                                style={{
                                    height: 120,
                                    width: 120,
                                    marginLeft: 16,
                                    marginTop: 10,
                                    marginBottom: 10
                                }}
                                resizeMethod={'resize'}
                            />
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
            </PaperProvider>
        </CustomModal>);
    }
}