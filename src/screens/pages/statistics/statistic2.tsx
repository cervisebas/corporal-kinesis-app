import React, { PureComponent } from "react";
import { FlatList, StyleSheet, ToastAndroid, View } from "react-native";
import { Appbar, MD2Colors, ProgressBar, Text } from 'react-native-paper';
import { statisticData2 } from "../../../scripts/ApiCorporal/types";
import { Alert, NoList } from "../../../assets/icons";
import { CustomItemList, EmptyListComments } from "../../components/Components";
import CustomModal from "../../components/CustomModal";
import HeaderList from "./HeaderList";
import { ThemeContext } from "../../../providers/ThemeProvider";

type IProps = {};
type IState = {
    dataView: { label: string; value: string; id: string; icon: string; color: string; }[];
    isLoading: boolean;
    isLoadingGraphics: boolean;
    dataUse: statisticData2;
    listExercises: string[];
    exercise: string;
    
    visible: boolean;
    exercise2: string;
    datas: statisticData2[];
    title: string;
};
export class Statistics2 extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            dataView: [],
            isLoading: true,
            isLoadingGraphics: true,
            dataUse: this.dataClean,
            listExercises: [],
            exercise: '',

            visible: false,
            exercise2: '',
            datas: [],
            title: ''
        };
        this.loadData = this.loadData.bind(this);
        this.close = this.close.bind(this);
    }
    static contextType = ThemeContext;
    private dataClean: statisticData2 = {
        exercise: '',
        separate: { labels: [], values: [], },
        singles: []
    };
    private loadData(exercise?: string) {
        var dataUse = this.state.datas.find((value)=>value.exercise == ((exercise)? exercise: this.state.exercise2));
        var listExercises = this.state.datas.map((value)=>value.exercise);
        if (!dataUse) return ToastAndroid.show('Ocurrió un error al cargar los datos.', ToastAndroid.SHORT);
        this.setState({ dataView: dataUse.singles.map((_i, index)=>({ label: '', value: '', id: `load-${index.toString()}`, icon: '', color: '' })), dataUse: dataUse, listExercises, exercise: dataUse.exercise }, ()=>{
            var datas: { label: string; value: string; id: string; icon: string; color: string; }[] = [];
            dataUse!.singles.forEach((value, index)=>{
                datas.push({
                    label: value.label,
                    value: value.value,
                    id: value.id,
                    icon: this.getIconItem(parseFloat(dataUse!.singles[index - 1]?.value), parseFloat(value.value)),
                    color: this.getColorItem(parseFloat(dataUse!.singles[index - 1]?.value), parseFloat(value.value))
                });
            });
            setTimeout(()=>this.setState({ isLoadingGraphics: false }), 1000);
            setTimeout(()=>this.setState({ dataView: datas.reverse(), isLoading: false }), 2000);
        });
    }
    private getIconItem(past: number | undefined, actual: number | undefined): string {
        var past2: number = (past)? past: 0; var actual2: number = (actual)? actual: 0;
        if (this.state.title == 'RPE') return (this.exist(past))? (this.exist(actual))? (past == actual)? 'chart-timeline-variant-shimmer': (actual2 < past2)? 'arrow-up': 'arrow-down': 'chart-timeline-variant': 'chart-timeline-variant';
        return (this.exist(past))? (this.exist(actual))? (past == actual)? 'chart-timeline-variant-shimmer': (actual2 > past2)? 'arrow-up': 'arrow-down': 'chart-timeline-variant': 'chart-timeline-variant';
    }
    private getColorItem(past: number | undefined, actual: number | undefined): string {
        var past2: number = (past)? past: 0; var actual2: number = (actual)? actual: 0;
        if (this.state.title == 'RPE') return (this.exist(past))? (this.exist(actual))? (past == actual)? MD2Colors.blue500: (actual2 < past2)? MD2Colors.green500: MD2Colors.red500: MD2Colors.yellow500: MD2Colors.yellow500;
        return (this.exist(past))? (this.exist(actual))? (past == actual)? MD2Colors.blue500: (actual2 > past2)? MD2Colors.green500: MD2Colors.red500: MD2Colors.yellow500: MD2Colors.yellow500;
    }
    private exist(value: number | undefined): boolean { return !(value == undefined || isNaN(value)); }
    private close() { this.setState({ visible: false }); }
    private listEmptyComponent(props: { isLoading: boolean }) { return(<View>{(!props.isLoading)? <EmptyListComments icon={<NoList width={96} height={96} />} message={'La lista esta vacía'} />: <View><ProgressBar indeterminate={true} /></View>}</View>); }

    public async open(title: string, exercise2: string, datas: statisticData2[]) {
        this.setState({
            visible: true,
            title,
            exercise2,
            datas
        }, this.loadData);
    }

    render(): React.ReactNode {
        const { theme } = this.context;
        return(<CustomModal visible={this.state.visible} onRequestClose={this.close}>
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={this.close} />
                    <Appbar.Content title={this.state.title} />
                </Appbar.Header>
                {(this.state.dataUse.singles.length !== 0)? <View style={{ flex: 2 }}>
                    <FlatList
                        data={this.state.dataView}
                        ListHeaderComponent={<HeaderList
                            datas={this.state.dataUse}
                            isLoading={this.state.isLoading}
                            listExercises={this.state.listExercises}
                            exercise={this.state.exercise}
                            changeExercise={(v)=>this.setState({ isLoading: true, exercise: v }, ()=>this.loadData(v))}
                        />}
                        keyExtractor={(item)=>`stat-user-${item.id}`}
                        getItemLayout={(_i, index)=>({
                            length: 72,
                            offset: 72 * index,
                            index,
                        })}
                        ListEmptyComponent={<this.listEmptyComponent isLoading={this.state.isLoading} />}
                        renderItem={({ item })=><CustomItemList
                            key={`stat-user-${item.id}`}
                            value={item.value}
                            label={item.label}
                            icon={item.icon}
                            color={item.color}
                            loading={this.state.isLoading}
                        />}
                    />
                </View> : <View style={[styles.contentError, { width: '100%', height: '90%' }]}>
                    <View style={styles.contentError}>
                        <Alert height={128} width={128} />
                        <Text style={{ fontSize: 18, marginLeft: 16, marginRight: 16, marginTop: 16, textAlign: 'center' }}>No se han encontrado estadísticas disponibles</Text>
                    </View>
                </View>}
            </View>
        </CustomModal>);
    }
};

const styles = StyleSheet.create({
    contentError: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }
});