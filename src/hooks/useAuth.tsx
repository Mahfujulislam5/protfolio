import { useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
         try {
           const docRef = doc(db, "settings", "admins");
           const docSnap = await getDoc(docRef);
           let allowedEmails = ["mahfujul848@gmail.com"];
           if (docSnap.exists() && docSnap.data().emails) {
              allowedEmails = docSnap.data().emails;
              if (!allowedEmails.includes("mahfujul848@gmail.com")) {
                 allowedEmails.push("mahfujul848@gmail.com");
              }
           }

           if (currentUser.email && allowedEmails.includes(currentUser.email)) {
              setUser(currentUser);
           } else {
              await signOut(auth);
              setUser(null);
           }
         } catch(e) {
            setUser(currentUser);
         }
      } else {
         setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
