import React from 'react';
import FunctionCreatorStepsLayout from "../components/FunctionCreatorStepsLayout";
import FunctionCreatorSteps from "../components/FunctionCreatorSteps";


function CreateFunctionPage({
                                notificationItems,
                                addNotificationItem,
                                isUserLoggedIn,
                                setIsUserLoggedIn,
                                userLoggedIn,
                                setUserLoggedIn
                            }) {
    return (
        <>
            <FunctionCreatorStepsLayout

                sectionTitle="Creador de funciones"
                sectionDescription="Crea una nueva función para ser utilizada en el transformador de datos"
                sectionContent={<FunctionCreatorSteps/>}
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

export default CreateFunctionPage;