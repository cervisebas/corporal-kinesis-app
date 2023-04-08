import React, { useCallback } from "react";
import { Avatar, List } from "react-native-paper";
import ImageDefault from "../../assets/profile.webp";
import { HostServer } from "../../scripts/ApiCorporal";
import { decode } from "base-64";
type IProps = {
    title: string;
    subtitle: string;
    type: string;
    image: string;
    onPress?: ()=>void;
};

export default React.memo(function CustomItemList3(props: IProps) {
    const _left = useCallback((lProps)=>{
        return(<Avatar.Image
            {...lProps}
            size={56}
            source={(!props.image)? ImageDefault: {
                uri: `${HostServer}/images/accounts/${decode(props.image)}`
            }}
        />);
    }, [props.image]);
    const _right = useCallback((rProps)=>{
        return(<List.Icon
            {...rProps}
            icon={(props.type == '0')? 'account-outline': 'shield-crown-outline'}
        />);
    }, [props.type]);

    return(<List.Item
        title={props.title}
        description={props.subtitle}
        onPress={props.onPress}
        left={_left}
        right={_right}
    />);
});