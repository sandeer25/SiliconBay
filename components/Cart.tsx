import React from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import { Input } from './ui/input'
import { Button } from './ui/button'

const Cart = () => {
    return (
        <Sheet>
            <SheetTrigger className='flex items-center cursor-pointer'>
                <ShoppingCart size={24} />
                <span className='ml-2 hidden md:inline'>Cart (0)</span>
            </SheetTrigger>

            <SheetContent className='gap-0 '>
                <SheetHeader>
                    <SheetTitle>Cart (0)</SheetTitle>
                </SheetHeader>

                {/* Items */}
                <div className='flex gap-2 p-2'>
                    <Image src={"/products/currentsensor.jpg"} alt="Product Image" width={100} height={100} className='object-cover border rounded-lg' />

                    <div className='grid gap-1'>
                        <h2 className='line-clamp-2 overflow-hidden leading-snug font-normal'>ARM Cortex-M4 Microcontroller STM32L476</h2>
                        <span className='font-semibold'>$3.70</span>
                        <div className='flex justify-between'>
                            <Input type="number" min={1} defaultValue={1} className='rounded w-16' />
                            <Button variant="link" className='ml-2 cursor-pointer'>Remove</Button>
                        </div>
                    </div>
                </div>
                <div className='flex gap-2 p-2'>
                    <Image src={"/products/microcontroller.jpg"} alt="Product Image" width={100} height={100} className='object-cover border rounded-lg' />

                    <div className='grid gap-1'>
                        <h2 className='line-clamp-2 overflow-hidden leading-snug font-normal'>Texas Instruments LM317 Adjustable Voltage Regulator Texas Instruments LM317 Adjustable Voltage Regulator</h2>
                        <span className='font-semibold'>$24.99</span>
                        <div className='flex justify-between'>
                            <Input type="number" min={1} defaultValue={1} className='rounded w-16' />
                            <Button variant="link" className='ml-2 cursor-pointer'>Remove</Button>
                        </div>
                    </div>
                </div>

                <SheetFooter>
                    <div className='w-full flex flex-col gap-4'>
                        <div className='flex justify-between font-semibold text-lg'>
                            <span>Subtotal (2 items):</span>
                            <span>$28.69</span>
                        </div>
                        <Button className='w-full bg-amber-600 hover:bg-amber-700 text-white rounded-full'>
                            Proceed to Checkout
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default Cart