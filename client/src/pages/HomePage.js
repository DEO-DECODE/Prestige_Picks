import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import InfiniteScroll from "react-infinite-scroll-component";
import "../styles/Homepage.css";
import { useFilter } from "../context/filter";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [auth, setAuth] = useFilter();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // get all categories
  const getAllCategory = async () => {
    try {
      const response = await fetch("/api/v1/category/get-category");
      const data = await response.json();

      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
    // getAllProducts();
  }, []);

  // get products
  const getAllProducts = async () => {
    try {
      console.log("Sending Response for Page in getAllProducts : ", page);
      setLoading(true);
      const response = await fetch(`/api/v1/product/product-list/${page}`);
      const data = await response.json();

      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  // get total count
  const getTotal = async () => {
    try {
      const response = await fetch("/api/v1/product/product-count");
      const data = await response.json();
      console.log("Total : ", data.total);
      setTotal(data?.total);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    console.log("Triggering Fetch more data ");
    console.log("Current length: ", products.length);
    try {
      setLoading(true);
      console.log("Sending Response for Page : ", nextPage);
      const response = await fetch(`/api/v1/product/product-list/${nextPage}`);
      const data = await response.json();

      setLoading(false);
      setProducts((prevProducts) => [...prevProducts, ...data?.products]);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // filter by category
  const handleFilter = (value, id) => {
    /*
    if block is executed when you check a checkbox, and the else block is executed when you uncheck a checkbox. 
    */
    let all = [...auth.checked];
    console.log("Boolean" + value);
    console.log(auth.checked);
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
      /*
      It ensures that the id of the category being unchecked is removed from the array of checked categories (all). 
      */
    }
    setAuth({ ...auth, checked: all });
    // navigate("/filter");
  };

  useEffect(() => {
    if (!auth.checked.length && !auth.radio.length) getAllProducts();
  }, [auth.checked.length, auth.radio.length]);

  return (
    <Layout title={"All Products - Best offers "}>
      <h1>All Products</h1>
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3 filters">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group
              onChange={(e) => setAuth({ ...auth, radio: e.target.value })}
            >
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => {
                navigate("/filter");
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
        <div className="col-md-9 ">
          <h1 className="text-center">All Products</h1>
          <InfiniteScroll
            dataLength={products ? products.length : 0}
            next={fetchMoreData}
            hasMore={products && products.length !== total}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
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
          </InfiniteScroll>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
