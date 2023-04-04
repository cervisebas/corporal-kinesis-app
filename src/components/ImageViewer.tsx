import React, { forwardRef, useImperativeHandle, useState } from "react";
import ImageView from "./ImageViewing/index";
import { ThemeStatus } from "../providers/ThemeProvider";
import statusEffect from "../scripts/StatusEffect";

export type ImageViewerRef = {
    open: (source: string)=>void;
};

export default React.memo(forwardRef(function ImageViewer(_props: any, ref: React.Ref<ImageViewerRef>) {
    const [visible, setVisible] = useState(false);
    const [source, setSource] = useState('https://tecnicadigital.com.ar/image/default-admin.png');
    
    const _status: ThemeStatus | undefined = {
        color: '#000000',
        style: 'light'
    };

    function open(_source: string) {
        setVisible(true);
        setSource(_source);
    }
    function _close() {
        setVisible(false);
    }

    statusEffect([_status, _status], visible);

    useImperativeHandle(ref, ()=>({ open }));

    return(<ImageView
        images={[{ uri: source }]}
        imageIndex={0}
        visible={visible}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
        onRequestClose={_close}
        presentationStyle={'fullScreen'}
        animationType={'none'}
    />);
}));