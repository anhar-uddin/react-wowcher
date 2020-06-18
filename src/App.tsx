import React, { useEffect, useState } from "react";
import "./App.css";
import ProductItem from './components/ProductItem';
import { cloneObject, formatNumber, Product } from "./lib/common";

export function App() {

  const branches = ['api/branch1.json', 'api/branch2.json', 'api/branch3.json']
  let initialProducts: Product[] = [];
  const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts(branches);
  }, []);

  const fetchProducts = (branches: any) => {
    Promise.all(branches.map((url: string) =>
      fetch(url).then(resp => resp.json()).catch(err => console.log(err))
    )).then(response => {
      let tempProducts: Product[] = [];
      response.map((branch: any) => {
        branch.products.map((product: Product) => {
          const existingProductIndex = tempProducts.findIndex((p: Product) => p.id === product.id);
          if (existingProductIndex > -1) {
            let existingProduct = cloneObject(tempProducts[existingProductIndex]);;
            existingProduct.sold = existingProduct.sold + product.sold;
            tempProducts[existingProductIndex] = existingProduct;
          } else {
            tempProducts = [...tempProducts, product]
          }
        });
      });
      tempProducts.sort((p1: { name: string; }, p2: { name: string; }) => (p1.name < p2.name) ? -1 : (p1.name > p2.name) ? 1 : 0);
      setTotal(calculateRevenue(tempProducts));
      setProducts([...tempProducts])
      setFilteredProducts([...tempProducts]);
    }).catch(err => console.log(err));
  }

  const calculateRevenue = (products: Product[]) => {
    return products.reduce((accumulator: number, product: Product) => {
      const productRevenue = product.unitPrice * product.sold;
      return accumulator + productRevenue;
    }, 0);
  }

  const handleChange = (e: any) => {
    const value = e.target.value;
    const newProducts = products.filter(e => e.name.toLowerCase().includes(value.toLowerCase()));
    setTotal(calculateRevenue(newProducts));
    setFilteredProducts([...newProducts]);
  }

  if (!products.length) {
    return "Loading...";
  }

  return (
    <div className="product-list">
      <div className="search-input-container">
        <label>Search Products</label>
        <input type="text" onChange={handleChange} />
      </div>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          <ProductItem productData={filteredProducts} />
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>{formatNumber(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );

}

export default App;
