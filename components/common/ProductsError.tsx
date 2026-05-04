'use client';

interface ProductsErrorProps {
    error: Error;
}

export default function ProductsError({ error }: ProductsErrorProps) {
    return (
        <section className="overflow-hidden my-20">
            <div className="container mx-auto fle justify-center items-center h-96">
                <p className="text-lg font-semibold">Error loading products: {error.message}</p>
            </div>
        </section>
    );
}
