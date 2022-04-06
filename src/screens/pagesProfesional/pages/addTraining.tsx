import React, { Component, PureComponent } from "react";
import { Dimensions, View, Modal, StyleSheet } from "react-native";
import { Appbar, Button, Text, TextInput, TouchableRipple } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import Settings from "../../../Settings";
import CombinedTheme from "../../../Theme";
import { ScrollView } from "react-native-gesture-handler";
import { CustomPicker1, CustomPicker2 } from "../../components/CustomPicker";
import { dataListUsers } from "../../../scripts/ApiCorporal/types";
import { decode } from "base-64";

const { width, height } = Dimensions.get('window');

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
            clientId: '1'
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
        this.setState({
            rds: '5',
            rpe: '5',
            pulse: '0',
            repetitions: '0',
            kilage: '0',
            tonnage: '0'
        });
        return this.props.close();
    }
    static contextType = Settings;
    render(): React.ReactNode {
        const { getSettings } = this.context;
        return(<Modal visible={this.props.show} transparent={false} hardwareAccelerated={true} animationType={getSettings.animations} onRequestClose={()=>this.closeModal()}>
            <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                    <Appbar.BackAction onPress={()=>this.closeModal()} />
                    <Appbar.Content title={'Cargar entrenamiento'}/>
                </Appbar.Header>
                <ScrollView>
                    <View style={{ marginLeft: 8, marginRight: 8, flexDirection: 'column', paddingTop: 16, alignItems: 'center' }}>
                        <CustomPicker2 style={{ width: Math.floor(width - 24), margin: 8 }} title={"Cliente:"} value={this.state.clientId} onChange={(value)=>this.setState({ clientId: value })}>
                            {this.props.listUsers.map((value, index)=>{
                                return(<Picker.Item label={decode(value.name)} value={value.id} key={index} />);
                            })}
                        </CustomPicker2>
                        <View style={{ flexDirection: 'row' }}>
                            <CustomPicker1 title={'RDS'} value={this.state.rds} onChange={(value)=>this.setState({ rds: value })} style={{ width: Math.floor((width / 2) - 20), marginLeft: 8, marginRight: 8 }} />
                            <CustomPicker1 title={'RPE'} value={this.state.rpe} onChange={(value)=>this.setState({ rpe: value })} style={{ width: Math.floor((width / 2) - 20), marginLeft: 8, marginRight: 8 }} />
                        </View>
                        <TextInput
                            style={styles.textInput}
                            mode={'outlined'}
                            label={'Pulsaciones por minuto'}
                            keyboardType={'decimal-pad'}
                            value={this.state.pulse}
                            onChangeText={(text)=>this.setState({ pulse: (text.length == 0)? '0': text.replace(/\ /gi, '') })} />
                        <TextInput
                            style={styles.textInput}
                            mode={'outlined'}
                            label={'Repeticiones'}
                            keyboardType={'decimal-pad'}
                            value={this.state.repetitions}
                            onChangeText={(text)=>this.setState({ repetitions: (text.length == 0)? '0': text.replace(/\ /gi, '') }, ()=>this.startCalculate())} />
                        <TextInput
                            style={styles.textInput}
                            mode={'outlined'}
                            label={'Kilaje'}
                            keyboardType={'decimal-pad'}
                            value={this.state.kilage}
                            onChangeText={(text)=>this.setState({ kilage: (text.length == 0)? '0': text.replace(/\ /gi, '') }, ()=>this.startCalculate())} />
                        <TextInput
                            style={styles.textInput}
                            mode={'outlined'}
                            label={'Tonelaje'}
                            disabled
                            value={this.state.tonnage} />
                        <Button mode={'contained'} style={{ width: (width / 2), marginTop: 8 }}>Guardar</Button>
                    </View>
                </ScrollView>
            </View>
        </Modal>);
    }
};

const styles = StyleSheet.create({
    textInput: {
        width: (width - 24),
        height: 52,
        margin: 8
    }
});