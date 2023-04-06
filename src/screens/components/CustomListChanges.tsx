import React from "react";
import { List, MD2Colors } from "react-native-paper";

type IProps = {
    version: string;
    date: string;
    changes: {
        type: number;
        text: string;
    }[];
};

export default React.memo(function CustomListChanges(props: IProps) {
    function _getIcon(type: number): string {
        switch (type) {
            case 0: return 'update';
            case 1: return 'plus';
            case 2: return 'bug-outline';
            case 3: return 'import';
        }
        return 'update';
    }
    function _getColor(type: number): string {
        switch (type) {
            case 0: return MD2Colors.blue500;
            case 1: return MD2Colors.green500;
            case 2: return MD2Colors.red500;
            case 3: return MD2Colors.yellow500;
        }
        return MD2Colors.green500;
    }

    function _renderItem(value: typeof props.changes[0], index: number, _array: typeof props.changes) {
        return(<List.Item
            key={`item-${props.version}-${index}`}
            title={value.text}
            titleNumberOfLines={10}
            titleStyle={{ fontSize: 14 }}
            left={(props)=><List.Icon
                {...props}
                icon={_getIcon(value.type)}
                color={_getColor(value.type)}
            />}
        />);
    }
    return(<List.Section>
        <List.Subheader variant={'titleLarge'} style={{ fontSize: 20 }}>Version {props.version}</List.Subheader>
        <List.Subheader style={{ marginLeft: 16, marginTop: -14 }}>{props.date}</List.Subheader>
        {props.changes.map(_renderItem)}
    </List.Section>);
});