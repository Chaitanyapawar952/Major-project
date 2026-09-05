import { collection, addDoc, getDocs, doc, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";

// Get all destinations
export const getDestinations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "destinations"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching destinations:", error);
    throw error;
  }
};

// Add destination to trip
export const addDestinationToTrip = async (tripId, destination) => {
  try {
    const docRef = await addDoc(collection(db, "tripDestinations"), {
      tripId,
      destination,
      addedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...destination };
  } catch (error) {
    console.error("Error adding destination:", error);
    throw error;
  }
};

// Get trip destinations
export const getTripDestinations = async (tripId) => {
  try {
    const q = query(collection(db, "tripDestinations"), where("tripId", "==", tripId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching trip destinations:", error);
    throw error;
  }
};
