'use client';

import Image from "next/image";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

import Countdown from "react-countdown";

export function Timer() {
    const targetDate = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days from now

    return (
        <Countdown
            date={targetDate}
            renderer={({ days, hours, minutes, seconds }) => (
                <div className="flex items-center justify-center gap-4 lg:gap-8 mt-8">
                    <div>
                        <div className="text-lg lg:text-4xl font-semibold">{String(days).padStart(2, "0")}</div>
                        <div className="text-[#4D4D4D] font-medium mt-2 lg:text-xl">Days</div>
                    </div>
                    <span className="text-lg lg:text-4xl">:</span>
                    <div>
                        <div className="text-lg lg:text-4xl font-semibold">{String(hours).padStart(2, "0")}</div>
                        <div className="text-[#4D4D4D] font-medium mt-2 lg:text-xl">Hours</div>
                    </div>
                    <span className="text-lg lg:text-4xl">:</span>
                    <div>
                        <div className="text-lg lg:text-4xl font-semibold">{String(minutes).padStart(2, "0")}</div>
                        <div className="text-[#4D4D4D] font-medium mt-2 lg:text-xl">Mins</div>
                    </div>
                    <span className="text-lg lg:text-4xl">:</span>
                    <div>
                        <div className="text-lg lg:text-4xl font-semibold">{String(seconds).padStart(2, "0")}</div>
                        <div className="text-[#4D4D4D] font-medium mt-2 lg:text-xl">Sec</div>
                    </div>
                </div>
            )}
        />
    );
}


export default function FlashSale() {
    return (
        <section className="xl:container mx-auto mt-20 px-5 ">
            <div className="grid grid-cols-12 gap-6 h-[400px]">

                {/* LEFT SIDE */}
                <div className="col-span-12 md:col-span-8 ">
                    <div className="relative w-full h-full">
                        <Image
                            src="/flash-sale.svg"
                            alt="flash"
                            fill
                            className="object-cover object-center rounded-4xl w-full h-full"
                            loading="lazy"

                        />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                            <h3 className="text-foreground font-medium text-3xl">Flash Sale!</h3>
                            <p className="text-[#666666] font-medium mt-3 text-lg">Get 25% Off On All Home Appliances - Limited Time Offer!</p>
                            <div >
                                <Timer />
                            </div>
                            <Button className="h-11 rounded-3xl mt-8">Shop All Home Appliances
                                <HugeiconsIcon
                                    icon={ArrowRight02Icon}
                                    size={24}
                                    color="#ffffff"
                                    strokeWidth={1.5}
                                />
                            </Button>
                        </div>

                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="hidden md:block col-span-12 md:col-span-4 w-full">
                    <div className="relative grid grid-cols-2 gap-3 w-full h-full">
                        <div className="relative w-full h-full">
                            <Image
                                src="/flash-sale-1.svg"
                                alt="flash-1"
                                fill
                                className="object-cover object-center rounded-4xl"
                                loading="lazy"
                            />
                        </div>

                        <div className="relative w-full h-full">
                            <Image
                                src="/flash-sale-2.svg"
                                alt="flash-2"
                                fill
                                className="object-cover object-center rounded-4xl"
                                loading="lazy"

                            />
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
