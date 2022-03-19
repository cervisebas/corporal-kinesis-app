import React from 'react';
import { View, Text, ActivityIndicator, Modal, StyleProp, ViewStyle } from 'react-native';

interface Props {
  show: boolean;
  loadingText?: string;
  backgroundOverlayColor?: string;
  backgroundColor?: string;
  indicatorSize?: "large" | "small";
  fontWeight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  loadingPaddingView?: number;
  borderRadius?: number;
  loadingTextMargin?: string;
  indicatorColor?: string;
  loaderContentDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  colorText?: string;
  animationType?: "fade" | "none" | "slide";
  style?: StyleProp<ViewStyle>;
}

const defaultProps: Props = {
  show: false,
  loadingText: 'Loading',
  indicatorSize: 'large',
  backgroundColor: 'white',
  backgroundOverlayColor: 'rgba(0, 0, 0, .5)',
  loadingPaddingView: 25,
  loadingTextMargin: '3%',
  loaderContentDirection: "row",
  borderRadius: 6,
  fontWeight: 'normal',
  animationType: 'none',
  colorText: '#000000'
};

const LoadingController: React.FC<Props> = (props: Props) => {
  return(<Modal visible={props.show} style={props.style} animationType={props.animationType} transparent statusBarTranslucent={true}>
    <View style={{ flex: 1, backgroundColor: props.backgroundOverlayColor, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ padding: props.loadingPaddingView, backgroundColor: props.backgroundColor, borderRadius: props.borderRadius }}>
        <View style={{ flexDirection: props.loaderContentDirection, alignItems: 'center' }}>
          <ActivityIndicator size={props.indicatorSize}  color={props.indicatorColor}/>
          <Text style={{ margin: props.loadingTextMargin, fontWeight: props.fontWeight, color: props.colorText, marginLeft: 16 }}>{props.loadingText}</Text>
        </View>
      </View>
    </View>
  </Modal>);
};

LoadingController.defaultProps = defaultProps;

export default LoadingController;
