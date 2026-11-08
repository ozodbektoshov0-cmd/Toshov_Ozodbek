/* Firebase sozlamasi (Google bilan kirish va kirishlar jadvali uchun).
   1) console.firebase.google.com da loyiha oching, Authentication > Google ni yoqing,
      Firestore Database yarating, Web ilova qo'shing.
   2) Ilova sozlamalarini shu yerga qo'ying, ADMIN_EMAIL ga o'z Gmail manzilingizni yozing.
   3) README.md dagi Firestore qoidalarini joylang. Bo'sh qolsa, kirish tugmasi yashirin turadi. */
window.TO_FIREBASE = {
  config: { apiKey: '', authDomain: '', projectId: '', appId: '' },
  ADMIN_EMAIL: ''
};
