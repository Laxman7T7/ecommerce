import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Product } from "../product.model";
import { ProductService } from "../product.service";

@Component({
  selector: "app-product-update",
  templateUrl: "./product-update.component.html",
  styleUrls: ["./product-update.component.css"],
})
export class ProductUpdateComponent implements OnInit {
  product: Product = {
    name: "",
    price: null,
    sku: "",
    images: [],
  };

  selectedImages: File[] = [];
  deletedImages: string[] = [];
  replacementMap: { [oldImage: string]: File } = {};
  newImages: File[] = [];

  skuError: string = "";
  originalSku: string = "";

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get("id");
    this.productService.readById(id).subscribe((product) => {
      this.product = product;
      this.originalSku = product.sku; // to skip checking current SKU
    });
  }

  onDeleteImage(imgName: string) {
    this.deletedImages.push(imgName);
    this.product.images = this.product.images.filter((img) => img !== imgName);
  }

  onReplaceImage(oldImageName: string, event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.replacementMap[oldImageName] = file;
    }
  }

  onImageSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.newImages.push(files[i]);
    }
  }

  triggerFileInput(imageName: string): void {
    const fileInput = document.getElementById(imageName) as HTMLInputElement;
    fileInput?.click();
  }

  checkSkuUniqueness() {
    const sku = this.product.sku.trim();
    if (!sku || sku === this.originalSku) {
      this.skuError = "";
      return;
    }

    this.productService.checkSkuExists(sku).subscribe({
      next: (res) => {
        if (res.exists) {
          this.skuError = "❌ SKU already exists. Please choose another.";
        } else {
          this.skuError = "";
        }
      },
      error: () => {
        this.skuError = "Error validating SKU.";
      },
    });
  }

  updateProduct() {
    if (this.skuError) {
      this.productService.showMessage("❌SKU Already Exist", true);
      return;
    }
    const formData = new FormData();
    formData.append("sku", this.product.sku);
    formData.append("name", this.product.name);
    formData.append("price", this.product.price.toString());

    this.deletedImages.forEach((img) => {
      formData.append("deletedImages[]", img);
    });

    Object.keys(this.replacementMap).forEach((oldImg) => {
      formData.append("replacedImagePaths[]", oldImg);
    });

    Object.values(this.replacementMap).forEach((file) => {
      formData.append("replacements", file);
    });

    this.newImages.forEach((file) => {
      formData.append("images", file);
    });

    this.productService.updateWithImages(this.product.id, formData).subscribe({
      next: () => {
        this.productService.showMessage("✅ Product updated successfully");
        this.router.navigate(["/products"]);
      },
      error: (err) => {
        this.productService.showMessage("❌ Failed to update product", true);
        console.error(err);
      },
    });
  }

  cancel(): void {
    this.router.navigate(["/products"]);
  }
}
