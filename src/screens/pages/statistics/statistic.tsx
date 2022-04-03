import React, { Component } from "react";
import { Dimensions, FlatList, Modal, StatusBar, StyleSheet, View } from "react-native";
import { Appbar, Colors, List, ProgressBar, Provider as PaperProvider, Text, Title } from 'react-native-paper';
import CombinedTheme from "../../../Theme";
import { statisticData } from "../../../scripts/ApiCorporal/types";
import { getNavigationBarHeight } from "react-native-android-navbar-height";
import { Alert, NoList } from "../../../assets/icons";
import Graphic from "./graphics";
import { CustomItemList, EmptyListComments } from "../../components/Components";
import Settings from "../../../Settings";

const { width, height } = Dimensions.get("window");

type IProps = {
    visible: boolean;
    datas: statisticData;
    title: string;
    close: ()=>any;
};
type IState = {
    navBarHeight: number;
    dataView: { label: string; value: string; icon: string; color: string; }[];
    isLoading: boolean;
    isLoadingGraphics: boolean;
};
export class Statistics extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.flatListRef = React.createRef();
        this.state = {
            navBarHeight: 0,
            dataView: [],
            isLoading: true,
            isLoadingGraphics: true
        };
    }
    private flatListRef: React.RefObject<FlatList>;
    static contextType = Settings;

    loadData() {
        this.setState({ dataView: this.props.datas.singles.map(()=>({ label: '', value: '', icon: '', color: '' })) }, ()=>{
            var datas: { label: string; value: string; icon: string; color: string; }[] = [];
            this.props.datas.singles.forEach((value, index)=>{
                datas.push({
                    label: value.label,
                    value: value.value,
                    icon: this.getIconItem(parseFloat(this.props.datas.singles[index - 1]?.value), parseFloat(value.value)),
                    color: this.getColorItem(parseFloat(this.props.datas.singles[index - 1]?.value), parseFloat(value.value))
                });
            });
            setTimeout(()=>this.setState({ isLoadingGraphics: false }), 1000);
            setTimeout(()=>this.setState({ dataView: datas.reverse(), isLoading: false }), 2000);
        });
    }
    getIconItem(past: number | undefined, actual: number | undefined): string {
        if (this.props.title == 'RPE') return (past)? (actual)? (past == actual)? 'chart-timeline-variant-shimmer': (actual < past)? 'arrow-up': 'arrow-down': 'chart-timeline-variant': 'chart-timeline-variant';
        return (past)? (actual)? (past == actual)? 'chart-timeline-variant-shimmer': (actual > past)? 'arrow-up': 'arrow-down': 'chart-timeline-variant': 'chart-timeline-variant';
    }
    getColorItem(past: number | undefined, actual: number | undefined): string {
        if (this.props.title == 'RPE') return (past)? (actual)? (past == actual)? Colors.blue500: (actual < past)? Colors.green500: Colors.red500: Colors.yellow500: Colors.yellow500;
        return (past)? (actual)? (past == actual)? Colors.blue500: (actual > past)? Colors.green500: Colors.red500: Colors.yellow500: Colors.yellow500;
    }
    async getNavBarHeight() { return this.setState({ navBarHeight: await getNavigationBarHeight() }); }
    resetDataAndClose() { this.setState({ dataView: [], isLoading: true, isLoadingGraphics: true }); this.props.close(); }
    listEmptyComponent(props: { isLoading: boolean }) { return(<View>{(!props.isLoading)? <EmptyListComments icon={<NoList width={96} height={96} />} message={'La lista esta vacía'} />: <View><ProgressBar indeterminate={true} /></View>}</View>); }

    render(): React.ReactNode {
        const { getSettings } = this.context;
        this.getNavBarHeight();
        return(<Modal visible={this.props.visible} transparent={false} hardwareAccelerated={true} animationType={getSettings.animations} onShow={()=>this.loadData()} onRequestClose={()=>this.resetDataAndClose()}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background, height, width }}>
                    <Appbar style={{ backgroundColor: '#1663AB', height: 56 }}>
                        <Appbar.BackAction onPress={()=>this.resetDataAndClose()} />
                        <Appbar.Content title={this.props.title} />
                    </Appbar>
                    {(this.props.datas.singles.length !== 0)? <View style={{ flex: 2 }}>
                        <FlatList
                            data={this.state.dataView}
                            ListHeaderComponent={<Graphic datas={this.props.datas} isLoading={this.state.isLoadingGraphics} />}
                            ListEmptyComponent={<this.listEmptyComponent isLoading={this.state.isLoading} />}
                            ref={this.flatListRef}
                            renderItem={({ item, index })=><CustomItemList key={index} value={item.value} label={item.label} icon={item.icon} color={item.color} loading={this.state.isLoading} />}
                        />
                    </View> : <View style={{ ...styles.contentError, width: width, height: (height - 56 - parseFloat(String(StatusBar.currentHeight)) - this.state.navBarHeight) }}>
                        <View style={styles.contentError}>
                            <Alert height={128} width={128} />
                            <Text style={{ fontSize: 18, marginLeft: 16, marginRight: 16, marginTop: 16, textAlign: 'center' }}>No se han encontrado estadísticas disponibles</Text>
                        </View>
                    </View>}
                </View>
            </PaperProvider>
        </Modal>);
    }
};

const styles = StyleSheet.create({
    contentError: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }
});