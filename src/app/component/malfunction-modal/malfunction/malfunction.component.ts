import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Malfunction } from "../../../model/Malfunction";

@Component({
  selector: 'app-malfunction',
  templateUrl: './malfunction.component.html',
  styleUrls: ['./malfunction.component.scss']
})
export class MalfunctionComponent {
  @Input() malfunction = {} as Malfunction;
  @Output() deleteMalfunctionEmitter: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

  onDeleteMalfunctionClick(malfunctionId: number): void {
    this.deleteMalfunctionEmitter.emit(malfunctionId)
  }
}
