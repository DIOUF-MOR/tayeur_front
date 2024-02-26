export interface Contact {
    id: string;
    avatar?: string | null;
    background?: string | null;
    name: string;
    emails?: {
        email: string;
        label: string;
    }[];
    phoneNumbers?: {
        country: string;
        phoneNumber: string;
        label: string;
    }[];
    title?: string;
    company?: string;
    birthday?: string | null;
    address?: string | null;
    notes?: string | null;
    tags: string[];
}

export interface Country {
    id: string;
    iso: string;
    name: string;
    code: string;
    flagImagePos: string;
}

export interface Tag {
    id?: string;
    title?: string;
}
export interface Tayeur {
    id?: string;
    nomComplet?: string;
    telelphone?: string;
    email?: string;
    password?: string;
}
export interface Model {
    id?: string;
    nom?: string;
    image?: string;
    type?: string;
}
export interface Client {
    id?: string;
    nomComplet?: string;
    telelphone?: string;
}
export interface Commande {
    id?: string;
    prix?: number;
    date?: Date;
}