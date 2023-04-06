import React, { useCallback, useContext } from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ActivityIndicator, Divider, List } from "react-native-paper";
import { statisticData2 } from "../../../scripts/ApiCorporal/types";
import { ThemeContext } from "../../../providers/ThemeProvider";
import Color from "color";

type IProps = {
    datas: statisticData2;
    isLoading: boolean;
};

export default React.memo(function Graphics(props: IProps) {
    const { theme } = useContext(ThemeContext);

    const { width } = Dimensions.get("window");
    const chartConfig = {
        backgroundGradientFrom: theme.colors.background,
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: theme.colors.background,
        backgroundGradientToOpacity: 0.5,
        color: _getColors0,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false
    };

    const _getLabels = useCallback(()=>props.datas.separate.labels.slice(0, 6), [props.datas]);
    const _getDatas = useCallback(()=>props.datas.separate.values.slice(0, 6), [props.datas]);
    function _getColors0(_opacity = 1) { return Color(theme.colors.onSurface).alpha(_opacity).rgb().string(); } // `rgba(255, 255, 255, ${_opacity})`; }
    function _getColors(_opacity = 1) { return Color(theme.colors.primary).alpha(_opacity).rgb().string(); } //`rgba(237, 112, 53, ${_opacity})`; }

    return(<View style={{ paddingTop: 16, position: 'relative' }}>
        <LineChart
            data={{
                labels: _getLabels(),
                datasets: [{
                    data: _getDatas(),
                    color: _getColors,
                    strokeWidth: 2
                }]
            }}
            width={width}
            height={220}
            style={{ opacity: (props.isLoading)? 0: 1 }}
            chartConfig={chartConfig}
        />
        <Divider style={{ marginTop: 8 }} />
        <List.Subheader>Historial</List.Subheader>
        <View style={{ display: (props.isLoading)? 'flex': 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator animating={true} size={'large'} />
        </View>
    </View>);
});