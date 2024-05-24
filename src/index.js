import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TestPage from "./pages/TestPage";
import MainPage from "./pages/MainPage";
import {HashRouter, Routes, Route} from "react-router-dom";
import CreateFunctionPage from "./pages/CreateFunctionPage";
import CreateUserPage from "./pages/CreateUserPage";
import { v4 as uuidv4 } from 'uuid';

const App = () => {
    const [notificationItems, setNotificationItems] = React.useState([]);
    const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(false);
    const [userLoggedIn, setUserLoggedIn] = React.useState(false);



    function addNotificationItem(item){
        const notificationId = uuidv4()
        let itemWithCancel = {...item,
                                        dismissible: true,
                                        onDismiss:() => setNotificationItems(items =>
                                            items.filter(item => item.id !== notificationId)
                                        ),
                                        dismissLabel: "Cerrar",
                                        id: notificationId}
        setNotificationItems(oldArray => [...oldArray, itemWithCancel]);
    }

    return (
        <React.StrictMode>
            <HashRouter>
                <Routes>
                    <Route path="createFunction" element={<CreateFunctionPage notificationItems={notificationItems} addNotificationItem={addNotificationItem}/>}/>
                    <Route path="createUser" element={<CreateUserPage notificationItems={notificationItems} addNotificationItem={addNotificationItem}/>}/>
                    <Route path="/" element={<MainPage notificationItems={notificationItems} addNotificationItem={addNotificationItem}/>}/>
                </Routes>
            </HashRouter>
        </React.StrictMode>
    );
}

ReactDOM.render(<App/>, document.getElementById('root'));