import { Component, Input } from '@angular/core';
import { Rental } from "../../../model/Rental";

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.scss']
})
export class RentalComponent {
  @Input() rental = {} as Rental;

  constructor() {
  }
}
