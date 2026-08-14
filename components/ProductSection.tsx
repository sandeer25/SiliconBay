import React from 'react'
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

type ProductSectionProps = {
    products: Product[];
    section: string;
}

const ProductSection = ({ section, products }: ProductSectionProps) => {
    return (
        <div className="px-8 py-6">
            <h2 className="text-2xl font-bold mb-4">{section}</h2>

            {products.length > 0 ? (
                <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory">
                    {products.map((product) => (
                        <div key={product.id} className="snap-start">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 px-6 py-8 text-sm text-gray-600">
                    No products available right now.
                </div>
            )}
        </div>
    )
}

export default ProductSection
