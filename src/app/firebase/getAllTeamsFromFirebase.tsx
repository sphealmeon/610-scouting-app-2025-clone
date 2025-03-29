import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

/**
 * Gets all numeric collections (collections that are team numbers) from Firebase
 * @returns Promise<string[]> Array of team numbers as strings
 */
export const getAllTeamsFromFirebase = async (): Promise<string[]> => {
    try {
        const collections = await getDocs(collection(db, "__collection__"));
        const numericCollections: string[] = [];
        
        collections.forEach((doc) => {
            const collectionName = doc.id;
            // Dont touch regex idk if this works
            if (/^\d+$/.test(collectionName)) {
                numericCollections.push(collectionName);
            }
        });
        return numericCollections.sort((a, b) => parseInt(a) - parseInt(b));
    } catch (error) {
        console.error("Error getting numeric collections:", error);
        return [];
    }
}; 