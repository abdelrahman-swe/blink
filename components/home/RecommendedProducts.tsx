// 'use client';

// import { getHomeProductsQuery } from '@/hooks/queries/useHomeQueries';
// import TopHeader from '../layout/TopHeader';
// import ProductsLoading from '../loading/ProductsLoading';
// import ProductsError from '../common/ProductsError';
// import ProductCard from '../common/ProductCard';

// export default function RecommendedProducts() {
//     const { data, isLoading, error } = getHomeProductsQuery("home-comfort", { limit: 4 });

//     return (
//         <section className="xl:container mx-auto mt-10 px-5">
//             <TopHeader title="Recommended for you" />
//             {isLoading ? (
//                 <ProductsLoading lgCols={4} />
//             ) : error ? (
//                 <ProductsError error={error} />
//             ) : (
//                 <ProductCard products={data || []} columns={4} />
//             )}
//         </section>
//     );
// }