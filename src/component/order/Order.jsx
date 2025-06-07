import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOrdersByUserId } from "../../store/features/orderSlice";
import { Table } from "react-bootstrap";

const Order = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const orders = useSelector((state) => state.order.orders);

  useEffect(() => {
    dispatch(getOrdersByUserId(userId));
  }, [userId, dispatch]);

  return (
    <Table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Date</th>
          <th>Total Amount</th>
          <th>Status</th>
          <th>Items</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(orders) &&
          orders.map((order, index) => {
            return (
              order && (
                <tr key={index}>
                  <td>{order.id}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>${order.totalAmount?.toFixed(2)}</td>
                  <td>{order.orderStatus}</td>
                  <td>
                    <Table size="sm" striped bordered hover>
                      <thead>
                        <tr>
                          <th>Item ID</th>
                          <th>Name</th>
                          <th>Brand</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(order.items) &&
                          order.items.map((item, itemIndex) => (
                            <tr key={itemIndex}>
                              <td>{item.itemProductId}</td>
                              <td>{item.itemName}</td>
                              <td>{item.itemBrand}</td>
                              <td>{item.quantity}</td>
                              <td>£{item.unitPrice.toFixed(2)}</td>
                              <td>£{item.totalPrice.toFixed(2)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </td>
                </tr>
              )
            );
          })}
      </tbody>
    </Table>
  );
};

export default Order;
