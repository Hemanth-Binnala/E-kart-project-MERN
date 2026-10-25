import FilterSideBar from "@/components/FilterSideBar";
import ProductCard from "@/components/ProductCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setProducts } from "@/redux/productSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Products = () => {

    const {products} = useSelector(store => store.product)
    const [allProducts,setAllProducts] = useState([])
    const [loading,setLoading] = useState(false)
    const [search,setSearch] = useState("")
    const [category,setCategory] = useState("All")
    const [brand,setBrand] = useState("All")
    const [priceRange,setPriceRange] = useState([0,999999])
    const [sortOrder,setSortOrder] = useState('')
    const dispatch = useDispatch()

    const getAllProducts = async() => {
        try{
            setLoading(true)
            const res = await axios.get('http://localhost:8000/api/v1/product/getAllProducts');
            if(res.data.success){
                console.log("First product:", res.data.products[0]);
                setAllProducts(res.data.products)
                dispatch(setProducts(res.data.products))
            }
        }
        catch(error){
            console.log(error);
            toast.error(error.response.data.message)
        }
        finally{
          setLoading(false);
        }
    }


        useEffect(() => {
  let filtered = [...allProducts];

  // Search by product name
  if (search.trim()) {
    const searchText = search.trim().toLowerCase();

    filtered = filtered.filter((p) =>
      p.productName?.toLowerCase().includes(searchText)
    );
  }

  // Filter by category
  if (category !== "All") {
    filtered = filtered.filter((p) => p.category === category);
  }

  // Filter by brand
  if (brand !== "All") {
    filtered = filtered.filter((p) => p.brand === brand);
  }

  // Filter by price
  filtered = filtered.filter(
    (p) =>
      Number(p.productPrice) >= priceRange[0] &&
      Number(p.productPrice) <= priceRange[1]
  );

  // Sort by price
  if (sortOrder === "lowToHigh") {
  filtered.sort(
    (a, b) => Number(a.productPrice) - Number(b.productPrice)
  );
} else if (sortOrder === "highToLow") {
  filtered.sort(
    (a, b) => Number(b.productPrice) - Number(a.productPrice)
  );
}

  dispatch(setProducts(filtered));
}, [search, category, brand, priceRange, sortOrder, allProducts, dispatch]);

        useEffect(() => {
            getAllProducts()
        },[])

  return (
    <div className="pt-20 pd-10">
      <div className="max-w-7xl mx-auto flex gap-7">
        {/* side bar */}
        <FilterSideBar 
        search={search}
        setSearch={setSearch}
        brand={brand}
        setBrand={setBrand}
        category={category}
        setCategory={setCategory}
        allProducts={allProducts} 
        priceRange={priceRange}
        setPriceRange={setPriceRange}
         />

        {/* Main product section */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-end mb-4">
            <Select onValueChange={(value)=>setSortOrder(value)}>
              <SelectTrigger className="w-[200px">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="lowToHigh">
                    {" "}
                    Price : Low to High
                  </SelectItem>
                  <SelectItem value="highToLow">
                    {" "}
                    Price : High to Low
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
            {
                products.map((product) =>{
                    return <ProductCard key = {product._id} product = {product} loading = {loading} />
                })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
