import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";

// Get all trips for user
export const getTrips = async (userId) => {
  try {
    const q = query(collection(db, "trips"), where("userId", "==", userId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error;
  }
};

// Create trip
export const createTrip = async (tripData) => {
  try {
    const docRef = await addDoc(collection(db, "trips"), {
      ...tripData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...tripData };
  } catch (error) {
    console.error("Error creating trip:", error);
    throw error;
  }
};

// Update trip
export const updateTrip = async (tripId, updates) => {
  try {
    const tripRef = doc(db, "trips", tripId);
    await updateDoc(tripRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating trip:", error);
    throw error;
  }
};

// Delete trip
export const deleteTrip = async (tripId) => {
  try {
    await deleteDoc(doc(db, "trips", tripId));
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
};
