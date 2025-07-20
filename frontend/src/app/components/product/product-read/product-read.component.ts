import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from './../product.service';
import { Product } from './../product.model';

@Component({
  selector: 'app-product-read',
  templateUrl: './product-read.component.html',
  styleUrls: ['./product-read.component.css']
})
export class ProductReadComponent implements OnInit {

  dataSource = new MatTableDataSource<Product>();
  displayedColumns = ['id', 'sku','name', 'price', 'images','action'];
  currentImageIndex: { [productId: number]: number } = {};

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.read().subscribe(products => {
      this.dataSource.data = products;
      products.forEach(product => {
        this.currentImageIndex[product.id] = 0;
      });
    });
  }

  getCurrentImage(product: Product): string {
    const index = this.currentImageIndex[product.id] ?? 0;
    return product.images?.[index];
  }

  prevImage(product: Product): void {
    const total = product.images?.length || 0;
    if (!total) return;
    const currentIndex = this.currentImageIndex[product.id] ?? 0;
    this.currentImageIndex[product.id] = (currentIndex - 1 + total) % total;
  }

  nextImage(product: Product): void {
    const total = product.images?.length || 0;
    if (!total) return;
    const currentIndex = this.currentImageIndex[product.id] ?? 0;
    this.currentImageIndex[product.id] = (currentIndex + 1) % total;
  }
}
