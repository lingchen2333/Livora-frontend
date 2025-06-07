import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserById,
  setUserAddresses,
  deleteAddressById,
  updateAddressById,
  addAddress,
} from "../../store/features/userSlice";
import { Col, Container, Row, Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import AddressForm from "../common/AddressForm";
import { nanoid } from "nanoid";
import { getOrdersByUserId } from "../../store/features/orderSlice";
import placeholder from "../../assets/images/placeholder.png";
import LoadSpinner from "../common/LoadSpinner";
import Order from "../order/Order";

const UserProfile = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const user = useSelector((state) => state.user.user);
  const isLoading = useSelector((state) => state.order.isLoading);

  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editingAddress, setEditingAddress] = useState({
    country: "",
    city: "",
    addressLine1: "",
    addressLine2: "",
    postCode: "",
    phone: "",
    addressType: "HOME",
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const orders = useSelector((state) => state.order.orders);

  useEffect(() => {
    dispatch(getOrdersByUserId(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  const handleDeleteAddress = async (addressId) => {
    const previousAddresses = [...user.addressList];

    dispatch(
      setUserAddresses(
        user.addressList.filter((address) => address.id !== addressId)
      )
    );

    try {
      const response = await dispatch(deleteAddressById(addressId)).unwrap();
      toast.success(response.message);
      console.log("deleting address");
    } catch (error) {
      toast.error(error.message);
      dispatch(setUserAddresses(previousAddresses));
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setEditingAddressId(address.id);
    console.log(address.id);
    setShowForm(true);
    setIsUpdating(true);
  };

  const handleAddressChange = (e) => {
    setEditingAddress((prevAddress) => ({
      ...prevAddress,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setEditingAddress({
      country: "",
      city: "",
      addressLine1: "",
      addressLine2: "",
      postCode: "",
      phone: "",
      addressType: "HOME",
    });
    setEditingAddressId(null);
    setShowForm(false);
    setIsUpdating(false);
  };

  const handleUpdateAddress = async (addressId) => {
    const previousAddresses = [...user.addressList];

    dispatch(
      setUserAddresses(
        user.addressList.map((address) =>
          address.id === addressId ? { ...editingAddress, addressId } : address
        )
      )
    );

    try {
      const response = await dispatch(
        updateAddressById({
          addressId: editingAddressId,
          address: editingAddress,
        })
      ).unwrap();
      resetForm();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
      dispatch(setUserAddresses(previousAddresses));
    }
  };

  const handleAddAddress = async () => {
    const previousAddresses = [...user.addressList];

    dispatch(
      setUserAddresses([
        ...user.addressList,
        { ...editingAddress, id: nanoid() },
      ])
    );

    try {
      const response = await dispatch(
        addAddress({
          userId,
          address: editingAddress,
        })
      ).unwrap();

      const realId = response.data.id;
      dispatch(
        setUserAddresses([
          ...previousAddresses,
          { ...editingAddress, id: realId },
        ])
      );
      resetForm();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
      dispatch(setUserAddresses(previousAddresses));
    }
  };

  if (isLoading) {
    return <LoadSpinner />;
  }

  return (
    <Container className="mt-5 mb-5">
      <ToastContainer />
      <h2 className="cart-title">User Dashboard</h2>
      {user ? (
        <Row>
          <Col md={4}>
            <Card className="mt-4">
              <Card.Title className="p-2">User Information</Card.Title>
              <Card.Body className="text-center">
                <div className="mb-3">
                  <img
                    src={user.photo || placeholder}
                    alt="User Photo"
                    style={{ width: "100px", height: "100px" }}
                    className="image-fluid rounded-circle"
                  />
                </div>
                <Card.Text>
                  <strong>Full Name: </strong> {user.firstName} {user.lastName}
                </Card.Text>
                <Card.Text>
                  <strong>Email: </strong> {user.email}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            <Card className="mt-4 mb-4">
              <Card.Header>User Addresses</Card.Header>
              <ListGroup variant="flush">
                {user.addressList?.length > 0 ? (
                  user.addressList.map((address) => (
                    <ListGroup.Item key={address.id}>
                      <Card className="p-2 mb-2 shadow">
                        <Card.Body>
                          <Card.Text>{address.addressType} Address: </Card.Text>
                          <hr />
                          <Card.Text>
                            {address.addressLine1}, {address.addressLine2},{" "}
                            {address.city}, {address.country}
                          </Card.Text>
                        </Card.Body>
                        <div className="d-flex gap-4">
                          <Link
                            className="text-danger"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <FaTrash />
                          </Link>
                          <Link>
                            <FaEdit
                              onClick={() => handleEditAddress(address)}
                            />
                          </Link>
                        </div>
                      </Card>
                    </ListGroup.Item>
                  ))
                ) : (
                  <p className="ps-2 pt-2"> No addresses found</p>
                )}
              </ListGroup>
              <Link
                className="ms-2 mb-2"
                variant="success"
                onClick={() => {
                  setIsUpdating(false);
                  setShowForm(true);
                }}
              >
                <FaPlus />
              </Link>

              {showForm && (
                <AddressForm
                  address={editingAddress}
                  onChange={handleAddressChange}
                  onCancel={resetForm}
                  isUpdating={isUpdating}
                  showTitle={true}
                  onSubmit={
                    isUpdating
                      ? () => handleUpdateAddress(editingAddressId)
                      : handleAddAddress
                  }
                  showCheck={true}
                  showButtons={true}
                  showAddressType={true}
                  showPostCode={true}
                />
              )}
            </Card>
          </Col>
        </Row>
      ) : (
        <p>Loading user information....</p>
      )}

      <Row>
        <Col>
          <Card className="mt-4">
            <Card.Header>Order History</Card.Header>
            <Container className="mt-4">
              {Array.isArray(orders) && orders.length === 0 ? (
                <p>No orders found at the moment.</p>
              ) : (
                <Order />
              )}
              <div className="mb-2">
                <Link to="/products">Start Shopping </Link>
              </div>
            </Container>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
