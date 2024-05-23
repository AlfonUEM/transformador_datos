import React from 'react';
import {
    AppLayout,
    BreadcrumbGroup,
    ContentLayout,
    Flashbar,
    Header, Link,
} from '@cloudscape-design/components';
import Alert from "@cloudscape-design/components/alert";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import MainNavBar from "./MainNavBar";


function FunctionCreatorStepsLayout({
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
                            {text: 'Crear función', href: '#craeteFunction'},
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
                notifications={<Flashbar items={items}/>}
                /*toolsOpen={true}
                tools={<HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>}*/
                toolsHide={true}
                content={contentWithProp}
                disableContentPaddings={false}
                /*splitPanel={<SplitPanel header="Split panel header">Split panel content</SplitPanel>}*/

            />
        </>
    );
}

export default FunctionCreatorStepsLayout;