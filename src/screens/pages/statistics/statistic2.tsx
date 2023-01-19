import React, { Component, PureComponent } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { Appbar, Colors, ProgressBar, Provider as PaperProvider, Text } from 'react-native-paper';
import CombinedTheme from "../../../Theme";
import { statisticData2 } from "../../../scripts/ApiCorporal/types";
import { Alert, NoList } from "../../../assets/icons";
import { CustomItemList, EmptyListComments } from "../../components/Components";
import CustomModal from "../../components/CustomModal";
import HeaderList from "./HeaderList";

const { width, height } = Dimensions.get("window");

type IProps = {
    visible: boolean;
    datas: statisticData2[];
    exercise: string;
    title: string;
    close: ()=>any;
};
type IState = {
    dataView: { label: string; value: string; id: string; icon: string; color: string; }[];
    isLoading: boolean;
    isLoadingGraphics: boolean;
    dataUse: statisticData2;
    listExercises: string[];
    exercise: string;
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
            exercise: ''
        };
    }
    private dataClean: statisticData2 = {
        exercise: '',
        separate: { labels: [], values: [], },
        singles: []
    };
    loadData(exercise?: string) {
        var dataUse = this.props.datas.find((value)=>value.exercise == ((exercise)? exercise: this.props.exercise));
        var listExercises = this.props.datas.map((value)=>value.exercise);
        if (dataUse) {
            var dataUse2 = dataUse;
            this.setState({ dataView: dataUse.singles.map((_i, index)=>({ label: '', value: '', id: `load-${index.toString()}`, icon: '', color: '' })), dataUse: dataUse2, listExercises, exercise: dataUse2.exercise }, ()=>{
                var datas: { label: string; value: string; id: string; icon: string; color: string; }[] = [];
                dataUse2.singles.forEach((value, index)=>{
                    datas.push({
                        label: value.label,
                        value: value.value,
                        id: value.id,
                        icon: this.getIconItem(parseFloat(dataUse2.singles[index - 1]?.value), parseFloat(value.value)),
                        color: this.getColorItem(parseFloat(dataUse2.singles[index - 1]?.value), parseFloat(value.value))
                    });
                });
                setTimeout(()=>this.setState({ isLoadingGraphics: false }), 1000);
                setTimeout(()=>this.setState({ dataView: datas.reverse(), isLoading: false }), 2000);
            });
        }
    }
    getIconItem(past: number | undefined, actual: number | undefined): string {
        var past2: number = (past)? past: 0; var actual2: number = (actual)? actual: 0;
        if (this.props.title == 'RPE') return (this.exist(past))? (this.exist(actual))? (past == actual)? 'chart-timeline-variant-shimmer': (actual2 < past2)? 'arrow-up': 'arrow-down': 'chart-timeline-variant': 'chart-timeline-variant';
        return (this.exist(past))? (this.exist(actual))? (past == actual)? 'chart-timeline-variant-shimmer': (actual2 > past2)? 'arrow-up': 'arrow-down': 'chart-timeline-variant': 'chart-timeline-variant';
    }
    getColorItem(past: number | undefined, actual: number | undefined): string {
        var past2: number = (past)? past: 0; var actual2: number = (actual)? actual: 0;
        if (this.props.title == 'RPE') return (this.exist(past))? (this.exist(actual))? (past == actual)? Colors.blue500: (actual2 < past2)? Colors.green500: Colors.red500: Colors.yellow500: Colors.yellow500;
        return (this.exist(past))? (this.exist(actual))? (past == actual)? Colors.blue500: (actual2 > past2)? Colors.green500: Colors.red500: Colors.yellow500: Colors.yellow500;
    }
    exist(value: number | undefined): boolean { return !(value == undefined || isNaN(value)); }
    resetDataAndClose() {
        this.setState({
            dataView: [],
            isLoading: true,
            isLoadingGraphics: true,
            dataUse: this.dataClean,
            listExercises: [],
            exercise: ''
        }); this.props.close();
    }
    listEmptyComponent(props: { isLoading: boolean }) { return(<View>{(!props.isLoading)? <EmptyListComments icon={<NoList width={96} height={96} />} message={'La lista esta vacía'} />: <View><ProgressBar indeterminate={true} /></View>}</View>); }

    render(): React.ReactNode {
        return(<CustomModal visible={this.props.visible} onShow={()=>this.loadData()} onRequestClose={()=>this.resetDataAndClose()}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background, height, width }}>
                    <Appbar style={{ backgroundColor: '#1663AB', height: 56 }}>
                        <Appbar.BackAction onPress={()=>this.resetDataAndClose()} />
                        <Appbar.Content title={this.props.title} />
                    </Appbar>
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
                    </View> : <View style={{ ...styles.contentError, width: width, height: '90%' }}>
                        <View style={styles.contentError}>
                            <Alert height={128} width={128} />
                            <Text style={{ fontSize: 18, marginLeft: 16, marginRight: 16, marginTop: 16, textAlign: 'center' }}>No se han encontrado estadísticas disponibles</Text>
                        </View>
                    </View>}
                </View>
            </PaperProvider>
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