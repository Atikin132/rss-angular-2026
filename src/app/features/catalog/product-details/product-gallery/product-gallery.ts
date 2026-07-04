import { Component, input, linkedSignal, output } from '@angular/core';

@Component({
  selector: 'app-product-gallery',
  imports: [],
  templateUrl: './product-gallery.html',
  styleUrl: './product-gallery.scss',
})
export class ProductGallery {
  images = input.required<string[]>();
  imageClick = output<number>();

  selectedImage = linkedSignal(() => this.images()[0] ?? '');

  selectImage(image: string): void {
    this.selectedImage.set(image);
  }

  openModal(): void {
    const index = this.images().indexOf(this.selectedImage());
    this.imageClick.emit(index);
  }
}
