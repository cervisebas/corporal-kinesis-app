import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Dialog, Paragraph } from "react-native-paper";
import { Account } from "../../../scripts/ApiCorporal";
import { GlobalRef } from "../../../GlobalRef";

type IProps = {
    reload: ()=>void;
};
export type DeleteUserRef = {
    open: (idClient: string)=>void;
};

export default React.memo(forwardRef(function DeleteUser(props: IProps, ref: React.Ref<DeleteUserRef>) {
    const [visible, setVisible] = useState(false);
    const [IDClient, setIDClient] = useState('-1');

    function close() {
        setVisible(false);
    }
    function open(idClient: string) {
        setVisible(true);
        setIDClient(idClient);
    }
    function deleteNow() {
        close();
        GlobalRef.current?.loadingController(true, 'Borrando información del cliente...');
        Account.admin_delete(IDClient)
            .then(()=>{
                GlobalRef.current?.loadingController(false);
                GlobalRef.current?.showSimpleAlert('Usuario borrado correctamente', '');
                props.reload();
            })
            .catch((error)=>{
                GlobalRef.current?.loadingController(false);
                GlobalRef.current?.showSimpleAlert('Ocurrio un error', error.cause);
            });
    }

    useImperativeHandle(ref, ()=>({ open }));

    return(<Dialog visible={visible} onDismiss={close}>
        <Dialog.Title>¡¡Advertencia!!</Dialog.Title>
        <Dialog.Content>
            <Paragraph>{'¿Estás de acuerdo que quieres borrar este usuario junto a toda su información?\n\nEsta acción no se podrá deshacer luego de una vez realizada.'}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
            <Button onPress={close}>Cancelar</Button>
            <Button onPress={deleteNow}>Aceptar</Button>
        </Dialog.Actions>
    </Dialog>);
}));