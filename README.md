# Livora Frontend

This is the frontend of **Livora**, an e-commerce furniture platform. The frontend is built with **React** and styled using **Tailwind CSS**, providing a fast, responsive, and modern user experience. You can find the backend [here](https://github.com/lingchen2333/Livora-backend).

## Tech Stack

- React (with Vite)
- Tailwind CSS
- Redux Toolkit (state management)
- React Router (SPA routing)
- Axios (API communication)
- JWT for auth integration with backend
- Netlify (deployment)

---

## Features

- Product Listing and Detail Views
- Search and Filter Products
- User Authentication (Login/Register)
- Cart and Checkout Functionality
- Order History for Logged-In Users
- Admin Interface to Add/Remove Products
- **Search by Image (OpenAI CLIP + ChromaDB)** [Local Only]

---

## Live Demo

🔗 [https://shop-livora.netlify.app](https://shop-livora.netlify.app)

> **Note**: The backend is hosted on [Render](https://livora-backend-latest.onrender.com) using the free tier, which means it may take **5 min to spin up** after a period of inactivity. You may notice a short delay on the first request — this is expected behavior on free-tier Render services.

> **Image Search Feature (powered by OpenAI)**: This project includes a feature to **search for products by image** using OpenAI's CLIP model and a Chroma vector store. However, **this feature is currently disabled in the live demo** due to the high cost of deploying and hosting a persistent vector database. You can run it locally by following the instructions in the backend README.

---

## Screenshots

### Homepage

  <img src="./readme_assets/home-1.png" width="800"/>
  <img src="./readme_assets/home-2.png" width="800"/>
  <img src="./readme_assets/home-3.png" width="800"/>

---

### Product Listing

<img src="./readme_assets/products.png" width="800" />
<img src="./readme_assets/product-details.png" width="800" />

---

### Shopping Cart

## <img src="./readme_assets/shopping-cart.png" width="800" />

---

### Checkout

<img src="./readme_assets/checkout.png" width="800" />

---

### User Login and Registration

<img src="./readme_assets/sign-in.png" width="800" />
<img src="./readme_assets/user-registration.png" width="800" />

---

### User Information and Order

<img src="./readme_assets/user-info.png" width="800" />

---

### Search by Image

<img src="./readme_assets/search-by-image.png" width="800" />

---

### Store Management by Admin

<img src="./readme_assets/products-admin.png" width="800" />
<img src="./readme_assets/add-product-1.png" width="800" />
<img src="./readme_assets/add-product-2.png" width="800" />

---

## 💻 Folder Structure

```
src/
 ├── assets/
 ├── components/
 ├── features/
 │    ├── auth/
 │    ├── products/
 │    └── cart/
 ├── pages/
 ├── services/       # API calls using Axios
 ├── store/          # Redux Toolkit setup
 └── App.jsx
```

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
