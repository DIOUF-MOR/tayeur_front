import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenreClient, IClient, ICommande, IMesureFemme, IMesureHomme, IModel, ITayeur, InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor, Pagination } from 'app/modules/admin/apps/ecommerce/commande/inventory.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, catchError, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { IMember } from '../../scrumboard/scrumboard.types';
const CLIENT_ROUTE = environment.urlTayeur + "/clients";
const COMMANDE_ROUTE = environment.urlTayeur + "/commandes";
const MODEL_ROUTE = environment.urlTayeur + "/models";
const TAYEUR_ROUTE = environment.urlTayeur + "/tayeurs";
const MESURE_HOMME_ROUTE = environment.urlTayeur + "/mesurehommes";
const MESURE_FEMME_ROUTE = environment.urlTayeur + "/mesurefemmes";

@Injectable({ providedIn: 'root' })
export class CommandeService {
    // Private
    private _clients: BehaviorSubject<IClient[] | null> = new BehaviorSubject(null);
    private _client: BehaviorSubject<IClient | null> = new BehaviorSubject(null);
    private _commandes: BehaviorSubject<ICommande[] | null> = new BehaviorSubject(null);
    private _commande: BehaviorSubject<ICommande | null> = new BehaviorSubject(null);
    private _tayeurs: BehaviorSubject<ITayeur[] | null> = new BehaviorSubject(null);
    private _tayeur: BehaviorSubject<ITayeur | null> = new BehaviorSubject(null);
    private _models: BehaviorSubject<IModel[] | null> = new BehaviorSubject(null);
    private _model: BehaviorSubject<IModel | null> = new BehaviorSubject(null);
    private _mesureHommes: BehaviorSubject<IMesureHomme[] | null> = new BehaviorSubject(null);
    private _mesureHomme: BehaviorSubject<IMesureHomme | null> = new BehaviorSubject(null);
    private _mesureFemmes: BehaviorSubject<IMesureFemme[] | null> = new BehaviorSubject(null);
    private _mesureFemme: BehaviorSubject<IMesureFemme | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    private _brands: BehaviorSubject<InventoryBrand[] | null> = new BehaviorSubject(null);
    private _categories: BehaviorSubject<InventoryCategory[] | null> = new BehaviorSubject(null);
    private _product: BehaviorSubject<InventoryProduct | null> = new BehaviorSubject(null);
    private _products: BehaviorSubject<InventoryProduct[] | null> = new BehaviorSubject(null);
    private _tags: BehaviorSubject<InventoryTag[] | null> = new BehaviorSubject(null);
    private _vendors: BehaviorSubject<InventoryVendor[] | null> = new BehaviorSubject(null);

    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    setLoading(value: boolean): void {
        this.loadingSubject.next(value);
    }

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }
    get clients$(): Observable<IClient[]> {
        return this._clients.asObservable();
    }
    get client$(): Observable<IClient> {
        return this._client.asObservable();
    }
    get commandes$(): Observable<ICommande[]> {
        return this._commandes.asObservable();
    }
    get commande$(): Observable<ICommande> {
        return this._commande.asObservable();
    }
    get tayeurs$(): Observable<ITayeur[]> {
        return this._tayeurs.asObservable();
    }
    get tayeur$(): Observable<ITayeur> {
        return this._tayeur.asObservable();
    }
    get models$(): Observable<IModel[]> {
        return this._models.asObservable();
    }
    get model$(): Observable<IModel> {
        return this._model.asObservable();
    }
    get mesureHommes$(): Observable<IMesureHomme[]> {
        return this._mesureHommes.asObservable();
    }
    get mesureFemmes$(): Observable<IMesureFemme[]> {
        return this._mesureFemmes.asObservable();
    }
    /**
     * Getter for brands
     */
    get brands$(): Observable<InventoryBrand[]> {
        return this._brands.asObservable();
    }
    get categories$(): Observable<InventoryCategory[]> {
        return this._categories.asObservable();
    }
    get pagination$(): Observable<InventoryPagination> {
        return this._pagination.asObservable();
    }
    get product$(): Observable<InventoryProduct> {
        return this._product.asObservable();
    }
    get products$(): Observable<InventoryProduct[]> {
        return this._products.asObservable();
    }
    get tags$(): Observable<InventoryTag[]> {
        return this._tags.asObservable();
    }
    get vendors$(): Observable<InventoryVendor[]> {
        return this._vendors.asObservable();
    }

    getClients(): Observable<IClient[]> {
        return this._httpClient.get<IClient[]>(`${CLIENT_ROUTE}/list`).pipe(
            tap((clients) => {
                this._clients.next(clients);
            }),
        );
    }
    getCommandes(): Observable<ICommande[]> {
        return this._httpClient.get<ICommande[]>(`${COMMANDE_ROUTE}/list`).pipe(
            tap((commandes) => {
                console.log(commandes);

                this._commandes.next(commandes);
            }),
        );
    }
    getCommandeById(id: number): Observable<ICommande> {
        return this._httpClient.get<ICommande>(`${COMMANDE_ROUTE}/${id}`).pipe(
            tap((commande) => {
                this._commande.next(commande);
            }),
        );
    }
    getClientById(id: number): Observable<IClient> {
        return this._httpClient.get<IClient>(`${CLIENT_ROUTE}/${id}`).pipe(
            tap((commande) => {
                this._client.next(commande);
            }),
        );
    }
    getModelById(id: number): Observable<IModel> {
        return this._models.pipe(
            take(1),
            map((contacts) => {
                // Find the contact
                const contact = contacts.find(item => item.id === id) || null;

                // Update the contact
                this._model.next(contact);

                // Return the contact
                return contact;
            }),
            switchMap((contact) => {
                if (!contact) {
                    return throwError('Could not found contact with id of ' + id + '!');
                }

                return of(contact);
            }),
        );
    }
    getTayeurById(id: number): Observable<ITayeur> {
        return this._tayeurs.pipe(
            take(1),
            map((tayeurs) => {
                // Find the contact
                const tayeur = tayeurs.find(item => item.id === id) || null;

                // Update the tayeur
                this._tayeur.next(tayeur);

                // Return the tayeur
                return tayeur;
            }),
            switchMap((tayeur) => {
                if (!tayeur) {
                    return throwError('Could not found tayeur with id of ' + id + '!');
                }

                return of(tayeur);
            }),
        );
    }
    getModels(): Observable<IModel[]> {
        return this._httpClient.get<IModel[]>(`${MODEL_ROUTE}/list`).pipe(
            tap((models) => {
                this._models.next(models);
            }),
        );;
    }
    getMesureHommes(): Observable<IMesureHomme[]> {
        return this._httpClient.get<IMesureHomme[]>(`${MESURE_HOMME_ROUTE}/list`);
    }
    getMesureFemmes(): Observable<IMesureFemme[]> {
        return this._httpClient.get<IMesureFemme[]>(`${MESURE_FEMME_ROUTE}/list`);
    }
    getTayeurs(): Observable<ITayeur[]> {
        return this._httpClient.get<ITayeur[]>(`${TAYEUR_ROUTE}/list`).pipe(
            tap((tayeurs) => {
                this._tayeurs.next(tayeurs);
            }),
        );;
    }

    saveModel(file: File, type: GenreClient, nom: string): Observable<string> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type.toString());
        formData.append('nom', nom);

        return this._httpClient.post<string>(`${MODEL_ROUTE}/add`, formData)
    }
    updateModel(id: number, file: File, type: GenreClient, nom: string): Observable<string> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type.toString());
        formData.append('nom', nom);
        // Ajoutez l'identifiant du modèle à la requête
        formData.append('id', id.toString());
        console.log(id);

        return this._httpClient.put<string>(`${MODEL_ROUTE}/update/${id}`, formData)
    }
    /**
        * Create contact
        */
    createModel(model: IModel): Observable<IModel> {
        return this._httpClient.post<IModel>(`${MODEL_ROUTE}/add`, model)
    }
    createClient(client: IClient): Observable<IClient> {
        return this._httpClient.post<IClient>(`${CLIENT_ROUTE}/add`, client)
    }
    /**
     * create tayeur
     */
    updateTayeur(id: number, tayeur: ITayeur): Observable<ITayeur> {
        console.log(tayeur);

        return this._httpClient.put<ITayeur>(`${TAYEUR_ROUTE}/update/${id}`, tayeur)
    }

    createTayeur(tayeur: ITayeur): Observable<ITayeur> {

        return this._httpClient.post<ITayeur>(`${TAYEUR_ROUTE}/add`, tayeur)
    }
    /**
     * Create product
     */
    createCommande(commande: ICommande): Observable<ICommande> {
        return this._httpClient.post<ICommande>(`${COMMANDE_ROUTE}/add`, commande)
    }

    /**
     * Update product
     *
     * @param id
     * @param product
     */
    updateCommande(id: number, product: ICommande): Observable<ICommande> {
        return this._httpClient.put<ICommande>(`${COMMANDE_ROUTE}/update/${id}`, product)
    }

    /**
     * Delete the product
     *
     * @param id
     */
    deleteProduct(id: string): Observable<boolean> {
        return this.products$.pipe(
            take(1),
            switchMap(products => this._httpClient.delete('api/apps/ecommerce/inventory/product', { params: { id } }).pipe(
                map((isDeleted: boolean) => {
                    // Find the index of the deleted product
                    const index = products.findIndex(item => item.id === id);

                    // Delete the product
                    products.splice(index, 1);

                    // Update the products
                    this._products.next(products);

                    // Return the deleted status
                    return isDeleted;
                }),
            )),
        );
    }



    /**
     * Create tag
     *
     * @param tag
     */
    createTag(tag: InventoryTag): Observable<InventoryTag> {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.post<InventoryTag>('api/apps/ecommerce/inventory/tag', { tag }).pipe(
                map((newTag) => {
                    // Update the tags with the new tag
                    this._tags.next([...tags, newTag]);

                    // Return new tag from observable
                    return newTag;
                }),
            )),
        );
    }



    /**
     * Delete the tag
     *
     * @param id
     */
    deleteTag(id: string): Observable<boolean> {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.delete('api/apps/ecommerce/inventory/tag', { params: { id } }).pipe(
                map((isDeleted: boolean) => {
                    // Find the index of the deleted tag
                    const index = tags.findIndex(item => item.id === id);

                    // Delete the tag
                    tags.splice(index, 1);

                    // Update the tags
                    this._tags.next(tags);

                    // Return the deleted status
                    return isDeleted;
                }),
                filter(isDeleted => isDeleted),
                switchMap(isDeleted => this.products$.pipe(
                    take(1),
                    map((products) => {
                        // Iterate through the contacts
                        products.forEach((product) => {
                            const tagIndex = product.tags.findIndex(tag => tag === id);

                            // If the contact has the tag, remove it
                            if (tagIndex > -1) {
                                product.tags.splice(tagIndex, 1);
                            }
                        });

                        // Return the deleted status
                        return isDeleted;
                    }),
                )),
            )),
        );
    }

    /**
     * Get vendors
     */
    getVendors(): Observable<InventoryVendor[]> {
        return this._httpClient.get<InventoryVendor[]>('api/apps/ecommerce/inventory/vendors').pipe(
            tap((vendors) => {
                this._vendors.next(vendors);
            }),
        );
    }
    decodeBase64(base64String: any) {
        try {
            const binaryString = atob(base64String);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);

            for (let i = 0; i < len; ++i) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            const blob = new Blob([bytes], { type: 'image/*' });
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Error decoding Base64: ', error);
        }
    }

}
