import FoodList from "@/app/ui/menu/food-list";
import Cuisines, { DEFAULT_CUISINE } from "@/app/ui/menu/cuisines";

export default async function Menu(props: {
  searchParams?: Promise<{
    cuisine?: string;
  }>;
}) {
    const searchParams = await props.searchParams;
    const cuisine = (searchParams?.cuisine) || DEFAULT_CUISINE;
    return (
        <section className="menu mt_95 xs_mt_65">
            <div className="container">
                <Cuisines />
                <FoodList cuisine={cuisine} />
            </div>
        </section>
    );
}