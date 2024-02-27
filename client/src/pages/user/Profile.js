import React, { useState, useEffect, useRef } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

const Profile = () => {
  // context
  const [auth, setAuth] = useAuth();
  const fileRef = useRef(null);
  // state
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);
  const [avatar, setAvatar] = useState("");

  // get user data
  useEffect(() => {
    console.log(auth.user);
    const { email, name, phone, address, avatar } = auth?.user;
    setName(name);
    setPhone(phone);
    setEmail(email);
    setAddress(address);
    setAvatar(avatar);
  }, [auth?.user]);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setAvatar(downloadURL);
        });
      }
    );
  };
  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/v1/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          address,
          avatar,
        }),
      });

      const data = await response.json();

      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Your Profile"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-8">
            <div className="form-container" style={{ marginTop: "-40px " }}>
              <form
                style={{ width: "60%" }}
                onSubmit={handleSubmit}
              >
                <h4 className="title">USER PROFILE</h4>

                <div className="mb-3">
                  <input
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                    autoFocus
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <div className="mb-3">
                    {avatar && (
                      <div className="text-center">
                        <img
                          onClick={() => fileRef.current.click()}
                          src={avatar}
                          alt="profile"
                          height={"200px"}
                          className="img img-responsive"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-sm self-center">
                    {fileUploadError ? (
                      <span className="text-red-700">
                        Error Image upload (image must be less than 2 mb)
                      </span>
                    ) : filePerc > 0 && filePerc < 100 ? (
                      <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
                    ) : filePerc === 100 ? (
                      <span className="text-green-700">
                        Image successfully uploaded!
                      </span>
                    ) : (
                      ""
                    )}
                  </p>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter Your Name"
                    autoFocus
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter Your Email "
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Enter Your Password"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter Your Phone"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter Your Address"
                  />
                </div>

                <button
                  type="submit"
                  style={{ width: "100%", backgroundColor: "#ffc107" }}
                  className="btn btn-warning"
                >
                  UPDATE
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
