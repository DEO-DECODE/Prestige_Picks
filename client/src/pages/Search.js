import React from "react";
import Layout from "./../components/Layout/Layout";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { useSearch } from "../context/search";
import "../styles/CardImage.css";
import {
  faInfoCircle,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Homepage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Search = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  return (
    <Layout title={"Search results"}>
      <div className="col-md-12">
        <div className="text-center">
          <h1 style={{ marginTop: "4rem" }}>Search Resuts</h1>
          <h3>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length} Items`}
          </h3>
          <div className="d-flex flex-wrap mt-4">
            {values?.results.map((p) => (
              <div className="product-card" key={p._id}>
                <div className="badge">{p.quantity>=1?"In Stock":"Out Of Stock"}</div>
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

export default Search;
