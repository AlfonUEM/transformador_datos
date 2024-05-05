import React from 'react';

import CreatorUserLayout from "../components/CreatorUserLayout";
import CreatorUser from "../components/CreatorUser";

function CreateUserPage() {
    return (
        <>
            <CreatorUserLayout
                sectionTitle="Crear Usuario"
                sectionDescription="Registrate como usuario para poder guardar tus propias funciones"
                sectionContent={<CreatorUser/>}
            />
        </>
    );
}

export default CreateUserPage;