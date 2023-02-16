import React, { PureComponent } from "react";
import { Animated, StyleProp, TextStyle, ViewStyle } from "react-native";

type IProps = {
    start: boolean;
    value: string;
    delay?: number;
    duration?: number;
    style?: StyleProp<ViewStyle>;
    styleText?: StyleProp<TextStyle>;
    reset: (state: boolean)=>void;
};
type IState = {
    view: React.ReactNode[];
};

export default class TextAnimationShake extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            view: []
        }
    }
    private animation: Animated.Value = new Animated.Value(0);
    componentDidUpdate(): void {
        if (this.props.start) {
            this.start();
            this.props.reset(false);
        }
    }
    start() {
        let string = this.props.value.split('');
        let delay = (this.props.delay)? this.props.delay: 60;
        let duration = (this.props.duration)? this.props.duration: 500;
        let view: React.ReactNode[] = [];
        for (let i = 0; i < string.length; i++) {
            const element = string[i];
            this.animation = new Animated.Value(0);
            view[i] = (<Animated.Text
                allowFontScaling={false}
                style={[this.props.styleText, {
                    transform: [{ scale: this.animation }],
                    opacity: this.animation
                }]}
                key={`Letter_${i.toString()}`}>
                {element}
            </Animated.Text>);
            Animated.timing(this.animation, {
                toValue: 1,
                delay: delay * i,
                duration: duration,
                useNativeDriver: true
            }).start();
        }
        this.setState({ view });
    }
    reset() {
        if (this.state.view.length !== 0) this.setState({ view: [] });
    }

    render() {
        return (<Animated.View style={[this.props.style, { flexDirection: 'row', flexWrap: 'wrap' }]}>
            {this.state.view}
        </Animated.View>);
    }
}