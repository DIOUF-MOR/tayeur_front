import { NgIf, NgFor, NgTemplateOutlet, NgClass, AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, Validators } from '@angular/forms';
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
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ClientListComponent } from '../client-list/client-list.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContactsService } from '../../../contacts/contacts.service';
import { MatTabsModule } from '@angular/material/tabs';
import { Subject, takeUntil } from 'rxjs';
import { Client, Tayeur } from '../../../contacts/contacts.types';
import { ITayeur, GenreClient, IClient } from '../../commande/inventory.types';
import { CommandeService } from '../../commande/commande.service';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css'],

  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
  standalone: true,
  imports: [NgIf, MatProgressBarModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe, RouterLink, MatCardModule, MatTabsModule, MatTooltipModule],
})
export class NewClientComponent implements OnInit {
  selectedProductForm: FormGroup;
  editMode: boolean = false;
  updated: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  clients: IClient[];
  client: any;
  tabModel = [
    {
      nom: 'HOMME'
    },
    {
      nom: 'FEMME'
    },
  ]
  selectedValue: string;
  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    private fb: FormBuilder,
    private _contactsService: ContactsService,
    private _commandeService: CommandeService,
    private _router: Router,
    private _clientListComponent: ClientListComponent,) { }

  ngOnInit() {
    this._clientListComponent.matDrawer.open();
    this.updated = this._contactsService.sharedVariable
    this.selectedProductForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      modelDtos: [[]],
      commandeDtos: this.fb.array([]),
      nomComplet: [''],
      type: [''],
      telephone: [''],
      mesureFemmeDtos: this.fb.group({
        id: [''],
        ceinture: [''],
        epaul: [''],
        poitrine: [''],
        fesse: [''],
        anche: [''],
        taille: [''],
        longueurTailleBasse: [''],
        longueurTaille: [''],
        longueurMarignere: [''],
        longueurRobe: [''],
        longueurJup: [''],
        longueurRobeTroisQuart: [''],
      }),
      mesureHommeDtos: this.fb.group({
        id: [''],
        ceinture: [''],
        epaul: [''],
        poitrine: [''],
        fesse: [''],
        longueur: [''],
        coup: [''],
        cuisse: [''],
        biceps: [''],
        poignet: [''],
        longueurPentallon: [''],
        bras: [''],
      }),
    });
    if (this._contactsService.sharedVariable) {

      // Get the contact
      this._contactsService.client$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((contact: Client) => {
          // Update the selected contact
          this.client = contact;

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });
    } else {

      // Get the contact
      this._commandeService.client$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((contact: IClient) => {
          // Open the drawer in case it is closed
          this._clientListComponent.matDrawer.open();

          // Get the contact
          this.client = contact;

          // Clear the emails and phoneNumbers form arrays
          (this.selectedProductForm.get('commandeDtos') as UntypedFormArray).clear();
          (this.selectedProductForm.get('mesureFemmeDtos') as UntypedFormArray).clear();
          (this.selectedProductForm.get('mesureHommeDtos') as UntypedFormArray).clear();

          // Patch values to the form
          this.selectedProductForm.patchValue(contact);

          // Setup the emails form array
          const commandeDtosFormGroups = [];
          const mesureFemmeDtosFormGroups = [];
          const mesureHommeDtosFormGroups = [];
          if (contact.masureFemmeDtos.length > 0) {
            // Iterate through them
            contact.masureFemmeDtos.forEach((mesureFemmeDto) => {
              // Create an email form group
              mesureFemmeDtosFormGroups.push(
                this.fb.group({
                  ceinture: [mesureFemmeDto.ceinture],
                  epaul: [mesureFemmeDto.epaul],
                  poitrine: [mesureFemmeDto.poitrine],
                  fesse: [mesureFemmeDto.fesse],
                  anche: [mesureFemmeDto.anche],
                  taille: [mesureFemmeDto.taille],
                  longueurTailleBasse: [mesureFemmeDto.longueurTailleBasse],
                  longueurTaille: [mesureFemmeDto.longueurTaille],
                  longueurMarignere: [mesureFemmeDto.longueurMarignere],
                  longueurRobe: [mesureFemmeDto.longueurRobe],
                  longueurJup: [mesureFemmeDto.longueurJup],
                  longueurRobeTroisQuart: [mesureFemmeDto.longueurRobeTroisQuart],
                }),
              );
            });
          } else {
            // Create an email form group
            mesureFemmeDtosFormGroups.push(
              this.fb.group({
                ceinture: [''],
                epaul: [''],
                poitrine: [''],
                fesse: [''],
                anche: [''],
                taille: [''],
                longueurTailleBasse: [''],
                longueurTaille: [''],
                longueurMarignere: [''],
                longueurRobe: [''],
                longueurJup: [''],
                longueurRobeTroisQuart: [''],
              }),
            );
          }
          if (contact.masureHommeDtos.length > 0) {
            // Iterate through them
            contact.masureHommeDtos.forEach((mesureHommeDto) => {
              // Create an email form group
              mesureHommeDtosFormGroups.push(
                this.fb.group({
                  ceinture: [mesureHommeDto.ceinture],
                  epaul: [mesureHommeDto.epaul],
                  poitrine: [mesureHommeDto.poitrine],
                  fesse: [mesureHommeDto.fesse],
                  longueur: [mesureHommeDto.longueur],
                  coup: [mesureHommeDto.coup],
                  cuisse: [mesureHommeDto.cuisse],
                  biceps: [mesureHommeDto.biceps],
                  poignet: [mesureHommeDto.poignet],
                  longueurPentallon: [mesureHommeDto.longueurPentallon],
                  bras: [mesureHommeDto.bras],

                }),
              );
            });
          } else {
            // Create an email form group
            mesureHommeDtosFormGroups.push(
              this.fb.group({
                ceinture: [''],
                epaul: [''],
                poitrine: [''],
                fesse: [''],
                longueur: [''],
                coup: [''],
                cuisse: [''],
                biceps: [''],
                poignet: [''],
                longueurPentallon: [''],
                bras: [''],
              }),
            );
          }

          if (contact.commandeDtos.length > 0) {
            // Iterate through them
            contact.commandeDtos.forEach((commandeDto) => {
              // Create an email form group
              commandeDtosFormGroups.push(
                this.fb.group({
                  date: [commandeDto.dateCreation],
                  delais: [commandeDto.delais],
                  model: [commandeDto.modelDto],
                  tayeurDto: [commandeDto.tayeurDto]

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
                tayeur: [''],
                model: [''],
              }),
            );
          }
          // Add the email form groups to the emails form array
          mesureFemmeDtosFormGroups.forEach((emailFormGroup) => {
            (this.selectedProductForm.get('mesureFemmeDtos') as UntypedFormArray).push(emailFormGroup);
          });
          // Add the email form groups to the emails form array
          mesureHommeDtosFormGroups.forEach((emailFormGroup) => {
            (this.selectedProductForm.get('mesureHommeDtos') as UntypedFormArray).push(emailFormGroup);
          });
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
    * Close the details
    */
  closeDetails(): void {
    this._router.navigate(['./'])
  }
  saveClient() {
    const t: IClient = {
      nomComlet: this.selectedProductForm.get('nomComlet').value,
      telephone: this.selectedProductForm.get('telephone').value,
      type: this.selectedProductForm.get('type').value,
      masureHommeDtos: [],
      masureFemmeDtos: [],
      modelDtos: [],
      commandeDtos: []
    }
    console.log(this.selectedProductForm.get('mesureFemmeDtos').value);

    this._commandeService.createClient(t).subscribe(ty => {
      console.log(t);

    })
  }
  /**
         * Close the drawer
         */
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._clientListComponent.matDrawer.close();
  }
}
