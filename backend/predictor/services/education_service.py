"""Patient education content service."""


class EducationService:
    """Handles education content requests."""

    def process(self, data=None):
        """Return predefined HTML for the requested education topic."""
        topic = (data or {}).get("topic", "").strip().lower()

        if topic == "cca overview":
            html = """<html><body>
<h2>CCA Overview - TEST123</h2>
<p>Cholangiocarcinoma (CCA) is a cancer that forms in the bile ducts, the tubes that carry bile from the liver to the small intestine.</p>
<h3>Types by Location</h3>
<ul>
<li><strong>Intrahepatic CCA:</strong> arises within the liver.</li>
<li><strong>Perihilar (Klatskin) CCA:</strong> forms where the left and right hepatic ducts join near the liver hilum.</li>
<li><strong>Distal CCA:</strong> develops in the bile duct closer to the pancreas and small intestine.</li>
</ul>
<p>CCA is uncommon but often diagnosed at a later stage because early symptoms can be subtle. Care is typically coordinated by hepatology, oncology, and surgical teams.</p>
<p>Always discuss your individual situation with your specialist team.</p>
</body></html>"""

        elif topic == "risk factors":
            html = """<html><body>
<h2>Risk Factors</h2>
<p>Several conditions increase the chance of developing cholangiocarcinoma, especially those that cause long-term bile duct inflammation or scarring.</p>
<h3>Major Risk Factors</h3>
<ul>
<li><strong>Primary sclerosing cholangitis (PSC)</strong></li>
<li><strong>Liver fluke infection</strong> (in endemic regions)</li>
<li><strong>Choledochal cysts</strong> and other bile duct anomalies</li>
<li><strong>Chronic biliary inflammation</strong> or stones</li>
<li><strong>Cirrhosis</strong> and chronic liver disease</li>
<li><strong>Hepatitis B or C</strong> infection</li>
</ul>
<p>Having a risk factor does not mean cancer will develop. Regular follow-up may be advised for people at higher risk.</p>
<p>Talk with your care team about your personal risk profile.</p>
</body></html>"""

        elif topic == "tumor markers":
            html = """<html><body>
<h2>Tumor Markers</h2>
<p>Tumor markers are blood tests that can support diagnosis and monitoring of cholangiocarcinoma, but they are not definitive alone.</p>
<h3>Common Markers</h3>
<ul>
<li><strong>CA 19-9:</strong> the most frequently used marker in CCA; levels may rise with tumor burden or biliary obstruction.</li>
<li><strong>CEA:</strong> sometimes elevated and used alongside other tests.</li>
<li><strong>AFP:</strong> more typical for hepatocellular carcinoma, but may be checked when the diagnosis is unclear.</li>
</ul>
<h3>Important Caveats</h3>
<p>CA 19-9 can also rise with infection, cholangitis, or bile duct blockage without cancer. Marker trends over time, combined with imaging and pathology, are more useful than a single value.</p>
<p>Interpret results only with your clinician.</p>
</body></html>"""

        elif topic == "imaging & staging":
            html = """<html><body>
<h2>Imaging &amp; Staging</h2>
<p>Imaging helps locate the tumor, assess bile duct involvement, and guide staging and treatment planning.</p>
<h3>Common Studies</h3>
<ul>
<li><strong>MRCP / MRI:</strong> detailed views of bile ducts and nearby structures.</li>
<li><strong>CT scan:</strong> evaluates tumor extent, vessels, and possible spread.</li>
<li><strong>ERCP:</strong> visualizes ducts, can relieve obstruction, and obtain brushings or biopsy.</li>
<li><strong>EUS:</strong> may help sample nearby lymph nodes or masses.</li>
</ul>
<h3>Staging Focus</h3>
<p>Staging considers tumor size and location, lymph node involvement, vascular invasion, and distant metastases. Accurate staging determines whether surgery, transplant evaluation, or systemic therapy is most appropriate.</p>
<p>Your team will explain what your scans show in your case.</p>
</body></html>"""

        elif topic == "treatment options":
            html = """<html><body>
<h2>Treatment Options</h2>
<p>Treatment for cholangiocarcinoma depends on tumor location, stage, liver function, and overall health.</p>
<h3>Possible Approaches</h3>
<ul>
<li><strong>Surgical resection:</strong> preferred when the tumor can be fully removed with clear margins.</li>
<li><strong>Liver transplantation:</strong> considered in selected early perihilar cases under strict protocols.</li>
<li><strong>Chemotherapy:</strong> used for unresectable or advanced disease, and sometimes after surgery.</li>
<li><strong>Radiation therapy:</strong> may help control local disease or symptoms.</li>
<li><strong>Biliary stenting:</strong> relieves jaundice and improves comfort when ducts are blocked.</li>
<li><strong>Targeted therapy / clinical trials:</strong> may be options based on molecular testing.</li>
</ul>
<p>A multidisciplinary tumor board often helps tailor the plan.</p>
<p>Discuss benefits, risks, and goals of care with your specialists.</p>
</body></html>"""

        elif topic == "symptoms":
            html = """<html><body>
<h2>Symptoms</h2>
<p>Symptoms of cholangiocarcinoma often relate to bile duct blockage or effects of the tumor on the liver and nearby organs.</p>
<h3>Common Warning Signs</h3>
<ul>
<li><strong>Jaundice</strong> (yellowing of skin or eyes)</li>
<li><strong>Dark urine</strong> and pale stools</li>
<li><strong>Itching (pruritus)</strong></li>
<li><strong>Abdominal pain</strong>, especially in the right upper abdomen</li>
<li><strong>Unexplained weight loss</strong> or loss of appetite</li>
<li><strong>Fever</strong> or fatigue</li>
</ul>
<p>These symptoms can also occur with non-cancer conditions such as gallstones or infection. New or worsening symptoms should be evaluated promptly.</p>
<p>Seek medical care rather than self-diagnosing based on symptoms alone.</p>
</body></html>"""

        elif topic == "nutrition & liver health":
            html = """<html><body>
<h2>Nutrition &amp; Liver Health</h2>
<p>Good nutrition supports energy, healing, and liver function during cholangiocarcinoma care.</p>
<h3>Practical Guidance</h3>
<ul>
<li>Eat regular, balanced meals with adequate protein to help maintain strength.</li>
<li>If appetite is low, try smaller, more frequent meals.</li>
<li>Stay hydrated unless your clinician advises otherwise.</li>
<li>Limit alcohol, which can further stress the liver.</li>
<li>Ask before using herbal supplements; some can harm the liver or interact with medications.</li>
</ul>
<h3>When Jaundice or Stents Are Present</h3>
<p>Fat digestion may be harder. A dietitian can help with fat tolerance, vitamin needs, and managing weight loss.</p>
<p>Personalized nutrition advice should come from your care team.</p>
</body></html>"""

        elif topic == "psc & surveillance":
            html = """<html><body>
<h2>PSC &amp; Surveillance</h2>
<p>Primary sclerosing cholangitis (PSC) is a chronic disease that scars the bile ducts and raises the long-term risk of cholangiocarcinoma.</p>
<h3>Why Surveillance Matters</h3>
<p>People with PSC may be monitored more closely so that concerning changes can be found earlier, when more treatment options may exist.</p>
<h3>Surveillance May Include</h3>
<ul>
<li><strong>Laboratory tests</strong> (liver enzymes, bilirubin, CA 19-9 as directed)</li>
<li><strong>Imaging</strong> such as MRI/MRCP on a scheduled basis</li>
<li><strong>Evaluation of new symptoms</strong> like worsening jaundice, fever, or unexplained weight loss</li>
</ul>
<p>Surveillance schedules differ by center and individual risk. Follow the plan set by your hepatology team, and report new symptoms promptly.</p>
</body></html>"""

        else:
            html = """<html><body>
<h2>Patient Education: Cholangiocarcinoma</h2>
<p>Cholangiocarcinoma is a rare cancer of the bile ducts. Select a topic such as CCA Overview, Risk Factors, Tumor Markers, Imaging &amp; Staging, Treatment Options, Symptoms, Nutrition &amp; Liver Health, or PSC &amp; Surveillance for focused information.</p>
<p>Always discuss personalized recommendations with your specialist team.</p>
</body></html>"""

        return {
            "status": "success",
            "service": "education",
            "analysis": html,
        }
