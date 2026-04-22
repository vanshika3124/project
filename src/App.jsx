import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader2 } from 'lucide-react';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch Categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://world.openfoodfacts.org/categories.json');
        setCategories(res.data.tags.slice(0, 15)); // Sirf top 15 categories dikhayenge
      } catch (err) { console.error(err); }
    };
    fetchCategories();
  }, []);

  // Fetch Products based on Page and Category
  useEffect(() => {
    fetchProducts();
  }, [page, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `https://world.openfoodfacts.org/cgi/search.pl?action=process&json=true&page=${page}&page_size=12`;
      if (category) url += `&tagtype_0=categories&tag_contains_0=contains&tag_0=${category}`;
      
      const res = await axios.get(url);
      setProducts(prev => page === 1 ? res.data.products : [...prev, ...res.data.products]);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white shadow-sm p-4 sticky top-0 z-50">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-blue-600 tracking-tight">🍎 FOOD INSIGHT</h1>
          
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search by name or barcode..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Category Filters */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
          <button 
            onClick={() => {setCategory(''); setPage(1);}}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!category ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => {setCategory(cat.name); setPage(1);}}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${category === cat.name ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
            .filter(p => p.product_name?.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((product) => (
            <div key={`${product.code}-${Math.random()}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col h-full hover:shadow-lg transition-all duration-300">
              <img 
                src={product.image_front_small_url || 'https://via.placeholder.com/150'} 
                alt={product.product_name}
                className="h-40 w-full object-contain mb-4 rounded-lg"
              />
              <h3 className="font-bold text-gray-800 line-clamp-1 mb-1 uppercase text-sm">{product.product_name || 'Unknown Item'}</h3>
              <p className="text-[10px] text-gray-400 font-bold mb-3 uppercase tracking-widest">{product.categories?.split(',')[0]}</p>
              
              <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                  product.nutrition_grades === 'a' ? 'bg-green-100 text-green-700' : 
                  product.nutrition_grades === 'd' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  GRADE: {product.nutrition_grades || 'N/A'}
                </span>
                <button className="text-blue-600 text-xs font-black hover:tracking-widest transition-all uppercase">View →</button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-12 mb-10">
          <button 
            disabled={loading}
            onClick={() => setPage(prev => prev + 1)}
            className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full font-black text-sm uppercase hover:bg-blue-600 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Load More Products'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;