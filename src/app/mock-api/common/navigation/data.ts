/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'accueil',
        title: 'Accueil',
        type: 'basic',
        icon: 'mat_outline:dashboard',
        link: '/accueil',
    },
    {
        id: 'commande',
        title: 'Commande',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/commandes',
    },
    {
        id: 'client',
        title: 'Client',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/clients',
    },
    {
        id: 'model',
        title: 'Model',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/models',
    },
    {
        id: 'tayeur',
        title: 'Tayeur',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/tayeurs',
    },
];
// export const futuristicNavigation: FuseNavigationItem[] = [
//     {
//         id   : 'example',
//         title: 'Example',
//         type : 'basic',
//         icon : 'heroicons_outline:chart-pie',
//         link : '/example'
//     }
// ];
// export const horizontalNavigation: FuseNavigationItem[] = [
//     {
//         id   : 'example',
//         title: 'Example',
//         type : 'basic',
//         icon : 'heroicons_outline:chart-pie',
//         link : '/example'
//     }
// ];
