import { useState, useEffect } from 'react';
import type { Product } from '../Interfaces/Product';
import Header from '../Components/Header';

export default function Home() {
  // DÜZELTME: Veriyi en başta, liste oluşurken hafızadan çekiyoruz!
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Ürünler her değiştiğinde hafızaya (localStorage) kaydet
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // EKLE & GÜNCELLE İşlemi
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return alert("Lütfen tüm alanları doldurun!");

    if (editingId) {
      // Güncelleme
      setProducts(products.map(p => 
        p.id === editingId ? { ...p, name, price: Number(price), stock: Number(stock) } : p
      ));
      setEditingId(null);
    } else {
      // Yeni Ekleme
      const newProduct: Product = {
        id: crypto.randomUUID(),
        name,
        price: Number(price),
        stock: Number(stock)
      };
      setProducts([...products, newProduct]);
    }
    setName(''); setPrice(''); setStock('');
  };

  // DÜZENLEME Moduna Geçiş
  const handleEdit = (product: Product) => {
    setName(product.name);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setEditingId(product.id);
  };

  // SİLME İşlemi
  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Header />
      <div className="max-w-4xl mx-auto p-6 mt-4">
        
        {/* FORM ALANI */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm border p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Örn: Gaming Laptop" />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm border p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="0" />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">Stok Adedi</label>
            <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm border p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="0" />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors h-[42px]">
            {editingId ? 'Güncelle' : 'Ekle'}
          </button>
        </form>

        {/* LİSTELEME ALANI (Tablo) */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ürün Adı</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fiyat</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stok</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{p.price} ₺</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {p.stock} Adet
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(p)} className="text-indigo-600 hover:text-indigo-900 mr-4 font-bold">Düzenle</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900 font-bold">Sil</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">
                    Henüz ürün eklenmedi. Yukarıdaki formu kullanarak ilk ürününüzü ekleyin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}