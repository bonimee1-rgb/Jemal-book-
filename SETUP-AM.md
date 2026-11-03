# Jemal Books and Hadith App — የCloud ዳታቤዝ ማዘጋጃ

## 1. Supabase ፕሮጀክት ፍጠር
1. https://supabase.com/ ክፈትና አዲስ Project ፍጠር።
2. የዳታቤዝ ፓስወርድህን በደህና አስቀምጥ።
3. Project Settings → API ግባ። Project URL እና anon/public key ቅዳ።
4. `service_role` key በፍጹም በHTML/JavaScript ውስጥ አታስገባ፤ በቻትም አትላክ።

## 2. ዳታቤዙን ፍጠር
1. Supabase → SQL Editor → New query ክፈት።
2. `supabase/schema.sql` ውስጥ ያለውን ሙሉ SQL ቅዳና Run አድርግ።
3. `books` ሰንጠረዥ የመጻሕፍት መረጃን ይይዛል።
4. `user_bookmarks` የተጠቃሚዎችን ዕልባት ይይዛል።

## 3. PDF ማከማቻ ፍጠር
1. Storage → New bucket ግባ።
2. ስሙን `jemal-books` ብለህ አድርግ።
3. ለደህንነት PRIVATE አድርገው።
4. PDF ለማሳየት ጊዜያዊ signed URL ተጠቀም። የመጽሐፉ ፈቃድ ሳይረጋገጥ ለሕዝብ አታሰራጭ።

## 4. የአፑን ቅንብር
1. `supabase-config.example.js` ወደ `supabase-config.js` ቅዳ።
2. Project URL እና anon/public key በተገቢው ቦታ አስገባ።
3. በ`index.html` ውስጥ ከ`app.js` በፊት የSupabase script tags አስገባ፤ በREADME ውስጥ ኮዱ ተቀምጧል።

## 5. የአስተዳዳሪ ደህንነት
SQL ፖሊሲዎቹ መጽሐፍ መጨመር/ማስተካከል የሚፈቅዱት በJWT `app_metadata.role = admin` ላለው ተጠቃሚ ብቻ ነው። ይህን ሚና ከደህንነቱ የተጠበቀ server-side መንገድ አዘጋጅ፤ በbrowser JavaScript ውስጥ አትመድብ።

## አስፈላጊ
ይህ የዳታቤዝ ማዘጋጃ ነው፤ አሁንም በቀጥታ ከአፑ ጋር አልተገናኘም። ቀጣዩ ሥራ የአስተዳዳሪ የደህንነት ማስገቢያ ገጽን እና የPDF ወደ Cloud መላኪያን ማገናኘት ነው።
