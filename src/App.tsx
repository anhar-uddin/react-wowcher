import React, { Component, useEffect, useState } from "react";
import "./App.css";
import ProductItem from './ProductItem';
export const formatNumber = (number: number) => new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);

export function App(props: { data: any }) {

  const branches = ['api/branch1.json', 'api/branch2.json', 'api/branch3.json']
  let initProducts: any[] = [];
  const [products, setProducts] = useState(initProducts);
  const [filteredProducts, setFilteredProducts] = useState(initProducts);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchBranchData(branches);
  }, []);

  const fetchBranchData = (branches: any) => {
    Promise.all(branches.map((url: any) =>
      fetch(url).then(resp => resp.json())
    )).then(response => {
      let p: any = [];
      response.map((branch: any) => {
        branch.products.map((product: any) => {
          const foundIndex = p.findIndex((e: any) => e.id === product.id);
          if (foundIndex > -1) {
            let existingItem = p[foundIndex];
            existingItem.sold = existingItem.sold + product.sold;
            p[foundIndex] = existingItem;
          } else {
            p = [...p, product]
          }
        });
      });
      p.sort((p1: { name: number; }, p2: { name: number; }) => (p1.name < p2.name) ? -1 : (p1.name > p2.name) ? 1 : 0);
      setTotal(calculateRevenue(p));
      setProducts([...p])
      setFilteredProducts([...p]);
    });
  }

  const calculateRevenue = (products: any) => {
    return products.reduce((accumulator: number, product: any) => {
      let productRevenue = product.unitPrice * product.sold;
      return accumulator + productRevenue;
    }, 0);
  }

  const handleChange = (e: any) => {
    let value = e.target.value;
    let newProducts = products.filter(e => e.name.toLowerCase().includes(value.toLowerCase()));
    setTotal(calculateRevenue(newProducts));
    setFilteredProducts([...newProducts]);
  }

  if (!filteredProducts.length) {
    return "Loading...";
  }

  return (
    <div className="product-list">
      <label>Search Products</label>
      <input type="text" onChange={handleChange} />
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
