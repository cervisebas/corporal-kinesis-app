import { createRef } from "react";
import { SessionRef } from "./screens/session";
import { ChangeLogRef } from "./screens/ChangeLog";

export const refSession = createRef<SessionRef>();
export const refChangeLog = createRef<ChangeLogRef>();