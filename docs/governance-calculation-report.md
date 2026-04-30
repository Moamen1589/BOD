# تقرير طريقة حساب نتائج اختبار الحوكمة

هذا الملف يشرح كيف يتم حساب نتائج اختبار الحوكمة داخل النظام الحالي بناءً على منطق الواجهة.

## المدخلات الأساسية

- تكلفة البرنامج الفعلية: `actualCost`
- كفاءة استخدام الموارد (%): `resourceEfficiency`
- تكلفة المستفيد (اختياري): `costPerBeneficiary`
- مدة التنفيذ بالأيام: `duration`
- حالة المشروع: `status`
- بيانات الأرباع (`Q1` إلى `Q4`):
  - تكلفة البرنامج لكل ربع: `programCost`
  - ميزانية البرنامج لكل ربع: `programBudget`
  - عدد المستفيدين لكل ربع: `beneficiaries`

## القيم المجمعة المستخدمة في الحساب

- إجمالي الإنفاق الفعلي:

  $$
  totalActual = actualCost
  $$

- إجمالي الميزانية:

  $$
  totalBudget = \sum_{q \in \{Q1,Q2,Q3,Q4\}} programBudget_q
  $$

- إجمالي المستفيدين:

  $$
  totalBeneficiaries = \sum_{q \in \{Q1,Q2,Q3,Q4\}} beneficiaries_q
  $$

- انحراف الميزانية (%):

  $$
  budgetVariance =
  \begin{cases}
  \dfrac{totalBudget - totalActual}{totalBudget} \times 100, & totalBudget > 0 \\
  0, & totalBudget = 0
  \end{cases}
  $$

- تكلفة المستفيد المعتمدة في الحساب:

  $$
  costPerBene =
  \begin{cases}
  costPerBeneficiary, & \text{إذا كانت مُدخلة} \\
  \dfrac{totalActual}{totalBeneficiaries}, & totalBeneficiaries > 0 \\
  0, & \text{غير ذلك}
  \end{cases}
  $$

## حساب أركان الحوكمة الستة (0 إلى 100)

> ملاحظة: كل ركن يتم قصّه إلى حد أعلى 100 عبر `Math.min(100, ...)`.

### 1) `purpose` (الغاية)

$$
purpose = \min\Big(100,\ \text{round}\big(\min(100, totalBeneficiaries/3) \times 0.6 + f\big)\Big)
$$

حيث:

$$
f=
\begin{cases}
\min\left(40,\ \dfrac{10000}{costPerBene}\times 4\right), & costPerBene > 0 \\
20, & costPerBene = 0
\end{cases}
$$

### 2) `integrity` (النزاهة)

$$
integrity = \min\Big(100,\ \text{round}(resourceEfficiency\times0.6 + g)\Big)
$$

حيث:

$$
g=
\begin{cases}
\min\left(40,\ \max\left(0,\ 1-\dfrac{|totalBudget-totalActual|}{totalBudget}\right)\times40\right), & totalBudget>0 \\
20, & totalBudget=0
\end{cases}
$$

### 3) `empowerment` (التمكين)

$$
empowerment=
\begin{cases}
\min\left(100,\ \text{round}\left(\min\left(100,\ \dfrac{totalBeneficiaries}{\max(1, totalBudget/10000)}\times30\right)\right)\right), & totalBudget>0 \land totalBeneficiaries>0 \\
0, & \text{غير ذلك}
\end{cases}
$$

### 4) `innovation` (التجديد والتكيّف المجتمعي)

- مكتمل = 95
- جارٍ التنفيذ = 70
- في المرحلة التخطيطية = 45
- غير ذلك = 20

### 5)  (الكفاءة التشغيلية)

$$
capacity=
\begin{cases}
\min\left(100,\ \text{round}\left(70+\dfrac{totalBudget-totalActual}{totalBudget}\times30\right)\right), & totalBudget>0 \land totalActual\le totalBudget \\
\min\left(100,\ \text{round}\left(\max\left(10,\ 70-\dfrac{totalActual-totalBudget}{totalBudget}\times80\right)\right)\right), & totalBudget>0 \land totalActual>totalBudget \\
\min(100,\ \text{round}(resourceEfficiency\times0.8)), & \text{إذا لم تتوفر ميزانية/تكلفة كافية}
\end{cases}
$$

### 6) `sustainability` (الشراكات والنظم البيئية)

$$
sustainability = \min\Big(100,\ \text{round}(coverage\times65 + durationPart)\Big)
$$

حيث:

$$
coverage = \dfrac{\#\{q: beneficiaries_q\ \text{مدخل غير فارغ} \land programBudget_q\ \text{مدخل غير فارغ}\}}{4}
$$

$$
durationPart=
\begin{cases}
\min\left(35,\ \dfrac{duration}{90}\times35\right), & duration>0 \\
0, & duration=0
\end{cases}
$$

## مؤشرات الحوكمة المعروضة في بطاقة النتيجة

- كفاءة الإنفاق المالي (%):

  $$
  spendingEfficiency=
  \begin{cases}
  \min\left(100,\dfrac{totalActual}{totalBudget}\times100\right), & totalBudget>0 \\
  0, & totalBudget=0
  \end{cases}
  $$

  ويعتبر "جيد" إذا كان بين 80 و100.

- كفاءة استخدام الموارد = `resourceEfficiency`، وتعتبر "جيدة" إذا كانت $\ge 75$.

- تكلفة المستفيد (%):

  $$
  beneCostScore=
  \begin{cases}
  \min\left(100,\ 100-\dfrac{costPerBene}{1000}\times10\right), & costPerBene>0 \\
  0, & costPerBene=0
  \end{cases}
  $$

  وتعتبر "جيدة" إذا كانت $\ge 60$.

## ملاحظات مهمة

- الحقول الربع سنوية (`Q1` إلى `Q4`) إلزامية للحساب والتقرير.
- المنطق الحالي يعتمد على قيم الواجهة كما هي بعد التحويل الرقمي.
