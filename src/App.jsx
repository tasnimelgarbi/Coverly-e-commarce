import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import Cart from "./components/cart/Cart";
import Footer from "./components/footer/Footer";
import Home from "./components/home/Home";
import CategoryProducts from "./components/products/CategoryProducts";
import CustomPage from "./components/products/CustomPage";

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/category/:slug", element: <CategoryProducts /> },
      { path: "/custom", element: <CustomPage /> },
      { path: "/cart", element: <Cart /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;