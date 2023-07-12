import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const clickCounter = async (id) => {
    try {
        const docRef = doc(db, "Thesis", id);
        const documentSnapshot = await getDoc(docRef);
        if (documentSnapshot.exists()) {
            const currentCount = documentSnapshot.data().count || 0;
            const updatedCount = currentCount + 1;
            await updateDoc(docRef, { count: updatedCount });
            console.log("Count field updated successfully!");
            return updatedCount;
        } else {
            console.error("Document does not exist!");
            return null;
        }
    } catch (error) {
        console.error("Error updating count field:", error);
        return null;
    }
};