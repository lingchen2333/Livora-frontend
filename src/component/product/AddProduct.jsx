import React, { useState } from "react";
import { addNewProduct } from "../../store/features/productSlice";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import CategorySelector from "../common/CategorySelector";
import BrandSelector from "../common/BrandSelector";
import { Stepper, Step, StepLabel } from "@mui/material";
import ImageUploader from "../common/ImageUploader";

const AddProduct = () => {
  const dispatch = useDispatch();
  const [showNewBrandInput, setShowNewBrandInput] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Add New Product", "Upload Product Image"];
  const [productId, setProductId] = useState(null);

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    price: "",
    inventory: " ",
    description: "",
    categoryName: "",
  });

  const isValidFrom =
    product.categoryName &&
    product.categoryName != "new" &&
    product.brand &&
    product.brand != "new";

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
    console.log(product);
  };

  const handleCategoryChange = (categoryName) => {
    setProduct((prev) => ({ ...prev, categoryName }));
    console.log("product from handle category change:", product);
    if (categoryName === "new") {
      setShowNewCategoryInput(true);
    } else {
      setShowNewCategoryInput(false);
    }
  };

  const handleBrandChange = (brand) => {
    setProduct((prev) => ({ ...prev, brand }));
    console.log("product from handle brand change:", product);
    if (brand === "new") {
      setShowNewBrandInput(true);
    } else {
      setShowNewBrandInput(false);
    }
  };

  const handleAddProduct = async (e) => {
    console.log("product from handleAddProduct", product);
    e.preventDefault();

    if (!isValidFrom) {
      toast.error("Please fill all fields and select valid brand/category.");
      return;
    }

    try {
      const result = await dispatch(addNewProduct(product)).unwrap();
      console.log("result from the add product", result);
      toast.success(result.message);
      setProductId(result.data.id);
      resetForm();
      setActiveStep(1);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setProduct({
      name: "",
      description: "",
      price: "",
      brand: "",
      categoryName: "",
      inventory: "",
    });
    setShowNewBrandInput(false);
    setShowNewCategoryInput(false);
  };

  const handlePreviousStep = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <section className="container mt-5 mb-5">
      <ToastContainer />
      <div className="d-flex justify-content-center">
        <div className="col-md-6 col-xs-12">
          <h4>Add New Product</h4>

          <Stepper activeStep={activeStep} className="mb-4">
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div>
            {activeStep === 0 && (
              <form onSubmit={handleAddProduct}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    id="name"
                    value={product.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Price:
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="price"
                    id="price"
                    value={product.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="inventory" className="form-label">
                    Inventory:
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="inventory"
                    id="inventory"
                    value={product.inventory}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <BrandSelector
                    selectedBrand={product.brand}
                    onBrandChange={handleBrandChange}
                    newBrand={newBrand}
                    setNewBrand={setNewBrand}
                    showNewBrandInput={showNewBrandInput}
                    setShowNewBrandInput={setShowNewBrandInput}
                  />
                </div>

                <div className="mb-3">
                  <CategorySelector
                    selectedCategory={product.categoryName}
                    onCategoryChange={handleCategoryChange}
                    newCategory={newCategory}
                    setNewCategory={setNewCategory}
                    showNewCategoryInput={showNewCategoryInput}
                    setShowNewCategoryInput={setShowNewCategoryInput}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description:
                  </label>
                  <textarea
                    className="form-control"
                    name="description"
                    id="description"
                    value={product.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-secondary btn-sm">
                  Add Product
                </button>
              </form>
            )}

            {activeStep === 1 && (
              <div className="container">
                <ImageUploader productId={productId} />
                <button
                  className="btn btn-secondary btn-s mt-3"
                  onClick={handlePreviousStep}
                >
                  Previous
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;
