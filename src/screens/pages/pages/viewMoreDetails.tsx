import { decode } from "base-64";
import React, { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, MD2Colors, Text } from "react-native-paper";
import utf8 from "utf8";
import { HostServer } from "../../../scripts/ApiCorporal";
import { commentsData, details, DetailsTrainings } from "../../../scripts/ApiCorporal/types";
import { CustomCard5, CustomCardComments } from "../../components/Components";
import CustomModal from "../../components/CustomModal";
import { ThemeContext } from "../../../providers/ThemeProvider";
import CustomCard4 from "../../components/CustomCard4";
import statusEffect from "../../../scripts/StatusEffect";

export type ViewModeDetailsRef = {
    open: (data: DetailsTrainings, comment: commentsData | undefined)=>void;
};

const decodeUtf8 = (str: string)=>{ try { return utf8.decode(str); } catch { return str; } };

const _defaultDataShow: DetailsTrainings = { id: '-1', date: { value: '-', status: -1, difference: undefined }, session_number: { value: '-', status: -1, difference: undefined }, rds: { value: '-', status: -1, difference: undefined }, rpe: { value: '-', status: -1, difference: undefined }, pulse: { value: '-', status: -1, difference: undefined }, repetitions: { value: '-', status: -1, difference: undefined }, kilage: { value: '-', status: -1, difference: undefined }, tonnage: { value: '-', status: -1, difference: undefined }, exercise: { name: 'No disponible', status: -1, description: '' } };

export default React.memo(forwardRef(function ViewModeDetails(_props: any, ref: React.Ref<ViewModeDetailsRef>) {
    // Context's
    const { theme } = useContext(ThemeContext);
    // State's
    const [visible, setVisible] = useState(false);
    const [dataShow, setDataShow] = useState<DetailsTrainings>(_defaultDataShow);
    const [commentData, setCommentData] = useState<commentsData|undefined>(undefined);

    function processShow(data: details, isRPE?: boolean): any {
        if (isRPE) return(<Text>{data.value} <Text style={{ color: (data.difference)&&(data.difference > 0)? (data.difference == -9999999999)? MD2Colors.yellow500: MD2Colors.red500: MD2Colors.green500 }}>{`(${(data.difference == -9999999999)? '~': data.difference})`}</Text></Text>);
        return(<Text>{data.value} <Text style={{ color: (data.difference)&&(data.difference < 0)? (data.difference == -9999999999)? MD2Colors.yellow500: MD2Colors.red500: MD2Colors.green500 }}>{`(${(data.difference == -9999999999)? '~': data.difference})`}</Text></Text>);
    }
    function processTitle(exercise: string): any { return(<Text>Ejercicio realizado: <Text style={{ fontWeight: '700' }}>{exercise}</Text></Text>); }
    function processParagraph(paragraph: string): any { return (paragraph == 'none')? 'No hay descripción disponible.': paragraph; }
    function close() { setVisible(false); }
    function open(data: DetailsTrainings, comment: commentsData | undefined) {
        setDataShow(data);
        setCommentData(comment);
        setVisible(true);
    }
    
    useImperativeHandle(ref, ()=>({ open }));
    statusEffect([
        { color: theme.colors.background, style: 'light' },
        { color: theme.colors.background, style: 'light' }
    ], visible, undefined, undefined, true);

    return(<CustomModal visible={visible} onRequestClose={close}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                <Appbar.BackAction onPress={close} />
                <Appbar.Content title={`Más detalles (${dataShow.date.value})`}/>
            </Appbar.Header>
            <ScrollView style={{ flex: 2, paddingBottom: 16 }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={[styles.row, { paddingLeft: 8, paddingRight: 4 }]}>
                        <CustomCard4 style={styles.card} title={'RDS'} iconName={'arrow-up-thick'} value={processShow(dataShow.rds)} />
                        <CustomCard4 style={styles.card} title={'Pulso'} iconName={'heart-pulse'} value={processShow(dataShow.pulse)} />
                        <CustomCard4 style={styles.card} title={'Kilaje'} iconName={'dumbbell'} value={processShow(dataShow.kilage)} />
                    </View>
                    <View style={[styles.row, { paddingLeft: 4, paddingRight: 8 }]}>
                        <CustomCard4 style={styles.card} title={'RPE'} iconName={'arrow-down-thick'} value={processShow(dataShow.rpe, true)} />
                        <CustomCard4 style={styles.card} title={'Repeticiones'} iconName={'autorenew'} value={processShow(dataShow.repetitions)} />
                        <CustomCard4 style={styles.card} title={'Tonelaje'} iconName={'weight'} value={processShow(dataShow.tonnage)} />
                    </View>
                </View>
                <CustomCard5 style={{ margin: 8 }} title={processTitle(dataShow.exercise.name)} paragraph={processParagraph(dataShow.exercise.description)} />
                {(commentData)&&<View style={{ marginTop: 8 }}>
                    <View style={{ marginLeft: 8, marginBottom: 16 }}><Text style={{ fontSize: 18 }}>Comentario:</Text></View>
                    <CustomCardComments
                        source={{ uri: `${HostServer}/images/accounts/${decode(commentData.accountData.image)}` }}
                        accountName={`${decode(commentData.accountData.name)}`}
                        edit={commentData.edit}
                        date={decode(commentData.date)}
                        comment={decodeUtf8(decode(commentData.comment))}
                    />
                </View>}
            </ScrollView>
        </View>
    </CustomModal>);
}));

const styles = StyleSheet.create({
    row: {
        width: '50%',
        flexDirection: 'column'
    },
    card: {
        marginTop: 8
    }
});