"use client";

import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import BreadcrumbSection from '@/components/BreadcrumbSection';
import ProductImageGallery from '@/components/ProductImageGallery';
import StarRating from '@/components/StarRating';
import ProductSection from '@/components/ProductSection';
import RatingBreakdown from '@/components/RatingBreakdown';
import ReviewFilter from '@/components/ReviewFilter';
import { Input } from '@/components/ui/input';
import { productService } from '@/lib/services/productService';
import ProductActions from '@/components/ProductActions';
import { Product } from '@/types/product';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

const normalizeProduct = (source: Product | null): Product | null => {
    if (!source) {
        return null;
    }

    const availableQty = Number(source.availableQty ?? source.stock ?? 0);
    const price = Number(source.price ?? 0);

    return {
        ...source,
        brand: source.brand ?? source.manufacturerName ?? source.modelName ?? source.categoryName ?? "",
        price,
        stock: source.stock ?? availableQty,
        availableQty,
        images: source.images ?? [],
        specs: source.specs ?? {
            model: source.modelName,
            manufacturer: source.manufacturerName,
            architecture: source.specs?.architecture ?? source.architectureName,
            category: source.categoryName,
            seller: source.sellerName,
        },
        rating: source.rating,
        reviews: source.reviews ?? [],
    };
};

const collectSimilarProducts = (products: Product[], currentId: string): Product[] => {
    const seen = new Set<string>();

    return products
        .filter((product) => String(product.id) !== currentId)
        .filter((product) => {
            const key = String(product.id);
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        })
        .slice(0, 6)
        .map((product) => normalizeProduct(product))
        .filter((product): product is Product => product !== null);
};

