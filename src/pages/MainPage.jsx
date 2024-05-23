import React from 'react';
import MainLayout from "../components/MainLayout";
import Transformer from "../components/Transformer";
function MainPage({items,setItems}){
    return (
        <>
            <MainLayout
                sectionTitle="Transformador de datos"
                sectionDescription="Aplica todas las transformaciones que quieras a tu entrada para obtener una salida"
                sectionContent={<Transformer/>}
                items={items}
                setItems={setItems}
            />
        </>
    );
}

export default MainPage;