# Zanaat Lokanta & Cafe - Landing Page + Dijital QR Menü

Sıfır sunucu ve sıfır veritabanı maliyetiyle çalışan, mobile-first, yüksek hızlı ve doğal bistro tasarımına sahip modern lokanta platformu.

---

## 🌟 Öne Çıkan Özellikler

1. **Ultra Hızlı Yükleme & Mobile-First:**
   - QR kod okutulduğunda 0.2 saniyede açılır (Next.js ISR & Statik Optimizasyon).
   - Tek elle kullanıma uygun butonlar, yapışkan kategori barı ve dokunmatik filtreler.

2. **Doğal ve Tok Renk Paleti (Yapay AI Gradyanı Yok):**
   - Pişmiş toprak kiremit (`#B34827`), doğal keten/taş zemin (`#F9F6F0`), zeytin yaprağı (`#3F5243`) ve sıcak amber (`#B87618`).

3. **Sıfır Sunucu & Sıfır DB Maliyeti (Airtable Entegrasyonu):**
   - Dükkan sahibi telefonundan veya bilgisayarından Airtable tablosunu açar; fiyat değiştirir, fotoğraf yükler veya ürünü "Tükendi" yapar.
   - Sitede otomatik güncellenir.
   - Airtable bağlı değilse bile zengin yerel menü verisiyle hatasız çalışır.

4. **İş Gören Fonksiyonlar:**
   - Canlı arama ve diyet/etiket filtreleme (Şefin Seçimi, Vejetaryen, Taş Fırın).
   - Yemek detay çekmecesi (Alerjenler, hazırlık süresi, porsiyon bilgisi).
   - Tek tıkla WhatsApp sipariş/soru taslağı oluşturma.
   - Masa WiFi şifresi görüntüleme ve tek tıkla kopyalama.
   - Google Haritalar doğrudan yol tarifi ve telefonla arama.
   - Yazdırılabilir masa QR kodu modalı.

---

## 🚀 Kurulum ve Çalıştırma

```bash
# Bağımlılıkları yükleyin (zaten kurulu)
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

---

## 📋 Airtable Bağlantı Rehberi (3 Adım)

Lokanta sahibine menüyü mobilden yönettirmek istediğinizde:

1. **Airtable'da Ücretsiz Bir Base Açın** ve tablo adını `Menü` yapın.
2. Aşağıdaki sütunları ekleyin:
   - `Yemek Adı` (Single line text)
   - `Açıklama` (Long text)
   - `Fiyat` (Number)
   - `Kategori` (Single select veya text: `corbalar`, `firindan`, `tencere`, `zeytinyaglilar`, `tatlilar`, `icecekler`)
   - `Fotoğraf` (Attachment - dükkancı galeriden sürükler)
   - `Etiketler` (Multiple select: `Şefin Seçimi`, `Vejetaryen`, `Taş Fırın`)
   - `Tükendi` (Checkbox)
   - `Porsiyon` (Single line text)
   - `Alerjenler` (Multiple select)
3. Proje kök dizininde `.env.local` oluşturup tokenlarınızı ekleyin:
   ```env
   AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
   AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
   AIRTABLE_TABLE_NAME=Menü
   ```
*(Bu değişkenler girilmezse proje varsayılan olarak `src/lib/mock-data.ts` içindeki zengin menüyle çalışır).*

---

## ☁️ Vercel'e Dağıtım (1 Tıkla Bedava)

GitHub deponuzu Vercel'e bağlayıp "Deploy" butonuna basmanız yeterlidir. Ömür boyu 0 TL barındırılır.
