import React, { PureComponent, ReactNode } from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ActivityIndicator, Divider, List } from "react-native-paper";
import { statisticData } from "../../../scripts/ApiCorporal/types";
import CombinedTheme from "../../../Theme";

type IProps = {
    datas: statisticData;
    isLoading: boolean;
};
type IState = {};

const { width, height } = Dimensions.get("window");

export default class Graphic extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
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
    render(): ReactNode {
        return(<View style={{ paddingTop: 16, position: 'relative' }}>
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
                style={{ opacity: (this.props.isLoading)? 0: 1 }}
                chartConfig={this.chartConfig}
            />
            <Divider style={{ marginTop: 8 }} />
            <List.Subheader>Historial</List.Subheader>
            <View style={{ display: (this.props.isLoading)? 'flex': 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator animating={true} size={'large'} />
            </View>
        </View>);
    }
}