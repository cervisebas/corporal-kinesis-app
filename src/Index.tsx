import React from "react";
import ThemeProvider from "./providers/ThemeProvider";
import App from "./App";
import 'react-native-gesture-handler';

export default React.memo(function Index() {
    return(<ThemeProvider>
        <App />
    </ThemeProvider>);
});