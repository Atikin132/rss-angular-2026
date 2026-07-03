import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MainCategoryNavigation } from '../main-category-navigation/main-category-navigation';
import { MainPageNavigation } from '../main-page-navigation/main-page-navigation';
import { MainDiscountCodes } from '../main-discount-codes/main-discount-codes';
import { MainNewArrivals } from '../main-new-arrivals/main-new-arrivals';

@Component({
  selector: 'app-main.page',
  imports: [MainCategoryNavigation, MainPageNavigation, MainDiscountCodes, MainNewArrivals],
  templateUrl: './main.page.html',
  styleUrl: './main.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPage {}
