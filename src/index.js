import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TestPage from "./pages/TestPage";
import MainPage from "./pages/MainPage";
import { HashRouter, Routes, Route } from "react-router-dom";
import CreateFunctionPage from "./pages/CreateFunctionPage";

class App extends React.Component {

    render() {
        return (
            <React.StrictMode>
                <HashRouter>
                    <Routes>
                        <Route path="craeteFunction" element={<CreateFunctionPage />} />
                        <Route path="/" element={<MainPage />}/>
                    </Routes>
                </HashRouter>
            </React.StrictMode>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));