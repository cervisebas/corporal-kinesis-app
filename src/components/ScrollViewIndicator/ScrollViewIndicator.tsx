import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Animated, ViewStyle, StyleProp } from 'react-native';

type PropsType = {
    children: React.ReactNode;
    indicatorHeight?: number;
    flexibleIndicator?: boolean;
    shouldIndicatorHide?: boolean;
    hideTimeout?: number;
    style?: StyleProp<ViewStyle>;
    scrollViewStyle?: StyleProp<ViewStyle>;
    scrollIndicatorContainerStyle?: StyleProp<ViewStyle>;
    scrollIndicatorStyle?: StyleProp<ViewStyle>;
};

export default function ({ children, indicatorHeight = 200, flexibleIndicator = true, shouldIndicatorHide = true, hideTimeout = 500, style = {}, scrollViewStyle = {}, scrollIndicatorContainerStyle = {}, scrollIndicatorStyle = {}, ...props }: PropsType): JSX.Element {
    const { onScroll, ...propsToSpread }: any = props;
    const [fadeAnim] = useState(new Animated.Value((shouldIndicatorHide)? 0 : 1));
    //const [fromTop, setFromTop] = useState(0);
    const [fromTop, setFromTop] = useState(new Animated.Value(0));
    const [indicatorFlexibleHeight, setIndicatorFlexibleHeight] = useState(indicatorHeight);
    const [visibleScrollPartHeight, setVisibleScrollPartHeight] = useState(1);
    const [fullSizeContentHeight, setFullSizeContentHeight] = useState(1);
    const [isIndicatorHidden, setIsIndicatorHidden] = useState(shouldIndicatorHide);
    const [scrollIndicatorContainerHeight, setScrollIndicatorContainerHeight] = useState(1);
    const handleScroll = (value: { nativeEvent: { contentOffset: any; }; }) => {
        const { nativeEvent: { contentOffset } } = value;
        if (onScroll && typeof onScroll === 'function') onScroll(value);
        const movePercent = contentOffset.y / ((fullSizeContentHeight - visibleScrollPartHeight) / 100);
        const position = ((visibleScrollPartHeight - indicatorFlexibleHeight - (visibleScrollPartHeight - scrollIndicatorContainerHeight)) / 100) * movePercent;
        Animated.timing(fromTop, { toValue: position, duration: 16, useNativeDriver: true }).start();
        //setFromTop(position);
    };
    useEffect(() => {
        if (shouldIndicatorHide)
            (isIndicatorHidden)? Animated.timing(fadeAnim, { toValue: 0, duration: hideTimeout, useNativeDriver: true }).start(): Animated.timing(fadeAnim, { toValue: 1, duration: hideTimeout, useNativeDriver: true }).start();
    }, [fadeAnim, hideTimeout, isIndicatorHidden, shouldIndicatorHide]);
    useEffect(()=> {
        flexibleIndicator && setIndicatorFlexibleHeight(visibleScrollPartHeight * (visibleScrollPartHeight / fullSizeContentHeight));
    }, [visibleScrollPartHeight, fullSizeContentHeight, flexibleIndicator]);
    const runHideTimer = () => { shouldIndicatorHide && setIsIndicatorHidden(true); };
    const showIndicator = () => { shouldIndicatorHide && setIsIndicatorHidden(false); };
    const isContentSmallerThanScrollView = fullSizeContentHeight - visibleScrollPartHeight <= 0;
    return(<View style={[styles.container, style]}>
        <ScrollView
            style={[styles.scrollViewContainer, scrollViewStyle]}
            onContentSizeChange={(_width, height) => setFullSizeContentHeight(height)}
            onLayout={(e) => setVisibleScrollPartHeight(e.nativeEvent.layout.height)}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onMomentumScrollEnd={()=>runHideTimer()}
            onScrollBeginDrag={()=>showIndicator()}
            showsVerticalScrollIndicator={false}
            {...propsToSpread}
        >
            {children}
        </ScrollView>
        {!isContentSmallerThanScrollView && (<Animated.View style={[ styles.scrollIndicatorContainer, { opacity: fadeAnim }, scrollIndicatorContainerStyle ]} onLayout={(e) => setScrollIndicatorContainerHeight(e.nativeEvent.layout.height)}>
            <Animated.View style={[styles.scrollIndicator, {
                //top: fromTop,
                transform: [{
                    translateY: fromTop
                }],
                height: indicatorFlexibleHeight
            }, scrollIndicatorStyle]} />
        </Animated.View>)}
    </View>);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    scrollViewContainer: {
        flex: 1,
    },
    scrollIndicatorContainer: {
        position: 'absolute',
        top: 0,
        right: 2,
        bottom: 0,
        overflow: 'hidden',
        borderRadius: 10,
        width: 6,
        marginVertical: 3,
    },
    scrollIndicator: {
        position: 'absolute',
        right: 0,
        width: 6,
        borderRadius: 3,
        opacity: 0.5,
        backgroundColor: 'blue',
    }
});