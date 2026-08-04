import { fetchCuisines } from "@/app/lib/data";
import { Cuisines } from "@/app/lib/definition";
import { formatCurrency as fc } from "@/app/lib/utils";
import { faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from 'next/image';

export type FoodListProps = {
    cuisine?: string;
}

export default async function FoodList(props: FoodListProps) {

    const formatCurrency = (price: number) => {
        return fc(price);
    };

    const fs = (key: number) => {
        return <svg key={key} xmlns="http://www.w3.org/2000/svg" height="14" width="15.75" viewBox="0 0 576 512"><path fill="rgb(252, 124, 8)" d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"/></svg>;
    }
    const hs = (key: number) => {
        return <FontAwesomeIcon key={key} icon={faStarHalfStroke} size="sm" style={{position:"relative", top: "2px"}}/>;
    }
    const es = (key: number) => {
        return <svg key={key} xmlns="http://www.w3.org/2000/svg" height="14" width="15.75" viewBox="0 0 576 512"><path fill="rgb(252, 124, 8)" d="M288.1-32c9 0 17.3 5.1 21.4 13.1L383 125.3 542.9 150.7c8.9 1.4 16.3 7.7 19.1 16.3s.5 18-5.8 24.4L441.7 305.9 467 465.8c1.4 8.9-2.3 17.9-9.6 23.2s-17 6.1-25 2L288.1 417.6 143.8 491c-8 4.1-17.7 3.3-25-2s-11-14.2-9.6-23.2L134.4 305.9 20 191.4c-6.4-6.4-8.6-15.8-5.8-24.4s10.1-14.9 19.1-16.3l159.9-25.4 73.6-144.2c4.1-8 12.4-13.1 21.4-13.1zm0 76.8L230.3 158c-3.5 6.8-10 11.6-17.6 12.8l-125.5 20 89.8 89.9c5.4 5.4 7.9 13.1 6.7 20.7l-19.8 125.5 113.3-57.6c6.8-3.5 14.9-3.5 21.8 0l113.3 57.6-19.8-125.5c-1.2-7.6 1.3-15.3 6.7-20.7l89.8-89.9-125.5-20c-7.6-1.2-14.1-6-17.6-12.8L288.1 44.8z"/></svg>;        
    }
    const buildRating = (rate: number) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            const lower = i;
            const upper = i + 1;
            if (rate < lower) {
                stars.push(es(i));
            } else if (rate >= upper) {
                stars.push(fs(i));
            } else {
                stars.push(hs(i));
            }
        }
        return stars;
    }

    const data: Cuisines[] = await fetchCuisines(props.cuisine);
    return (
        <div className="row grid">
            {data.map((cuisine) => {
                return (
                    <div key={cuisine.id} className="col-xxl-3 col-sm-6 col-lg-4">
                        <div className="menu_item">
                            <div className="menu_item_img">
                                <Image
                                    src={"/images/cuisine/" + cuisine.id + "/1.jpg"}
                                    width={344}
                                    height={220}
                                    alt={cuisine.name}
                                    unoptimized
                                />
                            </div>
                            <div className="menu_item_text">
                                <a className="category" href="#">{cuisine.cuisine}</a>
                                <a className="title" href="#">{cuisine.name}</a>
                                <p className="rating">
                                    {buildRating(cuisine.rate)}
                                    <span>{cuisine.rate}</span>
                                </p>
                                <h5 className="price">{formatCurrency(cuisine.price)}</h5>
                                <a className="add_to_cart" href="#">add
                                    to cart</a>
                                <ul className="d-flex flex-wrap justify-content-end">
                                    <li>
                                        <a href="#">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="14" width="15.75" viewBox="0 0 512 512"><path fill="rgb(252, 124, 8)" d="M378.9 80c-27.3 0-53 13.1-69 35.2l-34.4 47.6c-4.5 6.2-11.7 9.9-19.4 9.9s-14.9-3.7-19.4-9.9l-34.4-47.6c-16-22.1-41.7-35.2-69-35.2-47 0-85.1 38.1-85.1 85.1 0 49.9 32 98.4 68.1 142.3 41.1 50 91.4 94 125.9 120.3 3.2 2.4 7.9 4.2 14 4.2s10.8-1.8 14-4.2c34.5-26.3 84.8-70.4 125.9-120.3 36.2-43.9 68.1-92.4 68.1-142.3 0-47-38.1-85.1-85.1-85.1zM271 87.1c25-34.6 65.2-55.1 107.9-55.1 73.5 0 133.1 59.6 133.1 133.1 0 68.6-42.9 128.9-79.1 172.8-44.1 53.6-97.3 100.1-133.8 127.9-12.3 9.4-27.5 14.1-43.1 14.1s-30.8-4.7-43.1-14.1C176.4 438 123.2 391.5 79.1 338 42.9 294.1 0 233.7 0 165.1 0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1l15 20.7 15-20.7z"/></svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="14" width="15.75" viewBox="0 0 576 512"><path fill="rgb(252, 124, 8)" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.7-8.4-1 10.9-.1 22.1 2.9 33.2 13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-12.2-45.7-55.5-74.8-101.1-70.8 5.3 9.3 8.4 20.1 8.4 31.7z"/></svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            })}

        </div>
    );
}

/*

*/