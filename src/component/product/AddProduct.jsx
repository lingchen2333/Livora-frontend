import React, { useState } from "react";
import { addNewProduct } from "../../store/features/productSlice";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import CategorySelector from "../common/CategorySelector";
import BrandSelector from "../common/BrandSelector";
import { Stepper, Step, StepLabel } from "@mui/material";
import ImageUploader from "../common/ImageUploader";
import { FaArrowLeft, FaBox, FaImage } from "react-icons/fa";

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
    inventory: "",
    description: "",
    categoryName: "",
  });

  const isValidFrom =
    product.categoryName &&
    product.categoryName !== "new" &&
    product.brand &&
    product.brand !== "new";

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (categoryName) => {
    setProduct((prev) => ({ ...prev, categoryName }));
    if (categoryName === "new") {
      setShowNewCategoryInput(true);
    } else {
      setShowNewCategoryInput(false);
    }
  };

  const handleBrandChange = (brand) => {
    setProduct((prev) => ({ ...prev, brand }));
    if (brand === "new") {
      setShowNewBrandInput(true);
    } else {
      setShowNewBrandInput(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!isValidFrom) {
      toast.error("Please fill all fields and select valid brand/category.");
      return;
    }

    try {
      const result = await dispatch(addNewProduct(product)).unwrap();
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Add New Product
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Fill in the product details and upload images
            </p>
          </div>

          <Stepper
            activeStep={activeStep}
            className="mb-8"
            sx={{
              "& .MuiStepLabel-label": {
                fontSize: "0.875rem",
                fontWeight: 500,
              },
              "& .MuiStepIcon-root": {
                color: "#537D5D",
                "&.Mui-active": {
                  color: "#537D5D",
                },
                "&.Mui-completed": {
                  color: "#537D5D",
                },
              },
            }}
          >
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div>
            {activeStep === 0 && (
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Product Name
                    </label>
                    <input
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200"
                      type="text"
                      name="name"
                      id="name"
                      value={product.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">£</span>
                      </div>
                      <input
                        className="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200"
                        type="number"
                        name="price"
                        id="price"
                        value={product.price}
                        onChange={handleChange}
                        required
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="inventory"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Inventory
                    </label>
                    <input
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200"
                      type="number"
                      name="inventory"
                      id="inventory"
                      value={product.inventory}
                      onChange={handleChange}
                      required
                      placeholder="Enter quantity"
                      min="0"
                    />
                  </div>

                  <div>
                    <BrandSelector
                      selectedBrand={product.brand}
                      onBrandChange={handleBrandChange}
                      newBrand={newBrand}
                      setNewBrand={setNewBrand}
                      showNewBrandInput={showNewBrandInput}
                      setShowNewBrandInput={setShowNewBrandInput}
                    />
                  </div>

                  <div>
                    <CategorySelector
                      selectedCategory={product.categoryName}
                      onCategoryChange={handleCategoryChange}
                      newCategory={newCategory}
                      setNewCategory={setNewCategory}
                      showNewCategoryInput={showNewCategoryInput}
                      setShowNewCategoryInput={setShowNewCategoryInput}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-[#537D5D] focus:border-[#537D5D] transition-colors duration-200 min-h-[120px]"
                    name="description"
                    id="description"
                    value={product.description}
                    onChange={handleChange}
                    required
                    placeholder="Enter product description"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#537D5D] hover:bg-[#4A6F52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#537D5D] transition-colors duration-200"
                  >
                    <FaBox className="mr-2" />
                    Add Product
                  </button>
                </div>
              </form>
            )}

            {activeStep === 1 && (
              <div className="space-y-6">
                <ImageUploader productId={productId} />
                <div className="flex justify-start">
                  <button
                    onClick={handlePreviousStep}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#537D5D] transition-colors duration-200"
                  >
                    <FaArrowLeft className="mr-2" />
                    Previous
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
