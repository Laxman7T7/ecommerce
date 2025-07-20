import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  sku!: string

  @Column()
  name!: string

  @Column("decimal")
  price!: number

  @Column("simple-array") // Stores multiple image filenames as comma-separated string
  images!: string[]
}
