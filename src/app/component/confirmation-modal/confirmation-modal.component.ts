import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

interface DialogData {
  title: string,
  text: string,
}

export enum DIALOG_RESPONSE {
  NO = 'No',
  YES = 'Yes',
  DISCARD = 'Discard',
  Save = 'Save'
}

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  dialogData: DialogData;
  protected readonly DIALOG_RESPONSE = DIALOG_RESPONSE;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialogData = data;
  }
}
