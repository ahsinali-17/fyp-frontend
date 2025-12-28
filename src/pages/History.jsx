import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Search, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

const History = () => {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInspections(data || []);
    } catch (error) {
      toast.error('Could not load history');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = inspections.filter(item => {
    // 1. Filter Logic based on your 'prediction' column
    const isDefect = item.prediction?.toLowerCase().includes('defect');
    
    const matchesFilter = filter === 'All' 
      ? true 
      : filter === 'Defect' 
        ? isDefect 
        : !isDefect; // Assumes !isDefect means Clean/Normal
    
    // 2. Search Logic (Convert ID to string because your ID is int8)
    const idString = item.id.toString();
    const matchesSearch = idString.includes(searchTerm) || 
                          (item.device_name && item.device_name.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by ID or Device Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {['All', 'Defect', 'Clean'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                filter === f 
                  ? 'bg-slate-800 text-white shadow-lg' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">ID / Device</th>
              <th className="p-4">Date</th>
              <th className="p-4">Prediction</th>
              <th className="p-4">Confidence</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="6" className="p-8 text-center">Loading records...</td></tr>
            ) : filteredData.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-slate-400">No records found.</td></tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                      <img src={item.image_url} alt="Scan" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-700">#{item.id}</p>
                    <p className="text-xs text-slate-400">{item.device_name || 'Unknown Device'}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400"/>
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4">
                     {/* Show Defect Type if it exists, otherwise Prediction */}
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        item.prediction?.toLowerCase().includes('defect')
                          ? 'bg-red-50 text-red-700 border-red-100' 
                          : 'bg-green-50 text-green-700 border-green-100'
                      }`}>
                        {item.defect_type || item.prediction}
                      </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-700">
                    {/* Handle Confidence Display */}
                    {item.confidence ? `${(item.confidence * 100).toFixed(1)}%` : 'N/A'}
                  </td>
                  <td className="p-4 text-right">
                    <a 
                      href={item.image_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-blue-600 hover:underline text-sm font-medium cursor-pointer"
                    >
                      View Image
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;