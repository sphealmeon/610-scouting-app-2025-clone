import { Data } from "../interfaces";
import { CalculateAggregate } from "./calculateAggregate";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

/**
 * Submits the match data to the database
 * @param team the team to set match data for
 * @param match the match number
 * @param matchData matchData for the corresponding team and match
 */
export const SubmitMatch = async ({
  team,
  match,
  matchData,
}: {
  team: number;
  match: number;
  matchData: Data;
}) => {
  try {
    const timeout = 10000;
    const setDocPromise = setDoc(doc(db, team + "", match + ""), {
      matchData,
    });

    await Promise.race([
      setDocPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Firebase setDoc operation timed out")), timeout)
      )
    ]);

    await CalculateAggregate({ team });
    
    // Show success toast
    toast.success("Match data submitted successfully");
  } catch (e) {
    console.error(e);
    const failedSubmissions = JSON.parse(localStorage.getItem('failedSubmissions') || '[]');
    failedSubmissions.push({
      team,
      match,
      matchData,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('failedSubmissions', JSON.stringify(failedSubmissions));
    
    // Show error toast
    toast.error("Failed to submit match data. It will be saved locally and can be resubmitted later.");
  }
};
