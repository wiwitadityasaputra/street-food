"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';

import "@/app/ui/menu/add-to-chart-modal/add-to-chart-modal.css"
import { Cuisines, CuisinesChart } from "@/app/lib/definition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import CuisineRating from "@/app/ui/menu/cusine-rating/cuisine-rating";

export interface AddToChartModalProps {
    cuisine: Cuisines;
    cuisineCarts: CuisinesChart[];
}

export default function AddToChartModal(props: AddToChartModalProps) {
    const router = useRouter();
    console.log("dbg props ", props)

    return (<>
        <div className="add-to-chart-modal modal show cart_popup">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <button onClick={router.back} type="button" className="btn-close">
                            <FontAwesomeIcon icon={faClose} size="sm" />
                        </button>
                        <div className="cart_popup_img">
                            <Image
                                src={`/images/cuisine/${props.cuisine.id}/1.jpg`}
                                width={344}
                                height={220}
                                alt={"cuisine.name"}
                                unoptimized
                            />
                        </div>
                        <div className="cart_popup_text">
                            <a href="#" className="title">
                                {props.cuisine.name}
                            </a>
                            <p className="rating">
                                <CuisineRating rate={props.cuisine.rate} />
                                <span>(201)</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
}