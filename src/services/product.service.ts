import { AppError } from "../errors/AppError";
import { Prisma } from "../generated/prisma/client";
import { ProductUpdateInput } from "../generated/prisma/models";
import { prisma } from "../libs/prisma";

export const addProduct = async (data: Prisma.ProductCreateInput) => {
    const product = await prisma.product.create({ data });
    if (!product) throw new AppError('Não foi possível adicionar o produto', 400);
    return product;
};

export const getProducts = async () => {
    const products = await prisma.product.findMany({
        orderBy: { name: 'asc' }
    });
    return products;
};

export const getProductById = async (id: string) => {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new AppError('Produto não encontrado', 404);
    return product;
};

export const updateProduct = async (id: string, data: ProductUpdateInput) => {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new AppError('Produto não encontrado', 404);
    const updatedProduct = await prisma.product.update({
        where: { id },
        data
    });
    return updatedProduct;
};

export const removeProduct = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            _count: {
                select: { leads: true }
            }
        }
    });
    if (product) {
        if (product._count.leads > 0) {
            throw new AppError('O produto não pode ser deletado', 400);
        }
        return await prisma.product.delete({ where: { id } });
    } else {
        throw new AppError('Produto não encontrado', 404);
    }
};