import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from '@shared/error-modal/error-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    public dialog: MatDialog
  ) { }

  openErrorModal(message: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: message
    });
  }
}
