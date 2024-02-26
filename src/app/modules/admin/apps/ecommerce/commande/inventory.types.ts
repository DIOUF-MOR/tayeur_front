export interface InventoryProduct {
    id: string;
    category?: string;
    name: string;
    description?: string;
    tags?: string[];
    sku?: string | null;
    barcode?: string | null;
    brand?: string | null;
    vendor: string | null;
    stock: number;
    reserved: number;
    cost: number;
    basePrice: number;
    taxPercent: number;
    price: number;
    weight: number;
    thumbnail: string;
    images: string[];
    active: boolean;
}

export interface InventoryPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface InventoryCategory {
    id: string;
    parentId: string;
    name: string;
    slug: string;
}

export interface InventoryBrand {
    id: string;
    name: string;
    slug: string;
}

export interface InventoryTag {
    id?: string;
    title?: string;
}

export interface InventoryVendor {
    id: string;
    name: string;
    slug: string;
}

export interface IClient {
    id?: number;
    nomComlet: string;
    name?: string;
    telephone: string;
    type: GenreClient;
    masureHommeDtos?: IMesureHomme[];
    masureFemmeDtos?: IMesureFemme[];
    modelDtos: IModel[];
    commandeDtos: ICommande[]
}

export interface ITayeur {
    id?: number;
    nom: string;
    preNom: string;
    nombreCommandes: number;
    telephone: string;
    email: string;
    password: string;
    commandeDtos?: ICommande[]
}

export interface IModel {
    id?: number;
    nom: string;
    name?: string;
    image: any;
    type: GenreClient;
    commandeDtos?: ICommande[];
}

export interface IMesureFemme {
    id: number
    ceinture: number
    epaul: number
    poitrine: number
    fesse: number
    anche: number
    taille: number
    longueurTailleBasse: number
    longueurTaille: number
    longueurMarignere: number
    longueurRobe: number
    longueurJup: number
    longueurRobeTroisQuart: number
    modelDto: IModel;
}

export interface IMesureHomme {
    id: number
    ceinture: number
    epaul: number
    poitrine: number
    fesse: number
    longueur: number
    coup: number
    cuisse: number
    biceps: number
    poignet: number
    longueurPentallon: number
    bras: number
    modelDto: IModel;
}

export interface ICommande {
    id: number;
    etat: EtatCommande;
    name?: string;
    dateCreation: Date;
    delais: Date;
    prix: number;
    montantVersse: number;
    clientDto: IClient;
    tayeurDto: ITayeur;
    modelDto: IModel;
}

export enum GenreClient {
    HOMME, FEMME
}

export enum TailleModel {
    PETIT_MODEL, GRAND_MODEL
}
export enum EtatCommande {
    NON_PRIS_EN_CHARGE, EN_ATTENTE, PRIS_EN_CHARGE, VALIDE, EN_COURS, TERMINER, LIVRER
}
export interface Pagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}