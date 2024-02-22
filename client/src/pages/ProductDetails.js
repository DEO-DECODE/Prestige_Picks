import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import "../styles/ProductDetailsStyles.css";
import "../styles/CardImage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  faInfoCircle,
  faShoppingCart,
  faFilter,
  faList,
} from "@fortawesome/free-solid-svg-icons";
const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();
  //initial details
  useEffect(() => {
    AOS.init();
    if (params?.slug) getProduct();
  }, [params?.slug]);

  // getProduct
  const getProduct = async () => {
    try {
      const response = await fetch(
        `/api/v1/product/get-product/${params.slug}`
      );
      const data = await response.json();
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  // get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      console.log(product);
      const response = await fetch(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      const data = await response.json();
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div class="detailsCard" data-aos="zoom-in">
        <div class="left">
          <img src={product.photo} alt={product.name} />
        </div>
        <div class="right" data-aos="fade-out">
          <div class="product-info">
            <div class="product-name">
              <h1>{product.name}</h1>
            </div>
            <div class="details" data-aos="fade-in">
              <h2>{product?.category?.name}</h2>
              <div>{product.description}</div>
              <h4>
                Price :
                {product?.price?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </h4>
            </div>
            <button
              onClick={() => {
                setCart([...cart, product]);
                localStorage.setItem(
                  "cart",
                  JSON.stringify([...cart, product])
                );
                toast.success("Item Added to cart");
              }}
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              Add To Cart
            </button>
          </div>
        </div>
      </div>
      <hr />
      <div
        className="row  similar-products"
        style={{ width: "100%" }}
        data-aos="fade-right"
      >
        <h1 className="logoText" style={{ textAlign: "center" }}>
          Showing Similar Products
        </h1>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap" style={{ width: "100%" }}>
          {relatedProducts?.map((p) => (
            <div className="product-card" key={p._id}>
              <div className="badge">Hot</div>
              <div className="product-tumb">
                <img src={p.photo} alt={p.name} />
              </div>
              <div className="product-details">
                <span className="product-catagory">{p.category.name}</span>
                <h4>{p.name}</h4>
                <p>{p.description.substring(0, 60)}...</p>
                <div className="product-bottom-details">
                  <div className="product-price">
                    <small>
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </small>
                  </div>
                  <div className="product-links">
                    <button onClick={() => navigate(`/product/${p.slug}`)}>
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </button>
                    <button
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item Added to cart");
                      }}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
/*
<div class="card">
      <div class="left">
        <img
          src="https://www.dropbox.com/s/e928cht0h5crcn4/shoe.png?raw=1"
          alt="shoe"
        />
      </div>
      <div class="right">
        <div class="product-info">
          <div class="product-name">
            <h1>Airmax</h1>
          </div>
          <div class="details">
            <h3>Winter Collection</h3>
            <h2>Men Black Sneakers</h2>
            <h4><span class="fa fa-dollar"></span>150</h4>
            <h4 class="dis"><span class="fa fa-dollar"></span>200</h4>
          </div>
          <span class="foot"
            ><i class="fa fa-shopping-cart"></i>Add TO Cart</span
          >
        </div>
      </div>
    </div>
    */
