'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { generateTripCostAnalysis } from '@/lib/services/aiAnalysisService';
import { getExpenseStats } from '@/lib/services/expenseService';
import { 
  ArrowLeft, 
  Loader, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  PieChart,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Download,
  Clock,
  MapPin,
  Utensils,
  Plane,
  Home,
  ShoppingBag,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function TripAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [currentExpenses, setCurrentExpenses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch trip details
      const tripDoc = await getDoc(doc(db, 'trips', params.id));
      if (!tripDoc.exists()) {
        toast.error('Trip not found');
        router.push('/dashboard/trips');
        return;
      }
      
      const tripData = { id: tripDoc.id, ...tripDoc.data() };
      setTrip(tripData);

      // Fetch current expenses (optional)
      try {
        const expenses = await getExpenseStats(params.id);
        setCurrentExpenses(expenses);
      } catch (error) {
        console.log('No expenses yet');
        setCurrentExpenses({ total: 0, average: 0, count: 0 });
      }

      // Calculate duration
      const duration = tripData.endDate && tripData.startDate 
        ? Math.ceil((new Date(tripData.endDate) - new Date(tripData.startDate)) / (1000 * 60 * 60 * 24))
        : 7;

      // Generate AI analysis
      const aiAnalysis = await generateTripCostAnalysis({
        destination: tripData.destination,
        duration: duration,
        budget: tripData.budget || 2000,
        travelers: tripData.members?.length || 1,
        travelStyle: 'moderate',
      });

      setAnalysis(aiAnalysis);
      toast.success('Analysis generated successfully!');
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to generate analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Generating AI analysis...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (!trip || !analysis) {
    return (
      <div className="text-center py-16">
        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
        <p className="text-gray-500 text-lg mb-4">Unable to generate analysis</p>
        <Link 
          href={`/dashboard/trips/${params.id}`} 
          className="text-purple-600 hover:underline inline-flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Trip
        </Link>
      </div>
    );
  }

  const budgetStatus = analysis.budgetAnalysis?.budgetStatus || 'comfortable';
  const budgetColors = {
    insufficient: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', icon: 'text-red-600' },
    tight: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', icon: 'text-orange-600' },
    comfortable: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', icon: 'text-green-600' },
    generous: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', icon: 'text-blue-600' },
  };

  const statusColor = budgetColors[budgetStatus];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/trips/${params.id}`}
              className="p-3 hover:bg-gray-100 rounded-xl transition"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Cost Analysis</h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <MapPin size={16} />
                {trip.name} - {trip.destination}
              </p>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition"
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Budget Status Banner */}
      <div className={`rounded-2xl border-2 p-6 ${statusColor.bg} ${statusColor.border}`}>
        <div className="flex items-start gap-4">
          {analysis.budgetAnalysis?.isFeasible ? (
            <CheckCircle size={32} className={`flex-shrink-0 ${statusColor.icon}`} />
          ) : (
            <AlertTriangle size={32} className={`flex-shrink-0 ${statusColor.icon}`} />
          )}
          <div className="flex-1">
            <h2 className={`text-2xl font-bold mb-2 ${statusColor.text}`}>
              Budget Status: {budgetStatus.charAt(0).toUpperCase() + budgetStatus.slice(1)}
            </h2>
            <p className={`text-lg mb-2 ${statusColor.text}`}>
              {analysis.budgetAnalysis?.recommendation}
            </p>
            {analysis.budgetAnalysis?.warningMessage && (
              <div className="flex items-center gap-2 mt-3 bg-white/50 rounded-lg p-3">
                <AlertTriangle size={18} />
                <p className="font-semibold">{analysis.budgetAnalysis.warningMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          icon={<DollarSign size={24} />}
          label="Estimated Total"
          value={`$${analysis.totalEstimatedCost?.toLocaleString() || 0}`}
          color="purple"
        />
        <MetricCard
          icon={<Calendar size={24} />}
          label="Daily Average"
          value={`$${analysis.dailyAverage?.toFixed(2) || 0}`}
          color="blue"
        />
        <MetricCard
          icon={<TrendingUp size={24} />}
          label="Your Budget"
          value={`$${trip.budget?.toLocaleString() || 0}`}
          color="green"
        />
        <MetricCard
          icon={<PieChart size={24} />}
          label="Budget Difference"
          value={`${trip.budget >= analysis.totalEstimatedCost ? '+' : ''}$${Math.abs(trip.budget - analysis.totalEstimatedCost).toFixed(2)}`}
          color={trip.budget >= analysis.totalEstimatedCost ? 'green' : 'red'}
          subtext={trip.budget >= analysis.totalEstimatedCost ? 'Under budget' : 'Over budget'}
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'overview', label: '💰 Cost Breakdown', icon: <DollarSign size={18} /> },
            { id: 'daily', label: '📅 Daily Itinerary', icon: <Calendar size={18} /> },
            { id: 'tips', label: '💡 Saving Tips', icon: <Lightbulb size={18} /> },
            { id: 'hidden', label: '⚠️ Hidden Costs', icon: <AlertTriangle size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-2 border-purple-600 text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <CostBreakdownTab breakdown={analysis.costBreakdown} />}
          {activeTab === 'daily' && <DailyItineraryTab itinerary={analysis.dailyItineraryCost} />}
          {activeTab === 'tips' && (
            <SavingTipsTab 
              tips={analysis.moneySavingTips} 
              budgetTips={analysis.budgetAnalysis?.savingTips}
            />
          )}
          {activeTab === 'hidden' && <HiddenCostsTab costs={analysis.hiddenCosts} />}
        </div>
      </div>

      {/* Seasonal Info */}
      {analysis.seasonalConsiderations && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-md p-6 border border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={24} className="text-blue-600" />
            Seasonal Considerations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-2 font-semibold">Best Months to Visit</p>
              <p className="text-gray-900">{analysis.seasonalConsiderations.bestMonths?.join(', ')}</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-2 font-semibold">Peak Season</p>
              <p className="text-gray-900">{analysis.seasonalConsiderations.peakSeason}</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-2 font-semibold">Off Season</p>
              <p className="text-gray-900">{analysis.seasonalConsiderations.offSeason}</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-2 font-semibold">Price Variation</p>
              <p className="text-gray-900">{analysis.seasonalConsiderations.priceVariation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Metric Card Component
function MetricCard({ icon, label, value, color, subtext }) {
  const colors = {
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    red: 'bg-red-50 border-red-200 text-red-600',
  };

  return (
    <div className={`rounded-2xl border-2 p-6 ${colors[color]}`}>
      <div className="mb-3">{icon}</div>
      <p className="text-sm font-medium mb-1 text-gray-700">{label}</p>
      <p className="text-2xl font-bold mb-1">{value}</p>
      {subtext && <p className="text-xs text-gray-600">{subtext}</p>}
    </div>
  );
}

// Cost Breakdown Tab Component
function CostBreakdownTab({ breakdown }) {
  if (!breakdown) {
    return <p className="text-gray-500">No breakdown data available</p>;
  }

  const categoryIcons = {
    flights: <Plane size={24} />,
    accommodation: <Home size={24} />,
    food: <Utensils size={24} />,
    transportation: <Activity size={24} />,
    activities: <MapPin size={24} />,
    shopping: <ShoppingBag size={24} />,
    miscellaneous: <DollarSign size={24} />,
  };

  const categoryColors = {
    flights: 'bg-blue-100 text-blue-600',
    accommodation: 'bg-purple-100 text-purple-600',
    food: 'bg-orange-100 text-orange-600',
    transportation: 'bg-green-100 text-green-600',
    activities: 'bg-pink-100 text-pink-600',
    shopping: 'bg-yellow-100 text-yellow-600',
    miscellaneous: 'bg-gray-100 text-gray-600',
  };

  const categories = Object.entries(breakdown);
  
  return (
    <div className="space-y-6">
      {categories.map(([category, data]) => (
        <div key={category} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className={`${categoryColors[category]} w-12 h-12 rounded-xl flex items-center justify-center`}>
              {categoryIcons[category]}
            </div>
            <h4 className="text-xl font-bold text-gray-900 capitalize">{category}</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Minimum</p>
              <p className="text-2xl font-bold text-gray-900">${data.min?.toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-300">
              <p className="text-sm text-purple-700 mb-1 font-semibold">Recommended</p>
              <p className="text-2xl font-bold text-purple-600">${data.recommended?.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Maximum</p>
              <p className="text-2xl font-bold text-gray-900">${data.max?.toLocaleString()}</p>
            </div>
          </div>

          {data.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">💡 Note: </span>
                {data.notes}
              </p>
            </div>
          )}

          {/* Food Breakdown */}
          {category === 'food' && data.breakdown && (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Daily Meal Breakdown:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(data.breakdown).map(([meal, cost]) => (
                  <div key={meal} className="text-center">
                    <p className="text-xs text-gray-600 capitalize">{meal}</p>
                    <p className="text-lg font-bold text-gray-900">${cost}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Activities */}
          {category === 'activities' && data.suggestedActivities && data.suggestedActivities.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">🎯 Suggested Activities:</p>
              <ul className="space-y-2">
                {data.suggestedActivities.map((activity, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-700">{activity.name}</span>
                    <span className="font-semibold text-gray-900">${activity.cost}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Transportation Types */}
          {category === 'transportation' && data.types && data.types.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">🚗 Transportation Options:</p>
              <div className="flex flex-wrap gap-2">
                {data.types.map((type, index) => (
                  <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Miscellaneous Includes */}
          {category === 'miscellaneous' && data.includes && data.includes.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">📦 Includes:</p>
              <div className="flex flex-wrap gap-2">
                {data.includes.map((item, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Daily Itinerary Tab Component
function DailyItineraryTab({ itinerary }) {
  if (!itinerary || itinerary.length === 0) {
    return <p className="text-gray-500">No itinerary data available</p>;
  }

  return (
    <div className="space-y-4">
      {itinerary.map((day) => (
        <div key={day.day} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                {day.day}
              </div>
              <h4 className="text-lg font-bold text-gray-900">Day {day.day}</h4>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Daily Cost</p>
              <p className="text-2xl font-bold text-purple-600">${day.estimatedDailyCost}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {day.activities && day.activities.map((activity, index) => (
              <p key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>{activity}</span>
              </p>
            ))}
          </div>

          {day.breakdown && (
            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-purple-200">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">🍽️ Meals</p>
                <p className="font-semibold text-gray-900">${day.breakdown.meals}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">🚗 Transport</p>
                <p className="font-semibold text-gray-900">${day.breakdown.transport}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">🎯 Activities</p>
                <p className="font-semibold text-gray-900">${day.breakdown.activities}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">📦 Other</p>
                <p className="font-semibold text-gray-900">${day.breakdown.other}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Saving Tips Tab Component
function SavingTipsTab({ tips, budgetTips }) {
  return (
    <div className="space-y-6">
      {/* Budget Tips */}
      {budgetTips && budgetTips.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb size={20} className="text-yellow-500" />
            General Budget Tips
          </h4>
          <div className="space-y-2">
            {budgetTips.map((tip, index) => (
              <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <span className="text-yellow-600 text-xl flex-shrink-0">💡</span>
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Money-Saving Strategies */}
      {tips && tips.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-4">Detailed Money-Saving Strategies</h4>
          <div className="space-y-3">
            {tips.map((tip, index) => (
              <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase">
                      {tip.category}
                    </span>
                    <p className="text-gray-900 font-medium mb-2">{tip.tip}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-gray-600">Potential Savings</p>
                    <p className="text-2xl font-bold text-green-600">${tip.potentialSavings}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Potential Savings */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 mb-1">Total Potential Savings</p>
                <p className="text-3xl font-bold">
                  ${tips.reduce((sum, tip) => sum + tip.potentialSavings, 0).toLocaleString()}
                </p>
              </div>
              <TrendingDown size={48} className="text-green-200" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Hidden Costs Tab Component
function HiddenCostsTab({ costs }) {
  if (!costs || costs.length === 0) {
    return <p className="text-gray-500">No hidden costs identified</p>;
  }

  const priorityColors = {
    high: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700', badge: 'bg-red-600 text-white' },
    medium: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700', badge: 'bg-orange-600 text-white' },
    low: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700', badge: 'bg-blue-600 text-white' },
  };

  // Calculate total hidden costs
  const totalHidden = costs.reduce((sum, cost) => sum + cost.estimatedCost, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={24} className="text-orange-600" />
        <div>
          <h4 className="text-lg font-bold text-gray-900">Don't Forget These Costs!</h4>
          <p className="text-sm text-gray-600">Additional ${totalHidden.toLocaleString()} to budget for</p>
        </div>
      </div>

      {costs.map((cost, index) => {
        const colors = priorityColors[cost.priority];
        return (
          <div key={index} className={`rounded-xl p-6 border-2 ${colors.bg} ${colors.border}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${colors.badge}`}>
                    {cost.priority} Priority
                  </span>
                  <h5 className={`font-bold text-lg ${colors.text}`}>{cost.item}</h5>
                </div>
              </div>
              <p className={`text-2xl font-bold ${colors.text}`}>${cost.estimatedCost}</p>
            </div>
          </div>
        );
      })}

      {/* Total */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 mb-1">Total Hidden Costs</p>
            <p className="text-3xl font-bold">${totalHidden.toLocaleString()}</p>
          </div>
          <AlertTriangle size={48} className="text-orange-400" />
        </div>
      </div>
    </div>
  );
}
