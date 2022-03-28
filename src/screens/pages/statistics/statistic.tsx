import React, { Component } from "react";
import { Dimensions, FlatList, Modal, StatusBar, StyleSheet, View } from "react-native";
import { Appbar, Colors, Divider, List, Provider as PaperProvider, Text, Title } from 'react-native-paper';
import { LineChart } from "react-native-chart-kit";
import CombinedTheme from "../../../Theme";
import { statisticData } from "../../../scripts/ApiCorporal/types";
import { getNavigationBarHeight } from "react-native-android-navbar-height";
import { Alert } from "../../../assets/icons";

const { width, height } = Dimensions.get("window");

type IProps = {
    visible: boolean;
    datas: statisticData;
    title: string;
    close: ()=>any;
};
type IState = {
    navBarHeight: number;
    itemHeight: number;
};
export class Statistics extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.flatListRef = React.createRef();
        this.state = {
            navBarHeight: 0,
            itemHeight: 0
        };
    }

    private flatListRef: React.RefObject<FlatList>;
    private chartConfig = {
        backgroundGradientFrom: CombinedTheme.colors.background,
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: CombinedTheme.colors.background,
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false
    };

    getIconItem(past: number | undefined, actual: number | undefined): string {
        if (this.props.title == 'RPE') {
            return (past)? (actual)? (past == actual)? 'chart-timeline-variant-shimmer': (actual < past)? 'arrow-up': 'arrow-down': 'chart-timeline-variant': 'chart-timeline-variant';
        }
        return (past)? (actual)? (past == actual)? 'chart-timeline-variant-shimmer': (actual > past)? 'arrow-up': 'arrow-down': 'chart-timeline-variant': 'chart-timeline-variant';
    }
    getColorItem(past: number | undefined, actual: number | undefined): string {
        if (this.props.title == 'RPE') {
            return (past)? (actual)? (past == actual)? Colors.blue500: (actual < past)? Colors.green500: Colors.red500: Colors.yellow500: Colors.yellow500;
        }
        return (past)? (actual)? (past == actual)? Colors.blue500: (actual > past)? Colors.green500: Colors.red500: Colors.yellow500: Colors.yellow500;
    }
    async getNavBarHeight() {
        this.setState({ navBarHeight: await getNavigationBarHeight() });
    }

    render(): React.ReactNode {
        return(<Modal visible={this.props.visible} transparent={false} hardwareAccelerated={true} animationType={'none'} onShow={()=>this.flatListRef.current?.scrollToEnd({ animated: true })} onRequestClose={()=>this.props.close()}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background, height, width }}>
                    <Appbar style={{ backgroundColor: '#1663AB', height: 56 }}>
                        <Appbar.BackAction onPress={() =>this.props.close()} />
                        <Appbar.Content title={this.props.title} />
                    </Appbar>
                    {(this.props.datas.singles.length !== 0)? <View style={styles.content}>
                        <LineChart
                            data={{
                                labels: this.props.datas.separate.labels.slice(0, 6),
                                datasets: [{
                                    data: this.props.datas.separate.values.slice(0, 6),
                                    color: (opacity = 1) => `rgba(237, 112, 53, ${opacity})`,
                                    strokeWidth: 2
                                }]
                            }}
                            width={width}
                            height={220}
                            chartConfig={this.chartConfig}
                        />
                        <Divider style={{ marginTop: 8 }} />
                        <List.Section>
                            <List.Subheader>Historial</List.Subheader>
                            <FlatList
                                data={this.props.datas.singles}
                                style={{ paddingLeft: 16, height: (height - (276 + 36)) }}
                                ref={this.flatListRef}
                                inverted={true}
                                renderItem={({ item, index })=><List.Item
                                    onLayout={(layout)=>this.setState({ itemHeight: layout.nativeEvent.layout.height })}
                                    title={item.label}
                                    titleStyle={{ fontSize: 12, color: '#727272' }}
                                    left={()=><View style={{ width: (item.value.length < 2)? 24 : 16*item.value.length, height: 48, alignItems: 'center', justifyContent: 'center' }}><Title>{item.value}</Title></View>}
                                    right={()=><List.Icon color={this.getColorItem(parseFloat(this.props.datas.singles[index - 1]?.value), parseFloat(item.value))} icon={this.getIconItem(parseFloat(this.props.datas.singles[index - 1]?.value), parseFloat(item.value))} />}
                                />}
                            />
                        </List.Section>
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
    content: {
        paddingTop: 24
    },
    contentError: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }
});