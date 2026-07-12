'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Brain, ChevronRight, ChevronLeft, User, Heart, Utensils, Activity, Stethoscope } from 'lucide-react'
import { AIOutput } from '@/components/ui/AIOutput'
import { AILoadingSkeleton } from '@/components/ui/Skeleton'
import { callAPI, getRiskGaugeColor, getRiskCategory } from '@/lib/utils'

const STEPS = [
  { id: 'demographics', label: 'Demographics', icon: User },
  { id: 'lifestyle', label: 'Lifestyle', icon: Activity },
  { id: 'dietary', label: 'Dietary Habits', icon: Utensils },
  { id: 'medical', label: 'Medical History', icon: Heart },
  { id: 'symptoms', label: 'Symptoms', icon: Stethoscope },
]

const SYMPTOM_FIELDS = [
  { key: 'jaundice', label: 'Jaundice (yellow skin/eyes)' },
  { key: 'abdominalPain', label: 'Abdominal / RUQ pain' },
  { key: 'weightLoss', label: 'Unexplained weight loss' },
  { key: 'fatigue', label: 'Persistent fatigue' },
  { key: 'pruritus', label: 'Pruritus (itching)' },
  { key: 'darkUrine', label: 'Dark urine' },
  { key: 'paleStools', label: 'Pale / clay-coloured stools' },
  { key: 'fever', label: 'Fever / chills' },
  { key: 'nausea', label: 'Nausea / vomiting' },
  { key: 'lossOfAppetite', label: 'Loss of appetite' },
]

