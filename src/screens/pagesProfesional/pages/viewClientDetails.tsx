import { decode } from "base-64";
import moment from "moment";
import React, { Component, PureComponent, ReactNode } from "react";
import { Dimensions, Image, Linking, StyleSheet, View } from "react-native";
import { Appbar, Provider as PaperProvider, Divider, Text, Card, IconButton, Button } from "react-native-paper";
import { HostServer } from "../../../scripts/ApiCorporal";
import { userData } from "../../../scripts/ApiCorporal/types";
import CombinedTheme from "../../../Theme";
import CustomModal from "../../components/CustomModal";

const { width } = Dimensions.get('window');

type IProps = {
    show: boolean;
    close: ()=>any;
    userData: userData;
    completeClose: ()=>any;
};
type IState = {};

export default class ViewClietDetails extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    calcYears(date: string): string {
        var dateNow = new Date();
        var processDate = moment(date, 'DD-MM-YYYY').toDate();
        var years = dateNow.getFullYear() - processDate.getFullYear();
        var months = dateNow.getMonth() - processDate.getMonth();
        if (months < 0 || (months === 0 && dateNow.getDate() < processDate.getDate())) years--;
        return String(years);
    }
    render(): ReactNode {
        return(<CustomModal visible={this.props.show} onClose={()=>this.props.completeClose()} onRequestClose={()=>this.props.close()}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={()=>this.props.close()} />
                        <Appbar.Content title={decode(this.props.userData.name)} />
                    </Appbar.Header>
                    <View style={{ flex: 2 }}>
                        <View style={{ margin: 20, height: 100, width: (width - 40), flexDirection: 'row' }}>
                            <View style={styles.imageProfile}>
                                <Image style={{ width: '100%', height: '100%' }} source={{ uri: `${HostServer}/images/accounts/${decode(this.props.userData.image)}` }} />
                            </View>
                            <View style={styles.textProfile}>
                                <Text style={{ fontSize: 20 }}>{decode(this.props.userData.name)}</Text>
                                <Text style={{ marginTop: 8, marginLeft: 12, color: 'rgba(255, 255, 255, 0.7)' }}>
                                    <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>Experiencia: </Text>
                                    {decode(this.props.userData.experience)}
                                </Text>
                            </View>
                        </View>
                        <Divider />
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ margin: 14, marginLeft: 18, fontSize: 18 }}>Más información:</Text>
                            <View style={{ flexDirection: 'column' }}>
                                <PointItemList textA="Experiencia" textB={decode(this.props.userData.experience)} />
                                <PointItemList textA="Cumpleaños" textB={`${decode(this.props.userData.birthday)} (${this.calcYears(decode(this.props.userData.birthday))} años)`} />
                                <PointItemList textA="E-Mail" textB={decode(this.props.userData.email)} />
                                <PointItemList textA="Teléfono" textB={decode(this.props.userData.phone)} />
                                <PointItemList textA="D.N.I" textB={decode(this.props.userData.dni)} />
                            </View>
                        </View>
                        <Divider />
                        <View>
                            <Card style={{ margin: 16, display: (this.props.userData.type == '1')? 'flex': 'none' }}>
                                <Card.Title title="Medios de contacto:" />
                                <Card.Content>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                                        <IconButton animated icon={'phone'} style={styles.buttonsContacts} onPress={()=>Linking.openURL(`tel:+549${decode(this.props.userData.phone)}`)}/>
                                        <IconButton animated icon={'message'} style={styles.buttonsContacts} onPress={()=>Linking.openURL(`sms:+549${decode(this.props.userData.phone)}`)}/>
                                        <IconButton animated icon={'whatsapp'} style={styles.buttonsContacts} onPress={()=>Linking.openURL(`whatsapp://send?phone=+549${decode(this.props.userData.phone)}`)}/>
                                        <IconButton animated icon={'email'} style={styles.buttonsContacts} onPress={()=>Linking.openURL(`mailto:${decode(this.props.userData.email)}`)}/>
                                    </View>
                                </Card.Content>
                            </Card>
                            <Button icon={'dumbbell'} mode={'contained'} style={{ marginLeft: 16, marginRight: 16, marginTop: (this.props.userData.type == '1')? 0: 16 }} labelStyle={{ color: '#FFFFFF' }}>
                                Ver rendimiento
                            </Button>
                        </View>
                    </View>
                </View>
            </PaperProvider>
        </CustomModal>);
    }
};
const styles = StyleSheet.create({
    imageProfile: {
        borderRadius: 100,
        height: 90,
        width: 90,
        margin: 5,
        overflow: 'hidden',
        shadowColor: "#FFFFFF",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6
    },
    textProfile: {
        flex: 3,
        paddingLeft: 16,
        paddingTop: 18
    },
    buttonsContacts: {
        marginLeft: 12,
        marginRight: 12
    }
});

type IProps2 = { textA: string; textB: string };
class PointItemList extends PureComponent<IProps2> {
    constructor(props: IProps2) {
        super(props);
    }
    render(): React.ReactNode {
        return(<Text style={{ marginTop: 8, marginLeft: 32, flexDirection: 'row', alignItems: 'center' }}>
            <Text>{'\u2B24'}    </Text>
            <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>{this.props.textA}: </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{this.props.textB}</Text>
        </Text>);
    }
};