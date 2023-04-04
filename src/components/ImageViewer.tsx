import React, { PureComponent, forwardRef, useImperativeHandle, useState } from "react";
import ImageView from "./ImageViewing/index";
import statusEffect from "../Scripts/StatusEffect";
import { ThemeStatus } from "./DataProvider";

type IProps = {};
type IState = {
    visible: boolean;
    source: string;
};

/*export default class ImageViewer extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            source: 'https://tecnicadigital.com.ar/image/default-admin.png'
        };
        this.close = this.close.bind(this);
    }
    open(source: string) {
        this.setState({
            visible: true,
            source
        });
    }
    close() {
        this.setState({ visible: false });
    }
    render(): React.ReactNode {
        return(<ImageView
            images={[{ uri: this.state.source }]}
            imageIndex={0}
            visible={this.state.visible}
            swipeToCloseEnabled={true}
            doubleTapToZoomEnabled={true}
            onRequestClose={this.close}
        />);
    }
}*/

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