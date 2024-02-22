import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const CreateProduct = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");

  const getAllCategory = async () => {
    try {
      // console.log(auth.token);
      const response = await fetch("/api/v1/category/get-category", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const data = await response.json();

      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // console.log("Toke in handleCreate : ", auth?.token);
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);
      /*
      The FormData object is a built-in JavaScript object that provides a way to easily construct a set of key/value pairs representing form fields and their values. It is commonly used when making HTTP requests, especially when you need to send data as part of a multipart/form-data request, which is typically used for file uploads.
      */
      // console.log(photo);
      /*
      File {name: 'soap1.png', lastModified: 1705346213393, lastModifiedDate: Tue Jan 16 2024 00:46:53 GMT+0530 (India Standard Time), webkitRelativePath: '', size: 112400, …}
lastModified
: 
1705346213393
lastModifiedDate
: 
Tue Jan 16 2024 00:46:53 GMT+0530 (India Standard Time) {}
name
: 
"soap1.png"
size
: 
112400
type
: 
"image/png"
webkitRelativePath
: 
""
      */
      const response = await fetch("/api/v1/product/create-product", {
        method: "POST",
        body: productData,
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const data = await response.json();

      if (data?.success) {
        toast.success(data?.message);
        navigate("/dashboard/admin/products");
      } else {
        toast.error("Product Not Created");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="logoText text-center">Create Product</h1>
            <div className="m-1 w-75">
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch={true}
                className="form-select mb-3"
                onChange={(value) => {
                  setCategory(value);
                }}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    /*
                    type="file": Specifies that this is a file input. It allows the user to choose one or more files from their device.
                    */
                    name="photo"
                    /*
                    name="photo": Provides a name for the input. This name will be used when submitting the form, and it can be used to identify the input on the server-side when processing the form data.
                    */
                    accept="image/*"
                    /*
                     Sets a restriction on the types of files that can be selected. In this case, it allows only image files
                     */
                    onChange={(e) => setPhoto(e.target.files[0])}
                    /*
                    e.target.files[0] is the first file selected by the user.
                    */
                    hidden
                  />
                </label>
              </div>
              {console.log(photo)}
              <div className="mb-3">
                {photo && (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      /*URL.createObjectURL(photo): This method takes a Blob or File object (in this case, the photo file) and creates a unique URL that represents the content of that file.
                       */
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="write a name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="write a description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="write a Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="write a quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <Select
                  bordered={false}
                  placeholder="Select Shipping "
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setShipping(value);
                  }}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className="btn btn-warning" onClick={handleCreate}>
                  CREATE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
