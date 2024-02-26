import { AsyncPipe, CurrencyPipe, DOCUMENT, I18nPluralPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { CommandeService } from 'app/modules/admin/apps/ecommerce/commande/commande.service';
import { IClient, ICommande, IMesureFemme, IMesureHomme, IModel, ITayeur, InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/admin/apps/ecommerce/commande/inventory.types';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ContactsService } from '../../../contacts/contacts.service';

@Component({
    selector: 'commande-list',
    templateUrl: './commande.component.html',
    styles: [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
                }
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatSidenavModule, RouterOutlet, NgIf, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink, AsyncPipe, I18nPluralPipe],
})
export class CommandeListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    commandes$: Observable<ICommande[]>;
    commandes: ICommande[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProductForm: UntypedFormGroup;
    selectedCommande: ICommande | null = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    unreadCount: number = 0;
    private _overlayRef: OverlayRef;
    /**
     * Constructor
     */
    constructor(

        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsService: ContactsService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _inventoryService: CommandeService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit() {
        this.selectedProductForm = this.fb.group({

            id: [''],
            name: ['', [Validators.required]],
            nom: [''],
            image: [''],
            type: [''],

        });
        this.commandes$ = this._inventoryService.getCommandes();
        this._inventoryService.getCommandes().subscribe(mod => {
            console.log(mod);
            this._changeDetectorRef.markForCheck();
        });
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        // Dispose the overlay
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
    }
    /**
           * On backdrop clicked
           */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    createCommande(): void {
        // Create the contact
        this._contactsService.createCommande().subscribe((newContact) => {


            // Go to the new contact
            this._router.navigate(['./', newContact.id], { relativeTo: this._activatedRoute });

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
      * Close the details
      */
    closeDetails(): void {
        this.selectedCommande = null;
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    toggleDetails(commId: number): void {
        // If the product is already selected...
        if (this.selectedCommande && this.selectedCommande.id === commId) {

            // Close the details
            this.closeDetails();
            return;
        }
        this.selectedProductForm.reset();
        // Get the product by id
        this._inventoryService.getCommandeById(commId)
            .subscribe((product) => {
                // Set the selected product
                this.selectedCommande = product;
                // Fill the form
                this.selectedProductForm.patchValue(product);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

    }
}
