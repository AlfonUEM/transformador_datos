import React from 'react';
import {
    AppLayout,
    BreadcrumbGroup,

} from '@cloudscape-design/components';
import MainNavBar from "./MainNavBar";


function CreatorUserLayout({
                               sectionTitle,
                               sectionDescription,
                               sectionContent
                           }) {
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
                toolsHide={true}
                content={sectionContent}
                disableContentPaddings={false}
            />
        </>
    );
}

export default CreatorUserLayout;