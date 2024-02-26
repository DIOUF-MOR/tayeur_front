import { NgIf, NgFor, NgTemplateOutlet, NgClass, AsyncPipe, CurrencyPipe, DOCUMENT, I18nPluralPipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { takeUntil, merge, switchMap, map, Observable, Subject } from 'rxjs';
import { CommandeService } from '../../commande/commande.service';
import { IClient, IModel, ITayeur, ICommande, InventoryProduct, InventoryBrand, InventoryCategory, InventoryTag, InventoryPagination, InventoryVendor } from '../../commande/inventory.types';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ContactsService } from '../../../contacts/contacts.service';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
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
export class ClientListComponent implements OnInit, OnDestroy {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  clients$: Observable<IClient[]>;
  filteredModel: IModel[];
  selectedClient: IClient | null = null;
  filteredTags: InventoryTag[];
  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  pagination: InventoryPagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedProductForm: UntypedFormGroup;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _contactsService: ContactsService,
    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _inventoryService: CommandeService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this._contactsService.sharedVariable = false
    this.clients$ = this._inventoryService.clients$;
    this._inventoryService.getClients().subscribe(t => {

    })
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        switchMap(query =>

          // Search
          this._contactsService.searchContacts(query),
        ),
      )
      .subscribe();

    // Subscribe to MatDrawer opened change
    this.matDrawer.openedChange.subscribe((opened) => {
      if (!opened) {
        // Remove the selected contact when drawer closed
        this.selectedClient = null;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      }
    });
  }




  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  toggleDetails(commId: number): void {
    // If the product is already selected...
    if (this.selectedClient && this.selectedClient.id === commId) {

      // Close the details
      this.closeDetails();
      return;
    }
    this.selectedProductForm.reset();
    // Get the product by id
    this._inventoryService.getClientById(commId)
      .subscribe((product) => {
        // Set the selected product
        this.selectedClient = product;
        // Fill the form
        this.selectedProductForm.patchValue(product);

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

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

  createContact(): void {
    this._contactsService.sharedVariable = true
    // Create the contact
    this._contactsService.createClient().subscribe((newContact) => {

      // Go to the  contact
      this._router.navigate(['./', newContact.id], { relativeTo: this._activatedRoute });

      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }
  /**
    * Close the details
    */
  closeDetails(): void {
    this.selectedClient = null;
  }
}
