import { Picker } from "@react-native-picker/picker";
import React, { PureComponent } from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import { TouchableRipple } from "react-native-paper";
import Animated from "react-native-reanimated";

type IProps = {
    style?: StyleProp<ViewStyle>;
    onChange: (value: string)=>any;
    value: string;
    title: string;
};
type IState = {
    colorsClick: string[];
    borderClick: string[];
    indexColors: number;
};
export class CustomPicker1 extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            colorsClick: ['rgba(255, 255, 255, 0.5)', 'rgba(237, 112, 53, 1)'],
            borderClick: ['#FFFFFF', '#ED7035'],
            indexColors: 0
        };
    }
    private ref: Picker<string> | null = null;
    render(): React.ReactNode {
        return(<TouchableRipple onPress={()=>this.ref?.focus()} onPressIn={()=>this.setState({ indexColors: 1 })} onPressOut={()=>this.setState({ indexColors: 0 })} style={[this.props.style, { borderRadius: 4, borderColor: this.state.colorsClick[this.state.indexColors], borderWidth: 1.5, paddingTop: 8 }]}>
            <View>
                <Text style={{ marginLeft: 8, color: '#FFFFFF' }}>{this.props.title}</Text>
                <Picker
                    ref={(ref)=>this.ref = ref}
                    style={{ width: "100%", height: 52, color: '#FFFFFF' }}
                    selectedValue={this.props.value}
                    onValueChange={(itemValue)=>this.props.onChange(itemValue)}
                    mode={'dropdown'}
                    dropdownIconColor={this.state.borderClick[this.state.indexColors]}
                    dropdownIconRippleColor={'rgba(0,0,0,0)'}
                >
                    <Picker.Item label="5" value="5" />
                    <Picker.Item label="5.5" value="5.5" />
                    <Picker.Item label="6" value="6" />
                    <Picker.Item label="6.5" value="6.5" />
                    <Picker.Item label="7" value="7" />
                    <Picker.Item label="7.5" value="7.5" />
                    <Picker.Item label="8" value="8" />
                    <Picker.Item label="8.5" value="8.5" />
                    <Picker.Item label="9" value="9" />
                    <Picker.Item label="9.5" value="9.5" />
                    <Picker.Item label="10" value="10" />
                </Picker>
            </View>
        </TouchableRipple>);
    }
};

type IState2 = {
    colorsClick: string[];
    borderClick: string[];
    indexColors: number;
    widthMax: number;
    widthText: number;
};
export class CustomPicker2 extends PureComponent<IProps, IState2> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            colorsClick: ['rgba(255, 255, 255, 0.5)', 'rgba(237, 112, 53, 1)'],
            borderClick: ['#FFFFFF', '#ED7035'],
            indexColors: 0,
            widthMax: 0,
            widthText: 0
        };
    }
    private ref: Picker<string> | null = null;
    render(): React.ReactNode {
        return(<TouchableRipple onPress={()=>this.ref?.focus()} onPressIn={()=>this.setState({ indexColors: 1 })} onPressOut={()=>this.setState({ indexColors: 0 })} style={[this.props.style, { borderRadius: 4, borderColor: this.state.colorsClick[this.state.indexColors], borderWidth: 1.5 }]}>
            <View onLayout={(layout)=>this.setState({ widthMax: layout.nativeEvent.layout.width })} style={{ flex: 3, flexDirection: 'row', alignItems: 'center' }}>
                <Text onLayout={(layout)=>this.setState({ widthText: layout.nativeEvent.layout.width })} style={{ marginLeft: 8, marginRight: 12, color: '#FFFFFF' }}>{this.props.title}</Text>
                <Picker
                    ref={(ref)=>this.ref = ref}
                    style={{ width: (this.state.widthMax - this.state.widthText - 16), height: 52, color: '#FFFFFF' }}
                    selectedValue={this.props.value}
                    onValueChange={(itemValue)=>this.props.onChange(itemValue)}
                    mode={'dialog'}
                    dropdownIconColor={this.state.borderClick[this.state.indexColors]}
                    dropdownIconRippleColor={'rgba(0,0,0,0)'}
                >
                    {this.props.children}
                </Picker>
            </View>
        </TouchableRipple>);
    }
};