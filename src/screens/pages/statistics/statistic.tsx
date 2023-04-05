import React, { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, ToastAndroid, View } from "react-native";
import { Appbar, MD2Colors, ProgressBar, Text } from 'react-native-paper';
import { statisticData2 } from "../../../scripts/ApiCorporal/types";
import { Alert, NoList } from "../../../assets/icons";
import { CustomItemList, EmptyListComments } from "../../components/Components";
import CustomModal from "../../components/CustomModal";
import HeaderList from "./HeaderList";
import { ThemeContext } from "../../../providers/ThemeProvider";
import statusEffect from "../../../scripts/StatusEffect";

type DataView = {
    id: string;
    icon: string;
    color: string;
    label: string;
    value: string;
};

export type StatisticRef = {
    open: (title: string, exercise2: string, datas: statisticData2[])=>void;
};

export default React.memo(forwardRef(function Statistic(_props: any, ref: React.Ref<StatisticRef>) {
    // Context
    const { theme } = useContext(ThemeContext);
    // State's
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [dataShow, setDataShow] = useState<DataView[]>([]);
    const [dataUse, setDataUse] = useState<statisticData2>({ exercise: '', separate: { labels: [], values: [] }, singles: [] });
    const [dataOpen, setDataOpen] = useState<statisticData2[]>([]);
    const [listExercises, setListExercises] = useState<string[]>([]);
    const [title, setTitle] = useState('');
    const [exercise, setExercise] = useState('');

    function _close() { setVisible(false); }
    async function open(_title: string, _exercise: string, _datas: statisticData2[]) {
        setTitle(_title);
        setExercise(_exercise);
        setDataOpen(_datas);
        loadData(_exercise, _datas);
        setVisible(true);
    }
    
    // Get Datas
    function _getIconItem(past: string | undefined, actual: string | undefined): string {
        let past2 = parseFloat(past??'0'); let actual2 = parseFloat(actual??'0');
        if (title == 'RPE') return (_exist(past))? (_exist(actual))? (past == actual)? 'chart-timeline-variant-shimmer': (actual2 < past2)? 'arrow-up': 'arrow-down': 'chart-timeline-variant': 'chart-timeline-variant';
        return (_exist(past))? (_exist(actual))? (past == actual)? 'chart-timeline-variant-shimmer': (actual2 > past2)? 'arrow-up': 'arrow-down': 'chart-timeline-variant': 'chart-timeline-variant';
    }
    function _getColorItem(past: string | undefined, actual: string | undefined): string {
        let past2 = parseFloat(past??'0'); let actual2 = parseFloat(actual??'0');
        if (title == 'RPE') return (_exist(past))? (_exist(actual))? (past == actual)? MD2Colors.blue500: (actual2 < past2)? MD2Colors.green500: MD2Colors.red500: MD2Colors.yellow500: MD2Colors.yellow500;
        return (_exist(past))? (_exist(actual))? (past == actual)? MD2Colors.blue500: (actual2 > past2)? MD2Colors.green500: MD2Colors.red500: MD2Colors.yellow500: MD2Colors.yellow500;
    }
    function _exist(value: any): boolean { return !(value == undefined || isNaN(value)); }

    // Load Data
    function loadData(_exercise?: string, _data?: statisticData2[]) {
        try {
            // Determinar datos a utilizar.
            const datas = _data??dataOpen;
            // Filtrar datos por ejercicio.
            const _dataUse = datas.find((value)=>value.exercise == (_exercise??exercise));
            if (!_dataUse) return ToastAndroid.show('Ocurrió un error al cargar los datos.', ToastAndroid.SHORT);
            // Insertar datos iniciales.
            setDataShow(dataUse.singles.map((_i, index)=>({ label: '', value: '', id: `load-${index}`, icon: 'chart-timeline-variant-shimmer', color: '' })));
            setDataUse(_dataUse);
            setListExercises(datas.map((value)=>value.exercise));
            setExercise(_dataUse.exercise);
            // Determinar datos a mostrar
            const _mapDataShow = (item: typeof _dataUse.singles[0], index: number, array: (typeof _dataUse.singles[0])[])=>({
                id: item.id,
                icon: _getIconItem(array[index-1]?.value, item.value),
                color: _getColorItem(array[index-1]?.value, item.value),
                label: item.label,
                value: item.value
            });
            let _dataShow = _dataUse.singles.map(_mapDataShow);
            // Añadir datos y finalizar la carga.
            setTimeout(()=>setLoading2(false), 500);
            setTimeout(() => {
                setDataShow(_dataShow.reverse());
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    }
    function _changeExercise(_exercise: string) {
        setLoading(true);
        setExercise(_exercise);
        loadData(_exercise);
    }

    // FlatList
    function _getItemLayout(_data: DataView[] | null | undefined, index: number) {
        return {
            length: 72,
            offset: 72 * index,
            index,
        };
    }
    function _keyExtractor(item: DataView, index: number) {
        if (item.id == '') return `stat-user-load-${index}`;
        return `stat-user-${item.id}`;
    }
    function _renderItem({ item }: ListRenderItemInfo<DataView>) {
        return(<CustomItemList
            key={`stat-user-${item.id}`}
            value={item.value}
            label={item.label}
            icon={item.icon}
            color={item.color}
            loading={loading}
        />);
    }

    useImperativeHandle(ref, ()=>({ open }));
    statusEffect([
        { color: theme.colors.background, style: 'light' },
        { color: theme.colors.background, style: 'light' }
    ], visible, undefined, undefined, true);

    return(<CustomModal visible={visible} onRequestClose={_close}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={_close} />
                <Appbar.Content title={title} />
            </Appbar.Header>
            {(dataUse.singles.length !== 0)? <View style={{ flex: 2 }}>
                <FlatList
                    data={dataShow}
                    ListHeaderComponent={<HeaderList
                        datas={dataUse}
                        isLoading={loading2}
                        listExercises={listExercises}
                        exercise={exercise}
                        changeExercise={_changeExercise}
                    />}
                    keyExtractor={_keyExtractor}
                    getItemLayout={_getItemLayout}
                    ListEmptyComponent={<ListEmptyComponent loading={loading} />}
                    renderItem={_renderItem}
                />
            </View> : <View style={[styles.contentError, { width: '100%', height: '90%' }]}>
                <View style={styles.contentError}>
                    <Alert height={128} width={128} />
                    <Text style={{ fontSize: 18, marginLeft: 16, marginRight: 16, marginTop: 16, textAlign: 'center' }}>No se han encontrado estadísticas disponibles</Text>
                </View>
            </View>}
        </View>
    </CustomModal>);
}));

const ListEmptyComponent = React.memo(function ListEmptyComponent(props: { loading: boolean; }) {
    return(<View>
        {(!props.loading)?<EmptyListComments
            icon={<NoList
                width={96}
                height={96}
            />}
            message={'La lista esta vacía'}
        />: <View>
            <ProgressBar indeterminate={true} />
        </View>}
    </View>);
});

const styles = StyleSheet.create({
    contentError: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }
});