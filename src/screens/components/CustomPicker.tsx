import { Picker } from "@react-native-picker/picker";
import React, { PureComponent } from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import { TouchableRipple } from "react-native-paper";

type IProps = {
    style?: StyleProp<ViewStyle>;
    onChange: (value: string)=>any;
    value: string;
    title: string;
    disabled?: boolean;
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
    componentWillUnmount() {
        this.ref = null;
        this.setState({
            colorsClick: ['rgba(255, 255, 255, 0.5)', 'rgba(237, 112, 53, 1)'],
            borderClick: ['#FFFFFF', '#ED7035'],
            indexColors: 0
        });
    }
    render(): React.ReactNode {
        return(<TouchableRipple
                disabled={this.props.disabled}
                onPress={()=>(!this.props.disabled)? this.ref?.focus(): null}
                onPressIn={()=>(!this.props.disabled)? this.setState({ indexColors: 1 }): null}
                onPressOut={()=>(!this.props.disabled)? this.setState({ indexColors: 0 }): null}
                style={[this.props.style, { borderRadius: 4, borderColor: (!this.props.disabled)? this.state.colorsClick[this.state.indexColors]: 'rgba(255, 255, 255, 0.30)', borderWidth: 1.5, paddingTop: 8, overflow: 'hidden' }]}>
            <View>
                <Text style={{ marginLeft: 8, color: (!this.props.disabled)? '#FFFFFF': 'rgba(255, 255, 255, 0.30)' }}>{this.props.title}</Text>
                <Picker
                    ref={(ref)=>this.ref = ref}
                    style={{ width: "100%", height: 52, color: (!this.props.disabled)? '#FFFFFF': 'rgba(255, 255, 255, 0.30)' }}
                    selectedValue={this.props.value}
                    enabled={!this.props.disabled}
                    onValueChange={(itemValue)=>this.props.onChange(itemValue)}
                    mode={'dropdown'}
                    dropdownIconColor={(!this.props.disabled)? this.state.borderClick[this.state.indexColors]: 'rgba(255, 255, 255, 0.30)'}
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
    componentWillUnmount() {
        this.ref = null;
        this.setState({
            colorsClick: ['rgba(255, 255, 255, 0.5)', 'rgba(237, 112, 53, 1)'],
            borderClick: ['#FFFFFF', '#ED7035'],
            indexColors: 0,
            widthMax: 0,
            widthText: 0
        });
    }
    render(): React.ReactNode {
        return(<TouchableRipple
                onPress={()=>(!this.props.disabled)? this.ref?.focus(): null}
                disabled={this.props.disabled}
                onPressIn={()=>(!this.props.disabled)? this.setState({ indexColors: 1 }): null}
                onPressOut={()=>(!this.props.disabled)? this.setState({ indexColors: 0 }): null}
                style={[this.props.style, { borderRadius: 4, borderColor: (!this.props.disabled)? this.state.colorsClick[this.state.indexColors]: 'rgba(255, 255, 255, 0.25)', borderWidth: 1.5, overflow: 'hidden' }]}>
            <View onLayout={(layout)=>this.setState({ widthMax: layout.nativeEvent.layout.width })} style={{ flex: 3, flexDirection: 'row', alignItems: 'center' }}>
                <Text onLayout={(layout)=>this.setState({ widthText: layout.nativeEvent.layout.width })} style={{ marginLeft: 8, marginRight: 12, color: (!this.props.disabled)? '#FFFFFF': 'rgba(255, 255, 255, 0.25)' }}>{this.props.title}</Text>
                <Picker
                    ref={(ref)=>this.ref = ref}
                    style={{ width: (this.state.widthMax - this.state.widthText - 16), height: 52, color: (!this.props.disabled)? '#FFFFFF': 'rgba(255, 255, 255, 0.25)' }}
                    selectedValue={this.props.value}
                    enabled={!this.props.disabled}
                    onValueChange={(itemValue)=>this.props.onChange(itemValue)}
                    mode={'dialog'}
                    dropdownIconColor={(!this.props.disabled)? this.state.borderClick[this.state.indexColors]: 'rgba(255, 255, 255, 0.30)'}
                    dropdownIconRippleColor={'rgba(0,0,0,0)'}
                >
                    {this.props.children}
                </Picker>
            </View>
        </TouchableRipple>);
    }
};