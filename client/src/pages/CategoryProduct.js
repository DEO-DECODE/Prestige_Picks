import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CategoryProductStyles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import "../styles/Homepage.css";
const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [cart, setCart] = useCart();
  useEffect(() => {
    if (params?.slug) getProductsByCat();
  }, [params?.slug]);

  const getProductsByCat = async () => {
    try {
      const response = await fetch(
        `/api/v1/product/product-category/${params.slug}`
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data?.products);
        setCategory(data?.category);
      } else {
        console.error("Cannot fetch from productCategoryController");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <Layout>
      <div className="col-md-12 mt-4">
        <h1 className="text-center logoText" style={{ marginTop: "4rem", color: "gray" }}>Category - {category?.name}</h1>
        <h3 className="text-center logoText" style={{ color: "gray" }}>{products?.length} result found </h3>
        <div className="row">
          
            <div className="d-flex flex-wrap mt-4">
              {products.map((p) => (
                <div className="product-card" key={p._id}>
                  <div className="badge">
                    {p.quantity >= 1 ? "In Stock" : "Out Of Stock"}
                  </div>
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
      </div>
    </Layout>
  );
};

export default CategoryProduct;
