'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSuggestions, setSuggestionsLoading } from '@/store/destinationSlice';
import { getDestinationSuggestions } from '@/lib/gemini';
import { getTrips } from '@/lib/services/tripService';
import { Sparkles, MapPin, Loader, Calendar, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DestinationsPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const suggestions = useSelector((state) => state.destinations.suggestions);
  const suggestionsLoading = useSelector((state) => state.destinations.suggestionsLoading);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState('');
  const [formData, setFormData] = useState({
    budget: '2000',
    duration: '5',
    interests: [],
  });

  const interestOptions = [
    { value: 'hiking', emoji: '🥾', label: 'Hiking' },
    { value: 'culture', emoji: '🏛️', label: 'Culture' },
    { value: 'food', emoji: '🍜', label: 'Food' },
    { value: 'adventure', emoji: '🎢', label: 'Adventure' },
    { value: 'beach', emoji: '🏖️', label: 'Beach' },
    { value: 'shopping', emoji: '🛍️', label: 'Shopping' },
    { value: 'nightlife', emoji: '🎉', label: 'Nightlife' },
    { value: 'art', emoji: '🎨', label: 'Art' },
  ];

  useEffect(() => {
    fetchTrips();
  }, [user?.uid]);

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

  const handleGetSuggestions = async (e) => {
    e.preventDefault();
    if (!selectedTrip || formData.interests.length === 0) {
      toast.error('Please select a trip and at least one interest');
      return;
    }

    const trip = trips.find(t => t.id === selectedTrip);
    if (!trip) {
      toast.error('Trip not found');
      return;
    }

    try {
      dispatch(setSuggestionsLoading(true));
      const result = await getDestinationSuggestions({
        destination: trip.destination,
        budget: formData.budget,
        duration: formData.duration,
        interests: formData.interests,
      });
      dispatch(setSuggestions(result));
      toast.success('Suggestions loaded!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get suggestions');
    } finally {
      dispatch(setSuggestionsLoading(false));
    }
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles size={32} />
          <h1 className="text-4xl font-bold">Discover Destinations</h1>
        </div>
        <p className="text-purple-100 text-lg">Get AI-powered suggestions for your next adventure</p>
      </div>

      {/* Suggestions Form */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <form onSubmit={handleGetSuggestions} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Trip</label>
              <select
                value={selectedTrip}
                onChange={(e) => setSelectedTrip(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-600 font-medium"
              >
                {trips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Budget ($)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (days)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">What interests you?</label>
            <div className="flex flex-wrap gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest.value}
                  type="button"
                  onClick={() => handleInterestToggle(interest.value)}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all shadow-sm ${
                    formData.interests.includes(interest.value)
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{interest.emoji}</span>
                  {interest.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={suggestionsLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl hover:shadow-lg disabled:opacity-50 font-bold text-lg flex items-center justify-center gap-3 transition-all"
          >
            {suggestionsLoading ? (
              <>
                <Loader size={24} className="animate-spin" />
                Generating Suggestions...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Get AI Suggestions
              </>
            )}
          </button>
        </form>
      </div>

      {/* Suggestions Grid */}
      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((destination, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6">
                <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <MapPin size={28} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{destination.name}</h3>
                <p className="text-sm text-gray-600">{destination.country}</p>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-gray-700 leading-relaxed">{destination.description}</p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign size={16} />
                    <span className="font-semibold">{destination.estimatedBudget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span className="font-semibold">{destination.bestTime}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900 mb-2">✨ Highlights</p>
                  <ul className="space-y-1">
                    {destination.highlights?.map((highlight, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!suggestionsLoading && suggestions.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="bg-purple-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles size={40} className="text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No suggestions yet</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Use the form above to get AI-powered destination suggestions tailored to your interests
          </p>
        </div>
      )}
    </div>
  );
}
