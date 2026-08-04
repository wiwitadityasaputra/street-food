import FoodMenu from "@/app/ui/menu/food-menu";

export default function Menu() {
    return (
        <section className="menu mt_95 xs_mt_65">
            <div className="container">
                <FoodMenu />

                <div className="row grid">
                    <div  className="col-xxl-3 col-sm-6 col-lg-4 chicken wow fadeInUp" data-wow-duration="1s">
                        <div  className="menu_item">
                            <div  className="menu_item_img">
                                <img src="images/menu2_img_1.jpg" alt="menu"  className="img-fluid w-100" />
                            </div>
                            <div  className="menu_item_text">
                                <a  className="category" href="#">Biryani</a>
                                <a  className="title" href="menu_details.html">Hyderabadi biryani</a>
                                <p  className="rating">
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star-half-alt"></i>
                                    <i  className="far fa-star"></i>
                                    <span>24</span>
                                </p>
                                <h5  className="price">$65.00 <del>$90.00</del></h5>
                                <a  className="add_to_cart" href="#" data-bs-toggle="modal" data-bs-target="#cartModal">add
                                    to cart</a>
                                <ul  className="d-flex flex-wrap justify-content-end">
                                    <li><a href="#"><i  className="fal fa-heart"></i></a></li>
                                    <li><a href="menu_details.html"><i  className="far fa-eye"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div  className="col-xxl-3 col-sm-6 col-lg-4 burger dresserts wow fadeInUp" data-wow-duration="1s">
                        <div  className="menu_item">
                            <div  className="menu_item_img">
                                <img src="images/menu2_img_2.jpg" alt="menu"  className="img-fluid w-100" />
                            </div>
                            <div  className="menu_item_text">
                                <a  className="category" href="#">Chicken</a>
                                <a  className="title" href="menu_details.html">Daria Shevtsova</a>
                                <p  className="rating">
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <span>30</span>
                                </p>
                                <h5  className="price">$80.00</h5>
                                <a  className="add_to_cart" href="#" data-bs-toggle="modal" data-bs-target="#cartModal">add
                                    to cart</a>
                                <ul  className="d-flex flex-wrap justify-content-end">
                                    <li><a href="#"><i  className="fal fa-heart"></i></a></li>
                                    <li><a href="menu_details.html"><i  className="far fa-eye"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div  className="col-xxl-3 col-sm-6 col-lg-4 chicken wow fadeInUp" data-wow-duration="1s">
                        <div  className="menu_item">
                            <div  className="menu_item_img">
                                <img src="images/menu2_img_3.jpg" alt="menu"  className="img-fluid w-100" />
                            </div>
                            <div  className="menu_item_text">
                                <a  className="category" href="#">burger</a>
                                <a  className="title" href="menu_details.html">Spicy Burger</a>
                                <p  className="rating">
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star-half-alt"></i>
                                    <span>17</span>
                                </p>
                                <h5  className="price">$100.00 <del>$110.00</del></h5>
                                <a  className="add_to_cart" href="#" data-bs-toggle="modal" data-bs-target="#cartModal">add
                                    to cart</a>
                                <ul  className="d-flex flex-wrap justify-content-end">
                                    <li><a href="#"><i  className="fal fa-heart"></i></a></li>
                                    <li><a href="menu_details.html"><i  className="far fa-eye"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div  className="col-xxl-3 col-sm-6 col-lg-4 burger pizza wow fadeInUp" data-wow-duration="1s">
                        <div  className="menu_item">
                            <div  className="menu_item_img">
                                <img src="images/menu2_img_4.jpg" alt="menu"  className="img-fluid w-100" />
                            </div>
                            <div  className="menu_item_text">
                                <a  className="category" href="#">dressert</a>
                                <a  className="title" href="menu_details.html">Fried Chicken</a>
                                <p  className="rating">
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="far fa-star"></i>
                                    <i  className="far fa-star"></i>
                                    <span>22</span>
                                </p>
                                <h5  className="price">$99.00</h5>
                                <a  className="add_to_cart" href="#" data-bs-toggle="modal" data-bs-target="#cartModal">add
                                    to cart</a>
                                <ul  className="d-flex flex-wrap justify-content-end">
                                    <li><a href="#"><i  className="fal fa-heart"></i></a></li>
                                    <li><a href="menu_details.html"><i  className="far fa-eye"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div  className="col-xxl-3 col-sm-6 col-lg-4 chicken dresserts wow fadeInUp" data-wow-duration="1s">
                        <div  className="menu_item">
                            <div  className="menu_item_img">
                                <img src="images/menu2_img_5.jpg" alt="menu"  className="img-fluid w-100" />
                            </div>
                            <div  className="menu_item_text">
                                <a  className="category" href="#">kabab</a>
                                <a  className="title" href="menu_details.html">Mozzarella Sticks</a>
                                <p  className="rating">
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star-half-alt"></i>
                                    <span>72</span>
                                </p>
                                <h5  className="price">$75.00</h5>
                                <a  className="add_to_cart" href="#" data-bs-toggle="modal" data-bs-target="#cartModal">add
                                    to cart</a>
                                <ul  className="d-flex flex-wrap justify-content-end">
                                    <li><a href="#"><i  className="fal fa-heart"></i></a></li>
                                    <li><a href="menu_details.html"><i  className="far fa-eye"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div  className="col-xxl-3 col-sm-6 col-lg-4 burger pizza wow fadeInUp" data-wow-duration="1s">
                        <div  className="menu_item">
                            <div  className="menu_item_img">
                                <img src="images/menu2_img_6.jpg" alt="menu"  className="img-fluid w-100" />
                            </div>
                            <div  className="menu_item_text">
                                <a  className="category" href="#">kacchi</a>
                                <a  className="title" href="menu_details.html">Popcorn Chicken</a>
                                <p  className="rating">
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star-half-alt"></i>
                                    <i  className="far fa-star"></i>
                                    <span>57</span>
                                </p>
                                <h5  className="price">$69.00 <del>$80.00</del></h5>
                                <a  className="add_to_cart" href="#" data-bs-toggle="modal" data-bs-target="#cartModal">add
                                    to cart</a>
                                <ul  className="d-flex flex-wrap justify-content-end">
                                    <li><a href="#"><i  className="fal fa-heart"></i></a></li>
                                    <li><a href="menu_details.html"><i  className="far fa-eye"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div  className="col-xxl-3 col-sm-6 col-lg-4 chicken dresserts wow fadeInUp" data-wow-duration="1s">
                        <div  className="menu_item">
                            <div  className="menu_item_img">
                                <img src="images/menu2_img_7.jpg" alt="menu"  className="img-fluid w-100" />
                            </div>
                            <div  className="menu_item_text">
                                <a  className="category" href="#">noodles</a>
                                <a  className="title" href="menu_details.html">Chicken Wings</a>
                                <p  className="rating">
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="far fa-star"></i>
                                    <i  className="far fa-star"></i>
                                    <span>43</span>
                                </p>
                                <h5  className="price">$79.00 <del>$90.00</del></h5>
                                <a  className="add_to_cart" href="#" data-bs-toggle="modal" data-bs-target="#cartModal">add
                                    to cart</a>
                                <ul  className="d-flex flex-wrap justify-content-end">
                                    <li><a href="#"><i  className="fal fa-heart"></i></a></li>
                                    <li><a href="menu_details.html"><i  className="far fa-eye"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div  className="col-xxl-3 col-sm-6 col-lg-4 burger pizza wow fadeInUp" data-wow-duration="1s">
                        <div  className="menu_item">
                            <div  className="menu_item_img">
                                <img src="images/menu2_img_8.jpg" alt="menu"  className="img-fluid w-100" />
                            </div>
                            <div  className="menu_item_text">
                                <a  className="category" href="#">grill</a>
                                <a  className="title" href="menu_details.html">Onion Rings</a>
                                <p  className="rating">
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <i  className="fas fa-star"></i>
                                    <span>62</span>
                                </p>
                                <h5  className="price">$110.00</h5>
                                <a  className="add_to_cart" href="#" data-bs-toggle="modal" data-bs-target="#cartModal">add
                                    to cart</a>
                                <ul  className="d-flex flex-wrap justify-content-end">
                                    <li><a href="#"><i  className="fal fa-heart"></i></a></li>
                                    <li><a href="menu_details.html"><i  className="far fa-eye"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}