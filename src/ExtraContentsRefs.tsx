import { createRef } from "react";
import { SessionRef } from "./screens/session";
import { ChangeLogRef } from "./screens/ChangeLog";
import { InformationRef } from "./screens/information";

export const refSession = createRef<SessionRef>();
export const refChangeLog = createRef<ChangeLogRef>();
export const refInformation = createRef<InformationRef>();