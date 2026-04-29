import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Loader2, Zap, Sparkles } from 'lucide-react';

const Home = () => {
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const [page, setPage] = useState(1);
const [category, setCategory] = useState('');
const [categories, setCategories] = useState([]);

useEffect(() => {
const fetchCategories = async () => {
      try {
        const res = await axios.get('https://world.openfoodfacts.org/categories.json');
        setCategories(res.data.tags.slice(0, 10));
      } catch (err) { console.error(err); }
    };
    fetchCategories();
    fetchProducts(true); // Initial Load
  }, []);

  // Category change hone par automatic search
  useEffect(() => {
    if (category) {
      setPage(1);
      fetchProducts(true);
    }
  }, [category]);

  // Page change hone par load more
  useEffect(() => {
    if (page > 1) fetchProducts(false);
  }, [page]);

  const fetchProducts = async (isNewSearch = false) => {
    setLoading(true);
    try {
      // isNewSearch true hai toh page 1 se fetch karega
      let url = `https://world.openfoodfacts.org/cgi/search.pl?action=process&json=true&page=${isNewSearch ? 1 : page}&page_size=12&search_terms=${searchTerm}`;
      if (category) url += `&tagtype_0=categories&tag_contains_0=contains&tag_0=${category}`;
      
      const res = await axios.get(url);
      setProducts(prev => isNewSearch ? res.data.products : [...prev, ...res.data.products]);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  // Search Submit Handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(true);
  };

  const gradeColor = (grade) => {
    const colors = { a: 'from-emerald-400 to-green-600', b: 'from-green-400 to-lime-500', c: 'from-yellow-400 to-orange-500', d: 'from-orange-500 to-red-500', e: 'from-red-600 to-rose-800' };
    return colors[grade?.toLowerCase()] || 'from-slate-400 to-slate-600';
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30">
      <nav className="sticky top-0 z-50 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
               <Zap className="text-white w-6 h-6 fill-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">FOOD<span className="text-cyan-400 not-italic font-light">LAB</span></h1>
              <span className="text-[9px] font-bold text-slate-500 tracking-[0.3em] uppercase">Insight Engine</span>
            </div>
          </div>
          
          {/* SEARCH BAR FIXED: Form added to handle submit */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-1/2 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="text" placeholder="Search product..."
                className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-white/10 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="px-6 bg-cyan-500 hover:bg-cyan-400 text-white font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest"
            >
              Search
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setCategory(category === cat.name ? '' : cat.name)} 
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${category === cat.name ? 'bg-cyan-500 text-white' : 'bg-slate-900 text-slate-500 border border-white/5'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p, index) => (
            <Link to={`/product/${p.code}`} key={`${p.code}-${index}`} className="group relative bg-slate-900/40 hover:bg-slate-900/80 rounded-[2.5rem] p-6 border border-white/5 hover:border-cyan-500/40 transition-all duration-500 flex flex-col h-full">
              <div className="relative h-64 mb-8 rounded-3xl bg-black/20 overflow-hidden border border-white/5">
                <img 
                    src={p.image_front_url || p.image_front_small_url || 'https://via.placeholder.com/300'} 
                    alt={p.product_name} 
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
                />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-white font-black text-[10px] bg-gradient-to-br ${gradeColor(p.nutrition_grades)} uppercase`}>
                  Grade {p.nutrition_grades || 'NA'}
                </div>
              </div>
              <h3 className="font-bold text-white text-lg line-clamp-2 mb-2 uppercase tracking-tight h-14">{p.product_name || 'Unknown Product'}</h3>
              <p className="text-slate-500 font-black text-[9px] tracking-[0.2em] uppercase mb-6">{p.categories?.split(',')[0] || 'Uncategorized'}</p>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                 <span className="text-slate-600 text-[10px] font-mono tracking-tighter">REF: {p.code?.slice(-8)}</span>
                 <div className="text-cyan-400 font-black text-xs opacity-0 group-hover:opacity-100 transition-all">VIEW →</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-24 mb-20 flex justify-center">
          <button 
            disabled={loading} 
            onClick={() => setPage(prev => prev + 1)} 
            className="px-12 py-4 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-all flex items-center gap-4 uppercase tracking-widest text-[10px]"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <><span>Load More Data</span><Sparkles className="w-4 h-4" /></>}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;