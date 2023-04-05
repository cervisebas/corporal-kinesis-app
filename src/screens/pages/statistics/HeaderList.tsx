import React from "react";
import { View } from "react-native";
import { statisticData2 } from "../../../scripts/ApiCorporal/types";
import Graphic2 from "./graphics2";
import CustomPicker from "../../../components/CustomPicker";

type IProps = {
    datas: statisticData2;
    isLoading: boolean;
    exercise: string;
    listExercises: string[];
    changeExercise: (exercise: string)=>void;
};

export default React.memo(function HeaderList(props: IProps) {
    function _onChange(_l: string | undefined, value: string) { props.changeExercise(value); }
    return(<View style={{ flexDirection: 'column' }}>
        <View style={{ marginTop: 12, marginBottom: 8, marginLeft: 8, marginRight: 8 }}>
            <CustomPicker
                label={'Ejercicio:'}
                value={props.exercise}
                disabled={props.isLoading}
                options={props.listExercises.map((value)=>({ value: value }))}
                onChange={_onChange}
            />
        </View>
        <Graphic2
            datas={props.datas}
            isLoading={props.isLoading}
        />
    </View>);
})