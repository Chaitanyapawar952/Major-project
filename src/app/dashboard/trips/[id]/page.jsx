'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Edit, 
  Trash2, 
  Loader, 
  MessageSquare, 
  Receipt,
  Users,
  Link as LinkIcon,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTripDetails();
  }, [params.id]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const tripDoc = await getDoc(doc(db, 'trips', params.id));
      if (tripDoc.exists()) {
        setTrip({ id: tripDoc.id, ...tripDoc.data() });
      } else {
        toast.error('Trip not found');
        router.push('/dashboard/trips');
      }
    } catch (error) {
      console.error('Error fetching trip:', error);
      toast.error('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (!confirm('Are you sure you want to delete this trip? This action cannot be undone.')) return;
    
    try {
      // Import deleteTrip function
      const { deleteTrip } = await import('@/lib/services/tripService');
      await deleteTrip(params.id);
      toast.success('Trip deleted successfully');
      router.push('/dashboard/trips');
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast.error('Failed to delete trip');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Trip not found</p>
        <Link href="/dashboard/trips" className="text-purple-600 hover:underline mt-4 inline-block">
          ← Back to Trips
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/trips"
              className="p-3 hover:bg-gray-100 rounded-xl transition"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{trip.name}</h1>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <MapPin size={16} />
                {trip.destination}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition">
              <Edit size={18} />
              Edit
            </button>
            <button 
              onClick={handleDeleteTrip}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold transition"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-md p-8 border border-purple-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InfoCard
            icon={<MapPin size={24} />}
            label="Destination"
            value={trip.destination}
            color="purple"
          />
          <InfoCard
            icon={<DollarSign size={24} />}
            label="Budget"
            value={`$${trip.budget || 0}`}
            color="green"
          />
          <InfoCard
            icon={<Calendar size={24} />}
            label="Start Date"
            value={trip.startDate || 'Not set'}
            color="blue"
          />
          <InfoCard
            icon={<Calendar size={24} />}
            label="End Date"
            value={trip.endDate || 'Not set'}
            color="orange"
          />
        </div>
      </div>

      {/* Trip Collaboration Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-md p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 text-white p-3 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Trip Collaboration</h2>
              <p className="text-sm text-gray-600">Invite others to join this trip</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 space-y-4">
          {/* Join Code */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Join Code</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-6 py-3">
                <p className="text-3xl font-bold text-center tracking-widest text-purple-600">
                  {trip.joinCode || 'N/A'}
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(trip.joinCode);
                  toast.success('Join code copied!');
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-semibold transition flex items-center gap-2"
              >
                <LinkIcon size={18} />
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Share this code with friends so they can join your trip
            </p>
          </div>

          {/* Share Link */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Share Link</p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard/join?code=${trip.joinCode}`}
                readOnly
                className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/dashboard/join?code=${trip.joinCode}`);
                  toast.success('Link copied!');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition"
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Members */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">Members ({trip.members?.length || 1})</p>
            <div className="flex items-center gap-2">
              {trip.members?.slice(0, 5).map((memberId, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white font-bold shadow-md"
                  title={`Member ${index + 1}`}
                >
                  {index + 1}
                </div>
              ))}
              {trip.members?.length > 5 && (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                  +{trip.members.length - 5}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ActionCard
          icon={<Receipt size={32} />}
          title="View Expenses"
          description="Track trip spending"
          href={`/dashboard/expenses?tripId=${trip.id}`}
          color="green"
        />
        <ActionCard
          icon={<MessageSquare size={32} />}
          title="Group Chat"
          description="Chat with travelers"
          href={`/dashboard/chat?tripId=${trip.id}`}
          color="blue"
        />
        <ActionCard
          icon={<BarChart3 size={32} />}
          title="AI Cost Analysis"
          description="Detailed budget breakdown"
          href={`/dashboard/trips/${trip.id}/analysis`}
          color="orange"
        />
        <ActionCard
          icon={<MapPin size={32} />}
          title="Destinations"
          description="Explore places"
          href="/dashboard/destinations"
          color="purple"
        />
      </div>

      {/* Trip Description */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">About this Trip</h2>
        <p className="text-gray-600 leading-relaxed">
          {trip.description || 'No description added yet. Click Edit to add details about your trip.'}
        </p>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, color }) {
  const colors = {
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className={`${colors[color]} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 font-medium mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ActionCard({ icon, title, description, href, color }) {
  const colors = {
    green: 'from-green-50 to-green-100 border-green-200 hover:border-green-300',
    blue: 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300',
    purple: 'from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300',
    orange: 'from-orange-50 to-orange-100 border-orange-200 hover:border-orange-300',
  };

  return (
    <Link
      href={href}
      className={`bg-gradient-to-br ${colors[color]} rounded-xl p-6 border-2 hover:shadow-lg transition-all group`}
    >
      <div className="text-gray-600 group-hover:scale-110 transition-transform mb-3">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
