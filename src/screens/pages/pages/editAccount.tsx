import React, { Component } from "react";
import { DeviceEventEmitter, Dimensions, ScrollView, StyleSheet, TouchableHighlight, View } from "react-native";
import FastImage, { Source } from "react-native-fast-image";
import { ActivityIndicator, Appbar, Provider as PaperProvider, TextInput } from "react-native-paper";
import { infoAccount } from "../../../scripts/ApiCorporal/types";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import CombinedTheme from "../../../Theme";
import CustomModal from "../../components/CustomModal";
import moment from "moment";
import { decode, encode } from "base-64";
import { Account, HostServer } from "../../../scripts/ApiCorporal";
import { launchImageLibrary } from "react-native-image-picker";

type IProps = {
    visible: boolean;
    close: ()=>any;
    datas: infoAccount | undefined;
    showLoading: (show: boolean, text: string)=>any;
    showSnackBar: (show: boolean, text: string)=>any;
};
type IState = {
    formName: string;
    formBirthday: string;
    formDni: string;
    formPhone: string;
    formImage: { uri: string; type: string; name: string; } | undefined;

    viewImage: number | Source | undefined;
    actualDate: Date;

    isUpdate: boolean;
    isLoading: boolean;
};

const { width } = Dimensions.get('window');

export default class EditAccount extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            formName: '',
            formBirthday: '',
            formDni: '',
            formPhone: '',
            formImage: undefined,

            viewImage: require('../../../assets/profile.png'),
            actualDate: new Date(),

            isUpdate: false,
            isLoading: false
        };
    }
    componentDidUpdate() {
        if (this.props.visible) {
            if (!this.state.isUpdate) {
                (this.props.datas)&&this.setState({
                    formName: decode(this.props.datas.name),
                    formBirthday: decode(this.props.datas.birthday),
                    formDni: decode(this.props.datas.dni),
                    formPhone: decode(this.props.datas.phone),
                    viewImage: { uri: `${HostServer}/images/accounts/${decode(this.props.datas.image)}` },
                    actualDate: moment(decode(this.props.datas.birthday), 'DD/MM/YYYY').toDate(),
                    isUpdate: true
                });
            }
        } else {
            if (this.state.isUpdate) this.setState({
                formName: '',
                formBirthday: '',
                formDni: '',
                formPhone: '',
                formImage: undefined,
                viewImage: require('../../../assets/profile.png'),
                actualDate: new Date(),
                isUpdate: false
            });
        }
    }
    pickImage() {
        launchImageLibrary({ mediaType: 'photo', maxWidth: 512, maxHeight: 512, quality: 0.7 }).then((value)=>{
            if (value.assets) {
                this.setState({
                    formImage: {
                        uri: (value.assets[0].uri)? value.assets[0].uri: '',
                        type: (value.assets[0].type)? value.assets[0].type: '',
                        name: (value.assets[0].fileName)? value.assets[0].fileName: ''
                    },
                    viewImage: {
                        uri: value.assets[0].uri
                    }
                });
            }
        });
    }
    viewDatePicker() {
        DateTimePickerAndroid.open({
            value: this.state.actualDate,
            mode: 'date',
            onChange: ({ type }, date?)=>{
                if (type == 'dismissed') return;
                (date)&&this.setState({
                    actualDate: moment(date).toDate(),
                    formBirthday: moment(date).format('DD/MM/YYYY')
                });
            }
        });
    }
    modifyNow() {
        this.props.showLoading(true, 'Enviando datos...');
        var formData = new FormData();
        formData.append('name', encode(this.state.formName));
        formData.append('dni', encode(this.state.formDni));
        formData.append('birthday', encode(this.state.formBirthday));
        formData.append('phone', encode(this.state.formPhone));
        (this.state.formImage)&&formData.append('image', this.state.formImage);
        Account.modify(formData).then(()=>{
            this.props.showLoading(false, '');
            this.props.showSnackBar(true, 'Datos modificados con éxito.');
            this.props.close();
            DeviceEventEmitter.emit('tab1reload');
            DeviceEventEmitter.emit('tab2reload');
        }).catch((err)=>{
            console.log(err);
            this.props.showLoading(false, '');
            this.props.showSnackBar(true, err.cause);
            this.props.close();
        });
    }
    render(): React.ReactNode {
        return(<CustomModal visible={this.props.visible} onRequestClose={()=>this.props.close()} animationIn={'slideInLeft'} animationOut={'slideOutRight'}>
            <View style={{ ...styles.content, backgroundColor: CombinedTheme.colors.background }}>
                <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                    <Appbar.BackAction onPress={()=>this.props.close()} />
                    <Appbar.Content title="Editar datos" />
                    <Appbar.Action icon={'check-outline'} onPress={()=>this.modifyNow()} />
                </Appbar.Header>
                {(this.props.datas)&&<ScrollView>
                    <View style={{ width: '100%', height: 180, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableHighlight underlayColor={'#FFFFFF'} activeOpacity={0.8} onPress={()=>this.pickImage()} style={{ margin: 10, height: 160, width: 160, position: 'relative', borderRadius: 160, overflow: 'hidden' }}>
                            <View>
                                {(this.state.viewImage)&&<FastImage
                                    source={this.state.viewImage}
                                    style={{
                                        width: '100%',
                                        height: '100%'
                                    }}
                                />}
                                {(this.state.isLoading)&&<View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, .5)', alignItems: 'center', justifyContent: 'center' }}>
                                    <ActivityIndicator animating size={'small'} />
                                </View>}
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View>
                        <TextInput
                            style={styles.textInput}
                            mode={'outlined'}
                            label={'Nombre y apellido'}
                            keyboardType={'default'}
                            value={this.state.formName}
                            disabled={this.state.isLoading}
                            onChangeText={(text)=>this.setState({ formName: text })} />
                        <TextInput
                            style={styles.textInput}
                            mode={'outlined'}
                            label={'DNI'}
                            keyboardType={'numeric'}
                            value={this.state.formDni}
                            disabled={this.state.isLoading}
                            onChangeText={(text)=>this.setState({ formDni: text })} />
                        <TextInput
                            style={styles.textInput}
                            mode={'outlined'}
                            label={'Teléfono'}
                            keyboardType={'phone-pad'}
                            value={this.state.formPhone}
                            disabled={this.state.isLoading}
                            onChangeText={(text)=>this.setState({ formPhone: text })} />
                        <TextInput
                            style={styles.textInput}
                            mode={'outlined'}
                            label={'Fecha de nacimiento'}
                            keyboardType={'phone-pad'}
                            value={this.state.formBirthday}
                            disabled={this.state.isLoading}
                            editable={false}
                            right={<TextInput.Icon icon={'calendar-outline'} onPress={()=>this.viewDatePicker()} />} />
                    </View>
                </ScrollView>}
            </View>
        </CustomModal>);
    }
}

const styles = StyleSheet.create({
    textInput: {
        width: (width - 32),
        margin: 8
    },
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