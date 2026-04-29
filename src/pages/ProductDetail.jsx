import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Info, Zap, Beef, FlaskConical, CheckCircle2, ShoppingBag } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${id}.json`);
        setProduct(res.data.product);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center font-black text-white text-4xl tracking-tighter animate-pulse uppercase">
      LOADING_DATA...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500">
      {/* BACK BUTTON */}
      <button 
        onClick={() => navigate(-1)} 
        className="fixed top-8 left-8 z-50 bg-white text-slate-950 p-4 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 transition-all"
      >
        <ArrowLeft className="w-6 h-6 stroke-[3]" />
      </button>

      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* LEFT: IMAGE SECTION (STUCK) */}
        <div className="lg:w-1/2 h-[60vh] lg:h-screen bg-slate-900/50 flex items-center justify-center p-12 lg:sticky lg:top-0 border-b lg:border-b-0 lg:border-r border-white/10">
          <div className="relative group">
            <div className="absolute -inset-10 bg-blue-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <img 
              src={product?.image_front_url} 
              alt={product?.product_name} 
              className="relative max-w-full max-h-[70vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-105" 
            />
          </div>
        </div>

        {/* RIGHT: CONTENT SECTION */}
        <div className="lg:w-1/2 p-8 lg:p-24 overflow-y-auto">
          <div className="max-w-xl space-y-12">
            
            {/* HEADER */}
            <div>
              <span className="inline-block px-3 py-1 bg-blue-600 text-[10px] font-black tracking-[0.3em] uppercase mb-6 rounded-sm">
                {product?.brands || "UNKNOWN BRAND"}
              </span>
              <h1 className="text-6xl lg:text-8xl font-black leading-[0.85] uppercase tracking-tighter mb-8 italic">
                {product?.product_name}
              </h1>
              
              <div className="flex flex-wrap gap-3">
                <div className="px-5 py-2 border-2 border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:text-slate-950 transition-colors">
                  <Info className="w-4 h-4" /> GRADE {product?.nutrition_grades?.toUpperCase() || 'N/A'}
                </div>
                <div className="px-5 py-2 border-2 border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:text-slate-950 transition-colors">
                  <CheckCircle2 className="w-4 h-4" /> {product?.states_tags?.[0]?.replace('en:', '') || 'VERIFIED'}
                </div>
              </div>
            </div>

            {/* INGREDIENTS */}
            <section className="p-8 border-2 border-white/5 rounded-[40px] bg-white/[0.02]">
              <h3 className="text-blue-500 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                <FlaskConical className="w-4 h-4" /> THE_COMPOSITION
              </h3>
              <p className="text-xl text-slate-300 leading-tight font-bold uppercase tracking-tight">
                {product?.ingredients_text || "INGREDIENT TRANSPARENCY UNAVAILABLE."}
              </p>
            </section>

            {/* NUTRITION BENTO */}
            <section>
              <h3 className="text-slate-500 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4" /> PER_100G_ANALYSIS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'ENERGY', value: `${product?.nutriments?.energy_100g || 0} KCAL`, icon: <Zap />, color: 'bg-white text-slate-950' },
                  { label: 'PROTEINS', value: `${product?.nutriments?.proteins_100g || 0} G`, icon: <Beef />, color: 'bg-blue-600 text-white' }
                ].map((stat, i) => (
                  <div key={i} className={`p-8 rounded-[35px] ${stat.color} flex flex-col justify-between h-40 transition-transform hover:-rotate-2`}>
                    <div className="flex justify-between items-start">
                       <span className="font-black text-4xl tracking-tighter leading-none">{stat.value}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{stat.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* CERTIFICATIONS */}
            {product?.labels && (
              <section className="pt-8 border-t border-white/10">
                <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] mb-6">CERTIFICATIONS</h3>
                <div className="flex flex-wrap gap-3">
                  {product.labels.split(',').slice(0, 5).map((l, i) => (
                    <span key={i} className="text-[10px] font-black text-white/40 border border-white/10 px-4 py-2 rounded-full uppercase hover:border-blue-500 hover:text-blue-500 transition-colors">
                      {l.trim()}
                    </span>
                  ))}
                </div>
              </section>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;