import React, { useEffect, useState } from 'react';
import { Users, Activity, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getPartners } from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-base-content/60 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-base-content">{value}</h3>
      </div>
      <div className="relative p-3 rounded-xl overflow-hidden">
        <div className={`absolute inset-0 ${color} opacity-10`}></div>
        <div className="relative z-10">
          {icon}
        </div>
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <span className="text-green-500 text-sm font-medium flex items-center gap-1">
        <TrendingUp size={14} /> {trend}
      </span>
      <span className="text-base-content/40 text-xs">vs last month</span>
    </div>
  </div>
);

const DashboardHome = () => {
  const { user, userData } = useAuth();
  const [partnerCount, setPartnerCount] = useState(0);
  const [recentRequests, setRecentRequests] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Generate dynamic chart data based on real user stats
    const generateChartData = () => {
      const data = [];
      const totalRequests = userData?.sentRequests?.length || 0;
      const baseViews = 50; // Mock base views
      
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthName = d.toLocaleString('default', { month: 'short' });
        
        // Simulate a growth trend ending at the current real total
        // This makes the chart look "alive" and reflects actual usage scale
        const randomFluctuation = Math.floor(Math.random() * 5);
        const estimatedRequests = i === 0 
          ? Math.max(0, Math.floor(totalRequests * 0.2)) // Start low
          : i === 5 
            ? totalRequests // End at real total (cumulative-ish visual)
            : Math.floor(totalRequests * (i / 5)) + randomFluctuation; 

        data.push({
          name: monthName,
          views: baseViews + (i * 15) + Math.floor(Math.random() * 20), // Simulated View Growth
          requests: estimatedRequests
        });
      }
      setChartData(data);
    };

    generateChartData();
  }, [userData]); 
  // Re-run when userData changes (e.g. sending a new request)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const partners = await getPartners();
        setPartnerCount(partners.length);

        if (userData?.sentRequests?.length > 0) {
           // Fetch recent 3 requests
           const recentIds = userData.sentRequests.slice(-3).reverse();
           try {
              // We need to import getPartnerById if not already imported
              // Ideally create a bulk fetch or parallel fetch
              const requests = await Promise.all(recentIds.map(id => 
                 import('../../services/api').then(module => module.getPartnerById(id))
              ));
              setRecentRequests(requests.filter(r => r));
           } catch (err) {
             console.error("Failed to fetch recent requests", err);
           }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
        fetchData();
    }
  }, [user, userData]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-base-content mb-2">
          Dashboard Overview
        </h1>
        <p className="text-base-content/60">
          Welcome back, <span className="text-primary font-semibold">{user?.displayName || 'Student'}</span>! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Partners" 
          value={partnerCount} 
          icon={<Users size={24} className="text-primary" />} 
          color="bg-primary"
          trend="+12%"
        />
        <StatCard 
          title="Active Requests" 
          value={userData?.sentRequests?.length || 0}
          icon={<Activity size={24} className="text-secondary" />} 
          color="bg-secondary"
          trend="Pending"
        />
        <StatCard 
          title="Study Sessions" 
          value="0" 
          icon={<Calendar size={24} className="text-accent" />} 
          color="bg-accent"
          trend="Coming Soon"
        />
        <StatCard 
          title="Profile Views" 
          value="12" 
          icon={<TrendingUp size={24} className="text-orange-500" />} 
          color="bg-orange-500"
          trend="+2"
        />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
           <h3 className="text-xl font-bold mb-6 text-base-content">Activity Overview</h3>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart
                 data={chartData}
                 margin={{
                   top: 10,
                   right: 30,
                   left: 0,
                   bottom: 0,
                 }}
               >
                 <defs>
                   <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-base-300)" opacity={0.3} />
                 <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--color-base-content)', opacity: 0.6, fontSize: 12 }} 
                    dy={10}
                 />
                 <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--color-base-content)', opacity: 0.6, fontSize: 12 }} 
                 />
                 <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-base-100)', 
                      borderRadius: '12px', 
                      border: '1px solid var(--color-base-200)',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                    }}
                    itemStyle={{ color: 'var(--color-base-content)' }}
                  />
                 <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorViews)" 
                    name="Profile Views"
                  />
                 <Area 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="#ec4899" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRequests)" 
                    name="Connection Requests"
                  />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>
        <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
           <h3 className="text-xl font-bold mb-6 text-base-content">Recent Sent Requests</h3>
           <div className="space-y-4">
              {recentRequests.length > 0 ? (
                recentRequests.map((partner, i) => (
                  <div key={partner._id || i} className="flex items-center justify-between p-4 hover:bg-base-200/50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-base-200">
                     <div className="flex items-center gap-3">
                        {partner.image ? (
                          <img src={partner.image} alt={partner.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {partner.name?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-base-content">{partner.name}</p>
                          <p className="text-xs text-base-content/60">{partner.subject}</p>
                        </div>
                     </div>
                     <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-full border border-yellow-500/20">Pending</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-base-content/50">
                   No recent requests found.
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
