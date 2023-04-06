import { createRef } from "react";
import { StatisticRef } from "./pages/statistics/statistic";
import { ViewModeDetailsRef } from "./pages/pages/viewMoreDetails";
import { OptionsRef } from "./pages/pages/options";

export const refStatistic = createRef<StatisticRef>();
export const refViewModeDetails = createRef<ViewModeDetailsRef>();
export const refOptions = createRef<OptionsRef>();