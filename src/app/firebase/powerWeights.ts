import { db } from "./firebase";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";

// Default weights if none are found in Firebase
export const defaultPowerWeights = {
  autoPPG: 1.75,
  teleopPPG: 1.0,
  endgamePPG: 1.5,
  brokePercentage: -3.0,
  coralCyclesScored: 0.5,
  algaeCyclesScored: 0.3,
};

export interface PowerWeights {
  autoPPG: number;
  teleopPPG: number;
  endgamePPG: number;
  brokePercentage: number;
  coralCyclesScored: number;
  algaeCyclesScored: number;
}

export interface PowerWeightsPreset {
  id: string;
  name: string;
  weights: PowerWeights;
  isDefault?: boolean;
}

// Load active power weights from Firebase
export const loadPowerWeights = async (): Promise<PowerWeights> => {
  try {
    const activeWeightsDoc = await getDoc(doc(db, "settings", "activePowerWeights"));
    
    if (activeWeightsDoc.exists()) {
      console.log("Loaded active power weights from Firebase:", activeWeightsDoc.data());
      return activeWeightsDoc.data() as PowerWeights;
    } else {
      console.log("No active power weights found in Firebase, using defaults");
      // If no weights are found, save the defaults
      await savePowerWeights(defaultPowerWeights);
      return defaultPowerWeights;
    }
  } catch (error) {
    console.error("Error loading power weights:", error);
    return defaultPowerWeights;
  }
};

// Save active power weights to Firebase
export const savePowerWeights = async (weights: PowerWeights): Promise<boolean> => {
  try {
    await setDoc(doc(db, "settings", "activePowerWeights"), weights);
    console.log("Power weights saved to Firebase:", weights);
    return true;
  } catch (error) {
    console.error("Error saving power weights:", error);
    return false;
  }
};

// Get all saved presets
export const getPresets = async (): Promise<PowerWeightsPreset[]> => {
  try {
    const presetsCollection = collection(db, "powerWeightsPresets");
    const presetsSnapshot = await getDocs(presetsCollection);
    
    if (presetsSnapshot.empty) {
      // Create default preset if none exist
      const defaultPreset: PowerWeightsPreset = {
        id: "default",
        name: "Default",
        weights: defaultPowerWeights,
        isDefault: true
      };
      
      await savePreset(defaultPreset);
      return [defaultPreset];
    }
    
    const presets: PowerWeightsPreset[] = [];
    presetsSnapshot.forEach(doc => {
      presets.push({ id: doc.id, ...doc.data() } as PowerWeightsPreset);
    });
    
    return presets;
  } catch (error) {
    console.error("Error getting presets:", error);
    return [{
      id: "default",
      name: "Default",
      weights: defaultPowerWeights,
      isDefault: true
    }];
  }
};

// Save a preset
export const savePreset = async (preset: PowerWeightsPreset): Promise<boolean> => {
  try {
    const { id, ...presetData } = preset;
    await setDoc(doc(db, "powerWeightsPresets", id), presetData);
    console.log("Preset saved:", preset);
    return true;
  } catch (error) {
    console.error("Error saving preset:", error);
    return false;
  }
};

// Delete a preset
export const deletePreset = async (presetId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, "powerWeightsPresets", presetId));
    console.log("Preset deleted:", presetId);
    return true;
  } catch (error) {
    console.error("Error deleting preset:", error);
    return false;
  }
};

// Set a preset as active
export const activatePreset = async (preset: PowerWeightsPreset): Promise<boolean> => {
  return await savePowerWeights(preset.weights);
}; 