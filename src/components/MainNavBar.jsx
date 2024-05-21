import TopNavigation from "@cloudscape-design/components/top-navigation";
import React from "react";
import {Box, Button, Modal, FormField, Input} from "@cloudscape-design/components";
import SpaceBetween from "@cloudscape-design/components/space-between";

function MainNavBar() {

    const [visible, setVisible] = React.useState(false);
    const [user, setUser] = React.useState("")
    const [password, setPassword] = React.useState("")

    const cancelModal = () => {
        setVisible(false);
    }
    const confirmModal = () => {
        //añadir función que verifique usuario
        console.log("Se comprueba usuario", user, "y contraseña", password)
        setVisible(false);
        window.location.href = '#';
    }

    const loginClick = (detail) => {
        if (detail.detail.id === 'login') {
            setVisible(true);
        }
    };

    return (
        <>
            <TopNavigation
                identity={{
                    href: "#",
                    title: "Maestro Codificador",
                    logo: {
                        src: "/logo-small-top-navigation.svg",
                        alt: "Maestro Codificador"
                    }
                }}
                utilities={[
                    /*{
                   type: "button",
                   text: "Link",
                   href: "https://example.com/",
                   external: true,
                   externalIconAriaLabel: " (opens in a new tab)"
               },
               {
                   type: "button",
                   iconName: "notification",
                   title: "Notifications",
                   ariaLabel: "Notifications (unread)",
                   badge: true,
                   disableUtilityCollapse: false
               },
               {
                   type: "menu-dropdown",
                   iconName: "settings",
                   ariaLabel: "Settings",
                   title: "Settings",
                   items: [
                       {
                           id: "settings-org",
                           text: "Organizational settings"
                       },
                       {
                           id: "settings-project",
                           text: "Project settings"
                       }
                   ]
               },*/
                    {
                        type: "menu-dropdown",
                        text: "Usuario",
                        description: "Registrese o inicie sesión",
                        iconName: "user-profile",
                        items: [
                            {id: "newaccount", text: "Registrarse", href: "/#createUser"},
                            {id: "login", text: "Iniciar sesión", onItemClick: loginClick},
                        ],
                        onItemClick: loginClick,
                    }
                ]}
            />
            <Modal
                onDismiss={() => setVisible(false)}
                visible={visible}
                header="Inicio sesión"
                closeAriaLabel="Cerrar ventana"
                size="small"
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button variant="link" onClick={cancelModal}>Cancel</Button>
                            <Button variant="primary" onClick={confirmModal}>Ok</Button>
                        </SpaceBetween>
                    </Box>
                }
            >
                <FormField label="Usuario">
                    <Input type="text"
                           value={user}
                           onChange={({detail}) => setUser(detail.value)}/>
                </FormField>
                <FormField label="Contraseña">
                    <Input type="password"
                           value={password}
                           onChange={({detail}) => setPassword(detail.value)}/>
                </FormField>
            </Modal>
        </>
    );
}


export default MainNavBar;