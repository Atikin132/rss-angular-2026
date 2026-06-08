import { Component, input, linkedSignal } from '@angular/core';

@Component({
  selector: 'app-product-gallery',
  imports: [],
  templateUrl: './product-gallery.html',
  styleUrl: './product-gallery.scss',
})
export class ProductGallery {
  images = input.required<string[]>();

  selectedImage = linkedSignal(() => this.images()[0] ?? '');

  selectImage(image: string): void {
    this.selectedImage.set(image);
  }
}
