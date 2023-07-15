import { doc, updateDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const clickCounter = async (document) => {
    try {
        const thesisCollectionRef = collection(db, "Thesis");
        const q = query(thesisCollectionRef, where("id", "==", document.id), where("category", "==", document.category));
        const querySnapshot = await getDocs(q);

        console.log(querySnapshot.docs[0].id);
        if (!querySnapshot.empty) {
            const docRef = doc(db, "Thesis", querySnapshot.docs[0].id);
            const documentSnapshot = await getDoc(docRef);

            if (documentSnapshot.exists()) {
                const documentData = documentSnapshot.data();
                const currentCount = documentData.counter || 0;
                const updatedCount = currentCount + 1;

                await updateDoc(docRef, { counter: updatedCount });

                console.log("Count field updated successfully!");
                return updatedCount;
            }
        } else {
            console.log("No matching document found");
            return null;
        }
    } catch (error) {
        console.error("Error updating count field:", error);
        return null;
    }
};
