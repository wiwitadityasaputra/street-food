"use server";

import "@/app/ui/queue/all/queue-all.css";

export async function QueueAllSkeleton() {
    return (<>
        <div className="queue-all">
            <section className="cart_view mt_100 xs_mt_70 mb_100 xs_mb_70 queue-content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 wow fadeInUp">
                            please wait,,,
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </>)
}