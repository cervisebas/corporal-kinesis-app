import { Picker } from "@react-native-picker/picker";
import React, { PureComponent } from "react";
import { View } from "react-native";
import { statisticData2 } from "../../../scripts/ApiCorporal/types";
import { CustomPicker2 } from "../../components/CustomPicker";
import Graphic2 from "./graphics2";

type IProps = {
    datas: statisticData2;
    isLoading: boolean;
    exercise: string;
    listExercises: string[];
    changeExercise: (exercise: string)=>any;
};
type IState = {};

export default class HeaderList extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<View style={{ flexDirection: 'column' }}>
            <View style={{ marginTop: 12, marginBottom: 8, marginLeft: 8, marginRight: 8 }}>
                <CustomPicker2 title={'Ejercicio:'} disabled={this.props.isLoading} mode={'dropdown'} value={this.props.exercise} onChange={this.props.changeExercise}>
                    {this.props.listExercises.map((value, index)=><Picker.Item key={index.toString()} label={value} value={value} />)}
                </CustomPicker2>
            </View>
            <Graphic2
                datas={this.props.datas}
                isLoading={this.props.isLoading}
            />
        </View>);
    }
}