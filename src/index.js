import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TestPage from "./pages/TestPage";
import MainPage from "./pages/MainPage";
import {HashRouter, Routes, Route} from "react-router-dom";
import CreateFunctionPage from "./pages/CreateFunctionPage";
import CreateUserPage from "./pages/CreateUserPage";

const App = () => {
    const [items, setItems] = React.useState([]);

    return (
        <React.StrictMode>
            <HashRouter>
                <Routes>
                    <Route path="createFunction" element={<CreateFunctionPage items={items} setItems={setItems}/>}/>
                    <Route path="createUser" element={<CreateUserPage items={items} setItems={setItems}/>}/>
                    <Route path="/" element={<MainPage/>}/>
                </Routes>
            </HashRouter>
        </React.StrictMode>
    );
}

ReactDOM.render(<App/>, document.getElementById('root'));