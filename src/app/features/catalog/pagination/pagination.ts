import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  currentPage = input.required<number>();
  total = input.required<number>();
  pageSize = input.required<number>();
  loading = input(false);

  pageChange = output<number>();

  totalPages = computed(() => {
    const totalItems = this.total();
    const size = this.pageSize();
    return totalItems > 0 ? Math.ceil(totalItems / size) : 0;
  });

  hasPrevious = computed(() => this.currentPage() > 1);
  hasNext = computed(() => this.currentPage() < this.totalPages());

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage() || this.loading()) {
      return;
    }
    this.pageChange.emit(page);
  }

  previous(): void {
    this.goToPage(this.currentPage() - 1);
  }

  next(): void {
    this.goToPage(this.currentPage() + 1);
  }
}
