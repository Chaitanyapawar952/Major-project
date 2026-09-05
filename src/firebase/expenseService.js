import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";

// Get expenses for trip
export const getExpenses = async (tripId) => {
  try {
    const q = query(collection(db, "expenses"), where("tripId", "==", tripId), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

// Add expense
export const addExpense = async (expenseData) => {
  try {
    const docRef = await addDoc(collection(db, "expenses"), {
      ...expenseData,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...expenseData };
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};

// Update expense
export const updateExpense = async (expenseId, updates) => {
  try {
    const expenseRef = doc(db, "expenses", expenseId);
    await updateDoc(expenseRef, updates);
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};

// Delete expense
export const deleteExpense = async (expenseId) => {
  try {
    await deleteDoc(doc(db, "expenses", expenseId));
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};

// Get expense stats for trip
export const getExpenseStats = async (tripId) => {
  try {
    const expenses = await getExpenses(tripId);
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const byCategory = {};
    expenses.forEach((exp) => {
      byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
    });
    return {
      total,
      average: expenses.length > 0 ? total / expenses.length : 0,
      byCategory,
      count: expenses.length,
    };
  } catch (error) {
    console.error("Error calculating expense stats:", error);
    throw error;
  }
};
