import { inject } from "@angular/core";
import { ContactsService } from "../../contacts/contacts.service";
import { ClientListComponent } from "./client-list/client-list.component";
import { ClientComponent } from "./client.component";
import { NewClientComponent } from "./new-client/new-client.component";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Routes } from "@angular/router";
import { catchError, throwError } from "rxjs";

const clientResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const contactsService = inject(ContactsService);
    const router = inject(Router);

    return contactsService.getClientById(route.paramMap.get('id'))
        .pipe(
            // Error here means the requested contact is not available
            catchError((error) => {
                // Log the error
                console.error(error);

                // Get the parent url
                const parentUrl = state.url.split('/').slice(0, -1).join('/');

                // Navigate to there
                router.navigateByUrl(parentUrl);

                // Throw an error
                return throwError(error);
            }),
        );
};

/**
 * Can deactivate contacts details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateContactsDetails = (
    component: NewClientComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/contacts'
    // it means we are navigating away from the
    // contacts app
    if (!nextState.url.includes('/clients')) {
        // Let it navigate
        return true;
    }

    // If we are navigating to another contact...
    if (nextRoute.paramMap.get('id')) {
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};
export default [
    {
        path: '',
        component: ClientComponent,
        children: [
            {
                path: '',
                component: ClientListComponent,
                resolve: {
                    clients: () => inject(ContactsService).getClients(),
                },
                children: [
                    {
                        path: ':id',
                        component: NewClientComponent,
                        resolve: {
                            client: clientResolver,
                            clients: () => inject(ContactsService).getClients(),
                        },
                        canDeactivate: [canDeactivateContactsDetails],
                    },
                ]
            },
        ],
    },
] as Routes;