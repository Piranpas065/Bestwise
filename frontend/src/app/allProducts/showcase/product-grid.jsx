"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLoading } from "../../hooks/useLoading"
import Loader from "../../components/loader/page"

export function ProductGrid({ products, limit }) {
  const router = useRouter()
  const { loading, withLoading } = useLoading()
  const [hoveredProduct, setHoveredProduct] = useState(null)

  // Apply limit if provided
  const displayProducts = limit ? products.slice(0, limit) : products

  // Function to handle product click with loading state
  const handleProductClick = async (productId) => {
    await withLoading(async () => {
      router.push(`/productDetail/${productId}`)
    })
  }

  // Function to handle add to cart
  const handleAddToCart = (product) => {
    console.log("Added to cart:", product)
    // In a real app, this would dispatch an action to add the product to the cart
    alert(`Added ${product.name} to cart!`)
  }

  // Function to handle buy now
  const handleBuyNow = (product) => {
    console.log("Buy now:", product)
    // In a real app, this would redirect to checkout with this product
    alert(`Proceeding to checkout for ${product.name}!`)
  }

  if (displayProducts.length === 0) {
    return (
      <div className="text-gray-500 p-8 bg-gray-50 rounded-lg text-center">
        <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-medium mb-1">No products found</h3>
        <p>Try adjusting your filters to find what you're looking for.</p>
      </div>
    )
  }

  return (
    <>
      {loading && <Loader />}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {displayProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            onClick={() => handleProductClick(product.id)}
          >
            <div className="relative h-48">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain p-4" />

              {/* Discount tag */}
              {product.discount > 0 && (
                <div className="absolute top-0 left-0">
                  <div className="bg-red-600 text-white font-bold py-1 px-3 rounded-br-lg shadow-md flex items-center">
                    <span className="text-lg">{product.discount}%</span>
                    <span className="ml-1 text-xs">OFF</span>
                  </div>
                </div>
              )}

              {/* Size badge */}
              {product.attributes?.size && (
                <div className="absolute bottom-2 right-2">
                  <div className="bg-gray-800 bg-opacity-70 text-white text-xs py-1 px-2 rounded">
                    {product.attributes.size}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-medium text-gray-800 line-clamp-2 h-12">{product.name}</h3>

              <div className="flex items-center mt-1">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                {product.rating % 1 >= 0.5 && (
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                )}
                <span className="text-xs text-gray-500 ml-1">({product.ratingCount})</span>
              </div>

              <div className="mt-3">
                {product.discount > 0 ? (
                  <div className="flex items-center">
                    <span className="font-bold text-lg text-red-600">
                      £{(product.price * (1 - product.discount / 100)).toFixed(2)}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 line-through">£{product.price.toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="font-bold text-lg">£{product.price.toFixed(2)}</div>
                )}
              </div>

              {/* Stock indicator */}
              <div className="mt-1 mb-3">
                {product.stock <= 5 ? (
                  <span className="text-xs text-red-600">Only {product.stock} left in stock!</span>
                ) : product.stock <= 10 ? (
                  <span className="text-xs text-orange-500">Low stock: {product.stock} remaining</span>
                ) : (
                  <span className="text-xs text-green-600">In stock</span>
                )}
              </div>

              {/* Add to Cart and Buy Now buttons */}
              <div className="grid grid-cols-1 gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToCart(product)
                  }}
                  className="w-full py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add to Cart
                </button>
                {hoveredProduct === product.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBuyNow(product)
                    }}
                    className="w-full py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900 transition-colors"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
