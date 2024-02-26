import { NgIf, NgFor, NgClass, AsyncPipe, I18nPluralPipe, DOCUMENT, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Subject, takeUntil, Observable, fromEvent, filter } from 'rxjs';
import { CommandeService } from '../../commande/commande.service';
import { IModel, InventoryPagination } from '../../commande/inventory.types';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ContactsService } from '../../../contacts/contacts.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-list-model',
  templateUrl: './list-model.component.html',
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
  imports: [MatSidenavModule, RouterOutlet, NgIf, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink, AsyncPipe, MatPaginatorModule, I18nPluralPipe, FormsModule, NgxPaginationModule, CommonModule, MatProgressSpinnerModule],
})
export class ListModelComponent implements OnInit, OnDestroy {
  pages: number = 1;
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  models$: Observable<IModel[]>;
  models: IModel[];
  filteredModel: IModel[];
  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  pagination: InventoryPagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedProductForm: UntypedFormGroup;
  selectedModel: IModel | null = null;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  unreadCount: number = 0;
  decodedImage: string | null = null;
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

    this._contactsService.sharedVariable = false
    this.models$ = this._inventoryService.getModels();
    this._inventoryService.model$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((contact: IModel) => {
        // Update the selected contact
        this.selectedModel = contact;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Subscribe to MatDrawer opened change
    this.matDrawer.openedChange.subscribe((opened) => {
      if (!opened) {
        // Remove the selected contact when drawer closed
        this.selectedModel = null;
        // Mark for check
        this._changeDetectorRef.markForCheck();

      }
    });
    // Listen for shortcuts
    fromEvent(this._document, 'keydown')
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter<KeyboardEvent>(event =>
          (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
          && (event.key === '/'), // '/'
        ),
      )
      .subscribe(() => {
        this.createModel();
      });
  }
  decodeBase64(base64String: any) {
    return this._inventoryService.decodeBase64(base64String)
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

  createModel(): void {

    this._contactsService.sharedVariable = true
    // Create the contact
    this._contactsService.createModel().subscribe((newContact) => {


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
    this.selectedModel = null;
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
