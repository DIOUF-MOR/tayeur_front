import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tayeur',
  templateUrl: './tayeur.component.html',
  styleUrls: ['./tayeur.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
})
export class TayeurComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
