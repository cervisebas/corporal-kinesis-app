import React, { useCallback, useState } from "react";
import { IconButton, List, MD2Colors, Menu } from "react-native-paper";

type IProps = {
    title: string;
    actionDelete?: ()=>void;
    actionViewDescription?: ()=>void;
    actionEdit?: ()=>void;
};

export default React.memo(function CustomItemList4(props: IProps) {
    // State's
    const [menu, setMenu] = useState(false);

    function _openMenu() { setMenu(true); }
    function _closeMenu() { setMenu(false); }

    function _actionDelete() {
        _closeMenu();
        props.actionDelete?.();
    }
    function _actionViewDescription() {
        _closeMenu();
        props.actionViewDescription?.();
    }
    function _actionEdit() {
        _closeMenu();
        props.actionEdit?.();
    }

    const _right = useCallback((rProps: any)=>{
        return(<Menu
            visible={menu}
            onDismiss={_closeMenu}
            anchor={<IconButton {...rProps} onPress={_openMenu} icon={'dots-vertical'} />}>
            <Menu.Item onPress={_actionViewDescription} title={"Ver descripción"} />
            <Menu.Item onPress={_actionEdit} title={"Editar"} />
            <Menu.Item style={{ backgroundColor: MD2Colors.red500 }} onPress={_actionDelete} title={"Borrar"} />
        </Menu>);
    }, [menu]);
    function _left(lProps: any) {
        return(<List.Icon {...lProps} icon={'calendar-outline'} />);
    }

    return(<List.Item
        title={props.title}
        onPress={props.actionViewDescription}
        left={_left}
        right={_right}
    />);
});