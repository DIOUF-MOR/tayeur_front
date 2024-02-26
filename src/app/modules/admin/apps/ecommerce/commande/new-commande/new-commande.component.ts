import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Renderer2, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ICommande, IModel } from '../inventory.types';
import { NgIf, NgFor, NgTemplateOutlet, NgClass, AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fuseAnimations } from '@fuse/animations';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { ContactsService } from '../../../contacts/contacts.service';
import { ListModelComponent } from '../../model/list-model/list-model.component';
import { CommandeService } from '../commande.service';
import { CommandeComponent } from '../commande.component';
import { CommandeListComponent } from '../list/commande.component';

@Component({
  selector: 'app-new-commande',
  templateUrl: './new-commande.component.html',
  styleUrls: ['./new-commande.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
  standalone: true,
  imports: [NgIf, MatProgressBarModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe, RouterLink, MatCardModule, MatButtonModule, NgIf, MatIconModule, MatTooltipModule, NgFor, NgClass, NgTemplateOutlet, RouterLink, DatePipe],
})
export class NewCommandeComponent implements OnInit {
  selectedProductForm: UntypedFormGroup;
  editMode: boolean = false;
  commande: ICommande
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _overlayRef: OverlayRef;
  constructor(
    private _commandeService: CommandeService,
    private fb: FormBuilder,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _commandeListeComonent: CommandeListComponent,
    private _contactsService: ContactsService,
    private _formBuilder: UntypedFormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    private _renderer2: Renderer2,
    private _router: Router,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,) { }

  ngOnInit() {

    this._commandeListeComonent.matDrawer.open();


    this._commandeService.commande$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((task: ICommande) => {
        // Open the drawer in case it is closed
        this._commandeListeComonent.matDrawer.open();

        // Get the task
        this.commande = task;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Listen for NavigationEnd event to focus on the title field

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
  changeUrl(url: string) {
    // Remplacez 'nouvelle-url' par l'URL que vous souhaitez utiliser
    this.router.navigate([url]);
  }

  /**
       * Close the drawer
       */
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._commandeListeComonent.matDrawer.close();
  }

}
