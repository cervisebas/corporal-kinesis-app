import React from "react";
import ThemeProvider from "./providers/ThemeProvider";
import App from "./App";

export default React.memo(function Index() {
    return(<ThemeProvider>
        <App />
    </ThemeProvider>);
});