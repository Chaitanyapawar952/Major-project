import { db } from '@/firebase/config';
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, query, where, updateDoc, arrayUnion } from 'firebase/firestore';

// Generate random 6-digit join code
const generateJoinCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createTrip = async (tripData) => {
  try {
    const joinCode = generateJoinCode();
    const docRef = await addDoc(collection(db, 'trips'), {
      ...tripData,
      joinCode,
      members: [tripData.userId],
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...tripData, joinCode, members: [tripData.userId] };
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
};

export const getTrips = async (userId) => {
  try {
    const q = query(
      collection(db, 'trips'),
      where('members', 'array-contains', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting trips:', error);
    throw error;
  }
};

export const getTripByJoinCode = async (joinCode) => {
  try {
    const q = query(
      collection(db, 'trips'),
      where('joinCode', '==', joinCode.toUpperCase())
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const tripDoc = querySnapshot.docs[0];
    return { id: tripDoc.id, ...tripDoc.data() };
  } catch (error) {
    console.error('Error finding trip:', error);
    throw error;
  }
};

export const joinTrip = async (tripId, userId) => {
  try {
    const tripRef = doc(db, 'trips', tripId);
    await updateDoc(tripRef, {
      members: arrayUnion(userId),
    });
    return true;
  } catch (error) {
    console.error('Error joining trip:', error);
    throw error;
  }
};

export const deleteTrip = async (tripId) => {
  try {
    await deleteDoc(doc(db, 'trips', tripId));
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
};
