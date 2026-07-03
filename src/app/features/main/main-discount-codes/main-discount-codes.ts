import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/commercetools/commercetools-api.service';
import { DiscountCode } from '../../../core/models/discountcode.model';
import { DiscountCodesResponse } from '../models/discountcodes.response.model';

@Component({
  selector: 'app-main-discount-codes',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './main-discount-codes.html',
  styleUrl: './main-discount-codes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDiscountCodes {
  private readonly api = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);
  discountCodes = signal<DiscountCode[]>([]);

  constructor() {
    this.loadCodes();
  }

  private loadCodes() {
    this.api.request<DiscountCodesResponse>('/discount-codes').then((res) => {
      this.discountCodes.set(res.results.filter((c) => c.isActive));
    });
  }

  copyToClipboard(code: string) {
    navigator.clipboard.writeText(code);
    this.snackBar.open('Copied to clipboard', 'OK', {
      duration: 2000,
    });
  }
}
