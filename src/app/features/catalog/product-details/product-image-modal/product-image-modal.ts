import {
  Component,
  computed,
  HostListener,
  input,
  linkedSignal,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-image-modal',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './product-image-modal.html',
  styleUrl: './product-image-modal.scss',
})
export class ProductImageModal implements OnInit, OnDestroy {
  images = input.required<string[]>();
  startIndex = input.required<number>();

  closed = output<void>();

  currentIndex = linkedSignal(() => this.startIndex());

  currentImage = computed(() => this.images()[this.currentIndex()] ?? '');

  close(): void {
    this.closed.emit();
  }

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  next(): void {
    this.currentIndex.update((index) => (index + 1) % this.images().length);
  }

  previous(): void {
    this.currentIndex.update((index) => (index - 1 + this.images().length) % this.images().length);
  }

  @HostListener('window:keydown.arrowright')
  onRight(): void {
    this.next();
  }

  @HostListener('window:keydown.arrowleft')
  onLeft(): void {
    this.previous();
  }
}
