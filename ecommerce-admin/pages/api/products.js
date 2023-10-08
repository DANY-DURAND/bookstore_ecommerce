import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
    const { method } = req;
    try {
        await mongooseConnect();
        if (method === 'GET') {
            if (req.query?.id) {
                const product = await Product.findOne({ _id: req.query.id });
                if (!product) {
                    res.status(404).json({ message: 'Product not found' });
                } else {
                    res.json(product);
                }
            } else {
                const products = await Product.find();
                res.json(products);
            }
        }
        if (method === 'POST') {
            const { title, description, price, images} = req.body;
            if (!title || !description || !price) {
                res.status(400).json({ message: 'Missing required fields' });
            } else {
                const productDoc = await Product.create({
                    title,
                    description,
                    price
                });
                res.json(productDoc);
            }
        }

        if (method === 'PUT') {
            const { title, description, price, _id } = req.body;
            await Product.updateOne(
                { _id },
                {
                    title: title,
                    description: description,
                    price: price,
                });
            res.json(true);
        }

        if (method === 'DELETE') {
            if (req.query?.id) {
                await Product.deleteOne({ _id: req.query?.id });
                res.json(true);
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}