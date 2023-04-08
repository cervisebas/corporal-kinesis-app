import { createRef } from "react";
import { StatisticRef } from "./pages/statistics/statistic";
import { ViewModeDetailsRef } from "./pages/pages/viewMoreDetails";
import { EditAccountRef } from "./pages/pages/editAccount";

export const refStatistic = createRef<StatisticRef>();
export const refViewModeDetails = createRef<ViewModeDetailsRef>();
export const refEditAccount = createRef<EditAccountRef>();