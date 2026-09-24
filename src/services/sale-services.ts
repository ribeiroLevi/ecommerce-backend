import { SaleProduct } from "../types/sales.js";
import { prisma } from "../database/prisma.js";
import { productRoutes } from "../routes/products-routes.js";

interface CreateSaleService {
  userId: string;
  products: SaleProduct[];
}

export class SaleService {
  async getUserSales(userId: string) {
    const sales = await prisma.sales.findMany({
      where: {
        user_id: userId,
      },
      include: {
        sale_products: {
          include: {
            products: true,
          },
        },
      },
    });

    return sales;
  }

  async listAllSales() {
    const salesDB = await prisma.sales.findMany();
    return salesDB;
  }

  async deleteSale(saleId: string) {
    const sale = await prisma.sales.findUnique({
      where: {
        id: saleId,
      },
    });

    if (!sale) {
      throw new Error("Sale not found");
    }

    await prisma.$transaction(async (tx) => {
      await tx.sale_products.deleteMany({
        where: {
          sale_id: saleId,
        },
      });

      await tx.sales.delete({
        where: {
          id: saleId,
        },
      });
    });
  }

  async executeCreateSale({ userId, products }: CreateSaleService) {
    for (const item of products) {
      const product = await prisma.products.findUnique({
        where: {
          id: item.product_id,
        },
      });

      if (!product) {
        throw new Error("Produto inexistente");
      }

      if (item.quantity > product.quantity) {
        throw new Error("Estoque insuficiente");
      }
    }

    const sale = await prisma.$transaction(async (tx) => {
      const newSale = await tx.sales.create({
        data: {
          user_id: userId,
        },
      });

      for (const item of products) {
        const product = await tx.products.findUnique({
          where: {
            id: item.product_id,
          },
        });

        if (!product) {
          throw new Error("Produto inexistente");
        }

        if (item.quantity > product.quantity) {
          throw new Error("Estoque insuficiente");
        }

        await tx.sale_products.create({
          data: {
            sale_id: newSale.id,
            product_id: product.id,
            price: product.price,
            quantity: item.quantity,
          },
        });

        await tx.products.update({
          where: {
            id: product.id,
          },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newSale;
    });

    return sale;
  }
}
