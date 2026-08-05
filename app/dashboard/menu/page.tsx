import "./menu.css";
import FoodList from "@/app/ui/menu/food-list";
import Cuisines, { DEFAULT_CUISINE } from "@/app/ui/menu/cuisines";
import AddToChartModal from "@/app/ui/menu/add-to-chart-modal/add-to-chart-modal";
import { fetchCuisineCartByCuisineId, fetchCuisinesById } from "@/app/lib/data";

export default async function Menu(props: {
  searchParams?: Promise<{
    cuisine?: string;
    cuisineId?: string;
    showModal?: string;
  }>;
}) {
    const searchParams = await props.searchParams;
    const cuisineParams = (searchParams?.cuisine) || DEFAULT_CUISINE;

    const cuisineId = searchParams?.cuisineId;
    const showModal = searchParams?.showModal === 'true';
    
    if (cuisineId && showModal) {
        const cuisineCarts = await fetchCuisineCartByCuisineId(cuisineId);
        const cuisine = await fetchCuisinesById(cuisineId);
    }

    return (
        <>
            <section className="section-menu">
                <div className="container">
                    <Cuisines />
                    <FoodList cuisine={cuisineParams} />
                </div>
            </section>
            {showModal && <AddToChartModal />}
        </>
    );
}