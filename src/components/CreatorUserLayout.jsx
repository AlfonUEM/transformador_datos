import React from 'react';
import {
    AppLayout,
    BreadcrumbGroup, Flashbar,
} from '@cloudscape-design/components';
import MainNavBar from "./MainNavBar";


function CreatorUserLayout({
                               sectionTitle,
                               sectionDescription,
                               sectionContent,
                               items,
                               setItems,
                           }) {

    const contentWithProp = React.cloneElement(sectionContent, {setItems});

    return (
        <>
            <MainNavBar/>
            <AppLayout
                breadcrumbs={
                    <BreadcrumbGroup
                        items={[
                            {text: 'Transformador de datos', href: '#'},
                            {text: 'Crear Usuario'},
                        ]}
                    />
                }
                navigationHide={true}
                notifications={<Flashbar items={items}/>}
                toolsHide={true}
                content={contentWithProp}
                disableContentPaddings={false}
            />
        </>
    );
}

export default CreatorUserLayout;