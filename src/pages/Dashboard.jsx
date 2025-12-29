import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { 
  Activity, AlertTriangle, CheckCircle, Clock, ArrowRight, Loader2
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, defects: 0, clean: 0 });
  const [recentScans, setRecentScans] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetching recent 5 inspections
      const { data: recent, error } = await supabase
        .from('inspections') 
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentScans(recent || []);

      // Fetch all for stats
      const { data: all } = await supabase
        .from('inspections')
        .select('prediction')
        .eq('user_id', user.id);

      if (all) {
        const total = all.length;
        const defects = all.filter(i => 
          i.prediction?.toLowerCase().includes('defect') || 
          i.prediction?.toLowerCase() === 'damaged'
        ).length;
        
        const clean = total - defects;
        setStats({ total, defects, clean });
      }

    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to inspect?</h2>
            <p className="text-slate-300 max-w-lg text-sm md:text-base">
              Launch a new AI diagnostic scan to detect screen defects instantly.
            </p>
          </div>
          <button 
            onClick={() => navigate('/inspection')}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Start New Scan <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard 
          title="Total Scans" 
          value={stats.total} 
          icon={Activity} 
          type="blue" 
        />
        <StatCard 
          title="Defects Found" 
          value={stats.defects} 
          icon={AlertTriangle} 
          type="red" 
        />
        <StatCard 
          title="Pass Rate" 
          value={stats.total > 0 ? `${((stats.clean / stats.total) * 100).toFixed(1)}%` : '0%'} 
          icon={CheckCircle} 
          type="green" 
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm md:text-base">
            <Clock size={18} className="text-slate-400" /> Recent Activity
          </h3>
          <button 
            onClick={() => navigate('/history')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
          >
            View All
          </button>
        </div>
        
        <div className="divide-y divide-slate-50">
          {recentScans.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No scans recorded yet.</div>
          ) : (
            recentScans.map((scan) => (
              <div 
                key={scan.id} 
                onClick={() => navigate('/history')}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                    <img src={scan.image_url} alt="Scan" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm md:text-base group-hover:text-blue-600 transition-colors">
                      Scan ID #{scan.id}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(scan.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <StatusBadge status={scan.prediction} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, type }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colors[type]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const isDefect = status?.toLowerCase().includes('defect') || status?.toLowerCase().includes('damaged');
  
  return (
    <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-medium border ${
      isDefect 
        ? 'bg-red-50 text-red-700 border-red-100' 
        : 'bg-green-50 text-green-700 border-green-100'
    }`}>
      {status || 'Unknown'}
    </span>
  );
};

export default Dashboard;