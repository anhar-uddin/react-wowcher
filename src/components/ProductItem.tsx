import React from "react";
import { Product, formatNumber } from "../lib/common";
export interface Props { productData: Product[] }


const ProductItem: React.FC<Props> = props => {

    return (
        <>
            {props.productData.map((product: Product) => {
                return <tr key={product.name}>
                    <td>{product.name}</td>
                    <td>{formatNumber(product.unitPrice * product.sold)}</td>
                </tr>
            })}
        </>
    )

}

export default ProductItem;