import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { RootLayout } from "./component/layout/RootLayout";
import Home from "./component/home/Home";
import Products from "./component/product/Products";
import ProductDeatils from "./component/product/ProductDeatils";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./component/cart/Cart";
import Order from "./component/order/Order";
import AddProduct from "./component/product/AddProduct";
import ProductUpdate from "./component/product/ProductUpdate";
import UserRegistration from "./component/user/UserRegistration";
import Login from "./component/auth/Login";
import ProtectedRoute from "./component/auth/ProtectedRoute";
import UnAuthorised from "./component/UnAuthorised";
import UserProfile from "./component/user/UserProfile";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/search" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDeatils />} />
        <Route path="/register" element={<UserRegistration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorised" element={<UnAuthorised />} />

        <Route
          element={
            <ProtectedRoute
              useOutlet={true}
              allowedRoles={["ROLE_ADMIN", "ROLE_USER"]}
            />
          }
        >
          <Route path="/users/:userId/carts" element={<Cart />} />
          <Route path="/users/:userId/orders" element={<Order />} />
          <Route path="/users/:userId" element={<UserProfile />} />
        </Route>

        <Route
          element={
            <ProtectedRoute useOutlet={true} allowedRoles={["ROLE_ADMIN"]} />
          }
        >
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/:productId/edit" element={<ProductUpdate />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
