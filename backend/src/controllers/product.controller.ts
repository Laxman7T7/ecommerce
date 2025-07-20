import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Product } from "../entity/Product"
import multer from "multer"
import path from "path"
import fs from "fs";
// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/uploads"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})
export const upload = multer({ storage })

// Controller functions

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { sku, name, price } = req.body;

    // Check if SKU already exists
    const existingProduct = await AppDataSource.manager.findOneBy(Product, { sku });
    if (existingProduct) {
      return res.status(400).json({ error: "SKU already exists. Please use a different SKU." });
    }

    const images = req.files ? (req.files as Express.Multer.File[]).map(f => f.filename) : [];

    const product = AppDataSource.manager.create(Product, { sku, name, price, images });
    await AppDataSource.manager.save(product);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product", details: err });
  }
};


export const getAllProducts = async (req: Request, res: Response) => {
  const products = await AppDataSource.manager.find(Product)
  res.json(products)
}

export const getProductById = async (req: Request, res: Response) => {
  const product = await AppDataSource.manager.findOneBy(Product, { id: Number(req.params.id) })
  product ? res.json(product) : res.status(404).json({ message: "Not found" })
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { sku, name, price, replacedImagePaths, deletedImages } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } || {};
    const newImages = files["images"] || [];
    const replacements = files["replacements"] || [];

    const product = await AppDataSource.manager.findOneBy(Product, {
      id: Number(req.params.id),
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    //  Update only provided fields
    if (sku !== undefined) product.sku = sku;
    if (name !== undefined) product.name = name;
    if (price !== undefined && !isNaN(parseFloat(price))) {
      product.price = parseFloat(price);
    }

    let currentImages = product.images || [];

    //  Normalize replacedImagePaths
    const replaced = Array.isArray(replacedImagePaths)
      ? replacedImagePaths
      : replacedImagePaths ? [replacedImagePaths] : [];

    // Handle image replacements
    replaced.forEach((oldImage, index) => {
      const newFile = replacements[index];
      if (oldImage && newFile) {
        const idx = currentImages.indexOf(oldImage);
        if (idx !== -1) {
          const imagePath = path.join(__dirname, "..", "uploads", oldImage);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
          currentImages[idx] = newFile.filename;
        }
      }
    });

    // Normalize deletedImages
    const deleted = Array.isArray(deletedImages)
      ? deletedImages
      : deletedImages ? [deletedImages] : [];

    // Handle deletions
    deleted.forEach((imgName) => {
      const imagePath = path.join(__dirname, "..", "uploads", imgName);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      const index = currentImages.indexOf(imgName);
      if (index !== -1) currentImages.splice(index, 1);
    });

    // Append new images
    if (newImages.length > 0) {
      const newFilenames = newImages.map((file) => file.filename);
      currentImages.push(...newFilenames);
    }

    product.images = currentImages;
    await AppDataSource.manager.save(product);

    res.json(product);
  } catch (err) {
    console.error(" Update error:", err);
    res.status(500).json({ error: "Failed to update product", details: err });
  }
};
export const checkSkuExists = async (req: Request, res: Response) => {
  const { sku } = req.params;
  const productId = req.query.id;

  const existingProduct = await AppDataSource.manager.findOneBy(Product, { sku });

  if (!existingProduct) {
    return res.json({ exists: false });
  }

  if (productId && existingProduct.id === +productId) {
    return res.json({ exists: false });
  }

  return res.json({ exists: true });
};

export const deleteProduct = async (req: Request, res: Response) => {
  await AppDataSource.manager.delete(Product, { id: Number(req.params.id) })
  res.status(204).send()
}
