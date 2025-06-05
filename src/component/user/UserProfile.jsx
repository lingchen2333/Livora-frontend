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

const UserProfile = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const user = useSelector((state) => state.user.user);

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

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  const handleDeleteAddress = async (addressId) => {
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
      dispatch(setUserAddresses(user.addressList));
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setEditingAddressId(address.id);
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
    dispatch(
      setUserAddresses(
        user.addressList.map((address) =>
          address.id === addressId ? { ...editingAddress, addressId } : address
        )
      )
    );
    console.log("handleuUpdateAddress editing address id: ", editingAddressId);

    try {
      const response = await dispatch(
        updateAddressById({
          addressId: editingAddressId,
          address: editingAddress,
        })
      ).unwrap();
      console.log("response from handleUpdateAddress:", response);
      setShowForm(false);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
      dispatch(setUserAddresses(user.addressList));
    }
  };

  const handleAddAddress = async () => {
    dispatch(
      setUserAddresses([
        ...user.addressList,
        { ...editingAddress, id: nanoid() },
      ])
    ); //state.user.user.addressList

    try {
      console.log("editing address:", editingAddress);
      const response = await dispatch(
        addAddress({
          userId,
          address: editingAddress,
        })
      ).unwrap();
      toast.success(response.message);
      setShowForm(false);
      console.log("adding address");
    } catch (error) {
      toast.error(error.message);
      dispatch(setUserAddresses(user.addressList));
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <ToastContainer />
      <h2 className="cart-title">User Dashboard</h2>
      {user ? (
        <Row>
          <Col md={4}>
            <Card>
              <Card.Title>User Information</Card.Title>
              <Card.Body className="text-center">
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
            <Card className="mb-4">
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
                  <p> No addresses found</p>
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
                  showButtons={true}
                  onSubmit={
                    isUpdating
                      ? () => handleUpdateAddress(editingAddressId)
                      : handleAddAddress
                  }
                  showCheck={true}
                />
              )}
            </Card>
          </Col>
        </Row>
      ) : (
        <p>Loading user information....</p>
      )}
    </Container>
  );
};

export default UserProfile;
