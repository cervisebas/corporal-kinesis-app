import React, { Component } from "react";
import { Dimensions, View, Modal, StyleSheet } from "react-native";
import { Appbar, Button, Text, TextInput, TouchableRipple } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import Settings from "../../../Settings";
import CombinedTheme from "../../../Theme";
import { ScrollView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get('window');

type IProps = {
    show: boolean;
    close: ()=>any;
};
type IState = {
    rds: string;
    rpe: string;
    pulse: string;
    repetitions: string;
    kilage: string;
    tonnage: string;
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
            tonnage: '0'
        };
    }
    static contextType = Settings;
    private refRds: Picker<string> | null = null;
    private refRpe: Picker<string> | null = null;
    render(): React.ReactNode {
        const { getSettings } = this.context;
        return(<Modal visible={this.props.show} transparent={false} hardwareAccelerated={true} animationType={getSettings.animations} onRequestClose={()=>this.props.close()}>
            <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                    <Appbar.BackAction onPress={()=>this.props.close()} />
                    <Appbar.Content title={'Cargar entrenamiento'}/>
                </Appbar.Header>
                <ScrollView>
                    <View style={{ marginLeft: 8, marginRight: 8, flexDirection: 'column', paddingTop: 16, alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableRipple onPress={()=>this.refRds?.focus()} style={{ ...styles.viewPicker, width: Math.floor((width / 2) - 20), marginLeft: 8, marginRight: 8 }}>
                                <View >
                                    <Text style={{ marginLeft: 8 }}>RDS</Text>
                                    <Picker
                                        ref={(ref)=>this.refRds = ref}
                                        style={{ ...styles.picker, color: '#FFFFFF' }}
                                        selectedValue={this.state.rds}
                                        onValueChange={(itemValue)=>this.setState({ rds: itemValue })}
                                        mode={'dropdown'}
                                        dropdownIconColor={'#FFFFFF'}
                                        dropdownIconRippleColor={'rgba(0,0,0,0)'}
                                    >
                                        <Picker.Item label="5" value="5" />
                                        <Picker.Item label="5.5" value="5.5" />
                                        <Picker.Item label="6" value="6" />
                                        <Picker.Item label="6.5" value="6.5" />
                                        <Picker.Item label="7" value="7" />
                                        <Picker.Item label="7.5" value="7.5" />
                                        <Picker.Item label="8" value="8" />
                                        <Picker.Item label="8.5" value="8.5" />
                                        <Picker.Item label="9" value="9" />
                                        <Picker.Item label="9.5" value="9.5" />
                                        <Picker.Item label="10" value="10" />
                                    </Picker>
                                </View>
                            </TouchableRipple>
                            <TouchableRipple onPress={()=>this.refRpe?.focus()} style={{ ...styles.viewPicker, width: Math.floor((width / 2) - 20), marginLeft: 8, marginRight: 8 }}>
                                <View >
                                    <Text style={{ marginLeft: 8 }}>RPE</Text>
                                    <Picker
                                        ref={(ref)=>this.refRpe = ref}
                                        style={{ ...styles.picker, color: '#FFFFFF' }}
                                        selectedValue={this.state.rpe}
                                        onValueChange={(itemValue)=>this.setState({ rpe: itemValue })}
                                        mode={'dropdown'}
                                        dropdownIconColor={'#FFFFFF'}
                                        dropdownIconRippleColor={'rgba(0,0,0,0)'}
                                    >
                                        <Picker.Item label="5" value="5" />
                                        <Picker.Item label="5.5" value="5.5" />
                                        <Picker.Item label="6" value="6" />
                                        <Picker.Item label="6.5" value="6.5" />
                                        <Picker.Item label="7" value="7" />
                                        <Picker.Item label="7.5" value="7.5" />
                                        <Picker.Item label="8" value="8" />
                                        <Picker.Item label="8.5" value="8.5" />
                                        <Picker.Item label="9" value="9" />
                                        <Picker.Item label="9.5" value="9.5" />
                                        <Picker.Item label="10" value="10" />
                                    </Picker>
                                </View>
                            </TouchableRipple>
                        </View>
                        <TextInput
                            style={styles.textInput}
                            mode={'outlined'}
                            label={'Pulsaciones por minuto'}
                            keyboardType={'decimal-pad'}
                            value={this.state.pulse}
                            onChangeText={(text)=>this.setState({ pulse: text })} />
                        <TextInput
                            style={styles.textInput}
                            mode={'outlined'}
                            label={'Repeticiones'}
                            keyboardType={'decimal-pad'}
                            value={this.state.repetitions}
                            onChangeText={(text)=>this.setState({ repetitions: text })} />
                        <TextInput
                            style={styles.textInput}
                            mode={'outlined'}
                            label={'Kilaje'}
                            keyboardType={'decimal-pad'}
                            value={this.state.kilage}
                            onChangeText={(text)=>this.setState({ kilage: text })} />
                        <TextInput
                            style={styles.textInput}
                            mode={'outlined'}
                            label={'Tonelaje'}
                            disabled
                            keyboardType={'decimal-pad'}
                            value={this.state.tonnage}
                            onChangeText={(text)=>this.setState({ tonnage: text })} />
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
    },
    viewPicker: {
        borderRadius: 4,
        borderColor: 'rgba(255, 255, 255, .5)',
        borderWidth: 1.5,
        paddingTop: 8
    },
    picker: {
        width: '100%',
        height: 52,
    }
});