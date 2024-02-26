import { NgIf, NgFor, NgTemplateOutlet, NgClass, AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
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
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CommandeService } from '../../commande/commande.service';
import { GenreClient, IModel } from '../../commande/inventory.types';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Subject, connect, filter, takeUntil } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';
import { ContactsService } from '../../../contacts/contacts.service';
import { ContactsListComponent } from '../../../contacts/list/list.component';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { ListModelComponent } from '../list-model/list-model.component';
import { Model } from '../../../contacts/contacts.types';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-new-model',
  templateUrl: './new-model.component.html',
  styleUrls: ['./new-model.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
  standalone: true,
  imports: [NgIf, MatProgressBarModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe, RouterLink, MatCardModule, MatButtonModule, NgIf, MatIconModule, MatTooltipModule, NgFor, NgClass, NgTemplateOutlet, RouterLink, DatePipe],
})
export class NewModelComponent implements OnInit, OnDestroy {
  selectedProductForm: UntypedFormGroup;
  editMode: boolean = false;
  model: any
  tabModel = [
    {
      id: 1,
      name: 'HOMME'
    },
    {
      id: 2,
      name: 'FEMME'
    },
  ]
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _overlayRef: OverlayRef;
  constructor(
    private _commandeService: CommandeService,
    private fb: FormBuilder,
    private router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private _modelListComponent: ListModelComponent,
    private _contactsService: ContactsService,
    private _httpClient: HttpClient) { }

  selectedImage: string | ArrayBuffer | null = null;
  updated: boolean;
  file: File | null = null;
  type: GenreClient;
  id: number
  nom: string;
  myFile: boolean = false
  onFileSelected(event: any): void {
    this.myFile = true
    const file = event.target.files[0] as File;
    this.file = file
    if (file) {
      this.readImage(file);
    }
  }
  readImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImage = e.target?.result;
    };
    reader.readAsDataURL(file);
  }
  ngOnInit() {
    this.updated = this._contactsService.sharedVariable
    this._modelListComponent.matDrawer.open();
    this.selectedProductForm = this.fb.group({

      id: [''],
      name: ['', [Validators.required]],
      nom: [''],
      type: [''],
      image: [''],
      commandeDtos: this.fb.array([]),
    });
    if (this._contactsService.sharedVariable) {
      this._contactsService.model$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((contact: Model) => {
          this.model = contact;
          this._changeDetectorRef.markForCheck();
        });
    } else {
      this._commandeService.model$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((contact: IModel) => {
          this._modelListComponent.matDrawer.open();
          this.selectedImage = this.decodeBase64(contact.image)
          if (!this.myFile) {
            this.file = null
            this._httpClient.get(this.decodeBase64(contact.image), { responseType: 'blob' })
              .subscribe(blob => {
                this.file = new File([blob], 'filename.txt', { type: 'application/octet-stream' });
              });

          }
          this.model = contact;
          (this.selectedProductForm.get('commandeDtos') as UntypedFormArray).clear();
          this.selectedProductForm.patchValue(contact);
          const commandeDtosFormGroups = [];
          if (contact.commandeDtos.length > 0) {
            contact.commandeDtos.forEach((commandeDto) => {
              commandeDtosFormGroups.push(
                this.fb.group({
                  date: [commandeDto.dateCreation],
                  delais: [commandeDto.delais],
                  tayeur: [commandeDto.tayeurDto],
                  mesures: [commandeDto.clientDto.masureFemmeDtos ? commandeDto.clientDto.type == GenreClient.FEMME : commandeDto.clientDto.masureHommeDtos]

                }),
              );
            });
          }
          else {
            commandeDtosFormGroups.push(
              this.fb.group({
                date: [''],
                delais: [''],
                mesures: [''],
                tayeur: [''],
              }),
            );
          }
          commandeDtosFormGroups.forEach((emailFormGroup) => {
            (this.selectedProductForm.get('commandeDtos') as UntypedFormArray).push(emailFormGroup);
          });
          this.toggleEditMode(false);
          this._changeDetectorRef.markForCheck();
        })
    }
  }
  decodeBase64(base64String: any) {
    return this._commandeService.decodeBase64(base64String)
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
    this.router.navigate([url]);
    // Remplacez 'nouvelle-url' par l'URL que vous souhaitez utiliser
  }

  onFileSelectedSave(): void {
    this.type = this.selectedProductForm.get('type').value
    this.nom = this.selectedProductForm.get('nom').value
    if (this.file) {
      this._commandeService.saveModel(this.file, this.type, this.nom)
        .subscribe(response => {
          console.log(response);  // Handle the response as needed
        }, error => {
          console.error(error);  // Handle the error
        });
    }
    this.changeUrl('/models')
  }

  updateModel(): void {
    this.type = this.selectedProductForm.get('type').value
    this.nom = this.selectedProductForm.get('nom').value
    this.id = this.selectedProductForm.get('id').value
    this._commandeService.updateModel(this.id, this.file, this.type, this.nom)
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.error(error);
      });

    this._contactsService.refrecheVariable = true
    this.changeUrl('/models')
  }

  encodeToBase64(text: string): string {
    try {
      const base64String = btoa(text);
      return base64String;
    } catch (error) {
      console.error('Error encoding to Base64: ', error);
      return null; // Gérer l'erreur selon vos besoins
    }
  }
  closeDrawer(): Promise<MatDrawerToggleResult> {
    this._contactsService.sharedVariable = false
    return this._modelListComponent.matDrawer.close();
  }
}