const SingleProduct = () => {
    const params = useParams<{ id: string }>();
    const id = useMemo(() => String(params?.id ?? ""), [params]);
    const [product, setProduct] = useState<Product | null>(null);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(() => Boolean(id));
    const [loadError, setLoadError] = useState(() => (id ? "" : "Product id is missing."));

    useEffect(() => {
        if (!id) {
            return;
        }

        let active = true;

        const loadProduct = async () => {
            try {
                setLoading(true);
                setLoadError("");

                const [productResponse, featuredProducts, bestSellerProducts] = await Promise.all([
                    productService.getProductById(id),
                    productService.getFeaturedProducts().catch(() => []),
                    productService.getBestSellerProducts().catch(() => []),
                ]);

                if (!active) {
                    return;
                }

                const normalizedProduct = normalizeProduct(productResponse);

                if (!normalizedProduct) {
                    setProduct(null);
                    setSimilarProducts([]);
                    setLoadError("The backend did not return a product payload for this item.");
                    return;
                }

                setProduct(normalizedProduct);
                setSimilarProducts(
                    collectSimilarProducts(
                        [...featuredProducts, ...bestSellerProducts]
                            .map((item) => normalizeProduct(item))
                            .filter((item): item is Product => item !== null),
                        id,
                    )
                );
            } catch {
                if (!active) {
                    return;
                }

                setProduct(null);
                setSimilarProducts([]);
                setLoadError("Unable to load this product right now.");
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadProduct();

        return () => {
            active = false;
        };
    }, [id]);

    const ratingAverage = product?.rating?.average ?? 0;
    const ratingCount = product?.rating?.count ?? 0;
    const stockCount = Number(product?.stock ?? product?.availableQty ?? 0);
    const description = product?.description?.trim() || "This product currently has no description from the backend.";

    if (loading) {
        return (
            <div className="flex-1 px-8 py-16">
                <div className="max-w-2xl rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-gray-600">
                    Loading product details...
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex-1 px-8 py-16">
                <div className="max-w-2xl rounded-2xl border border-dashed border-gray-300 bg-white p-8">
                    <h1 className="text-2xl font-bold">Product not available</h1>
                    <p className="mt-2 text-gray-600">
                        {loadError || "The backend did not return a product payload for this item."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex-1'>
            {/* BREADCRUMBS */}
            <div className='px-8 py-4'>
               <BreadcrumbSection />
            </div>

            {/* PRODUCT DETAILS */}
            <div className='grid md:grid-cols-2 gap-8 px-8'>
                <div>
                    <div className="sticky top-2">
                        <ProductImageGallery images={product.images || []} />
                    </div>
                </div>

                <div className="space-y-5">
                    {/* PRODUCT NAME */}
                    <h1 className="text-3xl font-bold">{product.name}</h1>

                    <hr className="border-gray-300" />

                    {/* BRAND + RATING */}
                    <div className="flex items-center gap-4">
                        <Image src={product.images?.[0] || "/image.jpg"} alt="Product image" width={64} height={64} className="border rounded-full w-16 h-16 object-cover" />

                        <div className="grid">
                            <Link href="#" className="hover:underline font-semibold text-lg flex items-center gap-1">
                                {product.manufacturerName || product.brand || "Seller"}
                                <span className="text-gray-500 text-sm">{product.sellerName ? `(${product.sellerName})` : ""}</span>
                            </Link>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500">{product.categoryName || "Product details from backend"}</span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-300" />

                    {/* PRICE */}
                    <div className="flex items-center">
                        <h1 className="text-3xl font-bold">${product.price.toFixed(2)}</h1>
                        {product.discount ? (
                            <Badge className="ml-4 bg-green-100 text-green-800 px-2 py-1 rounded"> {product.discount}% OFF </Badge>
                        ) : null}
                    </div>

                    <hr className="border-gray-300" />

                    {/* PRODUCT RATING */}
                    <div className="flex items-center gap-2">
                        <StarRating rating={ratingAverage} size={24} />
                        <span className="text-gray-500">{ratingCount > 0 ? `(${ratingCount} Reviews)` : "No reviews yet"}</span>
                    </div>

                    <hr className="border-gray-300" />

                    {/* SPECS (YOUR EXACT STRUCTURE, JUST CLEANER) */}
                    <div className="grid gap-3 w-80 text-sm">
                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">Brand</div>
                            <div className="w-full">{product.brand || product.manufacturerName || "N/A"}</div>
                        </div>

                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">Architecture</div>
                            <div className="w-full">{product.specs?.architecture ?? product.architectureName ?? "N/A"}</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">Flash Memory</div>
                            <div className="w-full">{product.specs?.flashMemory ?? "N/A"}</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">GPIO Pins</div>
                            <div className="w-full">{product.specs?.gpioPins ?? "N/A"}</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">Package</div>
                            <div className="w-full">{product.specs?.package ?? "N/A"}</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">Clock Speed</div>
                            <div className="w-full">{product.specs?.clockSpeed ?? "N/A"}</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">RAM</div>
                            <div className="w-full">{product.specs?.ram ?? "N/A"}</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">Operating Voltage</div>
                            <div className="w-full">{product.specs?.operatingVoltage ?? "N/A"}</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">Temperature Range</div>
                            <div className="w-full">{product.specs?.temperatureRange ?? "N/A"}</div>
                        </div>
                    </div>

                    <hr className="border-gray-300" />

                    {/* QUANTITY SELECTOR */}
                    <div className="flex items-center gap-4">
                        <div className="font-semibold text-gray-700">Quantity:</div>
                        <Input type="number" defaultValue={1} min={1} className="w-20" />

                        <span className='text-gray-700'>{stockCount} in stock</span>
                    </div>
                    
                    <hr className="border-gray-300" />

                    {/* CTA BUTTONS */}
                    <ProductActions
                                            id={product.id}
                                            name={product.name}
                                            price={product.price}
                                            image={product.images?.[0] || "/image.jpg"}
                                            stock={stockCount}
                                            brand={product.brand ?? product.manufacturerName ?? ""}
                    />

                    <hr className="border-gray-300" />

                    {/* PAYMENT METHODS */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-semibold">Payment Methods</h2>
                        <div className="flex items-center gap-4">
                            <Image src="/payments/visa.png" alt="Visa" width={48} height={32} className="w-12 h-8 object-contain" />
                            <Image src="/payments/mastercard.png" alt="MasterCard" width={48} height={32} className="w-12 h-8 object-contain" />
                            <Image src="/payments/paypal.png" alt="PayPal" width={48} height={32} className="w-12 h-8 object-contain" />
                            <Image src="/payments/amex.png" alt="American Express" width={48} height={32} className="w-12 h-8 object-contain" />
                        </div>
                    </div>

                    <hr className="border-gray-300" />

                    {/* PRODUCT DESCRIPTION */}
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Product Description</h2>
                        <p className="text-gray-700 text-sm leading-6">
                            {description}
                        </p>
                    </div>
                </div>
            </div>

            {/* SIMILAR PRODUCTS */}
            <div className='my-12'>
                <ProductSection section="Similar Products" products={similarProducts} />
            </div>

            {/* REVIEW SECTION */}
            <div className='grid md:flex gap-10 p-8'>
                <div className='md:w-1/3'>
                    <div className='sticky top-2'>
                        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-6xl font-bold">{ratingAverage.toFixed(1)}</span>
                            <div>
                                <StarRating rating={ratingAverage} size={24} />
                                <div className="text-gray-500">{ratingCount > 0 ? `Based on ${ratingCount} reviews` : "No reviews available yet"}</div>
                            </div>
                        </div>
                        <RatingBreakdown data={{ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }} />

                        <hr className="border-gray-300 my-6" />

                        <div className="flex flex-col space-y-2">
                            <h2 className="text-2xl font-bold">Write a Review</h2>
                            <div className='flex justify-between items-center'>
                                <StarRating rating={0} size={24} interactive={true} />
                                <Button variant={'outline'} className="hover:bg-white hover:border-amber-500 hover:text-amber-500 rounded-full shadow-none"> Add Photos </Button>
                            </div>
                            <div>
                                <label className="block mb-1 font-semibold">Your Review</label>
                                <textarea className="w-full border border-gray-300 rounded-md p-2 h-32 resize-none" placeholder="Write your review here..."></textarea>
                            </div>
                            <Button className="ml-auto bg-amber-500 hover:bg-amber-600 rounded-full"> Submit Review </Button>
                        </div>
                    </div>
                </div>

                <div className='flex-1 min-w-0'>
                    <ReviewFilter reviews={product.reviews || []} />
                </div>
            </div>
        </div>
    );
}

export default SingleProduct;