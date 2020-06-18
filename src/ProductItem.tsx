import React from "react";

export const formatNumber = (number: number) => new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);

export interface Props { productData: any }


const ProductItem: React.FC<Props> = props => {

    return (
        <>
            {props.productData.map((product: any) => {
                return <tr key={product.name}>
                    <td>{product.name}</td>
                    <td>{formatNumber(product.unitPrice * product.sold)}</td>
                </tr>
            })}
        </>
    )

}

export default ProductItem;