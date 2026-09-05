'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTrips, addTrip, deleteTrip, setLoading } from '@/store/tripSlice';
import { getTrips, createTrip, deleteTrip as deleteFromFirebase } from '@/lib/services/tripService';
import { Plus, Trash2, Loader, Calendar, DollarSign, MapPin, Eye, Plane } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function TripsPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const trips = useSelector((state) => state.trips.items);
  const loading = useSelector((state) => state.trips.loading);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
  });

  useEffect(() => {
    fetchTrips();
  }, [user?.uid]);

  const fetchTrips = async () => {
    if (!user?.uid) return;
    try {
      dispatch(setLoading(true));
      const data = await getTrips(user.uid);
      dispatch(setTrips(data));
    } catch (error) {
      toast.error('Failed to load trips');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAddTrip = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.destination) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      dispatch(setLoading(true));
      const newTrip = await createTrip({
        ...formData,
        userId: user.uid,
        budget: parseFloat(formData.budget) || 0,
      });
      dispatch(addTrip(newTrip));
      toast.success('Trip created successfully!');
      setFormData({ name: '', destination: '', startDate: '', endDate: '', budget: '' });
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to create trip');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!confirm('Delete this trip?')) return;
    try {
      await deleteFromFirebase(tripId);
      dispatch(deleteTrip(tripId));
      toast.success('Trip deleted');
    } catch (error) {
      toast.error('Failed to delete trip');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
            <p className="text-gray-600 mt-1">Plan and manage all your adventures</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            <Plus size={20} />
            New Trip
          </button>
        </div>
      </div>

      {/* Add Trip Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Create New Trip</h2>
          <form onSubmit={handleAddTrip} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trip Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Summer in Paris"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-600 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Destination *</label>
                <input
                  type="text"
                  placeholder="e.g., Paris, France"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-600 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-600 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-600 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Budget ($)</label>
                <input
                  type="number"
                  placeholder="2000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-600 transition"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:shadow-lg disabled:opacity-50 font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {loading && <Loader size={18} className="animate-spin" />}
                Create Trip
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

      {/* Trips Grid */}
      {trips.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="bg-purple-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane size={40} className="text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No trips yet</h3>
          <p className="text-gray-600 mb-6">Create your first trip to get started!</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-xl hover:shadow-lg font-semibold transition-all"
          >
            <Plus size={20} />
            Create Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group">
              {/* Card Header */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <MapPin size={24} className="text-purple-600" />
                  </div>
                  <button
                    onClick={() => handleDeleteTrip(trip.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{trip.name}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin size={14} />
                  {trip.destination}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    Start
                  </span>
                  <span className="font-semibold text-gray-900">{trip.startDate || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    End
                  </span>
                  <span className="font-semibold text-gray-900">{trip.endDate || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-2 text-gray-600">
                    <DollarSign size={16} />
                    Budget
                  </span>
                  <span className="font-bold text-lg text-purple-600">${trip.budget || 0}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <Link
                  href={`/dashboard/trips/${trip.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl hover:shadow-lg font-semibold transition-all"
                >
                  <Eye size={18} />
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
