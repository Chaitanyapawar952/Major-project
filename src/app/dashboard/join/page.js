'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getTripByJoinCode, joinTrip } from '@/lib/services/tripService';
import { Users, Loader, Check, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function JoinTripPage() {
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [tripPreview, setTripPreview] = useState(null);

  const handleSearchTrip = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      toast.error('Please enter a join code');
      return;
    }

    try {
      setLoading(true);
      const trip = await getTripByJoinCode(joinCode);
      if (!trip) {
        toast.error('Trip not found. Check the code and try again.');
        setTripPreview(null);
      } else {
        setTripPreview(trip);
      }
    } catch (error) {
      toast.error('Failed to find trip');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTrip = async () => {
    if (!tripPreview) return;

    // Check if already a member
    if (tripPreview.members?.includes(user.uid)) {
      toast.error('You are already a member of this trip!');
      return;
    }

    try {
      setLoading(true);
      await joinTrip(tripPreview.id, user.uid);
      toast.success('Successfully joined the trip!');
      router.push(`/dashboard/trips/${tripPreview.id}`);
    } catch (error) {
      toast.error('Failed to join trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <Users size={32} />
          <h1 className="text-4xl font-bold">Join a Trip</h1>
        </div>
        <p className="text-blue-100 text-lg">Enter the join code to collaborate with friends</p>
      </div>

      {/* Join Form */}
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
        <form onSubmit={handleSearchTrip} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Enter Trip Join Code
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g., ABC123"
              maxLength={6}
              className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 text-center text-2xl font-bold tracking-widest uppercase focus:outline-none focus:border-purple-600 transition"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Ask the trip organizer for the 6-digit code
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !joinCode.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl hover:shadow-lg disabled:opacity-50 font-bold text-lg flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Searching...
              </>
            ) : (
              'Search Trip'
            )}
          </button>
        </form>
      </div>

      {/* Trip Preview */}
      {tripPreview && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg p-8 border-2 border-green-200 animate-fadeIn">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center">
              <Check size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Trip Found!</h2>
          </div>

          <div className="bg-white rounded-xl p-6 mb-6 space-y-3">
            <div>
              <p className="text-sm text-gray-600">Trip Name</p>
              <p className="text-xl font-bold text-gray-900">{tripPreview.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Destination</p>
              <p className="text-lg font-semibold text-gray-900">{tripPreview.destination}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-semibold text-gray-900">{tripPreview.startDate || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Budget</p>
                <p className="font-semibold text-gray-900">${tripPreview.budget || 0}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Members</p>
              <p className="font-semibold text-gray-900">{tripPreview.members?.length || 1} people</p>
            </div>
          </div>

          <button
            onClick={handleJoinTrip}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl hover:shadow-lg disabled:opacity-50 font-bold text-lg flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <Users size={20} />
                Join This Trip
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
