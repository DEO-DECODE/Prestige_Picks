import React from "react";
import { useSearch } from "../../context/search";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/v1/product/search/${values.keyword}`);
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setValues({ ...values, results: data });
        navigate("/search");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <form
      className="d-flex align-items-center justify-content-center search-form"
      role="search"
      onSubmit={handleSubmit}
      style={{ width: "100%" }}
    >
      <input
        className="form-control me-2 w-75"
        type="search"
        placeholder="Search"
        aria-label="Search"
        value={values.keyword}
        onChange={(e) => setValues({ ...values, keyword: e.target.value })}
      />
      <button
        className="btn"
        type="submit"
        style={{ backgroundColor: "#fbb72c", color: "black" }}
      >
        Search
      </button>
    </form>
  );
};

export default SearchInput;
