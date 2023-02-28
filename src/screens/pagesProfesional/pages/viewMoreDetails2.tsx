import { decode } from "base-64";
import React, { PureComponent } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Colors, Provider as PaperProvider, Text } from "react-native-paper";
import utf8 from "utf8";
import { HostServer } from "../../../scripts/ApiCorporal";
import { commentsData, details, DetailsTrainings } from "../../../scripts/ApiCorporal/types";
import CombinedTheme from "../../../Theme";
import { CustomCard4, CustomCard5, CustomCardComments } from "../../components/Components";
import CustomModal from "../../components/CustomModal";
import { calcYears } from "../../../scripts/Utils";

type IProps = {};
type IState = {
    visible: boolean;
    dataShow: DetailsTrainings | undefined;
    commentData: commentsData | undefined;
};

const decodeUtf8 = (str: string)=>{
    try {
        return utf8.decode(str);
    } catch {
        return str;
    }
};

export default class ViewMoreDetails extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            dataShow: undefined,
            commentData: undefined
        };
        this.close = this.close.bind(this);
    }
    processShow(data: details, isRPE?: boolean): any {
        if (isRPE) return(<Text>{data.value} <Text style={{ color: (data.difference)&&(data.difference > 0)? (data.difference == -9999999999)? Colors.yellow500: Colors.red500: Colors.green500 }}>{`(${(data.difference == -9999999999)? '~': data.difference})`}</Text></Text>);
        return(<Text>{data.value} <Text style={{ color: (data.difference)&&(data.difference < 0)? (data.difference == -9999999999)? Colors.yellow500: Colors.red500: Colors.green500 }}>{`(${(data.difference == -9999999999)? '~': data.difference})`}</Text></Text>);
    }
    processTitle(exercise: string): any { return(<Text>Ejercicio realizado: <Text style={{ fontWeight: '700' }}>{exercise}</Text></Text>); }
    processParagraph(paragraph: string) { return (paragraph == 'none')? 'No hay descripción disponible.': paragraph; }

    // Controller
    open(dataShow: DetailsTrainings, commentData?: commentsData) {
        this.setState({
            visible: true,
            dataShow,
            commentData
        });
    }
    close() { this.setState({ visible: false }); }

    render(): React.ReactNode {
        return(<CustomModal visible={this.state.visible} onRequestClose={this.close}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={this.close} />
                        <Appbar.Content title={`Más detalles (${(this.state.dataShow)? this.state.dataShow.date.value: ''})`}/>
                    </Appbar.Header>
                    {(this.state.dataShow)&&<ScrollView style={{ flex: 2, paddingBottom: 16 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ ...styles.row, paddingLeft: 8, paddingRight: 4 }}>
                                <CustomCard4 style={styles.card} title={'RDS'} iconName={'arrow-up-thick'} value={this.processShow(this.state.dataShow.rds)} />
                                <CustomCard4 style={styles.card} title={'Pulso'} iconName={'heart-pulse'} value={this.processShow(this.state.dataShow.pulse)} />
                                <CustomCard4 style={styles.card} title={'Kilaje'} iconName={'dumbbell'} value={this.processShow(this.state.dataShow.kilage)} />
                            </View>
                            <View style={{ ...styles.row, paddingLeft: 4, paddingRight: 8 }}>
                                <CustomCard4 style={styles.card} title={'RPE'} iconName={'arrow-down-thick'} value={this.processShow(this.state.dataShow.rpe, true)} />
                                <CustomCard4 style={styles.card} title={'Repeticiones'} iconName={'autorenew'} value={this.processShow(this.state.dataShow.repetitions)} />
                                <CustomCard4 style={styles.card} title={'Tonelaje'} iconName={'weight'} value={this.processShow(this.state.dataShow.tonnage)} />
                            </View>
                        </View>
                        <CustomCard5 style={{ margin: 8 }} title={this.processTitle(this.state.dataShow.exercise.name)} paragraph={this.processParagraph(this.state.dataShow.exercise.description)} />
                        {(this.state.commentData)&&<View style={{ marginTop: 8 }}>
                            <View style={{ marginLeft: 8, marginBottom: 16 }}><Text style={{ fontSize: 18 }}>Comentario:</Text></View>
                            <CustomCardComments
                                source={{ uri: `${HostServer}/images/accounts/${decode(this.state.commentData!.accountData.image)}` }}
                                accountName={`${decode(this.state.commentData!.accountData.name)}`}
                                edit={this.state.commentData!.edit}
                                date={decode(this.state.commentData!.date)}
                                comment={decodeUtf8(decode(this.state.commentData!.comment))}
                            />
                        </View>}
                    </ScrollView>}
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