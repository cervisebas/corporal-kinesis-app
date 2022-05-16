import { decode } from "base-64";
import moment from "moment";
import React, { Component } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Colors, Provider as PaperProvider, Text } from "react-native-paper";
import utf8 from "utf8";
import { HostServer } from "../../../scripts/ApiCorporal";
import { commentsData, details, DetailsTrainings } from "../../../scripts/ApiCorporal/types";
import CombinedTheme from "../../../Theme";
import { CustomCard4, CustomCard5, CustomCardComments } from "../../components/Components";
import CustomModal from "../../components/CustomModal";

type IProps = {
    visible: boolean;
    close: ()=>any;
    dataShow: DetailsTrainings;
    commentData: commentsData | undefined;
};
type IState = {};

const decodeUtf8 = (str: string)=>{
    try {
        return utf8.decode(str);
    } catch {
        return str;
    }
};

export default class ViewMoreDetails extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    processShow(data: details): any {
        return(<Text>{data.value} <Text style={{ color: (data.difference)&&(data.difference < 0)? (data.difference == -9999999999)? Colors.yellow500: Colors.red500: Colors.green500 }}>{`(${(data.difference == -9999999999)? '~': data.difference})`}</Text></Text>);
    }
    processTitle(exercise: string): any {
        return(<Text>Ejercicio realizado: <Text style={{ fontWeight: '700' }}>{exercise}</Text></Text>);
    }
    processParagraph(paragraph: string) {
        return (paragraph == 'none')? 'No hay descripción disponible.': paragraph;
    }
    calcYears(date: string): string {
        var dateNow = new Date();
        var processDate = moment(date, 'DD-MM-YYYY').toDate();
        var years = dateNow.getFullYear() - processDate.getFullYear();
        var months = dateNow.getMonth() - processDate.getMonth();
        if (months < 0 || (months === 0 && dateNow.getDate() < processDate.getDate())) years--;
        return String(years);
    }
    render(): React.ReactNode {
        return(<CustomModal visible={this.props.visible} onRequestClose={()=>this.props.close()}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={()=>this.props.close()} />
                        <Appbar.Content title={`Más detalles (${this.props.dataShow.date.value})`}/>
                    </Appbar.Header>
                    <ScrollView style={{ flex: 2, paddingBottom: 16 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ ...styles.row, paddingLeft: 8, paddingRight: 4 }}>
                                <CustomCard4 style={styles.card} title={'RDS'} iconName={'arrow-up-thick'} value={this.processShow(this.props.dataShow.rds)} />
                                <CustomCard4 style={styles.card} title={'Pulso'} iconName={'heart-pulse'} value={this.processShow(this.props.dataShow.pulse)} />
                                <CustomCard4 style={styles.card} title={'Kilaje'} iconName={'dumbbell'} value={this.processShow(this.props.dataShow.kilage)} />
                            </View>
                            <View style={{ ...styles.row, paddingLeft: 4, paddingRight: 8 }}>
                                <CustomCard4 style={styles.card} title={'RPE'} iconName={'arrow-down-thick'} value={this.processShow(this.props.dataShow.rpe)} />
                                <CustomCard4 style={styles.card} title={'Repeticiones'} iconName={'autorenew'} value={this.processShow(this.props.dataShow.repetitions)} />
                                <CustomCard4 style={styles.card} title={'Tonelaje'} iconName={'weight'} value={this.processShow(this.props.dataShow.tonnage)} />
                            </View>
                        </View>
                        <CustomCard5 style={{ margin: 8 }} title={this.processTitle(this.props.dataShow.exercise.name)} paragraph={this.processParagraph(this.props.dataShow.exercise.description)} />
                        {(this.props.commentData)&&<View style={{ marginTop: 8 }}>
                            <View style={{ marginLeft: 8, marginBottom: 16 }}><Text style={{ fontSize: 18 }}>Comentario:</Text></View>
                            <CustomCardComments
                                source={{ uri: `${HostServer}/images/accounts/${decode(this.props.commentData?.accountData.image)}` }}
                                accountName={`${decode(this.props.commentData?.accountData.name)} (${this.calcYears(decode(this.props.commentData?.accountData.birthday))} años)`}
                                edit={this.props.commentData?.edit}
                                date={decode(this.props.commentData?.date)}
                                comment={decodeUtf8(decode(this.props.commentData?.comment))}
                            />
                        </View>}
                    </ScrollView>
                </View>
            </PaperProvider>
        </CustomModal>);
    }
}

const styles = StyleSheet.create({
    row: {
        width: '50%',
        flexDirection: 'column'
    },
    card: {
        marginTop: 8
    }
});