import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from "@angular/router";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { ContactsService } from "../../contacts/contacts.service";
import { ModelComponent } from "./model.component";
import { ListModelComponent } from "./list-model/list-model.component";
import { NewModelComponent } from "./new-model/new-model.component";
import { CommandeService } from "../commande/commande.service";
/**
 * Contact resolver
 *
 * @param route
 * @param state
 */
const modelBackResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const commandeService = inject(CommandeService);
    const contactsService = inject(ContactsService);
    const router = inject(Router);
    if (contactsService.sharedVariable) {

        return contactsService.getModelById(route.paramMap.get('id'))
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
        return commandeService.getModelById(+route.paramMap.get('id'))
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
    component: NewModelComponent,
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
    if (!nextState.url.includes('/models')) {
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
        component: ModelComponent,
        children: [
            {
                path: '',
                component: ListModelComponent,
                resolve: {
                    modelsb: () => inject(CommandeService).getModels(),
                    models: () => inject(ContactsService).getModels(),
                },
                children: [
                    {
                        path: ':id',
                        component: NewModelComponent,
                        resolve: {
                            model: modelBackResolver,
                            modelsB: () => inject(CommandeService).getModels(),
                            models: () => inject(ContactsService).getModels(),
                        },
                        canDeactivate: [canDeactivateContactsDetails],
                    },
                ]
            },
        ],
    },
] as Routes;