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
                    text: "Usuario",
                    description: "Registrese o inicie sesión",
                    iconName: "user-profile",
                    items: [
                        {id: "newaccount", text: "Registrarse", href: "/#createUser"},
                        {id: "login", text: "Iniciar sesión"}
                    ]
                }
            ]}
        />
    );
}

export default MainNavBar;