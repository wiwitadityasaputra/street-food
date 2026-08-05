'use client'

import "./add-to-chart-modal.css";
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Cuisines, CuisinesChart } from "@/app/lib/definition";

export interface AddToChartModalProps {
    cuisine: Cuisines;
    cuisineCart: CuisinesChart;
}

export default function AddToChartModal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const cuisineId = searchParams.get("cuisineId");

    return (<>
        <div className="add-to-chart-modal modal show">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <button onClick={router.back} type="button" className="btn-close" aria-label="Close">
                            <i className="fal fa-times"></i>
                        </button>
                        <div className="cart_popup_img">
                            <Image
                                src={`/images/cuisine/${cuisineId}/1.jpg`}
                                width={344}
                                height={220}
                                alt={"cuisine.name"}
                                unoptimized
                            />
                        </div>
                        <div className="cart_popup_text">
                            <a href="#" className="title">
                                Maxican Pizza Test Better
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
}