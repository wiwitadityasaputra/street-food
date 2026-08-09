export default function Dashboard() {
    return (<>
        <section  className="banner">
            <div  className="banner_overlay">
                <span  className="banner_shape_1">
                    <img src="images/tree_5.png" alt="shape"  className="img-fluid w-100" />
                </span>
                <span  className="banner_shape_2">
                    <img src="images/tree_3.png" alt="shape"  className="img-fluid w-100" />
                </span>
                <span  className="banner_shape_3">
                    <img src="images/tree_4.png" alt="shape"  className="img-fluid w-100" />
                </span>
                <span  className="banner_shape_4">
                    <img src="images/tree_6.png" alt="shape"  className="img-fluid w-100" />
                </span>
                <span  className="banner_shape_5">
                    <img src="images/tree_7.png" alt="shape"  className="img-fluid w-100" />
                </span>
                <span  className="banner_shape_6">
                    <img src="images/tree_2.png" alt="shape"  className="img-fluid w-100" />
                </span>
                <div className="col-12">
                    <div className="banner_slider" style={{background: "url(/images/banner_bg.jpg)"}} >
                        <div className="banner_slider_overlay">
                            <div className=" container">
                                <div className="row justify-content-center">
                                    <div className="col-xxl-6 col-xl-6 col-md-10 col-lg-6">
                                        <div  className="banner_text wow fadeInLeft" data-wow-duration="1s">
                                            <h3>Satisfy Your Cravings</h3>
                                            <h1>Delicious Foods With Wonderful Eating</h1>
                                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum fugit
                                                minimaet debitis ut distinctio optio.</p>
                                        </div>
                                    </div>
                                    <div  className="col-xxl-5 col-xl-6 col-sm-10 col-md-9 col-lg-6">
                                        <div  className="banner_img wow fadeInRight" data-wow-duration="1s">
                                            <div  className="img">
                                                <img src="images/slider_img_1.png" alt="food item"  className="img-fluid w-100" />
                                                <span>
                                                    35% off
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>);
}