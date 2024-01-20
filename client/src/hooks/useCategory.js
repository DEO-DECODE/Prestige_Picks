import { useState, useEffect } from "react";

export default function useCategory() {
  const [categories, setCategories] = useState([]);

  //get cat
  const getCategories = async () => {
    try {
      const response = await fetch("/api/v1/category/get-category");

      if (response.ok) {
        const data = await response.json();
        setCategories(data?.category);
      } else {
        console.log("Error in fetching categories");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return categories;
}
