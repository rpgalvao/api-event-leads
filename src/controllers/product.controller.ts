import { RequestHandler } from "express";
import * as ProductService from "../services/product.service";
import { addProductSchema, getProductSchema, updateProductSchema } from "../validators/product.validator";
import { AppError } from "../errors/AppError";
import { id } from "zod/v4/locales";

export const addProduct: RequestHandler = async (req, res) => {
    const data = addProductSchema.parse(req.body);
    const product = await ProductService.addProduct(data);
    res.status(201).json({ success: true, data: product });
};

export const listProducts: RequestHandler = async (req, res) => {
    const products = await ProductService.getProducts();
    res.status(200).json({ success: true, data: products });
};

export const getProduct: RequestHandler = async (req, res) => {
    const { id } = getProductSchema.parse(req.params);
    const product = await ProductService.getProductById(id);
    res.status(200).json({ success: true, data: product });
};

export const updateProduct: RequestHandler = async (req, res) => {
    const data = updateProductSchema.parse(req.body);
    const { id } = getProductSchema.parse(req.params);
    if (!id) throw new AppError('ID do produto não informado', 400);
    const product = await ProductService.updateProduct(id as string, data);
    res.status(200).json({ success: true, message: 'Produto atualizado com sucesso!', data: product });
};

export const removeProduct: RequestHandler = async (req, res) => {
    const { id } = getProductSchema.parse(req.params);
    await ProductService.removeProduct(id);
    res.status(200).json({ success: true, message: 'Produto deletado com sucesso!' });
};