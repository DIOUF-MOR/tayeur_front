import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { AccueilComponent } from './modules/admin/apps/ecommerce/accueil/accueil.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'accueil' },

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    //{ path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'example' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        // resolve: {
        //     initialData: initialDataResolver
        // },
        children: [
            // { path: 'accueil', loadChildren: () => import('app/modules/landing/home/home.routes') },
            // {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes')},
            // {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes')},
            // {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes')},
            // {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
            // {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        component: LayoutComponent,
        // resolve: {
        //     initialData: initialDataResolver
        // },
        children: [
            // {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
            // {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes')}
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            { path: 'accueil', component: AccueilComponent, },
            { path: 'commandes', loadChildren: () => import('app/modules/admin/apps/ecommerce/commande/commande.routes') },
            { path: 'clients', loadChildren: () => import('app/modules/admin/apps/ecommerce/client/client.routes') },
            { path: 'models', loadChildren: () => import('app/modules/admin/apps/ecommerce/model/model.routes') },
            { path: 'tayeurs', loadChildren: () => import('app/modules/admin/apps/ecommerce/tayeur/tayeur.routes') },

        ]
    },

    // Admin routes
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            // { path: 'models', loadChildren: () => import('app/modules/admin/apps/ecommerce/ecommerce.routes') },
        ]
    }
];