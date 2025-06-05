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
      console.log("updated product", result);
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
    return <LoadSpinner />;
  }

  return (
    <div className="container mt-5 mb-5">
      <ToastContainer />
      <div className="row">
        <div className="col-md-6 me-4">
          <h4 className="mb-4"> Update Product</h4>
          <form onSubmit={handleUpdateProduct}>
            <div className="mb-3">
              <label className="form-label">Name :</label>

              <input
                className="form-control"
                type="text"
                id="name"
                name="name"
                value={updatedProduct.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Price:</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={updatedProduct.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Inventory:</label>
              <input
                type="number"
                className="form-control"
                name="inventory"
                value={updatedProduct.inventory}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <BrandSelector
                selectedBrand={updatedProduct.brand}
                onBrandChange={handleBrandChange}
                showNewBrandInput={showNewBrandInput}
                setShowNewBrandInput={setShowNewBrandInput}
                newBrand={newBrand}
                setNewBrand={setNewBrand}
              />
            </div>
            <div className="mb-3">
              <CategorySelector
                selectedCategory={updatedProduct.categoryName}
                onCategoryChange={handleCategoryChange}
                showNewCategoryInput={showNewCategoryInput}
                setShowNewCategoryInput={setShowNewCategoryInput}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description:</label>
              <textarea
                className="form-control"
                name="description"
                value={updatedProduct.description}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-secondary btn-sm">
              Save product update
            </button>
          </form>
        </div>

        <div className="col-md-3">
          <table className="table table-bordered text-center">
            <tbody>
              {updatedProduct.images.map((image, index) => (
                <tr key={index}>
                  <td className="update-image-container">
                    <ProductImageThumbnail imageId={image.id} />

                    <div className="d-flex gap-4 mb-2 mt-2">
                      <Link to={"#"} onClick={() => handleEditImage(image.id)}>
                        edit
                      </Link>
                      <Link
                        to={"#"}
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        remove
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to={"#"} onClick={() => handleAddImage(productId)}>
            Add Image
          </Link>
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
