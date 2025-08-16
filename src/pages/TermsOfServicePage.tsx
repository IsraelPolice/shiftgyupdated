import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function TermsOfServicePage() {
  const { language } = useLanguage();
  const [content, setContent] = useState<string>('');
  const pageTitle = language === 'he' ? 'ShiftGY - תקנון אתר' : 'ShiftGY - Terms of Service';

  useEffect(() => {
    // Load the appropriate content based on language
    if (language === 'he') {
      setContent(hebrewContent);
    } else {
      setContent(englishContent);
    }
    
    // Set the page title
    document.title = pageTitle;
    
    // Reset title when component unmounts
    return () => {
      document.title = 'ShiftGY - Smart Shift Scheduling Platform';
    };
  }, [language]);

  return (
    <div className="tos-container bg-white rounded-xl shadow-sm border border-gray-100 my-6">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

// English content
const englishContent = `
<h1>ShiftGY Terms of Service</h1>

<h2>1. Introduction</h2>
<p>Welcome to ShiftGY! These Terms of Service ("Terms") govern your access to and use of the ShiftGY platform, including our website, mobile applications, and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service.</p>

<h2>2. Definitions</h2>
<p>In these Terms:</p>
<ul>
  <li>"ShiftGY," "we," "us," and "our" refer to ShiftGY Ltd., the company that provides the Service.</li>
  <li>"You" and "your" refer to the individual or entity that accesses or uses the Service.</li>
  <li>"Content" refers to any information, data, text, software, graphics, messages, or other materials that are uploaded, posted, or otherwise transmitted through the Service.</li>
  <li>"User" refers to any individual or entity that accesses or uses the Service, including you.</li>
</ul>

<h2>3. Account Registration and Security</h2>
<p>To use certain features of the Service, you may need to create an account. When you create an account, you must provide accurate and complete information. You are responsible for maintaining the security of your account and password. ShiftGY cannot and will not be liable for any loss or damage resulting from your failure to maintain the security of your account and password.</p>

<h2>4. Use of the Service</h2>
<p>You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
<ul>
  <li>Use the Service in any way that violates any applicable law or regulation.</li>
  <li>Use the Service to transmit any material that is defamatory, obscene, or otherwise objectionable.</li>
  <li>Use the Service to transmit any material that contains software viruses or any other computer code, files, or programs designed to interrupt, destroy, or limit the functionality of any computer software or hardware.</li>
  <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
  <li>Attempt to gain unauthorized access to the Service, other accounts, computer systems, or networks connected to the Service.</li>
</ul>

<h2>5. Content</h2>
<p>You retain all rights to any Content you submit, post, or display on or through the Service. By submitting, posting, or displaying Content on or through the Service, you grant ShiftGY a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such Content in any and all media or distribution methods.</p>

<h2>6. Privacy</h2>
<p>Our Privacy Policy, available at [Privacy Policy URL], describes how we collect, use, and share information about you when you use the Service. By using the Service, you agree to the collection, use, and sharing of your information as described in the Privacy Policy.</p>

<h2>7. Intellectual Property</h2>
<p>The Service and its original content, features, and functionality are and will remain the exclusive property of ShiftGY and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of ShiftGY.</p>

<h2>8. Termination</h2>
<p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>

<h2>9. Limitation of Liability</h2>
<p>In no event shall ShiftGY, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.</p>

<h2>10. Disclaimer</h2>
<p>Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.</p>

<h2>11. Governing Law</h2>
<p>These Terms shall be governed and construed in accordance with the laws of Israel, without regard to its conflict of law provisions.</p>

<h2>12. Changes to Terms</h2>
<p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

<h2>13. Contact Us</h2>
<p>If you have any questions about these Terms, please contact us at support@shiftgy.com.</p>
`;

// Hebrew content
const hebrewContent = `
<h1>תנאי שימוש ShiftGY</h1>

<h2>1. מבוא</h2>
<p>ברוכים הבאים ל-ShiftGY! תנאי שימוש אלה ("התנאים") מסדירים את הגישה והשימוש שלך בפלטפורמת ShiftGY, כולל האתר שלנו, אפליקציות לנייד ושירותים (יחד, "השירות"). על ידי גישה או שימוש בשירות, אתה מסכים להיות מחויב לתנאים אלה. אם אינך מסכים לתנאים אלה, אינך רשאי לגשת או להשתמש בשירות.</p>

<h2>2. הגדרות</h2>
<p>בתנאים אלה:</p>
<ul>
  <li>"ShiftGY", "אנחנו", "אותנו" ו"שלנו" מתייחסים ל-ShiftGY בע"מ, החברה המספקת את השירות.</li>
  <li>"אתה" ו"שלך" מתייחסים לאדם או לישות שניגשים או משתמשים בשירות.</li>
  <li>"תוכן" מתייחס לכל מידע, נתונים, טקסט, תוכנה, גרפיקה, הודעות או חומרים אחרים שמועלים, מפורסמים או מועברים בדרך אחרת באמצעות השירות.</li>
  <li>"משתמש" מתייחס לכל אדם או ישות שניגשים או משתמשים בשירות, כולל אתה.</li>
</ul>

<h2>3. רישום חשבון ואבטחה</h2>
<p>כדי להשתמש בתכונות מסוימות של השירות, ייתכן שתצטרך ליצור חשבון. כאשר אתה יוצר חשבון, עליך לספק מידע מדויק ומלא. אתה אחראי לשמירה על אבטחת החשבון והסיסמה שלך. ShiftGY לא יכולה ולא תהיה אחראית לכל אובדן או נזק הנובעים מכשלונך לשמור על אבטחת החשבון והסיסמה שלך.</p>

<h2>4. שימוש בשירות</h2>
<p>אתה רשאי להשתמש בשירות רק למטרות חוקיות ובהתאם לתנאים אלה. אתה מסכים לא:</p>
<ul>
  <li>להשתמש בשירות בכל דרך שמפרה כל חוק או תקנה החלים.</li>
  <li>להשתמש בשירות כדי להעביר כל חומר שהוא דיבה, תועבה או בדרך אחרת בלתי ראוי.</li>
  <li>להשתמש בשירות כדי להעביר כל חומר המכיל וירוסי תוכנה או כל קוד מחשב אחר, קבצים או תוכניות המיועדים להפריע, להרוס או להגביל את הפונקציונליות של כל תוכנת מחשב או חומרה.</li>
  <li>להפריע או לשבש את השירות או שרתים או רשתות המחוברים לשירות.</li>
  <li>לנסות לקבל גישה לא מורשית לשירות, חשבונות אחרים, מערכות מחשב או רשתות המחוברות לשירות.</li>
</ul>

<h2>5. תוכן</h2>
<p>אתה שומר על כל הזכויות לכל תוכן שאתה מגיש, מפרסם או מציג בשירות או דרכו. על ידי הגשה, פרסום או הצגת תוכן בשירות או דרכו, אתה מעניק ל-ShiftGY רישיון עולמי, לא בלעדי, ללא תמלוגים להשתמש, להעתיק, לשכפל, לעבד, להתאים, לשנות, לפרסם, לשדר, להציג ולהפיץ תוכן כזה בכל מדיה או שיטות הפצה.</p>

<h2>6. פרטיות</h2>
<p>מדיניות הפרטיות שלנו, הזמינה ב-[כתובת מדיניות הפרטיות], מתארת כיצד אנו אוספים, משתמשים ומשתפים מידע עליך כאשר אתה משתמש בשירות. על ידי שימוש בשירות, אתה מסכים לאיסוף, שימוש ושיתוף המידע שלך כמתואר במדיניות הפרטיות.</p>

<h2>7. קניין רוחני</h2>
<p>השירות והתוכן המקורי שלו, תכונות ופונקציונליות הם ויישארו הרכוש הבלעדי של ShiftGY ומעניקי הרישיון שלה. השירות מוגן על ידי זכויות יוצרים, סימני מסחר וחוקים אחרים של ארצות הברית ומדינות זרות. סימני המסחר וסגנון המסחר שלנו לא ישמשו בקשר לכל מוצר או שירות ללא הסכמה מראש בכתב של ShiftGY.</p>

<h2>8. סיום</h2>
<p>אנו רשאים לסיים או להשעות את חשבונך ולמנוע גישה לשירות מיד, ללא הודעה מוקדמת או אחריות, לפי שיקול דעתנו הבלעדי, מכל סיבה שהיא וללא הגבלה, כולל אך לא מוגבל להפרת התנאים.</p>

<h2>9. הגבלת אחריות</h2>
<p>בשום מקרה ShiftGY, ולא מנהליה, עובדיה, שותפיה, סוכניה, ספקיה או שותפיה, לא יהיו אחראים לכל נזק עקיף, מקרי, מיוחד, תוצאתי או עונשי, כולל ללא הגבלה, אובדן רווחים, נתונים, שימוש, רצון טוב או הפסדים בלתי מוחשיים אחרים, הנובעים מ (i) הגישה שלך או השימוש שלך או חוסר היכולת לגשת או להשתמש בשירות; (ii) כל התנהגות או תוכן של צד שלישי בשירות; (iii) כל תוכן שהושג מהשירות; ו-(iv) גישה, שימוש או שינוי לא מורשים של השידורים או התוכן שלך, בין אם מבוסס על אחריות, חוזה, עוולה (כולל רשלנות) או כל תיאוריה משפטית אחרת, בין אם הודענו על אפשרות נזק כזה, ואפילו אם תרופה המפורטת כאן נמצאה ככשלה במטרתה העיקרית.</p>

<h2>10. כתב ויתור</h2>
<p>השימוש שלך בשירות הוא על אחריותך בלבד. השירות מסופק על בסיס "כמות שהוא" ו"כפי שהוא זמין". השירות מסופק ללא אחריות מכל סוג, בין אם מפורשת או משתמעת, כולל, אך לא מוגבל לאחריות משתמעת של סחירות, התאמה למטרה מסוימת, אי הפרה או מהלך ביצוע.</p>

<h2>11. חוק שולט</h2>
<p>תנאים אלה יהיו כפופים ויפורשו בהתאם לחוקי ישראל, ללא התחשבות בהוראות סתירת החוק שלה.</p>

<h2>12. שינויים בתנאים</h2>
<p>אנו שומרים לעצמנו את הזכות, לפי שיקול דעתנו הבלעדי, לשנות או להחליף תנאים אלה בכל עת. אם שינוי הוא מהותי, נספק הודעה של לפחות 30 יום לפני כניסת תנאים חדשים לתוקף. מה מהווה שינוי מהותי ייקבע לפי שיקול דעתנו הבלעדי.</p>

<h2>13. צור קשר</h2>
<p>אם יש לך שאלות כלשהן לגבי תנאים אלה, אנא צור איתנו קשר בכתובת support@shiftgy.com.</p>
`;