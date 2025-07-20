import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Product } from "./../product.model";
import { ProductService } from "./../product.service";

@Component({
  selector: "app-product-create",
  templateUrl: "./product-create.component.html",
  styleUrls: ["./product-create.component.css"],
})
export class ProductCreateComponent implements OnInit {
  product: Product = {
    sku: "",
    name: "",
    price: null,
  };

  selectedImages: File[] = [];
  previewUrls: string[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {}

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.selectedImages.push(...files);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
      input.value = "";
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById("imageInput") as HTMLInputElement;
    fileInput?.click();
  }

  createProduct(): void {
    const formData = new FormData();
    formData.append("sku", this.product.sku);
    formData.append("name", this.product.name);
    formData.append("price", this.product.price?.toString() || "0");
    this.selectedImages.forEach((file) => {
      formData.append("images", file, file.name);
    });

    this.productService.createWithImages(formData).subscribe(() => {
      this.productService.showMessage("Product created!");
      this.router.navigate(["/products"]);
    });
  }
skuExists: boolean = false;
skuError: string = "";
checkSkuUniqueness() {
  const sku = this.product.sku.trim();
  if (!sku) {
    this.skuError = "";
    return;
  }

  this.productService.checkSkuExists(sku).subscribe({
    next: (res) => {
      if (res.exists) {
        this.skuError = "SKU already exists. Please choose another.";
        this.productService.showMessage(this.skuError, true);
      } else {
        this.skuError = "";
      }
    },
    error: () => {
      this.skuError = "Error validating SKU.";
      this.productService.showMessage(this.skuError, true); 
    },
  });
}


  cancel(): void {
    this.router.navigate(["/products"]);
  }
}
