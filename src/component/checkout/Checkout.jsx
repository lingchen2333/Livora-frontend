import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCartByUserId } from "../../store/features/cartSlice";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast, ToastContainer } from "react-toastify";
import {
  createPaymentIntent,
  placeOrder,
} from "../../store/features/orderSlice";
import { Container, Row, Col, Form, FormGroup, Card } from "react-bootstrap";
import AddressForm from "../common/AddressForm";
import { cardElementOptions } from "../utils/cartElementOptions";
import { ClipLoader } from "react-spinners";

const Checkout = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { userId } = useParams();

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [loading, setLoading] = useState(false);

  const [userInfo, setUserInfo] = useState({
    firstname: "",
    lastName: "",
    email: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    postCode: "  ",
  });

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress({ ...billingAddress, [name]: value });
  };

  useEffect(() => {
    dispatch(getCartByUserId(userId));
  }, [dispatch, userId]);

  const handlePaymentAndOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    // check stripe presence
    if (!stripe || !elements) {
      toast.error("Loading... please try again");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // create payment intent through the backend
      const { clientSecret } = await dispatch(
        createPaymentIntent({ amount: cart.totalAmount, currency: "gbp" })
      ).unwrap();

      // confirm payment intent with card details
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${userInfo.firstname} ${userInfo.lastName}`,
              email: userInfo.email,
              address: {
                line1: billingAddress.addressLine1,
                line2: billingAddress.addressLine2,
                city: billingAddress.city,
                country: billingAddress.country,
                postal_code: billingAddress.postCode,
              },
            },
          },
        }
      );

      // place order after successful payment
      if (error) {
        toast.error(error.message);
        return;
      }
      if (paymentIntent.status === "succeeded") {
        await dispatch(placeOrder(userId)).unwrap();

        toast.success("Payment successful! Your order has been placed.");
        setTimeout(() => {
          window.location.href = `/users/${userId}`;
        }, 5000);
      }
    } catch (error) {
      toast.error("Error processing payment: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <ToastContainer />
      <div className="justify-content-center d-flex">
        <Row>
          <Col md={8}>
            <Form className="p-4 border rounded shadow-sm">
              <Row>
                <Col>
                  <FormGroup>
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={userInfo.firstName}
                      className="form-control mb-2"
                      onChange={handleUserInfoChange}
                    ></input>
                  </FormGroup>
                </Col>

                <Col>
                  <FormGroup>
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      id="lastName"
                      name="lastName"
                      value={userInfo.lastName}
                      onChange={handleUserInfoChange}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control mb-2"
                  id="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleUserInfoChange}
                />
              </FormGroup>

              <div>
                <h6>Enter Billing Address</h6>
                <AddressForm
                  onChange={handleAddressChange}
                  address={billingAddress}
                />
              </div>

              <div className="form-group">
                <label htmlFor="card-element" className="form-label">
                  <h6>Credit or Debit Card</h6>
                </label>
                <div id="card-element" className="form-control">
                  <CardElement
                    options={cardElementOptions}
                    onChange={(event) => {
                      setCardError(event.error ? event.error.message : "");
                    }}
                  />
                  {cardError && <div className="text-danger">{cardError}</div>}
                </div>
              </div>
            </Form>
          </Col>

          <Col md={4}>
            <h6 className="mt-4 text-center cart-title">Your Order Summary</h6>
            <hr />
            <Card style={{ backgroundColor: "whiteSmoke" }}>
              <Card.Body>
                <Card.Title className="mb-2 text-muted text-success">
                  Tatal Amount : £{cart.totalAmount.toFixed(2)}
                </Card.Title>
              </Card.Body>

              <button
                type="submit"
                className="btn btn-warning mt-3"
                disabled={!stripe}
                onClick={(e) => handlePaymentAndOrder(e)}
              >
                {loading ? (
                  <ClipLoader size={20} color={"#123abc"} />
                ) : (
                  "Pay Now"
                )}
              </button>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Checkout;
