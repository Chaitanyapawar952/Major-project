import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";

// Get messages for trip
export const getMessages = async (tripId) => {
  try {
    const q = query(
      collection(db, `trips/${tripId}/messages`),
      orderBy("timestamp", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Send message
export const sendMessage = async (tripId, messageData) => {
  try {
    const docRef = await addDoc(collection(db, `trips/${tripId}/messages`), {
      ...messageData,
      timestamp: new Date().toISOString(),
    });
    return { id: docRef.id, ...messageData };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Delete message
export const deleteMessage = async (tripId, messageId) => {
  try {
    await deleteDoc(doc(db, `trips/${tripId}/messages`, messageId));
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

// Real-time listener for messages
export const onMessagesChange = (tripId, callback) => {
  try {
    const q = query(
      collection(db, `trips/${tripId}/messages`),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(messages);
    });
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up listener:", error);
    throw error;
  }
};
