export const environment = {
    production: false,
    hmr: false,
    apiUrl: "http://localhost:4200",
    urlTayeur: "http://localhost:8085/api",
    mockApiUrl: "http://localhost:3000",

    envName: "local",
    keycloak: {
        issuer: "http://10.106.136.126:8080/auth/",
        realm: "Tayeur_app_front",
        clientId: "Tayeur_app_front",
    },
};