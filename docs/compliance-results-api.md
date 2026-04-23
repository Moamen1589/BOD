# صفحة عرض نتائج اختبار النضج - مواصفات الـ API

هذه الوثيقة تصف البيانات التي تحتاجها صفحة عرض النتائج الخاصة باختبار النضج لإظهار التقرير النهائي بعد إنهاء جميع المحاور.

## الهدف

الصفحة تعرض:

1. ملخص التقييم العام.
2. مستوى النضج المؤسسي.
3. نسبة الإكمال.
4. نتائج كل محور.
5. تفاصيل الأسئلة داخل كل محور، مع الدرجات والملاحظات.
6. التوصية النهائية أو المسار المناسب.
7. بيانات التقرير النهائي مثل حالة الإرسال والتقييم والمراجعة.

## الـ Endpoint المقترح

```http
GET /api/compliance/submissions/{submissionId}/final-report
```

يمكن أيضًا إرجاع نفس البيانات من endpoint آخر، لكن المهم أن يحتوي على نفس البنية الموضحة أدناه.

## Path Params

- `submissionId`: رقم/معرّف جلسة التقييم أو التقرير النهائي.

## البيانات المطلوبة في الرد

### 1) بيانات التقرير الأساسية

- `submission.id`
- `submission.status`
- `submission.overall_score`
- `submission.compliance_level`
- `submission.compliance_color`
- `submission.submitted_at`
- `submission.reviewed_at`
- `submission.evaluator_notes`
- `submission.management_action`
- `submission.management_decision`
- `submission.reassess_months`

### 2) بيانات التقييم

- `assessment.id`
- `assessment.title`
- `assessment.period_year`

### 3) بيانات الجهة

- `organization.id`
- `organization.name`
- `organization.type`

### 4) بيانات الإكمال

- `completion.total_questions`
- `completion.answered_questions`
- `completion.percentage`
- `completion.axes[]`

كل عنصر داخل `completion.axes[]` يجب أن يحتوي على:

- `axis_id`
- `title`
- `order`
- `answered`
- `total`
- `complete`
- `axis_score`

### 5) تفاصيل المحاور والأسئلة

- `axis_breakdown[]`

كل محور داخل `axis_breakdown[]` يجب أن يحتوي على:

- `axis_id`
- `title`
- `order`
- `recommendation_platform`
- `axis_score`
- `questions[]`

وكل سؤال داخل `questions[]` يجب أن يحتوي على:

- `question_id`
- `title`
- `score`
- `notes`

### 6) التوصيات

- `recommendations[]`

إذا كانت التوصيات غير متوفرة الآن، يمكن إرجاع مصفوفة فارغة.

## شكل الرد المتوقع

```json
{
  "submission": {
    "id": 3,
    "status": "draft",
    "overall_score": null,
    "compliance_level": null,
    "compliance_color": null,
    "submitted_at": null,
    "reviewed_at": null,
    "evaluator_notes": null,
    "management_action": null,
    "management_decision": null,
    "reassess_months": null
  },
  "assessment": {
    "id": 1,
    "title": "نموذج تقييم الامتثال السنوي - منظومة والدة حلم الاجتماعية",
    "period_year": "2026"
  },
  "organization": {
    "id": 13,
    "name": "جمعية السلام",
    "type": "foundation"
  },
  "completion": {
    "total_questions": 51,
    "answered_questions": 0,
    "percentage": 0,
    "axes": [
      {
        "axis_id": 1,
        "title": "الحوكمة والامتثال النظامي",
        "order": 1,
        "answered": 0,
        "total": 6,
        "complete": false,
        "axis_score": null
      }
    ]
  },
  "axis_breakdown": [
    {
      "axis_id": 1,
      "title": "الحوكمة والامتثال النظامي",
      "order": 1,
      "recommendation_platform": "مسرعة أثر وريادة",
      "axis_score": null,
      "questions": [
        {
          "question_id": 1,
          "title": "وجود مجلس إدارة فعّال",
          "score": null,
          "notes": null
        }
      ]
    }
  ],
  "recommendations": []
}
```

## ملاحظات مهمة للتنفيذ

1. ترتيب المحاور مهم، ويفضل إرجاعها مرتبة بحسب `order`.
2. لازم `axis_breakdown` يحتوي على `questions[]` لأن صفحة النتائج تعتمد عليه لعرض تفاصيل كل محور.
3. لو التقييم لسه Draft، ممكن إرجاع القيم الفارغة أو `null` بشكل طبيعي.
4. لو محتاجين صفحة النتائج تعرض بيانات أكثر، ممكن إضافة حقول مثل:
   - `final_summary`
   - `strengths[]`
   - `risks[]`
   - `next_actions[]`

