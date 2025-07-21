import { collection, getDocs } from "firebase/firestore";
import { db } from "../LoginPage/firebase";

useEffect(() => {
    fetchBudgets();
  }, [user]);
  

const fetchBudgets = async (user, setBudgets) => {
  try {
    if (!user || !user.uid) {
      console.error("User not logged in or missing UID");
      return;
    }

    const budgetRef = collection(db, "users", user.uid, "budgets");
    const snapshot = await getDocs(budgetRef);

    const budgets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setBudgets(budgets);
  } catch (err) {
    console.error("Error fetching budgets:", err);
  }
};

export default fetchBudgets;
