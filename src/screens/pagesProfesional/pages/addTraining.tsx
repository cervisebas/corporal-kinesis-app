import React, { Component } from "react";
import { Dimensions, View, StyleSheet, ToastAndroid, Pressable } from "react-native";
import { Appbar, Button, Text, TextInput, Provider as PaperProvider, Portal, Dialog, Snackbar, Paragraph } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import CombinedTheme from "../../../Theme";
import { ScrollView } from "react-native-gesture-handler";
import { CustomPicker1, CustomPicker2 } from "../../components/CustomPicker";
import { dataListUsers } from "../../../scripts/ApiCorporal/types";
import { decode } from "base-64";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import { Training } from "../../../scripts/ApiCorporal";
import CustomModal from "../../components/CustomModal";

const { width } = Dimensions.get('window');

type IProps = {
    show: boolean;
    close: ()=>any;
    listUsers: dataListUsers[];
};
type IState = {
    rds: string;
    rpe: string;
    pulse: string;
    repetitions: string;
    kilage: string;
    tonnage: string;
    clientId: string;
    date: Date;
    dateActual: string;
    viewDialogDate: boolean;
    isSendResults: boolean;
    showError: boolean;
    messageError: string;
    successShow: boolean;
};
export default class AddTraining extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            rds: '5',
            rpe: '5',
            pulse: '0',
            repetitions: '0',
            kilage: '0',
            tonnage: '0',
            clientId: '1',
            date: new Date(),
            dateActual: moment(new Date()).format('DD/MM/YYYY'),
            viewDialogDate: false,
            isSendResults: false,
            showError: false,
            messageError: '',
            successShow: false
        };
    }
    startCalculate() {
        if (this.state.repetitions.length !== 0 && this.state.kilage.length !== 0) {
            var repetitions: number = parseFloat(this.state.repetitions);
            var kilage: number = parseFloat(this.state.kilage);
            if (repetitions == 0 && kilage == 0) {
                if (this.state.tonnage !== '0') this.setState({ tonnage: '0' });
                return;
            }
            this.setState({ tonnage: String(repetitions * kilage) });
        } else {
            if (this.state.tonnage !== '0') {
                this.setState({ tonnage: '0' });
            }
        }
    }
    closeModal() {
        if (this.state.isSendResults) return ToastAndroid.show('Espere...', ToastAndroid.SHORT);
        this.setState({
            rds: '5',
            rpe: '5',
            pulse: '0',
            repetitions: '0',
            kilage: '0',
            tonnage: '0',
            clientId: '1',
            date: new Date(),
            dateActual: moment(new Date()).format('DD/MM/YYYY'),
            viewDialogDate: false,
            isSendResults: false,
            showError: false,
            messageError: '',
            successShow: false
        });
        return this.props.close();
    }
    sendResults() {
        this.setState({ isSendResults: true });
        Training.create(this.state.clientId, this.state.dateActual, this.state.rds, this.state.rpe, this.state.pulse, this.state.repetitions, this.state.kilage, this.state.tonnage).then(()=>this.setState({
            isSendResults: false,
            successShow: true,
            rds: '5',
            rpe: '5',
            pulse: '0',
            repetitions: '0',
            kilage: '0',
            tonnage: '0',
            clientId: '1',
            date: new Date(),
            dateActual: moment(new Date()).format('DD/MM/YYYY')
        })).catch((error)=>this.setState({
            isSendResults: false,
            showError: true,
            messageError: error.cause
        }));
    }
    render(): React.ReactNode {
        return(<CustomModal visible={this.props.show} onRequestClose={()=>this.closeModal()}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={()=>this.closeModal()} />
                        <Appbar.Content title={'Cargar entrenamiento'}/>
                    </Appbar.Header>
                    <ScrollView>
                        <View style={{ marginLeft: 8, marginRight: 8, flexDirection: 'column', paddingTop: 16, alignItems: 'center' }}>
                            <TextInput
                                style={styles.textInput}
                                mode={'outlined'}
                                label={'Fecha de carga'}
                                disabled={this.state.isSendResults}
                                editable={false}
                                right={<TextInput.Icon name="calendar-range" disabled={this.state.isSendResults} onPress={()=>this.setState({ viewDialogDate: true })} />}
                                value={this.state.dateActual}/>
                            <CustomPicker2 disabled={this.state.isSendResults} style={{ width: Math.floor(width - 24), margin: 8 }} title={"Cliente:"} value={this.state.clientId} onChange={(value)=>this.setState({ clientId: value })}>
                                {this.props.listUsers.map((value, index)=>{
                                    return(<Picker.Item label={`${index+1} - ${decode(value.name)}`} value={value.id} key={index} />);
                                })}
                            </CustomPicker2>
                            <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 8 }}>
                                <CustomPicker1 disabled={this.state.isSendResults} title={'RDS'} value={this.state.rds} onChange={(value)=>this.setState({ rds: value })} style={{ width: Math.floor((width / 2) - 20), marginLeft: 8, marginRight: 8 }} />
                                <CustomPicker1 disabled={this.state.isSendResults} title={'RPE'} value={this.state.rpe} onChange={(value)=>this.setState({ rpe: value })} style={{ width: Math.floor((width / 2) - 20), marginLeft: 8, marginRight: 8 }} />
                            </View>
                            <TextInput
                                style={styles.textInput}
                                mode={'outlined'}
                                label={'Pulsaciones por minuto'}
                                keyboardType={'decimal-pad'}
                                value={this.state.pulse}
                                disabled={this.state.isSendResults}
                                onChangeText={(text)=>this.setState({ pulse: (text.length == 0)? '0': text.replace(/\ /gi, '') })} />
                            <TextInput
                                style={styles.textInput}
                                mode={'outlined'}
                                label={'Repeticiones'}
                                keyboardType={'decimal-pad'}
                                value={this.state.repetitions}
                                disabled={this.state.isSendResults}
                                onChangeText={(text)=>this.setState({ repetitions: (text.length == 0)? '0': text.replace(/\ /gi, '') }, ()=>this.startCalculate())} />
                            <TextInput
                                style={styles.textInput}
                                mode={'outlined'}
                                label={'Kilaje'}
                                keyboardType={'decimal-pad'}
                                value={this.state.kilage}
                                disabled={this.state.isSendResults}
                                onChangeText={(text)=>this.setState({ kilage: (text.length == 0)? '0': text.replace(/\ /gi, '') }, ()=>this.startCalculate())} />
                            <Pressable onPress={()=>ToastAndroid.show('Este campo es automático, no hace falta editarlo.', ToastAndroid.SHORT)}>
                                <TextInput
                                    style={styles.textInput}
                                    mode={'outlined'}
                                    label={'Tonelaje'}
                                    disabled={this.state.isSendResults}
                                    editable={false}
                                    value={this.state.tonnage} />
                            </Pressable>
                            <Button
                                loading={this.state.isSendResults}
                                mode={'contained'}
                                style={{ width: (width / 2), marginTop: 8 }}
                                onPress={()=>(!this.state.isSendResults)? this.sendResults(): ToastAndroid.show('Espere...', ToastAndroid.SHORT)}>Guardar</Button>
                            {(this.state.isSendResults) && <Text style={{ marginTop: 16 }}>Enviando resultados...</Text>}
                        </View>
                    </ScrollView>
                </View>
                <Portal>
                    <Dialog visible={this.state.viewDialogDate} dismissable={true} onDismiss={()=>this.setState({ viewDialogDate: false })}>
                        <Dialog.Title>Fecha de nacimiento</Dialog.Title>
                        <Dialog.Content>
                            <DatePicker
                                date={this.state.date}
                                mode={'date'}
                                fadeToColor={'#323335'}
                                textColor={'#FFFFFF'}
                                onDateChange={(date)=>this.setState({ date: date })}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={()=>this.setState({ viewDialogDate: false })}>Cancelar</Button>
                            <Button onPress={()=>this.setState({ date: new Date(), dateActual: moment(new Date()).format('DD/MM/YYYY') })}>Resetear</Button>
                            <Button onPress={()=>this.setState({ dateActual: moment(this.state.date).format('DD/MM/YYYY'), viewDialogDate: false })}>Aceptar</Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog visible={this.state.showError} dismissable={true} onDismiss={()=>this.setState({ showError: false })}>
                        <Dialog.Title>Ocurrio un error</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>{this.state.messageError}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={()=>this.setState({ showError: false })}>Aceptar</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <Snackbar visible={this.state.successShow} style={{ backgroundColor: '#1663AB' }} onDismiss={()=>this.setState({ successShow: false })} duration={3000}>
                    <Text>Carga realizada correctamente.</Text>
                </Snackbar>
            </PaperProvider>
        </CustomModal>);
    }
};

const styles = StyleSheet.create({
    textInput: {
        width: (width - 24),
        margin: 8
    }
});