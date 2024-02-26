import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css'],
  standalone: true,
  imports: [RouterLink, FuseCardComponent]
})
export class AccueilComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  
}
