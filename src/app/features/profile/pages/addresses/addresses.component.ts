import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-addresses',
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.scss',
})
export class AddressesComponent {
  isEditMode = signal(false);

  editAddress(): void {
    this.isEditMode.set(true);
  }

  saveAddress(): void {
    this.isEditMode.set(false);
  }

  cancelEdit(): void {
    this.isEditMode.set(false);
  }
}
