// Breadcrumbs.js
import React from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ category, productName }) => (
  <nav className="text-sm text-gray-600 mb-4">
    <ul className="flex space-x-2">
      <li>
        <Link to="/" className="hover:text-gray-900">
          Home
        </Link>
      </li>
      <li>/</li>
      <li>
        <Link to={`/shop`} className="hover:text-gray-900">
          shop
        </Link>
      </li>
      <li>/</li>
      <li className="text-gray-500">{productName}</li>
    </ul>
  </nav>
);

export default Breadcrumbs;
