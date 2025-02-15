import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
	{ href: "/jeans", name: "Jeans", imageUrl: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8amVhbnN8ZW58MHx8MHx8fDA%3D" },
	{ href: "/t-shirts", name: "T-shirts", imageUrl: "https://m.media-amazon.com/images/I/81FjoDja7YL._SL1500_.jpg" },
	{ href: "/shoes", name: "Shoes", imageUrl: "https://hips.hearstapps.com/hmg-prod/images/run-adidas-running-shoes-65b13c3fe5b4a.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=1200:*" },
	{ href: "/appliances", name: "Appliances", imageUrl: "https://boschstore.in/in/media/images/img_webp/aa_shop_now_and_product_awarness.webp" },
	{ href: "/jackets", name: "Jackets", imageUrl: "https://www.voganow.com/cdn/shop/products/BBGJ-1116-SUD-09_10.jpg?v=1675413311&width=1946" },
	{ href: "/gadgets", name: "gadgets", imageUrl: "https://img.freepik.com/free-photo/modern-stationary-collection-arrangement_23-2149309649.jpg?semt=ais_hybrid" },
	{ href: "/bags", name: "Bags", imageUrl: "https://www.kalkstore.com/cdn/shop/articles/KL_WEB_BLOG_PORTADA_4420x2400_df689793-0c08-4d64-8872-7b415597a5ac.jpg?v=1654701916&width=1500" },
	{ href: "/grocery", name: "Grocery", imageUrl: "https://techcrunch.com/wp-content/uploads/2015/03/groceries-e1554037962210.jpg" },
];

const HomePage = () => {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Explore Our Categories
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Discover the latest trends in eco-friendly fashion
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
			</div>
		</div>
	);
};
export default HomePage;
