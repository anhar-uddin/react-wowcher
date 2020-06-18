import React, { Component, useEffect, useState } from "react";
import "./App.css";

export const formatNumber = (number: number) => new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);

export function App(props: { data: any }) {

  const branches = ['api/branch1.json', 'api/branch2.json', 'api/branch3.json']
  let initProducts: any[] = [];
  const [products, setProducts] = useState(initProducts);
  const [total, setTotal] = useState(0);

  useEffect(() => {

    Promise.all(branches.map(url =>
      fetch(url).then(resp => resp.json())
    )).then(response => {
      let p: any = [];
      let revenue: number = 0.0;
      response.map(branch => {
        branch.products.map((product: any) => {
          const foundIndex = p.findIndex((e: any) => e.id === product.id);
          if (foundIndex > -1) {
            let existingItem = p[foundIndex];
            product.revenue = product.unitPrice * product.sold;
            revenue = revenue + product.revenue;    
            existingItem.sold = existingItem.sold + product.sold;
            existingItem.revenue = existingItem.revenue + product.revenue;
            p[foundIndex] = existingItem;
            
          } else {
            product.revenue = product.unitPrice * product.sold;
            revenue = revenue + product.revenue;
            p = [...p, product]
          }
        });
      });
      p.sort((p1: { name: number; }, p2: { name: number; }) => (p1.name < p2.name) ? -1 : (p1.name > p2.name) ? 1 : 0);
      // revenue = formatNumber(revenue);
      setTotal(revenue);
      setProducts([...p])
      console.log('p', p);

    });





  }, []);

  const mergeFruits = (products: any) => {
    const result: any = {}; //(1)

    let set = new Set();
    let unionArray = products.filter((item: any) => {
      if (!set.has(item.id)) {
        set.add(item.id);
        return true;
      }
      return false;
    }, set);

    console.log('unionArray', unionArray);

    return result; //(7)
  };


  return (
    <div className="product-list">
      <label>Search Products</label>
      <input type="text" />

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
        <tfoot>
          {products.map((product: any) => {
            return <tr key={product.id}>
              <td>{product.name}</td>
              <td>{formatNumber(product.revenue)}</td>
            </tr>
          })}
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
