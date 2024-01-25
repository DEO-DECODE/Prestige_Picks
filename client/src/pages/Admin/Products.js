import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import "../../styles/CardImage.css"
const Products = () => {
  const [products, setProducts] = useState([]);

  // get all products
  const getAllProducts = async () => {
    try {
      const response = await fetch("/api/v1/product/get-product");
      const data = await response.json();
      console.log(response);
      if (response.ok) {
        setProducts(data.products);
        console.log(products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9 ">
          <h1 className="text-center">All Products List</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <Link
                key={p._id}
                to={`/dashboard/admin/product/${p.slug}`}
                className="product-link"
              >
                <div className="product-card" key={p._id}>
                  <div className="badge">Hot</div>
                  <div className="product-tumb">
                    <img src={p.photo} alt={p.name} />
                  </div>
                  <div className="product-details">
                    <span className="product-catagory">{p.category.name}</span>
                    <h4>{p.name}</h4>
                    <p>{p.description.substring(0, 60)}...</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
