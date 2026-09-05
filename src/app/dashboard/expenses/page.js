'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setExpenses, addExpense, deleteExpense, setLoading } from '@/store/expenseSlice';
import { getExpenses, addExpense as addToFirebase, deleteExpense as deleteFromFirebase, getExpenseStats } from '@/lib/services/expenseService';
import { getTrips } from '@/lib/services/tripService';
import { Plus, Trash2, Loader, DollarSign, TrendingUp, BarChart3, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExpensesPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const expenses = useSelector((state) => state.expenses.items);
  const loading = useSelector((state) => state.expenses.loading);
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({ total: 0, average: 0, count: 0 });
  const [showForm, setShowForm] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState('');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
  });

  const categories = [
    { value: 'food', label: '🍔 Food', color: 'bg-orange-500' },
    { value: 'transport', label: '🚗 Transport', color: 'bg-blue-500' },
    { value: 'accommodation', label: '🏨 Accommodation', color: 'bg-purple-500' },
    { value: 'activities', label: '🎯 Activities', color: 'bg-green-500' },
    { value: 'other', label: '📦 Other', color: 'bg-gray-500' },
  ];

  useEffect(() => {
    fetchTrips();
  }, [user?.uid]);

  useEffect(() => {
    if (selectedTrip) {
      fetchExpenses(selectedTrip);
    }
  }, [selectedTrip]);

  const fetchTrips = async () => {
    if (!user?.uid) return;
    try {
      const data = await getTrips(user.uid);
      setTrips(data);
      if (data.length > 0) {
        setSelectedTrip(data[0].id);
      }
    } catch (error) {
      toast.error('Failed to load trips');
    }
  };

  const fetchExpenses = async (tripId) => {
    try {
      dispatch(setLoading(true));
      const data = await getExpenses(tripId);
      dispatch(setExpenses(data));
      const stat = await getExpenseStats(tripId);
      setStats(stat);
    } catch (error) {
      toast.error('Failed to load expenses');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !selectedTrip) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      dispatch(setLoading(true));
      const newExpense = await addToFirebase({
        ...formData,
        tripId: selectedTrip,
        amount: parseFloat(formData.amount),
      });
      dispatch(addExpense(newExpense));
      toast.success('Expense added!');
      setFormData({ description: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      fetchExpenses(selectedTrip);
    } catch (error) {
      toast.error('Failed to add expense');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await deleteFromFirebase(expenseId);
      dispatch(deleteExpense(expenseId));
      toast.success('Expense deleted');
      fetchExpenses(selectedTrip);
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  const getCategoryInfo = (category) => {
    return categories.find(c => c.value === category) || categories[4];
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
            <p className="text-gray-600 mt-1">Track your travel spending</p>
          </div>
          <div className="flex gap-3">
            {trips.length > 0 && (
              <select
                value={selectedTrip}
                onChange={(e) => setSelectedTrip(e.target.value)}
                className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-600 font-medium bg-white min-w-[200px]"
              >
                {trips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.name}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold whitespace-nowrap"
            >
              <Plus size={20} />
              Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {selectedTrip && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <DollarSign size={24} className="text-green-600" />
              </div>
            </div>
            <p className="text-sm text-green-700 font-medium mb-1">Total Spent</p>
            <p className="text-3xl font-bold text-green-900">${stats.total.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-blue-700 font-medium mb-1">Average Expense</p>
            <p className="text-3xl font-bold text-blue-900">${stats.average.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <BarChart3 size={24} className="text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-purple-700 font-medium mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-purple-900">{stats.count}</p>
          </div>
        </div>
      )}

      {/* Add Expense Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Add New Expense</h2>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  placeholder="e.g., Lunch at restaurant"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-600 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount ($)</label>
                <input
                  type="number"
                  placeholder="25.00"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-600 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-600 transition font-medium"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-600 transition"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:shadow-lg disabled:opacity-50 font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {loading && <Loader size={18} className="animate-spin" />}
                Add Expense
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold text-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Description</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-gray-100 p-4 rounded-full">
                        <DollarSign size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No expenses yet</p>
                      <p className="text-sm text-gray-400">Add your first expense to start tracking</p>
                    </div>
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => {
                  const categoryInfo = getCategoryInfo(expense.category);
                  return (
                    <tr key={expense.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{expense.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white ${categoryInfo.color}`}>
                          {categoryInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-lg text-gray-900">${expense.amount.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{expense.date}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
