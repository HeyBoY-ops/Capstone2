import { db } from "../LoginPage/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const saveBudget = async (uid, newBudgetData) => {
  try {
    const docRef = doc(db, "budgets", uid);
    const docSnap = await getDoc(docRef);

    let existingBudgets = [];

    if (docSnap.exists()) {
      existingBudgets = docSnap.data().budgets || [];
    }

    await setDoc(docRef, {
      budgets: [...existingBudgets, newBudgetData],
    });

  } catch (error) {
    console.error("Error saving budget:", error);
  }
};
