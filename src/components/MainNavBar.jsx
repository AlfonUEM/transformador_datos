import TopNavigation from "@cloudscape-design/components/top-navigation";

function MainNavBar() {
    return (
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
                    text: "Usuario: pepe",
                    description: "pepe@gmail.com",
                    iconName: "user-profile",
                    items: [
                        {id: "profile", text: "Opciones de cuenta"},
                        {id: "newaccount", text: "Registrarse", href: "/#createUser"},
                        {id: "signout", text: "Cerrar sesión"}
                    ]
                }
            ]}
        />
    );
}

export default MainNavBar;