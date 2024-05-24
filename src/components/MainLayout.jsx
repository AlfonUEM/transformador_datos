import React from 'react';
import {
    AppLayout,
    BreadcrumbGroup,
    ContentLayout,
    Flashbar,
    Header, Link, SideNavigation,
} from '@cloudscape-design/components';
import Alert from "@cloudscape-design/components/alert";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import MainNavBar from "./MainNavBar";


function MainLayout({
                        sectionTitle,
                        sectionDescription,
                        sectionContent,
                        notificationItems,
                        addNotificationItem
                    }) {
    return (
        <>
            <MainNavBar/>
            <AppLayout
                breadcrumbs={
                    <BreadcrumbGroup
                        items={[
                            {text: 'Transformador de datos', href: '#'},
                        ]}
                    />
                }
                /*navigation={
                    <SideNavigation
                        header={{
                            href: '#',
                            text: 'Service name',
                        }}
                        items={[{ type: 'link', text: `Page #1`, href: `#` }]}
                    />
                }*/
                navigationHide={true}
                notifications={<Flashbar items={notificationItems}/>}
                /*toolsOpen={true}
                tools={<HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>}*/
                toolsHide={true}
                content={
                    <ContentLayout
                        //disableOverlap
                        header={
                            <SpaceBetween size="m">
                                <Header
                                    variant="h1"
                                    info={<Link>Info</Link>}
                                    description={sectionDescription}
                                    actions={
                                        <Button variant="primary" href="#createFunction">Crear Función</Button>
                                    }
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
                /*splitPanel={<SplitPanel header="Split panel header">Split panel content</SplitPanel>}*/

            />
        </>
    );
}

export default MainLayout;