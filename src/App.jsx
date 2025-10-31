import React, { useState, useEffect } from 'react';
import { Search, Download, Lock, X, Check, Calendar, MapPin, Phone, Edit2, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';

const colors = {
  primary: '#84C225',
  primaryDark: '#6FA01E',
  secondary: '#F8A51C',
  danger: '#E43D3D',
  success: '#27AE60',
  background: '#F7F7F7',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textLight: '#666666',
  border: '#E0E0E0',
};

// MODIFIED: Removed mallPrice from all items in the initial data structure
const initialData = {
  dealer: {
    name: "Lakshmi Traders",
    location: "Shevapet, Salem - 636002",
    phone: "+91 98765 43210",
    email: "contact@laksh.com"
  },
  lastUpdated: new Date().toISOString(),
  announcements: [
    "📢 துவரம் பருப்பு விலை அதிகரித்துள்ளது - Toor Dal price increased!",
    "🔔 இன்றைய சிறப்பு: கடலை பருப்பு குறைந்த விலையில் - Special offer on Chana Dal!",
    "⚠️ உளுத்தம் பருப்பு இருப்பு குறைவு - Limited stock on Urad Dal!",
    "💰 வெள்ளை கடலை விலை நிலையானது - White Channa price stable!",
  ],
  categories: {
    dhalls: {
      name: "Dhalls (பருப்பு)",
      icon: "🫘",
      items: [
        { id: 201, name: "Toor Dal (துவரம் பருப்பு)", icon: "🫘", wholesalePrice: 145, retailPrice: "155 - 165", unit: "1kg", previousPrice: 140, stock: "In Stock" },
        { id: 202, name: "Urad Dal (உளுத்தம் பருப்பு)", icon: "🫘", wholesalePrice: 135, retailPrice: "145 - 155", unit: "1kg", previousPrice: 138, stock: "Low Stock" },
        { id: 203, name: "Chana Dal (கடலை பருப்பு)", icon: "🫘", wholesalePrice: 110, retailPrice: "120 - 130", unit: "1kg", previousPrice: 115, stock: "In Stock" },
        { id: 204, name: "Moong Dal (பாசிப் பருப்பு)", icon: "🫘", wholesalePrice: 125, retailPrice: "135 - 145", unit: "1kg", previousPrice: 125, stock: "In Stock" },
        { id: 205, name: "Masoor Dal (மசூர் பருப்பு)", icon: "🫘", wholesalePrice: 95, retailPrice: "105 - 115", unit: "1kg", previousPrice: 95, stock: "In Stock" }
      ]
    },
    pulses: {
      name: "Pulses (பயறு)",
      icon: "🫛",
      items: [
        { id: 301, name: "White Channa (வெள்ளை கடலை)", icon: "🫛", wholesalePrice: 85, retailPrice: "95 - 105", unit: "1kg", previousPrice: 82, stock: "In Stock" },
        { id: 302, name: "Black Channa (கறுப்பு கடலை)", icon: "🫛", wholesalePrice: 90, retailPrice: "100 - 110", unit: "1kg", previousPrice: 90, stock: "In Stock" },
        { id: 303, name: "Green Peas (பச்சை பட்டாணி)", icon: "🫛", wholesalePrice: 95, retailPrice: "105 - 115", unit: "1kg", previousPrice: 93, stock: "In Stock" },
        { id: 304, name: "White Peas (வெள்ளை பட்டாணி)", icon: "🫛", wholesalePrice: 80, retailPrice: "90 - 100", unit: "1kg", previousPrice: 80, stock: "In Stock" },
        { id: 305, name: "Lobia (காராமணி)", icon: "🫛", wholesalePrice: 100, retailPrice: "110 - 120", unit: "1kg", previousPrice: 98, stock: "In Stock" },
      ]
    },
    spices: {
      name: "Spices (மசாலா)",
      icon: "🌶️",
      items: [
        { id: 401, name: "Cumin Seeds (சீரகம்)", icon: "🌿", wholesalePrice: 450, retailPrice: "480 - 510", unit: "1kg", previousPrice: 445, stock: "In Stock" },
        { id: 402, name: "Mustard Seeds (கடுகு)", icon: "🌿", wholesalePrice: 180, retailPrice: "195 - 210", unit: "1kg", previousPrice: 180, stock: "In Stock" },
        { id: 403, name: "Fenugreek (வெந்தயம்)", icon: "🌿", wholesalePrice: 120, retailPrice: "130 - 145", unit: "1kg", previousPrice: 118, stock: "In Stock" },
      ]
    },
    nuts: {
      name: "Nuts",
      icon: "🥜",
      items: [
        { id: 501, name: "Almonds (பாதாம்)", icon: "🥜", wholesalePrice: 750, retailPrice: "800 - 850", unit: "1kg", previousPrice: 735, stock: "In Stock" },
        { id: 502, name: "Cashew (முந்திரி)", icon: "🥜", wholesalePrice: 650, retailPrice: "695 - 740", unit: "1kg", previousPrice: 650, stock: "In Stock" },
        { id: 503, name: "Raisins (திராட்சை)", icon: "🍇", wholesalePrice: 280, retailPrice: "305 - 325", unit: "1kg", previousPrice: 275, stock: "In Stock" },
      ]
    }
  }
};

const BigBasketDashboard = () => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('wholesaleData');
      return saved ? JSON.parse(saved) : initialData;
    } catch (error) {
      console.error('Error loading data:', error);
      return initialData;
    }
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('isAdmin');
      return saved === 'true';
    } catch (error) {
      return false;
    }
  });

  const [adminPassword, setAdminPassword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  // MODIFIED: Removed mallPrice from newItem state
  const [newItem, setNewItem] = useState({
    name: '',
    tamilName: '',
    category: 'dhalls',
    wholesalePrice: '',
    retailPrice: '',
    stock: 'In Stock'
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('wholesaleData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem('isAdmin', isAdmin.toString());
    } catch (error) {
      console.error('Error saving admin state:', error);
    }
  }, [isAdmin]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminPassword('');
      showToast('✅ Admin access granted!', 'success');
    } else {
      showToast('❌ Invalid password', 'error');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    showToast('✅ Logged out successfully!', 'success');
  };

  // MODIFIED: handleUpdateRate no longer processes mallPrice
  const handleUpdateRate = () => {
    if (!editItem) return;
    
    setData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const category = newData.categories[editItem.categoryKey];
      const item = category.items.find(i => i.id === editItem.id);
      
      if (item) {
        item.previousPrice = item.wholesalePrice;
        item.wholesalePrice = parseFloat(editItem.wholesalePrice);
        item.retailPrice = editItem.retailPrice;
      }
      
      newData.lastUpdated = new Date().toISOString();
      return newData;
    });
    
    setShowEditModal(false);
    setEditItem(null);
    showToast('✅ Prices updated successfully!', 'success');
  };

  // MODIFIED: handleAddItem no longer validates or processes mallPrice
  const handleAddItem = () => {
    if (!newItem.name.trim() || !newItem.wholesalePrice || parseFloat(newItem.wholesalePrice) <= 0 || !newItem.retailPrice.trim()) {
      showToast('❌ Please fill all required fields', 'error');
      return;
    }

    const categoryItems = data.categories[newItem.category].items;
    const isDuplicate = categoryItems.some(item => 
      item.name.toLowerCase().includes(newItem.name.toLowerCase().trim())
    );

    if (isDuplicate) {
      showToast('❌ Item already exists in this category', 'error');
      return;
    }

    let maxId = 0;
    Object.values(data.categories).forEach(cat => {
      cat.items.forEach(item => { if (item.id > maxId) maxId = item.id; });
    });
    const newId = maxId + 1;

    const fullName = newItem.tamilName.trim() ? `${newItem.name} (${newItem.tamilName})` : newItem.name;

    setData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const category = newData.categories[newItem.category];
      
      const itemToAdd = {
        id: newId,
        name: fullName,
        icon: category.icon,
        wholesalePrice: parseFloat(newItem.wholesalePrice),
        retailPrice: newItem.retailPrice,
        unit: "1kg",
        previousPrice: parseFloat(newItem.wholesalePrice),
        stock: newItem.stock
      };
      
      category.items.push(itemToAdd);
      newData.lastUpdated = new Date().toISOString();
      return newData;
    });

    setNewItem({ name: '', tamilName: '', category: 'dhalls', wholesalePrice: '', retailPrice: '', stock: 'In Stock' });
    setShowAddModal(false);
    showToast('✅ Item added successfully!', 'success');
  };

  // MODIFIED: exportToCSV no longer includes the Mall column
  const exportToCSV = () => {
    let csv = 'Category,Item,Wholesale,Retail,Unit,Stock\n';
    Object.entries(data.categories).forEach(([key, category]) => {
      category.items.forEach(item => {
        csv += `"${category.name}","${item.name}",${item.wholesalePrice},"${item.retailPrice}",${item.unit},${item.stock}\n`;
      });
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wholesale-rates-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('✅ CSV exported successfully!', 'success');
  };

  const getFilteredItems = () => {
    let allItems = [];
    Object.entries(data.categories).forEach(([key, category]) => {
      if (selectedCategory === 'all' || selectedCategory === key) {
        category.items.forEach(item => {
          if (searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            allItems.push({ ...item, categoryKey: key, categoryName: category.name, categoryIcon: category.icon });
          }
        });
      }
    });
    return allItems;
  };

  const filteredItems = getFilteredItems();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, padding: '12px 20px', borderRadius: '8px', backgroundColor: toast.type === 'success' ? colors.success : colors.danger, color: 'white', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', animation: 'slideIn 0.3s ease' }}>
          {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
          <span style={{ fontSize: '14px', fontWeight: '500' }}>{toast.message}</span>
        </div>
      )}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: colors.surface, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderBottom: `3px solid ${colors.primary}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: colors.primary, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🛒</div>
              <div>
                <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: colors.text }}>{data.dealer.name}</h1>
                <p style={{ margin: 0, fontSize: '11px', color: colors.textLight, display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={11} /> {data.dealer.location}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <a href={`tel:${data.dealer.phone}`} style={{ color: colors.primary, fontSize: '13px', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }} className="desktop-only"><Phone size={14} />{data.dealer.phone}</a>
              <button onClick={() => isAdmin ? handleAdminLogout() : setShowAdminModal(true)} style={{ padding: '8px 16px', backgroundColor: isAdmin ? colors.success : colors.danger, color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'transform 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
                <Lock size={14} />{isAdmin ? '✓ Logout' : 'Admin'}
              </button>
            </div>
          </div>
        </div>
      </header>
      <div style={{ backgroundColor: '#FFF3CD', borderTop: `2px solid ${colors.secondary}`, borderBottom: `2px solid ${colors.secondary}`, padding: '8px 0', overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'flex', animation: 'scroll 30s linear infinite', whiteSpace: 'nowrap' }}>
          {[...data.announcements, ...data.announcements].map((announcement, index) => (<span key={index} style={{ display: 'inline-block', padding: '0 50px', fontSize: '13px', fontWeight: '600', color: '#856404' }}>{announcement}</span>))}
        </div>
      </div>
      <div style={{ backgroundColor: colors.primary, color: 'white', padding: '6px 20px', textAlign: 'center', fontSize: '12px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
        <Calendar size={14} />Last Updated: {new Date(data.lastUpdated).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 20px' }}>
        <div style={{ backgroundColor: colors.surface, padding: '14px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', marginBottom: '14px' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: '700', color: colors.text }}>Daily Wholesale Rates</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <div style={{ flex: '1 1 220px', position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.textLight }} size={16} />
              <input type="text" placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 38px', border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = colors.primary} onBlur={(e) => e.target.style.borderColor = colors.border} />
            </div>
            {isAdmin && (<button onClick={() => setShowAddModal(true)} style={{ padding: '10px 18px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primaryDark; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.primary; }}><span style={{ fontSize: '16px' }}>➕</span>Add Item</button>)}
            <button onClick={exportToCSV} style={{ padding: '10px 18px', backgroundColor: colors.secondary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E89510'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.secondary; }}><Download size={16} />Export CSV</button>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button onClick={() => setSelectedCategory('all')} style={{ padding: '6px 14px', backgroundColor: selectedCategory === 'all' ? colors.primary : colors.surface, color: selectedCategory === 'all' ? 'white' : colors.text, border: `2px solid ${selectedCategory === 'all' ? colors.primary : colors.border}`, borderRadius: '18px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>All Items</button>
            {Object.entries(data.categories).map(([key, cat]) => (<button key={key} onClick={() => setSelectedCategory(key)} style={{ padding: '6px 14px', backgroundColor: selectedCategory === key ? colors.primary : colors.surface, color: selectedCategory === key ? 'white' : colors.text, border: `2px solid ${selectedCategory === key ? colors.primary : colors.border}`, borderRadius: '18px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ fontSize: '14px' }}>{cat.icon}</span>{cat.name}</button>))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredItems.map((item) => {
            const priceChange = item.wholesalePrice - item.previousPrice;
            return (
              <div key={item.id} style={{ backgroundColor: colors.surface, borderRadius: '10px', padding: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', transition: 'all 0.2s', cursor: 'pointer', border: `1px solid ${colors.border}` }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ width: '56px', height: '56px', backgroundColor: colors.background, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: '1 1 160px', minWidth: '160px' }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700', color: colors.text, lineHeight: '1.3' }}>{item.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: colors.primary }}>₹{item.wholesalePrice}</span>
                      <span style={{ fontSize: '11px', color: colors.textLight, fontWeight: '500' }}>/ {item.unit}</span>
                      {priceChange !== 0 && (<span style={{ fontSize: '10px', fontWeight: '700', color: priceChange > 0 ? colors.success : colors.danger, display: 'flex', alignItems: 'center', gap: '2px' }}>{priceChange > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}₹{Math.abs(priceChange)}</span>)}
                    </div>
                  </div>
                  {/* MODIFIED: Item card now only shows Retail price, layout adjusted */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px', flex: '1 1 190px' }}>
                    <div style={{ padding: '6px', backgroundColor: colors.background, borderRadius: '6px', border: `1px solid ${colors.border}` }}>
                      <div style={{ fontSize: '9px', color: colors.textLight, marginBottom: '2px', fontWeight: '600' }}>Retail</div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: colors.text }}>₹{item.retailPrice}</div>
                    </div>
                  </div>
                  {isAdmin ? (<button onClick={(e) => { e.stopPropagation(); setEditItem({ ...item }); setShowEditModal(true); }} style={{ padding: '8px 12px', backgroundColor: colors.secondary, color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'transform 0.2s', flexShrink: 0 }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}><Edit2 size={12} />Edit</button>) : (<ChevronRight size={20} color={colors.textLight} style={{ flexShrink: 0 }} />)}
                </div>
              </div>
            );
          })}
        </div>
        {filteredItems.length === 0 && (<div style={{ backgroundColor: colors.surface, borderRadius: '12px', padding: '50px 20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}><div style={{ fontSize: '60px', marginBottom: '16px' }}>🔍</div><p style={{ fontSize: '16px', color: colors.textLight, margin: 0 }}>No items found</p></div>)}
      </div>

      {showAdminModal && (<div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }} onClick={() => setShowAdminModal(false)}><div style={{ backgroundColor: colors.surface, borderRadius: '16px', padding: '28px', maxWidth: '380px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}><h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: colors.text }}>Admin Login</h3><button onClick={() => setShowAdminModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textLight }}><X size={22} /></button></div><input type="password" placeholder="Enter admin password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()} style={{ width: '100%', padding: '12px', border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', marginBottom: '14px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = colors.primary} onBlur={(e) => e.target.style.borderColor = colors.border} /><button onClick={handleAdminLogin} style={{ width: '100%', padding: '12px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>Login</button><p style={{ marginTop: '14px', fontSize: '11px', color: colors.textLight, textAlign: 'center' }}>Demo password: admin123</p></div></div>)}
      
      {/* MODIFIED: Edit Modal without Mall Price */}
      {showEditModal && editItem && (<div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }} onClick={() => setShowEditModal(false)}><div style={{ backgroundColor: colors.surface, borderRadius: '16px', padding: '28px', maxWidth: '450px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}><h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: colors.text }}>Update Rates</h3><button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textLight }}><X size={22} /></button></div><div style={{ marginBottom: '16px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: colors.text, marginBottom: '6px' }}>Item Name</label><input type="text" value={editItem.name} disabled style={{ width: '100%', padding: '10px', border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', backgroundColor: colors.background, color: colors.textLight }} /></div><div style={{ marginBottom: '16px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: colors.text, marginBottom: '6px' }}>Wholesale Price (₹)</label><input type="number" value={editItem.wholesalePrice} onChange={(e) => setEditItem({ ...editItem, wholesalePrice: e.target.value })} style={{ width: '100%', padding: '10px', border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = colors.primary} onBlur={(e) => e.target.style.borderColor = colors.border} /></div><div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: colors.text, marginBottom: '6px' }}>Retail Price Range</label><input type="text" placeholder="e.g., 155 - 165" value={editItem.retailPrice} onChange={(e) => setEditItem({ ...editItem, retailPrice: e.target.value })} style={{ width: '100%', padding: '10px', border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = colors.primary} onBlur={(e) => e.target.style.borderColor = colors.border} /></div><button onClick={handleUpdateRate} style={{ width: '100%', padding: '12px', backgroundColor: colors.success, color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>Update Prices</button></div></div>)}
      
      {/* MODIFIED: Add Modal without Mall Price */}
      {showAddModal && (<div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }} onClick={() => setShowAddModal(false)}><div style={{ backgroundColor: colors.surface, borderRadius: '16px', padding: '28px', maxWidth: '450px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}><h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: colors.text }}>Add New Item</h3><button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textLight }}><X size={22} /></button></div><div style={{ marginBottom: '16px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: colors.text, marginBottom: '6px' }}>Item Name <span style={{ color: colors.danger }}>*</span></label><input type="text" placeholder="e.g., Masoor Dal" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} style={{ width: '100%', padding: '10px', border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = colors.primary} onBlur={(e) => e.target.style.borderColor = colors.border} /></div><div style={{ marginBottom: '16px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: colors.text, marginBottom: '6px' }}>Tamil Name (Optional)</label><input type="text" placeholder="e.g., மசூர் பருப்பு" value={newItem.tamilName} onChange={(e) => setNewItem({ ...newItem, tamilName: e.target.value })} style={{ width: '100%', padding: '10px', border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = colors.primary} onBlur={(e) => e.target.style.borderColor = colors.border} /></div><div style={{ marginBottom: '16px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: colors.text, marginBottom: '6px' }}>Category <span style={{ color: colors.danger }}>*</span></label><select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} style={{ width: '100%', padding: '10px', border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: colors.surface, cursor: 'pointer' }} onFocus={(e) => e.target.style.borderColor = colors.primary} onBlur={(e) => e.target.style.borderColor = colors.border}>{Object.entries(data.categories).map(([key, cat]) => (<option key={key} value={key}>{cat.icon} {cat.name}</option>))} </select></div><div style={{ marginBottom: '16px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: colors.text, marginBottom: '6px' }}>Wholesale Price (₹) <span style={{ color: colors.danger }}>*</span></label><input type="number" placeholder="e.g., 145" value={newItem.wholesalePrice} onChange={(e) => setNewItem({ ...newItem, wholesalePrice: e.target.value })} style={{ width: '100%', padding: '10px', border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = colors.primary} onBlur={(e) => e.target.style.borderColor = colors.border} /></div><div style={{ marginBottom: '16px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: colors.text, marginBottom: '6px' }}>Retail Price Range <span style={{ color: colors.danger }}>*</span></label><input type="text" placeholder="e.g., 155 - 165" value={newItem.retailPrice} onChange={(e) => setNewItem({ ...newItem, retailPrice: e.target.value })} style={{ width: '100%', padding: '10px', border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = colors.primary} onBlur={(e) => e.target.style.borderColor = colors.border} /></div><div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: colors.text, marginBottom: '6px' }}>Stock Status <span style={{ color: colors.danger }}>*</span></label><select value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })} style={{ width: '100%', padding: '10px', border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: colors.surface, cursor: 'pointer' }} onFocus={(e) => e.target.style.borderColor = colors.primary} onBlur={(e) => e.target.style.borderColor = colors.border}><option value="In Stock">In Stock</option><option value="Low Stock">Low Stock</option><option value="Out of Stock">Out of Stock</option></select></div><div style={{ display: 'flex', gap: '10px' }}><button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', backgroundColor: colors.background, color: colors.text, border: `2px solid ${colors.border}`, borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>Cancel</button><button onClick={handleAddItem} style={{ flex: 1, padding: '12px', backgroundColor: colors.success, color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>Add Item</button></div></div></div>)}

      <footer style={{ backgroundColor: colors.text, color: 'white', padding: '24px 20px', textAlign: 'center', marginTop: '30px' }}>
        <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>© 2025 {data.dealer.name}. All rights reserved.</p>
        <p style={{ margin: '6px 0 0 0', fontSize: '11px', opacity: 0.7 }}>Fresh • Affordable • Reliable</p>
      </footer>

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .desktop-only { display: flex; }
        @media (max-width: 768px) { .desktop-only { display: none !important; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${colors.background}; }
        ::-webkit-scrollbar-thumb { background: ${colors.primary}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${colors.primaryDark}; }
        button { -webkit-tap-highlight-color: transparent; }
        input:focus, select:focus { box-shadow: 0 0 0 3px ${colors.primary}33; border-color: ${colors.primary} !important; }
      `}</style>
    </div>
  );
};

export default BigBasketDashboard;
