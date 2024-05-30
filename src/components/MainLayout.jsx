import React from 'react';
import {
    AppLayout,
    BreadcrumbGroup,
    ContentLayout,
    Flashbar,
    Header,
} from '@cloudscape-design/components';
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import MainNavBar from "./MainNavBar";


function MainLayout({
                        sectionTitle,
                        sectionDescription,
                        sectionContent,
                        notificationItems,
                        addNotificationItem,
                        isUserLoggedIn,
                        setIsUserLoggedIn,
                        userLoggedIn,
                        setUserLoggedIn
                    }) {
    return (
        <>
            <MainNavBar isUserLoggedIn={isUserLoggedIn}
                        setIsUserLoggedIn={setIsUserLoggedIn}
                        userLoggedIn={userLoggedIn}
                        setUserLoggedIn={setUserLoggedIn}/>
            <AppLayout
                breadcrumbs={
                    <BreadcrumbGroup
                        items={[
                            {text: 'Transformador de datos', href: '#'},
                        ]}
                    />
                }
                navigationHide={true}
                notifications={<Flashbar items={notificationItems}/>}
                toolsHide={true}
                content={
                    <ContentLayout
                        header={
                            <SpaceBetween size="m">
                                <Header
                                    variant="h1"
                                    description={sectionDescription}
                                    actions={isUserLoggedIn && <Button variant="primary" href="#createFunction">Crear Función</Button>}
                                >
                                    {sectionTitle}
                                </Header>
                            </SpaceBetween>
                        }
                    >
                        {sectionContent}
                    </ContentLayout>
                }
                disableContentPaddings={false}
            />
        </>
    );
}

export default MainLayout;