## الاستعمال في الواجهة

الواجهة تحتاج هذه البيانات لتكوين:

- المتوسط العام.
- مستوى النضج.
- شريط الإكمال.
- بطاقات المحاور.
- تفاصيل كل سؤال داخل المحور.
- اقتراحات التحسين أو المسار المناسب.

## نطاقات السكور وما الذي يجب أن يظهر

الصفحة الحالية تعتمد على سكور من 0 إلى 5، سواء على مستوى التقرير العام أو كل محور.

### 1) مستوى النضج العام

حقل `submission.overall_score` أو المتوسط الناتج من المحاور يستخدم هذه الحدود:

| النطاق | مستوى النضج | اللون | ما يجب أن يظهر |
| --- | --- | --- | --- |
| 4.5 إلى 5.0 | امتثال مؤسسي ناضج | أخضر | الجمعية متقدمة جدًا، ويُعرض أن الحالة مستقرة وناضجة مع أقل احتياج للتدخل. |
| 3.5 إلى 4.4 | امتثال جيد | أزرق | الأداء جيد، ويُعرض أن هناك تحسينات بسيطة فقط مطلوبة. |
| 2.5 إلى 3.4 | امتثال متوسط | أصفر | الوضع متوسط، ويُعرض أن هناك حاجة لخطة تطوير واضحة. |
| 1.5 إلى 2.4 | امتثال ضعيف | برتقالي | الوضع ضعيف، ويُعرض تنبيه بأن هذا المجال يحتاج تدخلًا وتحسينًا قريبًا. |
| أقل من 1.5 | خطر مؤسسي | أحمر | الوضع حرج، ويُعرض تحذير قوي بأن المحور أو المنظمة تحتاج تدخلًا عاجلًا. |

### 2) مستوى كل محور

كل محور داخل `axis_breakdown[]` يستخدم نفس النطاقات تقريبًا عبر `axis_score`:

- إذا كان `axis_score >= 4.5`:
  - يُعرض المحور على أنه ناضج.
  - لا يحتاج توصية عاجلة.
- إذا كان `axis_score >= 3.5` وأقل من 4.5:
  - يُعرض كمحور جيد.
  - تظهر ملاحظة بأنه يمكن تحسينه أكثر.
- إذا كان `axis_score >= 2.5` وأقل من 3.5:
  - يُعرض كمحور متوسط.
  - تظهر توصية تطوير أو تحسين.
- إذا كان `axis_score >= 1.5` وأقل من 2.5:
  - يُعرض كمحور ضعيف.
  - تظهر رسالة أنه يحتاج تدخلاً قريبًا.
- إذا كان `axis_score < 1.5`:
  - يُعرض كخطر مؤسسي.
  - تظهر رسالة تدخل عاجل.

### 3) ما الذي يجب أن يخرج بناءً على النطاق

يفضل أن يرجع الـ API أو يسهّل على الواجهة هذه القيم:

- `submission.overall_score`: رقم من 0 إلى 5.
- `submission.compliance_level`: نص يطابق المستوى النهائي.
- `submission.compliance_color`: لون أو كلاس لوني متوافق مع المستوى.
- `axis_breakdown[].axis_score`: رقم من 0 إلى 5 لكل محور.
- `axis_breakdown[].recommendation_platform`: المنصة المناسبة عند وجود ضعف في المحور.

الواجهة حاليًا تعرض:

- التسمية النصية للمستوى.
- اللون المناسب للمستوى.
- رسالة تفسيرية قصيرة لكل محور حسب النطاق.
- توصية منصة عند انخفاض النتيجة في محور معين.

### 4) منطق التوصية الظاهر في الواجهة

الواجهة حاليًا تولد رسالة توصية لكل محور بناءً على `axis_score`:

- `>= 4.5`: لا تظهر رسالة تدخل.
- `3.5 - 4.4`: يمكن الاستفادة من المنصة المقترحة.
- `2.5 - 3.4`: يوصى بالالتحاق بالمنصة المقترحة.
- `< 2.5`: يوصى بشدة بالتدخل عبر المنصة المقترحة.

هذا يعني أن الباك إند يفضل يرجع اسم المنصة لكل محور في `recommendation_platform` أو بشكل مكافئ داخل `recommendations[]`.

## اقتراح إضافي

لو حابين نفصل النتائج بشكل أوضح، ممكن تقسيمها إلى endpointين:

1. `GET /api/compliance/submissions/{submissionId}/summary`
2. `GET /api/compliance/submissions/{submissionId}/breakdown`

لكن لو الهدف صفحة واحدة، endpoint واحد شامل يكفي.