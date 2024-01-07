// import React, { useEffect, useState } from "react";
// import Layout from "./../../components/Layout/Layout";
// import AdminMenu from "./../../components/Layout/AdminMenu";
// import toast from "react-hot-toast";
// import axios from "axios";
// import CategoryForm from "../../components/Form/CategoryForm";
// import { Modal } from "antd";
// const CreateCategory = () => {
//   const [categories, setCategories] = useState([]);
//   const [name, setName] = useState("");
//   const [visible, setVisible] = useState(false);
//   const [selected, setSelected] = useState(null);
//   const [updatedName, setUpdatedName] = useState("");
//   //handle Form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post("/api/v1/category/create-category", {
//         name,
//       });
//       if (data?.success) {
//         toast.success(`${name} is created`);
//         getAllCategory();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       // toast.error("somthing went wrong in input form");
//     }
//   };

//   //get all cat
//   const getAllCategory = async () => {
//     try {
//       const { data } = await axios.get("/api/v1/category/get-category");
//       if (data?.success) {
//         setCategories(data?.category);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Something wwent wrong in getting catgeory");
//     }
//   };

//   useEffect(() => {
//     getAllCategory();
//   }, []);

//   //update category
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.put(
//         `/api/v1/category/update-category/${selected._id}`,
//         { name: updatedName }
//       );
//       if (data?.success) {
//         toast.success(`${updatedName} is updated`);
//         setSelected(null);
//         setUpdatedName("");
//         setVisible(false);
//         getAllCategory();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   //delete category
//   const handleDelete = async (pId) => {
//     try {
//       const { data } = await axios.delete(
//         `/api/v1/category/delete-category/${pId}`
//       );
//       if (data.success) {
//         toast.success(`category is deleted`);

//         getAllCategory();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error("Somtihing went wrong");
//     }
//   };
//   return (
//     <Layout title={"Dashboard - Create Category"}>
//       <div className="container-fluid m-3 p-3 dashboard">
//         <div className="row">
//           <div className="col-md-3">
//             <AdminMenu />
//           </div>
//           <div className="col-md-9">
//             <h1>Manage Category</h1>
//             <div className="p-3 w-50">
//               <CategoryForm
//                 handleSubmit={handleSubmit}
//                 value={name}
//                 setValue={setName}
//               />
//             </div>
//             <div className="w-75">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th scope="col">Name</th>
//                     <th scope="col">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {categories?.map((c) => (
//                     <>
//                       <tr>
//                         <td key={c._id}>{c.name}</td>
//                         <td>
//                           <button
//                             className="btn btn-primary ms-2"
//                             onClick={() => {
//                               setVisible(true);
//                               setUpdatedName(c.name);
//                               setSelected(c);
//                             }}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="btn btn-danger ms-2"
//                             onClick={() => {
//                               handleDelete(c._id);
//                             }}
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     </>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <Modal
//               onCancel={() => setVisible(false)}
//               footer={null}
//               visible={visible}
//             >
//               <CategoryForm
//                 value={updatedName}
//                 setValue={setUpdatedName}
//                 handleSubmit={handleUpdate}
//               />
//             </Modal>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CreateCategory;
import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";

const CreateCategory = () => {
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // This is done to prevent the default behavior of reloading.
    try {
      const response = await fetch("/api/v1/category/create-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        /*
        When you set "Content-Type" to "application/json", you are telling the server that the data being sent in the request body is in JSON format. This is crucial for the server to correctly interpret and process the incoming data.
        */
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (data?.success) {
        toast.success(`${name} is created`);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      // toast.error("something went wrong in input form");
    }
  };

  const getAllCategory = async () => {
    try {
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/v1/category/update-category/${selected._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({ name: updatedName }),
        }
      );

      const data = await response.json();

      if (data?.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (pId) => {
    try {
      const response = await fetch(`/api/v1/category/delete-category/${pId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`category is deleted`);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>
                        <button
                          className="btn btn-primary ms-2"
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(c.name);
                            setSelected(c);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => {
                            handleDelete(c._id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              visible={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
