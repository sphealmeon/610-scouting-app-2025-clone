import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function changeLast4( state: boolean) {
    await setDoc(
        doc(db, "AggregateModifiers", "modifiers"),
        {
            last4Matches: state
        },
        { merge: true }
      );
}
export async function changeIgnoreBroken( state: boolean) {
    await setDoc(
        doc(db, "AggregateModifiers", "modifiers"),
        {
            ignoreBroken: state
        },
        { merge: true }
      );
}

export async function getUseLast4Matches(): Promise<boolean> {
    const document = await getDoc(doc(db, "AggregateModifiers", "modifiers"))
    return document.data()?.last4Matches
  }
  export async function getIgnoreBroken(): Promise<boolean> {
    const document = await getDoc(doc(db, "AggregateModifiers", "modifiers"))
    return document.data()?.ignoreBroken
  }