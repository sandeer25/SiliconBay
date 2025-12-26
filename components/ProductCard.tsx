import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from './ui/card'
import { Toggle } from './ui/toggle'
import { Heart } from 'lucide-react'

type ProductCardProps = {
    id: string;
    name: string;
    images?: string[];
    price: number;
};

const ProductCard = (product: ProductCardProps) => {
    return (
        <Card key={product.id} className="w-56 p-0 shadow-none gap-0 border-0 snap-start shrink-0">
            <CardContent className="p-0">
                <div className="relative w-full h-56 overflow-hidden rounded-lg border">
                    <Link href={`/product/${product.id}`}>
                        <Image
                            src={product.images?.[0] || "/carousel/carousel-1.jpg"}
                            alt={product.name}
                            fill
                            className="mx-auto rounded-lg object-cover
                            hover:scale-105 transition-transform duration-300
                            "
                        />
                    </Link>

                    <Toggle
                        aria-label="Toggle bookmark"
                        size="sm"
                        variant="default"
                        className="data-[state=on]:bg-white data-[state=on]:*:[svg]:fill-amber-500 data-[state=on]:*:[svg]:stroke-amber-500 absolute top-4 right-4 bg-white backdrop-blur-md shadow-md rounded-full"
                    >
                        <Heart size={24} className="scale-110" />
                    </Toggle>
                </div>
            </CardContent>

            <CardFooter className="p-0">
                <div className="w-full flex flex-col gap-1">
                    <Link href={`/product/${product.id}`} className="hover:underline mt-2">
                        <CardTitle className="line-clamp-2 overflow-hidden leading-snug font-normal">
                            {product.name}
                        </CardTitle>
                    </Link>

                    <CardDescription className="font-medium text-black text-lg">
                        ${product.price.toFixed(2)}
                    </CardDescription>
                </div>
            </CardFooter>
        </Card>
    )
}

export default ProductCard