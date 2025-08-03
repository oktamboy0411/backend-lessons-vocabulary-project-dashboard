function Home() {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4 py-12">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl w-full space-y-6">
        <h1 className="text-4xl font-bold text-blue-700 text-center">
          Assalomu alaykum va xush kelibsiz!
        </h1>

        <p className="text-gray-700 text-lg leading-relaxed">
          Ushbu platforma orqali siz so‘zlar, ularning ma'nolari va ularni
          to‘g‘ri guruhlash haqida mukammal tizim bilan ishlashingiz mumkin.
        </p>

        <div className="space-y-4">
          <p className="text-gray-800">
            🔤 <span className="font-semibold">Vocabulary (Lug‘at)</span> – bu
            sizning asosiy so‘zlar to‘plamingiz. Har bir vocabulary ma’lum bir
            mavzu yoki tilga oid so‘zlar guruhini ifodalaydi.
          </p>

          <p className="text-gray-800">
            📚 <span className="font-semibold">Section (Bo‘lim)</span> –
            vocabulary ichida kichik mavzular yoki yo‘nalishlarga bo‘lingan
            bo‘limlardir. Masalan, “Hayvonlar” vocabulary’sida “Qushlar”, “Sut
            emizuvchilar” kabi sectionlar bo‘lishi mumkin.
          </p>

          <p className="text-gray-800">
            🗂 <span className="font-semibold">Category (Toifa)</span> – har bir
            section ichida so‘zlarni yana chuqurroq guruhlash imkonini beradi.
            Bu so‘zlar o‘rtasidagi aloqani aniqlashtirish va tez topishni
            osonlashtiradi.
          </p>

          <p className="text-gray-800">
            📝 <span className="font-semibold">Words (So‘zlar)</span> –
            platformaning yuragi. Har bir word o‘zining nomi, tavsifi, rasmi va
            unga tegishli vocabulary, section va category bilan bog‘langan
            holatda saqlanadi.
          </p>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mt-4">
            Boshlash uchun chap menyudagi bo‘limlardan birini tanlang yoki yangi
            so‘zlar yaratishni boshlang!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