const MED_FIELDS = [
  { key: 'primarySclerosingCholangitis', label: 'Primary Sclerosing Cholangitis (PSC)', risk: 'very-high' },
  { key: 'hepatitisC', label: 'Hepatitis C (HCV)', risk: 'high' },
  { key: 'hepatitisB', label: 'Hepatitis B (HBV)', risk: 'high' },
  { key: 'liverFlukeExposure', label: 'Liver fluke exposure (Opisthorchis / Clonorchis)', risk: 'very-high' },
  { key: 'gallstones', label: 'Gallstones (cholelithiasis)', risk: 'moderate' },
  { key: 'liverDisease', label: 'Chronic liver disease / cirrhosis', risk: 'high' },
  { key: 'fattyLiver', label: 'Fatty liver disease (NAFLD/NASH)', risk: 'moderate' },
  { key: 'diabetes', label: 'Type 2 diabetes mellitus', risk: 'moderate' },
  { key: 'obesity', label: 'Obesity (BMI ≥30)', risk: 'moderate' },
  { key: 'familyHistoryBileDuctCancer', label: 'Family history of bile duct cancer', risk: 'high' },
  { key: 'familyHistoryLiverCancer', label: 'Family history of liver cancer', risk: 'moderate' },
  { key: 'previousBiliaryDisorders', label: 'Previous biliary tract disorders', risk: 'moderate' },
]

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((s, i) => {
        const done = i < current, active = i === current
        return (
          <div key={s.id} className="flex items-center flex-1">
            <div className={`flex items-center gap-1.5 ${active ? 'opacity-100' : done ? 'opacity-70' : 'opacity-30'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all
                ${active ? 'bg-medical-400 text-white shadow-lg shadow-medical-400/30'
                  : done ? 'bg-medical-400/40 text-medical-400'
                  : 'bg-gray-800 text-gray-500'}`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${active ? 'text-medical-400' : done ? 'text-gray-400' : 'text-gray-600'}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 ${i < current ? 'bg-medical-400/40' : 'bg-gray-800'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function SeveritySelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const opts = [
    { v: 0, label: 'None', cls: 'bg-gray-800 text-gray-500' },
    { v: 1, label: 'Mild', cls: 'bg-green-900/40 text-green-400' },
    { v: 2, label: 'Moderate', cls: 'bg-yellow-900/40 text-yellow-400' },
    { v: 3, label: 'Severe', cls: 'bg-red-900/40 text-red-400' },
  ]
  return (
    <div className="flex gap-1">
      {opts.map(o => (
        <button key={o.v} type="button" onClick={() => onChange(o.v)}
          className={`px-2 py-1 rounded text-xs font-medium border transition-all ${value === o.v ? o.cls + ' border-current' : 'border-gray-700 text-gray-600 hover:border-gray-600'}`}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

function estimateRiskScore(html: string): number {
  const text = html.toLowerCase()

  if (text.includes("very high")) return 85
  if (text.includes("high risk")) return 70
  if (text.includes("moderate")) return 50
  if (text.includes("low risk")) return 25

  return 40
}


export function RiskAssessmentPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

 
 
 
  const [form, setForm] = useState({
    // Demographics
   patientName: '', age: '', sex: 'female', weightKg: '', heightCm: '', country: '', ethnicity: '',
    // Lifestyle
    smokingStatus: 'never', smokingYears: '', cigarettesPerDay: '',
    alcoholUnitsWeek: '', physicalActivity: 'moderate', sedentaryHoursDay: '6',
    sleepHours: '7', sleepQuality: 'good', stressLevel: 5,
    // Dietary
    vegetableServings: '2', fruitServings: '1', waterLitresDay: '1.5',
    sugaryDrinksDay: '1', fastFoodPerWeek: '2', processedFoodScore: 5,
    redMeatPerWeek: '3', friedFoodPerWeek: '3', fiberAdequate: false,
    saltIntake: 'moderate', cookingOilType: 'vegetable', mealTimingRegular: true, lateNightEating: false,
    // Medical history (all booleans as strings for form)
    primarySclerosingCholangitis: false, hepatitisC: false, hepatitisB: false,
    liverFlukeExposure: false, gallstones: false, liverDisease: false, fattyLiver: false,
    diabetes: false, obesity: false, familyHistoryBileDuctCancer: false,
    familyHistoryLiverCancer: false, previousBiliaryDisorders: false,
    // Symptoms (0–3 severity)
    jaundice: 0, abdominalPain: 0, weightLoss: 0, fatigue: 0, pruritus: 0,
    darkUrine: 0, paleStools: 0, fever: 0, nausea: 0, lossOfAppetite: 0,
  })

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  async function submit() {
    if (!form.age) { toast.error('Please enter age before submitting'); return }
    setLoading(true); setResult(null)
    try {
      const bmi = form.weightKg && form.heightCm
        ? parseFloat((parseFloat(form.weightKg) / Math.pow(parseFloat(form.heightCm) / 100, 2)).toFixed(1))
        : undefined
      const payload = { ...form, age: parseInt(form.age), bmi,
        weightKg: form.weightKg ? parseFloat(form.weightKg) : undefined,
        heightCm: form.heightCm ? parseFloat(form.heightCm) : undefined,
      }
      const data = await callAPI<{ analysis: string }>('/api/cca-assessment', payload)

setResult(data.analysis)

const riskScore = estimateRiskScore(data.analysis)

const history = JSON.parse(
  localStorage.getItem("riskHistory") || "[]"
)

history.push({
  date: new Date().toLocaleDateString(),

  patientName: form.patientName,

  age: form.age,
  sex: form.sex,

  riskScore,

  patientData: payload,

  assessment: data.analysis
})

localStorage.setItem(
  "latestPatient",
  JSON.stringify({
    patientName: form.patientName,
    age: form.age,
    sex: form.sex,
    riskScore,
    patientData: payload,
    assessment: data.analysis,
    date: new Date().toLocaleDateString()
  })
)

    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Assessment failed')
    } finally { setLoading(false) }
  }

  const inp = 'form-input'
  const sel = 'form-input'

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="card">
        <StepBar current={step} />

        {/* Step 0 — Demographics */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2"><User className="w-4 h-4 text-medical-400" />Demographics</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
  <label className="form-label">
    Patient Name *
  </label>

  <input
    type="text"
    className={inp}
    placeholder="e.g. Rajan Pillai"
    value={form.patientName}
    onChange={(e) =>
      set('patientName', e.target.value)
    }
  />
</div>
              <div><label className="form-label">Age *</label><input type="number" className={inp} placeholder="e.g. 58" min={1} max={120} value={form.age} onChange={e => set('age', e.target.value)} /></div>
              <div><label className="form-label">Biological Sex</label>
                <select className={sel} value={form.sex} onChange={e => set('sex', e.target.value)}>
                  <option value="female">Female</option><option value="male">Male</option><option value="other">Other / Prefer not to say</option>
                </select>
              </div>
              <div><label className="form-label">Weight (kg)</label><input type="number" className={inp} placeholder="e.g. 72" step="0.1" value={form.weightKg} onChange={e => set('weightKg', e.target.value)} /></div>
              <div><label className="form-label">Height (cm)</label><input type="number" className={inp} placeholder="e.g. 165" value={form.heightCm} onChange={e => set('heightCm', e.target.value)} /></div>
              {form.weightKg && form.heightCm && (
                <div className="col-span-2 p-2 rounded-lg bg-gray-800/50 text-xs text-gray-400">
                  BMI: <strong className="text-gray-200">{(parseFloat(form.weightKg) / Math.pow(parseFloat(form.heightCm) / 100, 2)).toFixed(1)}</strong>
                  {parseFloat(form.weightKg) / Math.pow(parseFloat(form.heightCm) / 100, 2) >= 30 && <span className="ml-2 text-orange-400">⚠ Obesity — CCA risk factor</span>}
                </div>
              )}
              <div><label className="form-label">Country</label><input type="text" className={inp} placeholder="e.g. India" value={form.country} onChange={e => set('country', e.target.value)} /></div>
              <div><label className="form-label">Ethnicity (optional)</label>
                <select className={sel} value={form.ethnicity} onChange={e => set('ethnicity', e.target.value)}>
                  <option value="">Prefer not to say</option>
                  <option value="south-asian">South Asian</option><option value="southeast-asian">Southeast Asian</option>
                  <option value="east-asian">East Asian</option><option value="caucasian">Caucasian / White</option>
                  <option value="african">African / Black</option><option value="hispanic">Hispanic / Latino</option><option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-2">* Southeast Asian ethnicity and age &gt;50 are independent CCA risk factors per epidemiological data.</div>
          </div>
        )}

        {/* Step 1 — Lifestyle */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2"><Activity className="w-4 h-4 text-medical-400" />Lifestyle Factors</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="form-label">Smoking status</label>
                <select className={sel} value={form.smokingStatus} onChange={e => set('smokingStatus', e.target.value)}>
                  <option value="never">Never smoked</option><option value="former">Former smoker</option><option value="current">Current smoker</option>
                </select>
              </div>
              {form.smokingStatus !== 'never' && <>
                <div><label className="form-label">Years of smoking</label><input type="number" className={inp} placeholder="e.g. 15" value={form.smokingYears} onChange={e => set('smokingYears', e.target.value)} /></div>
                <div><label className="form-label">Cigarettes per day</label><input type="number" className={inp} placeholder="e.g. 10" value={form.cigarettesPerDay} onChange={e => set('cigarettesPerDay', e.target.value)} /></div>
              </>}
              <div><label className="form-label">Alcohol (units/week)</label><input type="number" className={inp} placeholder="1 unit = 10ml pure alcohol" step="0.5" value={form.alcoholUnitsWeek} onChange={e => set('alcoholUnitsWeek', e.target.value)} /></div>
              {parseFloat(form.alcoholUnitsWeek) > 14 && <div className="col-span-2 text-xs text-orange-400 bg-orange-900/20 border border-orange-900/40 rounded p-2">Heavy alcohol use (&gt;14 units/week) significantly increases hepatocellular damage and CCA risk.</div>}
              <div><label className="form-label">Physical activity</label>
                <select className={sel} value={form.physicalActivity} onChange={e => set('physicalActivity', e.target.value)}>
                  <option value="sedentary">Sedentary (no exercise)</option><option value="light">Light (1–2×/week)</option>
                  <option value="moderate">Moderate (3–4×/week)</option><option value="active">Active (5+×/week)</option>
                </select>
              </div>
              <div><label className="form-label">Sedentary hours / day</label>
                <select className={sel} value={form.sedentaryHoursDay} onChange={e => set('sedentaryHoursDay', e.target.value)}>
                  {['<2','2–4','4–6','6–8','8–10','>10'].map(v => <option key={v} value={v}>{v} hours</option>)}
                </select>
              </div>
              <div><label className="form-label">Sleep duration</label>
                <select className={sel} value={form.sleepHours} onChange={e => set('sleepHours', e.target.value)}>
                  {['<5','5–6','6–7','7–8','8–9','>9'].map(v => <option key={v} value={v}>{v} hours</option>)}
                </select>
              </div>
              <div><label className="form-label">Sleep quality</label>
                <select className={sel} value={form.sleepQuality} onChange={e => set('sleepQuality', e.target.value)}>
                  <option value="excellent">Excellent</option><option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option><option value="very-poor">Very poor (insomnia)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="form-label">Stress level: <strong className="text-gray-200">{form.stressLevel}/10</strong></label>
              <input type="range" min={1} max={10} className="w-full accent-medical-400 mt-1" value={form.stressLevel} onChange={e => set('stressLevel', parseInt(e.target.value))} />
              <div className="flex justify-between text-[10px] text-gray-600"><span>Minimal</span><span>Extreme</span></div>
            </div>
          </div>
        )}

        {/* Step 2 — Dietary */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2"><Utensils className="w-4 h-4 text-medical-400" />Dietary Habits</h2>
            <div className="alert-info text-xs">Dietary patterns significantly affect liver inflammation and bile duct health. Answer based on your typical weekly habits.</div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="form-label">Vegetable servings / day</label>
                <select className={sel} value={form.vegetableServings} onChange={e => set('vegetableServings', e.target.value)}>
                  {['0','1','2','3','4','5+'].map(v => <option key={v} value={v}>{v} servings</option>)}
                </select>
              </div>
              <div><label className="form-label">Fruit servings / day</label>
                <select className={sel} value={form.fruitServings} onChange={e => set('fruitServings', e.target.value)}>
                  {['0','1','2','3','4+'].map(v => <option key={v} value={v}>{v} servings</option>)}
                </select>
              </div>
              <div><label className="form-label">Water intake (litres/day)</label>
                <select className={sel} value={form.waterLitresDay} onChange={e => set('waterLitresDay', e.target.value)}>
                  {['<0.5','0.5–1','1–1.5','1.5–2','2–2.5','>2.5'].map(v => <option key={v} value={v}>{v} L</option>)}
                </select>
              </div>
              <div><label className="form-label">Sugary drinks / day</label>
                <select className={sel} value={form.sugaryDrinksDay} onChange={e => set('sugaryDrinksDay', e.target.value)}>
                  {['0','1','2','3','4+'].map(v => <option key={v} value={v}>{v} drinks</option>)}
                </select>
              </div>
              <div><label className="form-label">Fast food / week</label>
                <select className={sel} value={form.fastFoodPerWeek} onChange={e => set('fastFoodPerWeek', e.target.value)}>
                  {['0','1','2','3','4','5','6','7+'].map(v => <option key={v} value={v}>{v}× / week</option>)}
                </select>
              </div>
              <div><label className="form-label">Red meat / week</label>
                <select className={sel} value={form.redMeatPerWeek} onChange={e => set('redMeatPerWeek', e.target.value)}>
                  {['0','1','2','3','4','5','6','7+'].map(v => <option key={v} value={v}>{v}× / week</option>)}
                </select>
              </div>
              <div><label className="form-label">Fried food / week</label>
                <select className={sel} value={form.friedFoodPerWeek} onChange={e => set('friedFoodPerWeek', e.target.value)}>
                  {['0','1','2','3','4','5','6','7+'].map(v => <option key={v} value={v}>{v}× / week</option>)}
                </select>
              </div>
              <div><label className="form-label">Salt intake</label>
                <select className={sel} value={form.saltIntake} onChange={e => set('saltIntake', e.target.value)}>
                  <option value="low">Low (rarely add salt)</option><option value="moderate">Moderate</option><option value="high">High (frequent salted/pickled foods)</option>
                </select>
              </div>
              <div><label className="form-label">Cooking oil</label>
                <select className={sel} value={form.cookingOilType} onChange={e => set('cookingOilType', e.target.value)}>
                  <option value="olive">Olive oil</option><option value="canola">Canola / rapeseed</option><option value="vegetable">Vegetable oil</option>
                  <option value="coconut">Coconut oil</option><option value="ghee">Ghee / butter</option><option value="palm">Palm oil</option>
                </select>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-3">
                {[['fiberAdequate','Adequate fibre intake (wholegrain, legumes, oats)'],['mealTimingRegular','Regular meal timing (no skipping)'],['lateNightEating','Late-night eating (after 10pm)']].map(([k,l]) => (
                  <label key={k} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[k as keyof typeof form] as boolean} onChange={e => set(k, e.target.checked)} className="w-3.5 h-3.5 accent-medical-400 rounded" />
                    <span className="text-xs text-gray-300">{l}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Medical History */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2"><Heart className="w-4 h-4 text-medical-400" />Medical History</h2>
            <div className="alert-warn text-xs">These conditions significantly affect CCA risk. PSC, liver fluke, and viral hepatitis are among the strongest known risk factors.</div>
            <div className="space-y-2">
              {MED_FIELDS.map(f => {
                const val = form[f.key as keyof typeof form] as boolean
                return (
                  <label key={f.key} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${val ? 'bg-medical-400/10 border-medical-400/40' : 'border-gray-800/60 hover:border-gray-700'}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={val} onChange={e => set(f.key, e.target.checked)} className="w-4 h-4 accent-medical-400 rounded" />
                      <span className="text-sm text-gray-300">{f.label}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      f.risk === 'very-high' ? 'bg-red-900/40 text-red-400' :
                      f.risk === 'high' ? 'bg-orange-900/40 text-orange-400' :
                      'bg-yellow-900/40 text-yellow-400'}`}>
                      {f.risk === 'very-high' ? '⬆ Very High Risk' : f.risk === 'high' ? '↑ High Risk' : '↗ Moderate Risk'}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 4 — Symptoms */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2"><Stethoscope className="w-4 h-4 text-medical-400" />Symptom Assessment</h2>
            <div className="alert-danger text-xs">Jaundice, weight loss, and pale stools together form the classic CCA triad. Rate current symptom severity.</div>
            <div className="space-y-3">
              {SYMPTOM_FIELDS.map(s => (
                <div key={s.key} className="flex items-center justify-between gap-4">
                  <label className="text-sm text-gray-300 flex-1">{s.label}</label>
                  <SeveritySelect value={form[s.key as keyof typeof form] as number} onChange={v => set(s.key, v)} />
                </div>
              ))}
            </div>
            {(form.jaundice > 0 || form.paleStools > 0 || form.darkUrine > 0) && (
              <div className="alert-danger">
                <span className="font-semibold">⚠ Red flag:</span> Jaundice + pale stools + dark urine indicate biliary obstruction. Urgent hepatobiliary evaluation needed regardless of other risk factors.
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800/60">
          <button className="btn-outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-xs text-gray-600">Step {step + 1} of {STEPS.length}</span>
          {step < STEPS.length - 1 ? (
            <button className="btn-medical" onClick={() => setStep(s => s + 1)}>
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button className="btn-medical" onClick={submit} disabled={loading}>
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</> : <><Brain className="w-4 h-4" /> Generate Assessment</>}
            </button>
          )}
        </div>
      </div>

      {loading && <AILoadingSkeleton label="Running CCA risk model..." />}
      {!loading && result && <AIOutput html={result} label="CCA Risk Assessment Report" timestamp={new Date().toLocaleTimeString()} />}
    </div>
  )
}
