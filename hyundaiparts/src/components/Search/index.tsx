import React, { useState } from "react"; 
import axios from "axios"; 
import s from "./search.module.scss"; 
import Link from "next/link"; 
import { Image } from "react-bootstrap";
 
 
const Search = () => { 
  const [searchText, setSearchText] = useState(""); 
  const [products, setProducts] = useState([]); 
  const [showResults, setShowResults] = useState(false); 
 
  const handleSearch = async () => { 
    const response = await axios.get(`https://fakestoreapi.com/products`); 
    const filteredProducts = response.data.filter((product:any) => 
      product.title.toLowerCase().includes(searchText.toLowerCase()) 
    ); 
    setProducts(filteredProducts); 
    setShowResults(true); 
  };
 
  // Додайте цей код для реалізації debounce. 
  const debounce = (func:any, delay:any) => { 
    let timeoutId:any; 
    return function () { 
      const context = this; 
      const args = arguments; 
      clearTimeout(timeoutId); 
      timeoutId = setTimeout(() => { 
        func.apply(context, args); 
      }, delay); 
    }; 
  }; 
  // debounce використовується для затримки виконання функції handleSearch. 
  const debouncedSearch = debounce(handleSearch, 500); 
 
  const closeResults = () => { 
    setShowResults(false); 
  }; 
 
  return ( 
    <div className={s.search}> 
      <input 
        type="text" 
        placeholder="Search H'PARTS" 
        value={searchText} 
        onChange={(e) => { 
          setSearchText(e.target.value); 
          // Затримка виконання handleSearch на 1000 мс. 
          debouncedSearch(); 
        }} 
      /> 
      <button type="submit" onClick={handleSearch}> 
        Search 
      </button> 
      {showResults && ( 
        <div 
          className={s.results} 
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            padding: "10px", 
            border: "1px solid silver", 
            marginBottom: "10px", 
            borderRadius:'8px'
          }} 
        > 
          <button 
            onClick={() => { 
              setShowResults(false); 
              setSearchText(""); 
            }} 
            className={s.results__close} 
          > 
            close 
          </button> 
          {products.length ? ( 
            products.map((product) => ( 
              <Link 
                style={{ 
                  textDecoration: "none", 
                  color: "#000", 
                  width: "100%", 
                }} 
                href={`/market/${product.id}?${product.title}?category=${product.category}`} 
 
                onClick={() => { 
                  setShowResults(false); 
                  setSearchText(""); 
                }} 
              > 
                <div 
                  key={product.id} 
                  style={{ 
                    display: "flex", 
                    flexDirection: "row", 
                    alignItems: "center", 
                    justifyContent: "start", 
                    padding: "10px ", 
                    border: "1px solid silver", 
                    marginBottom: "10px", 
                    width: "100%", 
                    maxWidth: "500px", 
                    cursor: "pointer", 
                    borderRadius:'8px'
                  }} 
                > 
                  <Image
                    style={{ 
                      width: "50px", 
                      height: "50px", 
                      marginRight: "10px", 
                    }} 
                    src={product.image} 
                    alt={product.title} 
                  /> 
                  <div> 
                    <h5>{product.title}</h5> 
                    <p 
                      style={{ 
                        fontSize: "16px", 
                        color: "green", 
                      }} 
                    > 
                      {product.price} USD 
                    </p> 
                  </div> 
                </div> 
              </Link> 
            )) 
          ) : ( 
            <p>No results found</p> 
          )} 
        </div> 
      )} 
    </div> 
  ); 
}; 
 
export default Search;