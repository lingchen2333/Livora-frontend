import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Form, Button } from "react-bootstrap";
import { getAllCountries } from "../../store/features/userSlice";
import { FaCheck, FaTimes } from "react-icons/fa";

const AddressForm = ({
  address,
  onChange,
  onCancel,
  isUpdating,
  showTitle,
  showButtons,
  onSubmit,
  showCheck,
}) => {
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const countries = await dispatch(getAllCountries()).unwrap();
      setCountries(countries);
    };
    fetchCountries();
  }, [dispatch]);

  return (
    <div className="p-3 m-3 border">
      {showTitle && <h5>{isUpdating ? "Edit Address" : "Add New Address"}</h5>}
      <Form.Group className="mb-3">
        <Form.Label>Address Line 1:</Form.Label>
        <Form.Control
          type="text"
          name="addressLine1"
          value={address.addressLine1}
          onChange={onChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Address Line 2:</Form.Label>
        <Form.Control
          type="text"
          name="addressLine2"
          value={address.addressLine2}
          onChange={onChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>City:</Form.Label>
        <Form.Control
          type="text"
          name="city"
          value={address.city}
          onChange={onChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Country:</Form.Label>
        <Form.Control
          as="select"
          name="country"
          value={address.country}
          onChange={onChange}
          required
        >
          <option value="">Select a country</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Post Code:</Form.Label>
        <Form.Control
          type="text"
          name="postCode"
          value={address.postCode}
          onChange={onChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Phone: </Form.Label>
        <Form.Control
          type="text"
          name="phone"
          value={address.phone}
          onChange={onChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Address Type:</Form.Label>
        <Form.Control
          as="select"
          name="addressType"
          value={address.addressType}
          onChange={onChange}
          required
        >
          <option value="HOME">Home</option>
          <option value="WORK">Work</option>
          <option value="OTHER">Other</option>
        </Form.Control>
      </Form.Group>
      <div className="d-flex justify-content-end">
        {showButtons && (
          <div className="d-flex gap-4 mt-3">
            {showCheck && (
              <div
                onClick={onSubmit}
                style={{ cursor: "pointer", color: "green" }}
              >
                <FaCheck
                  size={24}
                  title={isUpdating ? "Update Address" : "Add Address"}
                />
              </div>
            )}
            <div onClick={onCancel} style={{ cursor: "pointer", color: "red" }}>
              <FaTimes size={24} title="Cancel" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
