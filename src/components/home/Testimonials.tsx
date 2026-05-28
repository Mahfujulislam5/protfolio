import { motion } from "motion/react";
import { Star, Quote, Loader2, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, query, limit, getDocs, addDoc, serverTimestamp, orderBy, where, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";

export function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", text: "", rating: 5 });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "reviews"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc"),
      limit(6)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.text) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "reviews"), {
        ...formData,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
        status: "approved", // auto approve for now
        createdAt: serverTimestamp()
      });
      setFormData({ name: "", role: "", text: "", rating: 5 });
      setShowForm(false);
      alert("Thank you for your review!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 container mx-auto max-w-7xl px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl bg-primary/5 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

      <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
        <h2 className="text-sm font-medium text-primary tracking-widest uppercase mb-3">Client Stories</h2>
        <h3 className="text-4xl md:text-5xl font-display font-bold mb-6">What People Say</h3>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors font-medium text-sm">
            Write a Review
          </button>
        )}
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto mb-16 glass-card p-8 rounded-3xl relative z-10"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="text-xl font-bold mb-4">Leave your feedback</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 mb-1 block">Your Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary text-sm" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Role / Company (Optional)</label>
                <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary text-sm" placeholder="CEO, Tech Co" />
              </div>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Review</label>
              <textarea required value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary text-sm min-h-[100px]" placeholder="Your experience..."></textarea>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-white/50 hover:text-white">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium flex items-center gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card rounded-3xl p-8 relative group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-30 transition-opacity">
                <Quote className="w-12 h-12 text-white" />
              </div>
              
              <div className="flex gap-1 mb-6 text-yellow-400">
                {[...Array(review.rating || 5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}
              </div>
              
              <p className="text-white/70 leading-relaxed mb-8 relative z-10 text-lg font-light">
                "{review.text}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                {review.avatar && (
                  <img 
                    src={review.avatar} 
                    alt={review.name} 
                    className="w-12 h-12 rounded-full border border-white/20"
                  />
                )}
                <div>
                  <h4 className="font-bold text-white">{review.name}</h4>
                  <p className="text-sm text-white/50">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center text-white/50 py-12 glass-card rounded-3xl">
          No reviews yet. Be the first to leave one!
        </div>
      )}
    </section>
  );
}
