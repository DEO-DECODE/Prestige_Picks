import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { useFilter } from "../context/filter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/CardImage.css";
import {
  faInfoCircle,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Homepage.css";
const Filter = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [auth, setAuth] = useFilter();

  useEffect(() => {
    filterProduct();
  }, []);

  const filterProduct = async () => {
    try {
      const response = await fetch("/api/v1/product/product-filters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ checked: auth.checked, radio: auth.radio }),
      });

      const data = await response.json();

      if (data) {
        setProducts(data?.products);
        setAuth({ checked: [], radio: [] });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout title={"Showing Results Based on your Search"}>
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-12">
        <h1 className="text-center" style={{marginTop:"4rem"}}>Showing Results Based On Your Filter</h1>
        <h3 className="logoText text-center" style={{ color: "gray" }}>
            {products?.length < 1
              ? "No Products Found"
              : `Found ${products?.length} Items`}
          </h3>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
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

export default Filter;
