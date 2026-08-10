"use server";

import "@/src/ui/queue/me/queue-me.css";

export async function QueueMeSkeleton() {
    return (<>
        <div className="queue">
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