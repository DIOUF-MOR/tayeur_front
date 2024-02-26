import { NgIf, NgFor, NgTemplateOutlet, NgClass, AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormArray, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GenreClient, ITayeur } from '../../commande/inventory.types';
import { CommandeService } from '../../commande/commande.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { ListTayeurComponent } from '../list-tayeur/list-tayeur.component';
import { ContactsService } from '../../../contacts/contacts.service';
import { Subject, takeUntil } from 'rxjs';
import { Tayeur } from '../../../contacts/contacts.types';

@Component({
  selector: 'app-new-tayeur',
  templateUrl: './new-tayeur.component.html',
  styleUrls: ['./new-tayeur.component.css'],

  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
  standalone: true,
  imports: [NgIf, MatProgressBarModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe, RouterLink, MatCardModule, MatTooltipModule]
})
export class NewTayeurComponent implements OnInit {

  editMode: boolean = false;
  updated: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  selectedProductForm: FormGroup;
  tayeurs: ITayeur[];
  tayeur: any;
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _fuseConfirmationService: FuseConfirmationService,
    private _tayeurListComponent: ListTayeurComponent,
    private _commandeService: CommandeService,
    private _contactsService: ContactsService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.updated = this._contactsService.sharedVariable
    this._tayeurListComponent.matDrawer.open();

    this.selectedProductForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      preNom: [''],
      nom: [''],
      nombreCommandes: [''],
      telephone: [''],
      email: [''],
      password: [''],
      commandeDtos: this.fb.array([]),
    });
    if (this._contactsService.sharedVariable) {

      // Get the contact
      this._contactsService.tayeur$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((contact: Tayeur) => {
          // Update the selected contact
          this.tayeur = contact;

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });
    } else {

      // Get the contact
      this._commandeService.tayeur$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((contact: ITayeur) => {
          // Open the drawer in case it is closed
          this._tayeurListComponent.matDrawer.open();

          // Get the contact
          this.tayeur = contact;

          // Clear the emails and phoneNumbers form arrays
          (this.selectedProductForm.get('commandeDtos') as UntypedFormArray).clear();

          // Patch values to the form
          this.selectedProductForm.patchValue(contact);

          // Setup the emails form array
          const commandeDtosFormGroups = [];

          if (contact.commandeDtos.length > 0) {
            // Iterate through them
            contact.commandeDtos.forEach((commandeDto) => {
              // Create an email form group
              commandeDtosFormGroups.push(
                this.fb.group({
                  date: [commandeDto.dateCreation],
                  delais: [commandeDto.delais],
                  model: [commandeDto.clientDto.modelDtos],
                  mesures: [commandeDto.clientDto.masureFemmeDtos ? commandeDto.clientDto.type == GenreClient.FEMME : commandeDto.clientDto.masureHommeDtos]

                }),
              );
            });
          }
          else {
            // Create an email form group
            commandeDtosFormGroups.push(
              this.fb.group({
                date: [''],
                delais: [''],
                mesures: [''],
                model: [''],
              }),
            );
          }

          // Add the email form groups to the emails form array
          commandeDtosFormGroups.forEach((emailFormGroup) => {
            (this.selectedProductForm.get('commandeDtos') as UntypedFormArray).push(emailFormGroup);
          });
          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        })
    }

  }

  /**
   * Close the details
   */
  closeDetails(): void {
    this._router.navigate(['./'])
  }
  saveTayeur() {
    const t: ITayeur = {
      preNom: this.selectedProductForm.get('preNom').value,
      nom: this.selectedProductForm.get('nom').value,
      nombreCommandes: this.selectedProductForm.get('nombreCommandes').value,
      telephone: this.selectedProductForm.get('telephone').value,
      email: this.selectedProductForm.get('email').value,
      password: this.selectedProductForm.get('password').value,
      commandeDtos: []
    }
    this._commandeService.createTayeur(t).subscribe(ty => {
      console.log(t);

    })
  }
  updateTayeur() {
    const t: ITayeur = {

      id: this.selectedProductForm.get('id').value,
      preNom: this.selectedProductForm.get('preNom').value,
      nom: this.selectedProductForm.get('nom').value,
      nombreCommandes: this.selectedProductForm.get('nombreCommandes').value,
      telephone: this.selectedProductForm.get('telephone').value,
      email: this.selectedProductForm.get('email').value,
      password: this.selectedProductForm.get('password').value,
      commandeDtos: this.selectedProductForm.get('commandeDtos').value,
    }
    this._commandeService.updateTayeur(this.tayeur.id, t).subscribe(ty => {
      console.log(t);

    })
    
  }
  getFormValues() {
    const nom = this.selectedProductForm.get('preNom').value;
    const preNom = this.selectedProductForm.get('nom').value;
    const nombreCommandes = this.selectedProductForm.get('nombreCommandes').value;
    const telephone = this.selectedProductForm.get('telephone').value;
    const email = this.selectedProductForm.get('email').value;
    const password = this.selectedProductForm.get('password').value;
  }

  toggleEditMode(editMode: boolean | null = null): void {
    if (editMode === null) {
      this.editMode = !this.editMode;
    }
    else {
      this.editMode = editMode;
    }

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }
  /**
       * Close the drawer
       */
  closeDrawer(): Promise<MatDrawerToggleResult> {
    this._contactsService.sharedVariable = false
    return this._tayeurListComponent.matDrawer.close();
  }
}
