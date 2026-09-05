'use client';

import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages, addMessage, setLoading } from '@/store/chatSlice';
import { getMessages, sendMessage, onMessagesChange } from '@/lib/services/chatService';
import { getTrips } from '@/lib/services/tripService';
import { Send, MessageSquare, Loader, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const messages = useSelector((state) => state.chat.messages);
  const loading = useSelector((state) => state.chat.loading);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchTrips();
  }, [user?.uid]);

  useEffect(() => {
    if (selectedTrip) {
      fetchMessages(selectedTrip);
    }
  }, [selectedTrip]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const fetchMessages = async (tripId) => {
    try {
      dispatch(setLoading(true));
      const data = await getMessages(tripId);
      dispatch(setMessages({ tripId, messages: data }));

      const unsubscribe = onMessagesChange(tripId, (updatedMessages) => {
        dispatch(setMessages({ tripId, messages: updatedMessages }));
      });

      return unsubscribe;
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedTrip) return;

    try {
      setSending(true);
      await sendMessage(selectedTrip, {
        text: messageText,
        userId: user.uid,
        userName: user.displayName,
      });
      setMessageText('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const tripMessages = messages[selectedTrip] || [];
  const selectedTripData = trips.find(t => t.id === selectedTrip);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-t-2xl shadow-md p-6 border border-gray-100 border-b-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Group Chat</h1>
            <p className="text-gray-600 text-sm mt-1">
              {selectedTripData ? `Chatting about ${selectedTripData.name}` : 'Select a trip to start chatting'}
            </p>
          </div>
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
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-white border-x border-gray-100 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader size={40} className="animate-spin text-purple-600 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Loading messages...</p>
            </div>
          </div>
        ) : tripMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={36} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {tripMessages.map((msg, index) => {
              const isOwnMessage = msg.userId === user.uid;
              return (
                <div
                  key={index}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-lg ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      isOwnMessage 
                        ? 'bg-gradient-to-br from-purple-600 to-purple-900' 
                        : 'bg-gradient-to-br from-blue-600 to-blue-900'
                    }`}>
                      {msg.userName?.[0]?.toUpperCase() || 'U'}
                    </div>

                    {/* Message Bubble */}
                    <div>
                      <div className={`text-xs font-medium mb-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        <span className="text-gray-600">{msg.userName || 'User'}</span>
                      </div>
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-sm ${
                          isOwnMessage
                            ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-br-sm'
                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                        }`}
                      >
                        <p className="break-words">{msg.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white rounded-b-2xl shadow-md p-4 border border-gray-100 border-t-0">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-600 transition"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !messageText.trim()}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:shadow-lg disabled:opacity-50 font-semibold flex items-center gap-2 transition-all"
          >
            {sending ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
            <span className="hidden md:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
