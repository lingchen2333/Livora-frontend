import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  updateProduct,
  getProductById,
} from "../../store/features/productSlice";
import BrandSelector from "../common/BrandSelector";
import CategorySelector from "../common/CategorySelector";
import ImageUpdater from "../image/ImageUpdater";
import ProductImageThumbnail from "../utils/ProductImageThumbnail";
import LoadSpinner from "../common/LoadSpinner";
import { deleteImageById } from "../../store/features/imageSlice";
import { FaEdit, FaTrash, FaPlus, FaSave } from "react-icons/fa";

const ProductUpdate = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();

  const [showNewBrandInput, setShowNewBrandInput] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const newProductImage = useSelector((state) => state.image.uploadedImages);

  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    brand: "",
    price: "",
    inventory: "",
    description: "",
    categoryName: "",
    images: [],
  });

  useEffect(() => {
    const result = async () => {
      setIsLoading(true);
      try {
        const result = await dispatch(getProductById(productId)).unwrap();
        setUpdatedProduct({
          ...result,
          categoryName: result.category?.name || "",
        });
      } catch (error) {
        toast.error(error.message);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };
    result();
  }, [dispatch, productId, newProductImage]);

  const handleChange = (e) => {
    setUpdatedProduct({ ...updatedProduct, [e.target.name]: e.target.value });
  };

  const handleBrandChange = (brand) => {
    setUpdatedProduct({ ...updatedProduct, brand });
    if (brand === "new") {
      setShowNewBrandInput(true);
    } else {
      setShowNewBrandInput(false);
    }
  };

  const handleCategoryChange = (categoryName) => {
    setUpdatedProduct({ ...updatedProduct, categoryName });
    if (categoryName === "new") {
      setShowNewCategoryInput(true);
    } else {
      setShowNewCategoryInput(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(updateProduct(updatedProduct)).unwrap();
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditImage = (imageId) => {
    setSelectedImageId(imageId);
    setShowImageModal(true);
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const result = await dispatch(deleteImageById({ imageId })).unwrap();
      toast.success(result.message);

      setUpdatedProduct({
        ...updatedProduct,
        images: updatedProduct.images.filter((image) => image.id !== imageId),
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddImage = () => {
    setShowImageModal(true);
    setSelectedImageId(null);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImageId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Update Product
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleUpdateProduct} className="space-y-6">
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
                      id="name"
                      name="name"
                      value={updatedProduct.name}
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
                        value={updatedProduct.price}
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
                      value={updatedProduct.inventory}
                      onChange={handleChange}
                      required
                      placeholder="Enter quantity"
                      min="0"
                    />
                  </div>

                  <div>
                    <BrandSelector
                      selectedBrand={updatedProduct.brand}
                      onBrandChange={handleBrandChange}
                      showNewBrandInput={showNewBrandInput}
                      setShowNewBrandInput={setShowNewBrandInput}
                      newBrand={newBrand}
                      setNewBrand={setNewBrand}
                    />
                  </div>

                  <div>
                    <CategorySelector
                      selectedCategory={updatedProduct.categoryName}
                      onCategoryChange={handleCategoryChange}
                      showNewCategoryInput={showNewCategoryInput}
                      setShowNewCategoryInput={setShowNewCategoryInput}
                      newCategory={newCategory}
                      setNewCategory={setNewCategory}
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
                    value={updatedProduct.description}
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
                    <FaSave className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Image Gallery */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Product Images
                </h3>
                <div className="space-y-4">
                  {updatedProduct.images.map((image, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 shadow-sm"
                    >
                      <div className="aspect-w-1 aspect-h-1 mb-3">
                        <ProductImageThumbnail imageId={image.id} />
                      </div>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => handleEditImage(image.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#537D5D] transition-colors duration-200"
                        >
                          <FaEdit className="mr-1.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                          <FaTrash className="mr-1.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleAddImage}
                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#537D5D] transition-colors duration-200"
                  >
                    <FaPlus className="mr-2" />
                    Add Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageUpdater
        show={showImageModal}
        handleClose={handleCloseImageModal}
        selectedImageId={selectedImageId}
        productId={productId}
      />
    </div>
  );
};

export default ProductUpdate;
