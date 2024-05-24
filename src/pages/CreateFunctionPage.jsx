import React from 'react';
import FunctionCreatorStepsLayout from "../components/FunctionCreatorStepsLayout";
import FunctionCreatorSteps from "../components/FunctionCreatorSteps";


function CreateFunctionPage({notificationItems, addNotificationItem}) {
    return (
        <>
            <FunctionCreatorStepsLayout

                sectionTitle="Creador de funciones"
                sectionDescription="Crea una nueva función para ser utilizada en el transformador de datos"
                sectionContent={<FunctionCreatorSteps />}
                notificationItems={notificationItems}
                addNotificationItem={addNotificationItem}
            />
        </>
    );
}

export default CreateFunctionPage;