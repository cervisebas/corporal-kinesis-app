import React, { Component } from "react";
import { Dimensions, View, StyleSheet, ToastAndroid, Pressable } from "react-native";
import { Appbar, Button, Text, TextInput, Provider as PaperProvider, Portal, Dialog, Snackbar, Paragraph } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import CombinedTheme from "../../../Theme";
import { ScrollView } from "react-native-gesture-handler";
import { CustomPicker1, CustomPicker2, CustomPicker3, CustomPicker4 } from "../../components/CustomPicker";
import { dataExercise, dataListUsers } from "../../../scripts/ApiCorporal/types";
import { decode, encode } from "base-64";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import 'moment/locale/es';
import { Comment, Training } from "../../../scripts/ApiCorporal";
import CustomModal from "../../components/CustomModal";
import utf8 from 'utf8';

const { width } = Dimensions.get('window');

type IProps = {
    show: boolean;
    close: ()=>any;
    listUsers: dataListUsers[];
    listExercise: dataExercise[];
};
type IState = {
    rds: string;
    rpe: string;
    pulse: string;
    repetitions: string;
    kilage: string;
    tonnage: string;
    clientId: string;
    exerciseId: string;
    rir: string;
    shoelaces: string;
    date: Date;
    dateActual: string;
    technique: string;

    viewDialogDate: boolean;
    isSendResults: boolean;
    buttonSendText: string;
    showError: boolean;
    messageError: string;
    successShow: boolean;

    comment: string;
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
            exerciseId: '1',
            rir: '0',
            shoelaces: 'nada',
            date: new Date(),
            dateActual: moment(new Date()).format('DD/MM/YYYY'),
            technique: '5',
            viewDialogDate: false,
            isSendResults: false,
            buttonSendText: 'Enviar',
            showError: false,
            messageError: '',
            successShow: false,
            comment: ''
        };
        moment.locale('es');
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
            exerciseId: '1',
            rir: '0',
            shoelaces: 'nada',
            date: new Date(),
            dateActual: moment(new Date()).format('DD/MM/YYYY'),
            technique: '5',
            viewDialogDate: false,
            isSendResults: false,
            showError: false,
            messageError: '',
            successShow: false,
            comment: ''
        });
        return this.props.close();
    }
    sendResults() {
        this.setState({ isSendResults: true, buttonSendText: 'Enviando...' }, ()=>
            Training.create(this.state.clientId, this.state.exerciseId, this.state.dateActual, this.state.rds, this.state.rpe, this.state.pulse, this.state.repetitions, this.state.kilage, this.state.tonnage).then((idTrainingGet)=>{
                var comment: string = `
                    Observaciones: ${moment(this.state.date).format('dddd D [de] MMMM [del] YYYY')}\n   • Ejercicio realizado: ${decode(String(this.props.listExercise.find((e)=>e.id == this.state.exerciseId)?.name))}\n   • RIR: ${this.state.rir}\n   • Agujetas: ${this.state.shoelaces}\n   • Técnica realizada: ${this.state.technique}\n\nObservaciones del entrenador:\n${this.state.comment}
                `.trimStart().trimEnd();
                Comment.admin_create(this.state.clientId, encode(utf8.encode(comment)), idTrainingGet).then(()=>this.setState({
                    isSendResults: false,
                    buttonSendText: 'Enviar',
                    successShow: true,
                    rds: '5',
                    rpe: '5',
                    pulse: '0',
                    repetitions: '0',
                    kilage: '0',
                    tonnage: '0',
                    clientId: '1',
                    exerciseId: '1',
                    rir: '0',
                    shoelaces: 'nada',
                    date: new Date(),
                    dateActual: moment(new Date()).format('DD/MM/YYYY'),
                    technique: '5',
                    comment: ''
                })).catch((error)=>this.setState({
                    isSendResults: false,
                    buttonSendText: 'Enviar',
                    showError: true,
                    messageError: error.cause
                }));
            }).catch((error)=>this.setState({
                isSendResults: false,
                buttonSendText: 'Enviar',
                showError: true,
                messageError: error.cause
            }))
        );
    }
    loadStart() {
        this.setState({ exerciseId: this.props.listExercise[0].id });
    }
    render(): React.ReactNode {
        return(<CustomModal visible={this.props.show} onShow={()=>this.loadStart()} onRequestClose={()=>this.closeModal()}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={()=>this.closeModal()} />
                        <Appbar.Content title={'Cargar entrenamiento'}/>
                    </Appbar.Header>
                    <ScrollView>
                        <View style={{ marginLeft: 8, marginRight: 8, flexDirection: 'column', paddingTop: 16, paddingBottom: 16, alignItems: 'center' }}>
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
                            <CustomPicker4 disabled={this.state.isSendResults} style={{ width: Math.floor(width - 24), margin: 8 }} title={"Ejercicio:"} value={this.state.exerciseId} onChange={(value)=>this.setState({ exerciseId: value })}>
                                {this.props.listExercise.map((value, index)=>{
                                    return(<Picker.Item label={decode(value.name)} value={value.id} key={index} />);
                                })}
                            </CustomPicker4>
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
                            <CustomPicker4 disabled={this.state.isSendResults} title={'RIR'} value={this.state.rir} onChange={(value)=>this.setState({ rir: value })} style={styles.textInput}>
                                <Picker.Item label={'0'} value={'0'}/>
                                <Picker.Item label={'1/2'} value={'1/2'}/>
                                <Picker.Item label={'2/3'} value={'2/3'}/>
                                <Picker.Item label={'3/4'} value={'3/4'}/>
                                <Picker.Item label={'4+'} value={'4+'}/>
                                <Picker.Item label={'Fallo muscular'} value={'fallo muscular'}/>
                                <Picker.Item label={'Fallo técnica'} value={'fallo técnica'}/>
                            </CustomPicker4>
                            <CustomPicker4 disabled={this.state.isSendResults} title={'Agujetas'} value={this.state.shoelaces} onChange={(value)=>this.setState({ shoelaces: value })} style={styles.textInput}>
                                <Picker.Item label={'Nada'} value={'nada'}/>
                                <Picker.Item label={'Leves'} value={'leves'}/>
                                <Picker.Item label={'Moderadas'} value={'moderadas'}/>
                                <Picker.Item label={'Altas'} value={'altas'}/>
                                <Picker.Item label={'Muy altas'} value={'muy altas'}/>
                                <Picker.Item label={'Lesión'} value={'lesión'}/>
                            </CustomPicker4>
                            <CustomPicker1
                                disabled={this.state.isSendResults}
                                title={'Técnica'}
                                value={this.state.technique}
                                onChange={(value)=>this.setState({ technique: value })}
                                style={styles.textInput}/>
                            <TextInput
                                style={styles.textInput}
                                mode={'outlined'}
                                label={'Observaciones'}
                                multiline={true}
                                numberOfLines={8}
                                keyboardType={'default'}
                                value={this.state.comment}
                                disabled={this.state.isSendResults}
                                onChangeText={(text)=>this.setState({ comment: text })} />
                            <Button
                                loading={this.state.isSendResults}
                                mode={'contained'}
                                style={{ width: (width / 2), marginTop: 8 }}
                                onPress={()=>(!this.state.isSendResults)? this.sendResults(): ToastAndroid.show('Espere...', ToastAndroid.SHORT)}>{this.state.buttonSendText}</Button>
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
                <Snackbar visible={this.state.successShow} style={{ backgroundColor: '#1663AB' }} onDismiss={()=>this.setState({ successShow: false })} duration={3000}><Text>Carga realizada correctamente.</Text></Snackbar>
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