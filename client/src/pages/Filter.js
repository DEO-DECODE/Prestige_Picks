import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { useFilter } from "../context/filter";
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
        data.products.map((elem) => {
          console.log(elem.name);
          console.log("---");
          console.log(elem.category);
        });

        setProducts(data?.products);
        setAuth({ checked: [], radio: [] });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout title={"Showing Results Based on your Search"}>
      <h1>All Products</h1>
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-9 ">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-2" key={p._id}>
                <img src={p.photo} className="card-img-top" alt={p.name} />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </h5>
                  </div>
                  <p className="card-text ">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="card-name-price">
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-dark ms-1"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item Added to cart");
                      }}
                    >
                      ADD TO CART
                    </button>
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
