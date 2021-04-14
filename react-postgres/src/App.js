import React from 'react'
import AutomatedTest from './components/ResponseTests/AutomatedTest'


import Navbar from './components/Navbar'
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Results from './components/HistoryPage/History'

const App = () => {
    sessionStorage.setItem('BASE_URL', "https://api.safetyculture.io")

    return(
        <BrowserRouter>
            <Navbar />
            <div style={{ marginTop: 20 }}>
                <Switch>
                    <Route exact path="/">
                        <AutomatedTest />
                    </Route>
                    <Route path="/results_history">
                        <Results />
                    </Route>
                </Switch>
            </div>
        </BrowserRouter>
    )
}

export default App