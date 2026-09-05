'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from '@/store/tripSlice';
import { getTrips } from '@/lib/services/tripService';
import { getExpenseStats } from '@/lib/services/expenseService';
import { BarChart, PieChart, TrendingUp, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function SummaryPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [data, setData] = useState({
    totalTrips: 0,
    totalExpense: 0,
    averageTrip: 0,
    byCategory: {},
  });
  const [loading, setLoadingState] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user?.uid]);

  const fetchData = async () => {
    if (!user?.uid) return;
    try {
      setLoadingState(true);
      const trips = await getTrips(user.uid);
      let totalExpense = 0;
      let byCategory = {};

      if (trips.length > 0) {
        const promises = trips.map(trip => getExpenseStats(trip.id));
        const results = await Promise.all(promises);
        
        results.forEach(stat => {
          totalExpense += stat.total;
          Object.entries(stat.byCategory).forEach(([cat, amount]) => {
            byCategory[cat] = (byCategory[cat] || 0) + amount;
          });
        });
      }

      setData({
        totalTrips: trips.length,
        totalExpense,
        averageTrip: trips.length > 0 ? totalExpense / trips.length : 0,
        byCategory,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load summary');
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Summary & Analytics</h1>
        <p className="text-gray-600">Overview of your travel spending</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<Users size={24} />}
          title="Total Trips"
          value={data.totalTrips}
          color="purple"
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          title="Total Spent"
          value={`$${data.totalExpense.toFixed(2)}`}
          color="green"
        />
        <StatCard
          icon={<BarChart size={24} />}
          title="Avg per Trip"
          value={`$${data.averageTrip.toFixed(2)}`}
          color="blue"
        />
        <StatCard
          icon={<PieChart size={24} />}
          title="Categories"
          value={Object.keys(data.byCategory).length}
          color="orange"
        />
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Spending by Category</h2>
        {Object.keys(data.byCategory).length === 0 ? (
          <p className="text-gray-500">No expenses yet</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(data.byCategory).map(([category, amount]) => (
              <div key={category}>
                <div className="flex justify-between mb-1">
                  <span className="capitalize font-medium text-gray-700">{category}</span>
                  <span className="font-semibold text-gray-900">${amount.toFixed(2)}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 rounded-full h-2"
                    style={{ width: `${(amount / data.totalExpense * 100) || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/trips"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center"
        >
          <h3 className="font-bold text-gray-900 mb-2">Manage Trips</h3>
          <p className="text-sm text-gray-600">Create or edit trips</p>
        </Link>
        <Link
          href="/dashboard/expenses"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center"
        >
          <h3 className="font-bold text-gray-900 mb-2">Track Expenses</h3>
          <p className="text-sm text-gray-600">Add and manage expenses</p>
        </Link>
        <Link
          href="/dashboard/destinations"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center"
        >
          <h3 className="font-bold text-gray-900 mb-2">Discover Places</h3>
          <p className="text-sm text-gray-600">Get AI suggestions</p>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  const colors = {
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className={`${colors[color]} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
