import React, { Component, PureComponent } from "react";
import { Dimensions, View, StyleSheet, ToastAndroid, Pressable, StyleProp, ViewStyle } from "react-native";
import { Appbar, Button, Text, TextInput, Provider as PaperProvider, Portal, Dialog, Snackbar, Paragraph, TouchableRipple } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import CombinedTheme from "../../../Theme";
import { ScrollView } from "react-native-gesture-handler";
import { CustomPicker1, CustomPicker4 } from "../../components/CustomPicker";
import { dataExercise, dataListUsers } from "../../../scripts/ApiCorporal/types";
import { decode, encode } from "base-64";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import 'moment/locale/es';
import { Comment, Training } from "../../../scripts/ApiCorporal";
import CustomModal from "../../components/CustomModal";
import utf8 from 'utf8';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get('window');

type IProps = {
    listUsers: dataListUsers[];
    listExercise: dataExercise[];
    openUserSelect: ()=>void;
};
type IState = {
    visible: boolean;

    rds: string;
    rpe: string;
    pulse: string;
    repetitions: string;
    kilage: string;
    tonnage: string;
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

    snackBarView: boolean;
    snackBarText: string;

    comment: string;

    userSelect: { id: string; name: string; } | undefined;
};
export default class AddTraining extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            rds: '-',
            rpe: '-',
            pulse: '0',
            repetitions: '0',
            kilage: '0',
            tonnage: '0',
            exerciseId: '-1',
            rir: '-',
            shoelaces: '-',
            date: new Date(),
            dateActual: moment(new Date()).format('DD/MM/YYYY'),
            technique: '-',
            viewDialogDate: false,
            isSendResults: false,
            buttonSendText: 'Enviar',
            showError: false,
            messageError: '',
            successShow: false,
            snackBarView: false,
            snackBarText: '',
            comment: '',
            userSelect: undefined
        };
        moment.locale('es');
        this.close = this.close.bind(this);
        this.startCalculate = this.startCalculate.bind(this);
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
    verifyInputs() {
        if (this.state.userSelect == undefined) {
            this.setState({ snackBarView: true, snackBarText: 'Selecciona un cliente.' });
            return false;
        }
        if (this.state.exerciseId == '-1') {
            this.setState({ snackBarView: true, snackBarText: 'Selecciona un ejercicio.' });
            return false;
        }
        if (this.state.rds == '-') {
            this.setState({ snackBarView: true, snackBarText: 'Selecciona un valor para el RDS.' });
            return false;
        }
        if (this.state.rpe == '-') {
            this.setState({ snackBarView: true, snackBarText: 'Selecciona un valor para el RPE.' });
            return false;
        }
        if (parseInt(this.state.pulse) == 0) {
            this.setState({ snackBarView: true, snackBarText: 'Ingresa un valor para las pulsaciones.' });
            return false;
        }
        if (parseInt(this.state.repetitions) == 0) {
            this.setState({ snackBarView: true, snackBarText: 'Ingresa un valor para las repeticiones.' });
            return false;
        }
        if (parseInt(this.state.kilage) == 0) {
            this.setState({ snackBarView: true, snackBarText: 'Ingresa un valor para el kilaje.' });
            return false;
        }
        if (parseInt(this.state.tonnage) == 0) {
            this.setState({ snackBarView: true, snackBarText: 'Ingresa un valor para el tonelaje.' });
            return false;
        }
        if (this.state.rir == '-') {
            this.setState({ snackBarView: true, snackBarText: 'Selecciona un valor para el RIR.' });
            return false;
        }
        if (this.state.shoelaces == '-') {
            this.setState({ snackBarView: true, snackBarText: 'Selecciona un valor para las agujetas.' });
            return false;
        }
        if (this.state.technique == '-') {
            this.setState({ snackBarView: true, snackBarText: 'Selecciona un valor para la técnica.' });
            return false;
        }
        return true;
    }
    sendResults() {
        if (!this.verifyInputs()) return;
        this.setState({ isSendResults: true, buttonSendText: 'Enviando...' }, ()=>
            Training.create(this.state.userSelect!.id, this.state.exerciseId, this.state.dateActual, this.state.rds, this.state.rpe, this.state.pulse, this.state.repetitions, this.state.kilage, this.state.tonnage).then((idTrainingGet)=>{
                var comment: string = `
                    Observaciones: ${moment(this.state.date).format('dddd D [de] MMMM [del] YYYY')}\n   • Ejercicio realizado: ${decode(String(this.props.listExercise.find((e)=>e.id == this.state.exerciseId)?.name))}\n   • RIR: ${this.state.rir}\n   • Agujetas: ${this.state.shoelaces}\n   • Técnica realizada: ${this.state.technique}\n\nObservaciones del entrenador:\n${this.state.comment}
                `.trimStart().trimEnd();
                Comment.admin_create(this.state.userSelect!.id, encode(utf8.encode(comment)), idTrainingGet).then(()=>this.setState({
                    isSendResults: false,
                    buttonSendText: 'Enviar',
                    successShow: true,
                    rds: '-',
                    rpe: '-',
                    pulse: '0',
                    repetitions: '0',
                    kilage: '0',
                    tonnage: '0',
                    exerciseId: '-1',
                    rir: '-',
                    shoelaces: '-',
                    date: new Date(),
                    dateActual: moment(new Date()).format('DD/MM/YYYY'),
                    technique: '-',
                    comment: '',
                    userSelect: undefined
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
    processTextInput(str: string) {
        return (str.length == 0)? '0': (str.charAt(0) == '0')? (str.slice(1) == ' ')? '0': str.slice(1).replace(/\ /gi, ''): str.replace(/\ /gi, '');
    }

    // Controller
    open() {
        this.setState({
            visible: true,
            isSendResults: false,
            buttonSendText: 'Enviar',
            successShow: false,
            rds: '-',
            rpe: '-',
            pulse: '0',
            repetitions: '0',
            kilage: '0',
            tonnage: '0',
            exerciseId: '-1',
            rir: '-',
            shoelaces: '-',
            date: new Date(),
            dateActual: moment(new Date()).format('DD/MM/YYYY'),
            technique: '-',
            comment: '',
            userSelect: undefined
        });
    }
    update(userSelect: { id: string; name: string; }) {
        this.setState({ userSelect });
    }
    close() {
        this.setState({ visible: false });
    }

    render(): React.ReactNode {
        return(<CustomModal visible={this.state.visible} onRequestClose={this.close}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={this.close} />
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
                            <SelectUser
                                styles={styles.textInput}
                                data={this.state.userSelect}
                                onPress={this.props.openUserSelect}
                            />
                            <CustomPicker4 disabled={this.state.isSendResults} style={{ width: Math.floor(width - 24), margin: 8 }} title={"Ejercicio:"} value={this.state.exerciseId} onChange={(value)=>this.setState({ exerciseId: value })}>
                                <Picker.Item label={'- Seleccionar -'} value={'-1'} />
                                {this.props.listExercise.map((value)=>{
                                    return(<Picker.Item label={decode(value.name)} value={value.id} key={`addT-admin-${value.id}`} />);
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
                                onChangeText={(text)=>this.setState({ pulse: this.processTextInput(text) })} />
                            <TextInput
                                style={styles.textInput}
                                mode={'outlined'}
                                label={'Repeticiones'}
                                keyboardType={'decimal-pad'}
                                value={this.state.repetitions}
                                disabled={this.state.isSendResults}
                                onChangeText={(text)=>this.setState({ repetitions: this.processTextInput(text) }, this.startCalculate)} />
                            <TextInput
                                style={styles.textInput}
                                mode={'outlined'}
                                label={'Kilaje'}
                                keyboardType={'decimal-pad'}
                                value={this.state.kilage}
                                disabled={this.state.isSendResults}
                                onChangeText={(text)=>this.setState({ kilage: this.processTextInput(text) }, this.startCalculate)} />
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
                                <Picker.Item label={'-'} value={'-'}/>
                                <Picker.Item label={'0'} value={'0'}/>
                                <Picker.Item label={'1/2'} value={'1/2'}/>
                                <Picker.Item label={'2/3'} value={'2/3'}/>
                                <Picker.Item label={'3/4'} value={'3/4'}/>
                                <Picker.Item label={'4+'} value={'4+'}/>
                                <Picker.Item label={'Fallo muscular'} value={'fallo muscular'}/>
                                <Picker.Item label={'Fallo técnica'} value={'fallo técnica'}/>
                            </CustomPicker4>
                            <CustomPicker4 disabled={this.state.isSendResults} title={'Agujetas'} value={this.state.shoelaces} onChange={(value)=>this.setState({ shoelaces: value })} style={styles.textInput}>
                                <Picker.Item label={'-'} value={'-'}/>
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
                        <Dialog.Content style={{ overflow: 'hidden' }}>
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
                <Snackbar
                    visible={this.state.successShow}
                    style={{ backgroundColor: '#1663AB' }}
                    onDismiss={()=>this.setState({ successShow: false })}
                    action={{
                        label: 'OCULTAR',
                        onPress: ()=>this.setState({ successShow: false })
                    }}
                    duration={3000}>
                    <Text>Carga realizada correctamente.</Text>
                </Snackbar>
                <Snackbar
                    visible={this.state.snackBarView}
                    style={{ backgroundColor: '#1663AB' }}
                    onDismiss={()=>this.setState({ snackBarView: false })}
                    action={{
                        label: 'OCULTAR',
                        onPress: ()=>this.setState({ snackBarView: false })
                    }}
                    duration={3000}>
                    <Text>{this.state.snackBarText}</Text>
                </Snackbar>
            </PaperProvider>
        </CustomModal>);
    }
};

type IProps2 = {
    styles?: StyleProp<ViewStyle>;
    onPress?: ()=>any;
    data: { id: string; name: string; } | undefined;
};
class SelectUser extends PureComponent<IProps2> {
    constructor(props: IProps2) {
        super(props);
    }
    private styles: StyleProp<ViewStyle> = {
        overflow: 'hidden',
        height: 56,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1.5,
        borderRadius: 4,
        padding: 8
    };
    render(): React.ReactNode {
        return(<TouchableRipple onPress={this.props.onPress} style={[this.styles, this.props.styles]}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Text>Cliente:</Text>
                <Text style={{ flex: 2, marginLeft: 32, fontSize: 16 }}>{(this.props.data)? this.props.data.name: '- Seleccionar -'}</Text>
                <Icon name="menu-down" color={'#FFFFFF'} size={24} />
            </View>
        </TouchableRipple>);
    }
}

const styles = StyleSheet.create({
    textInput: {
        width: (width - 24),
        margin: 8
    }
});