// 'use client';
// import TopHeader from "../layout/TopHeader";
// import ProductsLoading from "../loading/ProductsLoading";
// import ProductsError from "../common/ProductsError";
// import { getHomeProductsQuery } from '@/hooks/queries/useHomeQueries';
// import ProductCard from "../common/ProductCard";

// export default function TopCategories() {
//     const { data, isLoading, error } = getHomeProductsQuery("home-comfort", { limit: 4 });

//     return (
//         <section className="xl:container mx-auto px-5 pb-15">
//             <TopHeader title="Top Of home-comfort" />
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