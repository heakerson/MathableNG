import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from '@shared/error-modal/error-modal.component';
import { SolutionComponent } from '@shared/solution/solution.component';
import { Solution } from 'src/models/services/math/solution/solution.model';

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

  openSolutionModal(solution: Solution): void {
    const ref = this.dialog.open(SolutionComponent);
    ref.componentInstance.solution = solution;
  }
}
