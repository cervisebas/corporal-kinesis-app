import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import LoadingComponent, { LoadingComponentRef } from "./components/LoadingComponent";
import ImageViewer, { ImageViewerRef } from "./components/ImageViewer";
import { Button, Dialog, Paragraph, Portal } from "react-native-paper";
import { resolveCacheImgLocation } from "./components/ImageLazyLoad";

export type GlobalComponentsRef = {
    showSimpleAlert: (title: string, message: string)=>void;
    showDoubleAlert: (title: string, message: string, callback: ()=>void)=>void;
    showImageViewer: (source: string)=>void;
    showImageAndVerify: (source: string)=>void;
    loadingController: (visible: boolean, message?: string)=>void;
};

var dialogFunction: undefined|(()=>void);

export default React.memo(forwardRef(function GlobalComponents(_props: any, ref: React.Ref<GlobalComponentsRef>) {
    const refLoadingComponent = useRef<LoadingComponentRef>(null);
    const refImageViewer = useRef<ImageViewerRef>(null);

    // Simple Alert
    const [simpleAlertVisible, setSimpleAlertVisible] = useState(false);
    const [simpleAlertTitle, setSimpleAlertTitle] = useState('Titulo de prueba');
    const [simpleAlertMessage, setSimpleAlertMessage] = useState('Aute reprehenderit consectetur eu et consectetur eu nostrud ex voluptate. Proident non id non incididunt. Adipisicing nisi enim dolor ea cillum commodo cupidatat culpa proident incididunt.');
    function hideSimpleAlert() { setSimpleAlertVisible(false); }
    function showSimpleAlert(title: string, message: string) {
        let _message = (typeof message == 'string')? message: 'El mensaje no se puede mostrar, debió ocurrir un error inesperado y no se pudo procesar el mensaje correctamente.';
        setSimpleAlertVisible(true);
        setSimpleAlertTitle(title);
        setSimpleAlertMessage(_message);
    }

    // Double Choice Alert
    const [doubleAlertVisible, setDoubleAlertVisible] = useState(false);
    const [doubleAlertTitle, setDoubleAlertTitle] = useState('Titulo de prueba');
    const [doubleAlertMessage, setDoubleAlertMessage] = useState('Aute reprehenderit consectetur eu et consectetur eu nostrud ex voluptate. Proident non id non incididunt. Adipisicing nisi enim dolor ea cillum commodo cupidatat culpa proident incididunt.');
    function hideDoubleAlert() { setDoubleAlertVisible(false); }
    function doneDoubleAlert() { hideDoubleAlert(); if (dialogFunction) dialogFunction();  }
    function showDoubleAlert(title: string, message: string, callback: ()=>void) {
        let _message = (typeof message == 'string')? message: 'El mensaje no se puede mostrar, debió ocurrir un error inesperado y no se pudo procesar el mensaje correctamente.';
        setDoubleAlertVisible(true);
        setDoubleAlertTitle(title);
        setDoubleAlertMessage(_message);
        dialogFunction = callback;
    }

    // Loading
    function loadingController(visible: boolean, message?: string) {
        if (!visible) return refLoadingComponent.current?.close();
        refLoadingComponent.current?.open(message!);
    }

    // Image Viewer
    function showImageViewer(source: string) {
        refImageViewer.current?.open(source);
    }
    async function showImageAndVerify(source: string) {
        loadingController(true, 'Espere por favor...')
        try {
            const verify = await resolveCacheImgLocation(source);
            loadingController(false);
            showImageViewer(verify);
        } catch (error) {
            loadingController(false);
            showSimpleAlert('Ocurrió un error al cargar la imagen', error as string);
        }
    }

    useImperativeHandle(ref, ()=>({
        showSimpleAlert,
        showDoubleAlert,
        showImageViewer,
        showImageAndVerify,
        loadingController
    }));

    return(<>
        <Portal>
            <Dialog visible={simpleAlertVisible} onDismiss={hideSimpleAlert}>
                <Dialog.Title>{simpleAlertTitle}</Dialog.Title>
                {(simpleAlertMessage !== '')&&<Dialog.Content>
                    <Paragraph>{simpleAlertMessage}</Paragraph>
                </Dialog.Content>}
                <Dialog.Actions>
                    <Button onPress={hideSimpleAlert}>Cerrar</Button>
                </Dialog.Actions>
            </Dialog>
            <Dialog visible={doubleAlertVisible} onDismiss={hideDoubleAlert}>
                <Dialog.Title>{doubleAlertTitle}</Dialog.Title>
                {(doubleAlertMessage !== '')&&<Dialog.Content>
                    <Paragraph>{doubleAlertMessage}</Paragraph>
                </Dialog.Content>}
                <Dialog.Actions>
                    <Button onPress={hideDoubleAlert}>Cancelar</Button>
                    <Button onPress={doneDoubleAlert}>Aceptar</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
        
        <LoadingComponent ref={refLoadingComponent} />
        <ImageViewer ref={refImageViewer} />
    </>);
}));