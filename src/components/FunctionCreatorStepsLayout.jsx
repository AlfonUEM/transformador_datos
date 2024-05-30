import React from 'react';
import {
    AppLayout,
    BreadcrumbGroup,
    Flashbar,
} from '@cloudscape-design/components';
import MainNavBar from "./MainNavBar";


function FunctionCreatorStepsLayout({
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

    const contentWithProp = React.cloneElement(sectionContent, {addNotificationItem});

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
                            {text: 'Crear función', href: '#craeteFunction'},
                        ]}
                    />
                }
                navigationHide={true}
                notifications={<Flashbar items={notificationItems}/>}
                toolsHide={true}
                content={contentWithProp}
                disableContentPaddings={false}
            />
        </>
    );
}

export default FunctionCreatorStepsLayout;