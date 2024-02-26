import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, Commande, Contact, Country, Model, Tag, Tayeur } from 'app/modules/admin/apps/contacts/contacts.types';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { IModel, ITayeur } from '../ecommerce/commande/inventory.types';

@Injectable({ providedIn: 'root' })
export class ContactsService {
    // Private
    private _models: BehaviorSubject<Model[] | null> = new BehaviorSubject(null);
    private mode: BehaviorSubject<Boolean | null> = new BehaviorSubject(null);
    private _model: BehaviorSubject<Model | null> = new BehaviorSubject(null);

    private _clients: BehaviorSubject<Client[] | null> = new BehaviorSubject(null);
    private _client: BehaviorSubject<Client | null> = new BehaviorSubject(null);

    private _commandes: BehaviorSubject<Commande[] | null> = new BehaviorSubject(null);
    private _commande: BehaviorSubject<Commande | null> = new BehaviorSubject(null);

    private _tayeurs: BehaviorSubject<Tayeur[] | null> = new BehaviorSubject(null);
    private _tayeur: BehaviorSubject<Tayeur | null> = new BehaviorSubject(null);

    private _contact: BehaviorSubject<Contact | null> = new BehaviorSubject(null);
    private _contacts: BehaviorSubject<Contact[] | null> = new BehaviorSubject(null);
    private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(null);
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);
    sharedVariable: boolean = false;
    refrecheVariable: boolean = false;
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for contact
     */
    get contact$(): Observable<Contact> {
        return this._contact.asObservable();
    }
    /**
   * Getter for commandes
   */
    get commandes$(): Observable<Commande[]> {
        return this._commandes.asObservable();
    }
    get commande$(): Observable<Commande> {
        return this._commande.asObservable();
    }
    /**
   * Getter for clients
   */
    get clients$(): Observable<Client[]> {
        return this._clients.asObservable();
    }
    get client$(): Observable<Client> {
        return this._client.asObservable();
    }
    /**
   * Getter for model
   */
    get model$(): Observable<Model> {
        return this._model.asObservable();
    }
    get models$(): Observable<Model[]> {
        return this._models.asObservable();
    }
    /**
     * Getter for contacts
     */
    get tayeur$(): Observable<Tayeur> {
        return this._tayeur.asObservable();
    }
    get tayeurs$(): Observable<Tayeur[]> {
        return this._tayeurs.asObservable();
    }
    /**
     * Getter for contacts
     */
    get contacts$(): Observable<Contact[]> {
        return this._contacts.asObservable();
    }
    /**
     * Getter for countries
     */
    get countries$(): Observable<Country[]> {
        return this._countries.asObservable();
    }

    /**
     * Getter for tags
     */
    get tags$(): Observable<Tag[]> {
        return this._tags.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get contacts
     */
    getContacts(): Observable<Contact[]> {
        return this._httpClient.get<Contact[]>('api/apps/contacts/all').pipe(
            tap((contacts) => {
                this._contacts.next(contacts);
            }),
        );
    }

    /**
     * Search contacts with given query
     *
     * @param query
     */
    searchContacts(query: string): Observable<Contact[]> {
        return this._httpClient.get<Contact[]>('api/apps/contacts/search', {
            params: { query },
        }).pipe(
            tap((contacts) => {
                this._contacts.next(contacts);
            }),
        );
    }

    /**
     * Get contact by id
     */
    getContactById(id: string): Observable<Contact> {
        return this._contacts.pipe(
            take(1),
            map((contacts) => {
                // Find the contact
                const contact = contacts.find(item => item.id === id) || null;

                // Update the contact
                this._contact.next(contact);

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

    getCommandeById(id: string): Observable<Commande> {
        return this._commandes.pipe(
            take(1),
            map((commandes) => {
                // Find the contact
                const commande = commandes.find(item => item.id === id) || null;

                // Update the contact
                this._commande.next(commande);

                // Return the contact
                return commande;
            }),
            switchMap((commande) => {
                if (!commande) {
                    return throwError('Could not found commande with id of ' + id + '!');
                }

                return of(commande);
            }),
        );
    }
    getClientById(id: string): Observable<Client> {
        return this._clients.pipe(
            take(1),
            map((clients) => {
                // Find the contact
                const client = clients.find(item => item.id === id) || null;

                // Update the contact
                this._client.next(client);

                // Return the contact
                return client;
            }),
            switchMap((client) => {
                if (!client) {
                    return throwError('Could not found client with id of ' + id + '!');
                }

                return of(client);
            }),
        );
    }
    getModelById(id: string): Observable<Model> {
        return this._models.pipe(
            take(1),
            map((models) => {
                // Find the contact
                const model = models.find(item => item.id === id) || null;

                // Update the contact
                this._model.next(model);

                // Return the contact
                return model;
            }),
            switchMap((model) => {
                if (!model) {
                    return throwError('Could not found model with id of ' + id + '!');
                }

                return of(model);
            }),
        );
    }
    getTayeurById(id: string): Observable<Tayeur> {
        return this._tayeurs.pipe(
            take(1),
            map((tayeurs) => {
                // Find the contact
                const tayeur = tayeurs?.find(item => item.id === id) || null;

                // Update the contact
                this._tayeur.next(tayeur);

                // Return the contact
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

    createCommande(): Observable<Commande> {
        return this.commandes$.pipe(
            take(1),
            switchMap(commandes => this._httpClient.post<Commande>('api/apps/contacts/commande', {}).pipe(
                map((newCommande) => {
                    // Update the contacts with the new contact
                    this._commandes.next([newCommande, ...commandes]);

                    // Return the new contact
                    return newCommande;
                }),
            )),
        );
    }
    createClient(): Observable<Client> {
        return this.clients$.pipe(
            take(1),
            switchMap(clients => this._httpClient.post<Client>('api/apps/contacts/client', {}).pipe(
                map((newClient) => {
                    // Update the contacts with the new contact
                    this._clients.next([newClient, ...clients]);

                    // Return the new contact
                    return newClient;
                }),
            )),
        );
    }
    createTayeur(): Observable<Tayeur> {
        return this.tayeurs$.pipe(
            take(1),
            switchMap(tayeurs => this._httpClient.post<Tayeur>('api/apps/contacts/tayeur', {}).pipe(
                map((newTayeur) => {
                    // Update the contacts with the new contact
                    this._tayeurs.next([newTayeur, ...tayeurs]);

                    // Return the new contact
                    return newTayeur;
                }),
            )),
        );
    }
    createModel(): Observable<Model> {
        return this.models$.pipe(
            take(1),
            switchMap(models => this._httpClient.post<Model>('api/apps/contacts/model', {}).pipe(
                map((newModel) => {
                    // Update the contacts with the new contact
                    this._models.next([newModel, ...models]);

                    // Return the new contact
                    return newModel;
                }),
            )),
        );
    }
    /**
     * Create contact
     */
    createContact(): Observable<Contact> {
        return this.contacts$.pipe(
            take(1),

            switchMap(contacts => this._httpClient.post<Contact>('api/apps/contacts/contact', {}).pipe(
                map((newContact) => {
                    // Update the contacts with the new contact
                    this._contacts.next([newContact, ...contacts]);

                    // Return the new contact
                    return newContact;
                }),
            )),
        );
    }

    /**
     * Update contact
     *
     * @param id
     * @param contact
     */
    updateContact(id: string, contact: Contact): Observable<Contact> {
        return this.contacts$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.patch<Contact>('api/apps/contacts/contact', {
                id,
                contact,
            }).pipe(
                map((updatedContact) => {
                    // Find the index of the updated contact
                    const index = contacts.findIndex(item => item.id === id);

                    // Update the contact
                    contacts[index] = updatedContact;

                    // Update the contacts
                    this._contacts.next(contacts);

                    // Return the updated contact
                    return updatedContact;
                }),
                switchMap(updatedContact => this.contact$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {
                        // Update the contact if it's selected
                        this._contact.next(updatedContact);

                        // Return the updated contact
                        return updatedContact;
                    }),
                )),
            )),
        );
    }

    /**
     * Delete the contact
     *
     * @param id
     */
    deleteContact(id: string): Observable<boolean> {
        return this.contacts$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.delete('api/apps/contacts/contact', { params: { id } }).pipe(
                map((isDeleted: boolean) => {
                    // Find the index of the deleted contact
                    const index = contacts.findIndex(item => item.id === id);

                    // Delete the contact
                    contacts.splice(index, 1);

                    // Update the contacts
                    this._contacts.next(contacts);

                    // Return the deleted status
                    return isDeleted;
                }),
            )),
        );
    }

    getClients(): Observable<Client[]> {
        return this._httpClient.get<Client[]>('api/apps/contacts/clients').pipe(
            tap((clients) => {
                this._clients.next(clients);
            }),
        );
    }
    getModels(): Observable<Model[]> {
        return this._httpClient.get<Model[]>('api/apps/contacts/models').pipe(
            tap((models) => {
                this._models.next(models);
            }),
        );
    }
    getCommandes(): Observable<Commande[]> {
        return this._httpClient.get<Commande[]>('api/apps/contacts/commandes').pipe(
            tap((commandes) => {
                this._commandes.next(commandes);
            }),
        );
    }


    getTayeurs(): Observable<Tayeur[]> {
        return this._httpClient.get<Tayeur[]>('api/apps/contacts/tayeurs').pipe(
            tap((tayeurs) => {
                this._tayeurs.next(tayeurs);
            }),
        );
    }


    /**
     * Get countries
     */
    getCountries(): Observable<Country[]> {
        return this._httpClient.get<Country[]>('api/apps/contacts/countries').pipe(
            tap((countries) => {
                this._countries.next(countries);
            }),
        );
    }

    /**
     * Get tags
     */
    getTags(): Observable<Tag[]> {
        return this._httpClient.get<Tag[]>('api/apps/contacts/tags').pipe(
            tap((tags) => {
                this._tags.next(tags);
            }),
        );
    }

    /**
     * Create tag
     *
     * @param tag
     */
    createTag(tag: Tag): Observable<Tag> {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.post<Tag>('api/apps/contacts/tag', { tag }).pipe(
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
     * Update the tag
     *
     * @param id
     * @param tag
     */
    updateTag(id: string, tag: Tag): Observable<Tag> {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.patch<Tag>('api/apps/contacts/tag', {
                id,
                tag,
            }).pipe(
                map((updatedTag) => {
                    // Find the index of the updated tag
                    const index = tags.findIndex(item => item.id === id);

                    // Update the tag
                    tags[index] = updatedTag;

                    // Update the tags
                    this._tags.next(tags);

                    // Return the updated tag
                    return updatedTag;
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
            switchMap(tags => this._httpClient.delete('api/apps/contacts/tag', { params: { id } }).pipe(
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
                switchMap(isDeleted => this.contacts$.pipe(
                    take(1),
                    map((contacts) => {
                        // Iterate through the contacts
                        contacts.forEach((contact) => {
                            const tagIndex = contact.tags.findIndex(tag => tag === id);

                            // If the contact has the tag, remove it
                            if (tagIndex > -1) {
                                contact.tags.splice(tagIndex, 1);
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
     * Update the avatar of the given contact
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: string, avatar: File): Observable<Contact> {
        return this.contacts$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.post<Contact>('api/apps/contacts/avatar', {
                id,
                avatar,
            }, {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': avatar.type,
                },
            }).pipe(
                map((updatedContact) => {
                    // Find the index of the updated contact
                    const index = contacts.findIndex(item => item.id === id);

                    // Update the contact
                    contacts[index] = updatedContact;

                    // Update the contacts
                    this._contacts.next(contacts);

                    // Return the updated contact
                    return updatedContact;
                }),
                switchMap(updatedContact => this.contact$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {
                        // Update the contact if it's selected
                        this._contact.next(updatedContact);

                        // Return the updated contact
                        return updatedContact;
                    }),
                )),
            )),
        );
    }
}
