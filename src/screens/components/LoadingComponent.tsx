import React, { forwardRef, useImperativeHandle, useState } from "react";
import CombinedTheme from "../../Theme";
import LoadingController from "../../components/loading/loading-controller";

type IProps = {};
export type LoadingComponentRef = {
    controller: (visible: boolean, message?: string)=>void;
};

export default React.memo(forwardRef(function LoadingComponent(props: IProps, ref: React.Ref<LoadingComponentRef>) {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');

    function controller(visible: boolean, message?: string) {
        if (visible) {
            setVisible(true);
            setMessage(message!);
            return;
        }
        setVisible(false);
    }
    useImperativeHandle(ref, ()=>({ controller }));

    return(<LoadingController
        show={visible}
        loadingText={message}
        backgroundColor={'#323335'}
        indicatorColor={CombinedTheme.colors.accent}
        colorText={CombinedTheme.colors.text}
        borderRadius={8}
    />);
}));