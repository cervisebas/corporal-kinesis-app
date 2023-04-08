import React, { Component } from "react";
import ChangeLog from "./screens/ChangeLog";
import Information from "./screens/information";
import Session from "./screens/session";
import VerifyScreen from "./screens/verify";
import { refChangeLog, refInformation, refSession } from "./ExtraContentsRefs";

type IProps = {
    // Session
    reVerify: ()=>void;

    // Verify
    showVerify: boolean;
    textVerify: string | undefined;
};
type IState = {};

export class ExtraContents extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {};
    }
    render(): React.ReactNode {
        return(<>
            <VerifyScreen
                visible={this.props.showVerify}
                textShow={this.props.textVerify}
            />
            <Session ref={refSession} reVerify={this.props.reVerify} />
            <ChangeLog ref={refChangeLog} />
            <Information ref={refInformation} />
        </>);
    }
}