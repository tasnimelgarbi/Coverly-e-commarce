import { createBrowserRouter, RouterProvider } from "react-router";
import Product from "./components/products/Product";
import Cart from "./components/cart/Cart";
import Footer from "./components/footer/Footer";
import Home from "./components/home/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Home />
        <Footer />
      </>
    ),
  },

    {
    path: "/products",
    element: (
      <>
        <Product />
        <Footer />
      </>
    ),
  },
  
  {
    path: "/cart",
    element: (
      <>
        <Cart />
        <Footer />
      </>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
