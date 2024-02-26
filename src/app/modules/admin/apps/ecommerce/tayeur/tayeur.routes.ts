import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from "@angular/router";
import { CommandeService } from "../commande/commande.service";
import { inject } from "@angular/core";
import { TayeurComponent } from "./tayeur.component";
import { ListTayeurComponent } from "./list-tayeur/list-tayeur.component";
import { NewTayeurComponent } from "./new-tayeur/new-tayeur.component";
import { catchError, throwError } from "rxjs";
import { ContactsService } from "../../contacts/contacts.service";
/**
 * Contact resolver
 *
 * @param route
 * @param state
 */
const tayeurBackResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const commandeService = inject(CommandeService);
    const contactsService = inject(ContactsService);
    const router = inject(Router);
    if (contactsService.sharedVariable) {

        return contactsService.getTayeurById(route.paramMap.get('id'))
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
    } else {
        return commandeService.getTayeurById(+route.paramMap.get('id'))
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
    }
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
    component: NewTayeurComponent,
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
    if (!nextState.url.includes('/tayeurs')) {
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
        component: TayeurComponent,
        children: [
            {
                path: '',
                component: ListTayeurComponent,
                resolve: {
                    tayeurs: () => inject(CommandeService).getTayeurs(),
                    tayeurBs: () => inject(ContactsService).getTayeurs(),
                },
                children: [
                    {
                        path: ':id',
                        component: NewTayeurComponent,
                        resolve: {
                            tayeur: tayeurBackResolver,
                            tayeurs: () => inject(CommandeService).getTayeurs(),
                            tayeurBs: () => inject(ContactsService).getTayeurs(),

                        },
                        canDeactivate: [canDeactivateContactsDetails],
                    },

                ]
            },
        ],
    },
] as Routes;