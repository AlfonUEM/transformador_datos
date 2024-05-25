import React from 'react';
import MainLayout from "../components/MainLayout";
import Transformer from "../components/Transformer";

function MainPage({
                      notificationItems,
                      addNotificationItem,
                      isUserLoggedIn,
                      setIsUserLoggedIn,
                      userLoggedIn,
                      setUserLoggedIn
                  }) {
    return (
        <>
            <MainLayout
                sectionTitle="Transformador de datos"
                sectionDescription="Aplica todas las transformaciones que quieras a tu entrada para obtener una salida"
                sectionContent={<Transformer/>}
                notificationItems={notificationItems}
                addNotificationItem={addNotificationItem}
                isUserLoggedIn={isUserLoggedIn}
                setIsUserLoggedIn={setIsUserLoggedIn}
                userLoggedIn={userLoggedIn}
                setUserLoggedIn={setUserLoggedIn}
            />
        </>
    );
}

export default MainPage;