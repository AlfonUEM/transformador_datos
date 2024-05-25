import React from 'react';

import CreatorUserLayout from "../components/CreatorUserLayout";
import CreatorUser from "../components/CreatorUser";


function CreateUserPage({
                            notificationItems,
                            addNotificationItem,
                            isUserLoggedIn,
                            setIsUserLoggedIn,
                            userLoggedIn,
                            setUserLoggedIn
                        }) {
    return (
        <>
            <CreatorUserLayout
                sectionTitle="Crear Usuario"
                sectionDescription="Registrate como usuario para poder guardar tus propias funciones"
                sectionContent={<CreatorUser/>}
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

export default CreateUserPage;