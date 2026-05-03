# تقرير طريقة حساب نتائج اختبار قياس الأثر المجتمعي

هذا الملف يشرح كيف يتم حساب نتائج اختبار قياس الأثر المجتمعي داخل النظام الحالي.

## المدخلات الأساسية

- عدد المستفيدين: `beneficiaries`
- معدل الرضا (%): `satisfactionRate`
- نسبة التحسين (%): `improvementRate`
- مؤشر الشمول (%): `inclusionIndex`
- ساعات التطوع: `volunteerHours`
- التكلفة الفعلية: `actualCost`
- قائمة المنافع الاجتماعية: `benefits[]` وكل عنصر يحتوي:
  - `name`
  - `value` (قيمة مالية)

## معادلات الحساب

- إجمالي قيمة المنافع:

  $$
  totalBenefitsValue = \sum_{b \in benefits} value_b
  $$

- معدل العائد الاجتماعي على الاستثمار `SROI`:

  $$
  SROI=
  \begin{cases}
  \dfrac{totalBenefitsValue}{actualCost}, & actualCost>0 \\
  \text{غير معرّف (—)}, & actualCost=0
  \end{cases}
  $$

- تحويل ساعات التطوع إلى مؤشر نسبي:

  $$
  volunteerIndex =
  \begin{cases}
  \min\left(100,\dfrac{volunteerHours}{10}\right), & volunteerHours>0 \\
  0, & volunteerHours=0
  \end{cases}
  $$

- مؤشر الأثر الكلي `avgScore` (%):

  $$
  avgScore = \dfrac{satisfactionRate + improvementRate + inclusionIndex + volunteerIndex}{4}
  $$

  ثم يتم عرضه برقم عشري واحد.

## تصنيف النتيجة المعروض في الواجهة

- إذا `avgScore >= 75`: أثر ممتاز ✅
- إذا `55 <= avgScore < 75`: أثر جيد ⚠️
- إذا `avgScore < 55`: يحتاج تحسين ❌

## قواعد النص التحليلي (AI Insight)

- إذا `satisfactionRate >= 85` و `improvementRate >= 70`:
  - "أثر مجتمعي ممتاز..."
- وإلا إذا `satisfactionRate >= 70`:
  - "أثر مجتمعي جيد..."
- وإلا إذا `improvementRate < 50`:
  - "أثر محدود..."
- غير ذلك:
  - "أثر متوسط..."

## ملاحظات مهمة

- في اختبار الأثر، قيم الرضا/التحسين/الشمول واجهة الإدخال تحددها حتى 100، لكن الحساب نفسه يأخذ القيم الرقمية كما هي بعد التحويل.
- قيمة `benefits` تدخل مباشرة في حساب `SROI` بدون أوزان إضافية.

## مثال سريع

إذا كانت القيم:

- `satisfactionRate = 80`
- `improvementRate = 60`
- `inclusionIndex = 70`
- `volunteerHours = 400`

إذًا:

$$
volunteerIndex = \min(100, 400/10)=40
$$

$$
avgScore = (80+60+70+40)/4 = 62.5\%
$$

والتصنيف الظاهر: "أثر جيد ⚠️".
