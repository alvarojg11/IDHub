// app/probid/references/sources/page.tsx
import Link from "next/link";

type Reference = {
  section: string;
  citation: string;
  doi?: string;
};

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
        {title}
      </h2>
      <div className="mt-5 space-y-6">{children}</div>
    </section>
  );
}

function CitationEntry({ item }: { item: Reference }) {
  return (
    <article className="pb-6 border-b border-[var(--border)] last:border-b-0 last:pb-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
        Citation
      </span>

      <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]/85 text-justify">
        {item.citation}
      </p>

      {item.doi ? (
        <div className="mt-4">
          <a
            href={item.doi}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--primary)] hover:underline underline-offset-2"
          >
            DOI <span className="text-[var(--primary)]/80">{item.doi}</span>
          </a>
        </div>
      ) : null}
    </article>
  );
}

export default function ProbIDAllReferencesPage() {
  const references: Reference[] = [
    {
      section: "General Methods",
      citation:
        "Deeks JJ, Altman DG. Diagnostic tests 4: likelihood ratios. BMJ. 2004;329:168–169.",
      doi: "https://doi.org/10.1136/bmj.329.7458.168",
    },
    {
      section: "General Methods",
      citation:
        "Pauker SG, Kassirer JP. Therapeutic Decision Making: A Cost-Benefit Analysis. N Engl J Med. 1975;293(5):229-234.",
      doi: "https://doi.org/10.1056/NEJM197507312930505",
    },
    {
      section: "Endocarditis",
      citation:
        "Delgado V, Ajmone Marsan N, de Waha S, et al. 2023 ESC Guidelines for the management of endocarditis. Eur Heart J. 2023;44(39):3948-4042.",
      doi: "https://doi.org/10.1093/eurheartj/ehad193",
    },
    {
      section: "Endocarditis",
      citation:
        "Fowler VG, Durack DT, Selton-Suty C, et al. The 2023 Duke-International Society for Cardiovascular Infectious Diseases Criteria for Infective Endocarditis: Updating the Modified Duke Criteria. Clin Infect Dis. 2023;77(4):518-526.",
      doi: "https://doi.org/10.1093/cid/ciad271",
    },
    {
      section: "Endocarditis",
      citation:
        "Bai AD, Steinberg M, Showler A, et al. Diagnostic Accuracy of Transthoracic Echocardiography for Infective Endocarditis Findings Using Transesophageal Echocardiography as the Reference Standard: A Meta-Analysis. J Am Soc Echocardiogr. 2017;30(7):639-646.e8.",
      doi: "https://doi.org/10.1016/j.echo.2017.03.007",
    },
    {
      section: "Endocarditis",
      citation:
        "San S, Ravis E, Tessonier L, et al. Diagnostic performance of 18F-FDG PET/CT in infective endocarditis: A meta-analysis. Open Heart. 2022;9:e001856.",
      doi: "https://doi.org/10.1136/openhrt-2021-001856",
    },
    {
      section: "Endocarditis",
      citation:
        "Tubiana S, Duval X, Alla F, et al. The PREDICT score to guide echocardiography in Staphylococcus aureus bacteremia. Clin Infect Dis. 2015;61(1):18-28.",
      doi: "https://doi.org/10.1093/cid/civ235",
    },
    {
      section: "Endocarditis",
      citation:
        "Peinado-Acevedo JS, et al. Prediction Rules for Ruling Out Endocarditis in Patients With Staphylococcus aureus Bacteremia. Clin Infect Dis. 2022;74(8):1442-1450.",
      doi: "https://doi.org/10.1093/cid/ciab632",
    },
    {
      section: "Endocarditis",
      citation:
        "Berge A, Krantz A, Östlund H, Nauclér P, Rasmussen M. The DENOVA score efficiently identifies patients with monomicrobial Enterococcus faecalis bacteremia where echocardiography is not necessary. Infection. 2019;47(1):45-50.",
      doi: "https://doi.org/10.1007/s15010-018-1208-3",
    },
    {
      section: "Endocarditis",
      citation:
        "Sunnerhagen T, Törnell A, Vikbrant M, et al. HANDOC: A Handy Score to Determine the Need for Echocardiography in Non-beta-hemolytic Streptococcal Bacteremia. Clin Infect Dis. 2018;66(5):693-698.",
      doi: "https://doi.org/10.1093/cid/cix880",
    },
    {
      section: "CAP",
      citation:
        "Metlay JP, Waterer GW, Long AC, et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia. Am J Respir Crit Care Med. 2019;200:e45–e67.",
      doi: "https://doi.org/10.1164/rccm.201908-1581ST",
    },
    {
      section: "CAP",
      citation:
        "Metlay JP, Kapoor WN, Fine MJ. Does this patient have community-acquired pneumonia? Diagnosing pneumonia by history and physical examination. JAMA. 1997;278(17):1440-1445.",
      doi: "https://doi.org/10.1001/jama.278.17.1440",
    },
    {
      section: "CAP",
      citation:
        "Ebell MH, Bentivegna M, Cai X, Hulme C, Kearney M. Accuracy of Biomarkers for the Diagnosis of Adult Community-acquired Pneumonia: A Meta-analysis. Acad Emerg Med. 2020;27(3):195-206.",
      doi: "https://doi.org/10.1111/acem.13889",
    },
    {
      section: "CAP",
      citation:
        "Klompas M, Calandra T, Singer M. Antibiotics for respiratory tract infections in adults in intensive care units and general wards after implementation of molecular diagnostics: a multicenter cohort study. Infect Control Hosp Epidemiol. 2021;42(2):131-138.",
      doi: "https://doi.org/10.1017/ice.2020.1312",
    },
    {
      section: "CAP",
      citation:
        "Metlay JP, et al. Adult Outpatients With Suspected Community-Acquired Pneumonia: What Is the Role of Viral Respiratory Diagnostics? An Official American Thoracic Society Clinical Practice Guideline. Am J Respir Crit Care Med. 2024.",
      doi: "https://doi.org/10.1164/rccm.202102-0498ST",
    },
    {
      section: "CAP",
      citation:
        "Nahum J, et al. IDSA Position Statement on Use of Influenza and SARS-CoV-2 Molecular Assays to Inform Antibacterial Prescribing in Adults with Suspected Community-Acquired Pneumonia. Clin Infect Dis. 2025.",
      doi: "https://doi.org/10.1093/cid/ciaf625",
    },
    {
      section: "CDI",
      citation:
        "McDonald LC, Gerding DN, Johnson S, et al. Clinical Practice Guidelines for Clostridioides difficile Infection in Adults and Children. Clin Infect Dis. 2018;66:e1–e48.",
      doi: "https://doi.org/10.1093/cid/cix1085",
    },
    {
      section: "CDI",
      citation:
        "Johnson S, Lavergne V, Skinner AM, et al. Clinical Practice Guideline by the IDSA and SHEA: 2021 Focused Update Guidelines on Management of Clostridioides difficile Infection in Adults. Clin Infect Dis. 2021;73(5):e1029-e1044.",
      doi: "https://doi.org/10.1093/cid/ciab549",
    },
    {
      section: "CDI",
      citation:
        "Kraft CS, Parrott JS, Cornish NE, et al. A Laboratory Medicine Best Practices Systematic Review and Meta-analysis of Nucleic Acid Amplification Tests (NAATs) and Algorithms Including NAATs for the Diagnosis of Clostridioides difficile in Adults. Clin Microbiol Rev. 2019;32(3):e00032-18.",
      doi: "https://doi.org/10.1128/CMR.00032-18",
    },
    {
      section: "UTI",
      citation:
        "Gupta K, Hooton TM, Naber KG, et al. International Clinical Practice Guidelines for the Treatment of Acute Uncomplicated Cystitis and Pyelonephritis in Women: A 2010 Update by IDSA and ESCMID. Clin Infect Dis. 2011;52(5):e103-e120.",
      doi: "https://doi.org/10.1093/cid/ciq257",
    },
    {
      section: "UTI",
      citation:
        "Bent S, Nallamothu BK, Simel DL, Fihn SD, Saint S. Does this woman have an acute uncomplicated urinary tract infection? JAMA. 2002;287(20):2701-2710.",
      doi: "https://doi.org/10.1001/jama.287.20.2701",
    },
    {
      section: "UTI",
      citation:
        "Deville WL, Yzermans JC, van Duijn NP, et al. The urine dipstick test useful to rule out infections. A meta-analysis of the accuracy. BMC Urol. 2004;4:4.",
      doi: "https://doi.org/10.1186/1471-2490-4-4",
    },
    {
      section: "PJP",
      citation:
        "Brown A, Miah A, et al. Accuracy of Pneumocystis jirovecii PCR assays in respiratory samples for diagnosis of Pneumocystis pneumonia: a systematic review and meta-analysis. Clin Infect Dis. 2024.",
      doi: "https://doi.org/10.1093/cid/ciae239",
    },
    {
      section: "PJP",
      citation:
        "Del Corpo O, Butler-Laporte G, Sheppard DC, et al. Diagnostic accuracy of serum (1-3)-beta-D-glucan for Pneumocystis jirovecii pneumonia: a systematic review and meta-analysis. Clin Microbiol Infect. 2020;26(9):1137-1143.",
      doi: "https://doi.org/10.1016/j.cmi.2020.05.024",
    },
    {
      section: "PJP",
      citation:
        "Veintimilla C, Kuncio D, Mays JA, et al. Accuracy of Microscopy and PCR for the Diagnosis of Pneumocystis jirovecii from Bronchoalveolar Lavage in a Real-World Clinical Setting. J Fungi (Basel). 2023;9(4):414.",
      doi: "https://doi.org/10.3390/jof9040414",
    },
    {
      section: "PJP",
      citation:
        "Mappin-Kasirer B, et al. A diagnostic model for Pneumocystis jirovecii pneumonia in patients requiring bronchoscopy and bronchoalveolar lavage. BMC Infect Dis. 2024;24:1311.",
      doi: "https://doi.org/10.1186/s12879-024-09957-y",
    },
    {
      section: "PJP",
      citation:
        "Wills M, et al. Utility of Chest X-ray Features in Presumed HIV-Associated Pneumocystis jirovecii Pneumonia: A Systematic Review and Meta-Analysis. Open Forum Infect Dis. 2024;11(5):ofae146.",
      doi: "https://doi.org/10.1093/ofid/ofae146",
    },
    {
      section: "PJP",
      citation:
        "Shin HJ, et al. Risk factors for Pneumocystis jirovecii pneumonia in patients with autoimmune diseases receiving non-high-dose steroids. Sci Rep. 2019;9:1911.",
      doi: "https://doi.org/10.1038/s41598-019-38618-3",
    },
    {
      section: "Invasive Candidiasis",
      citation:
        "Pappas PG, Kauffman CA, Andes DR, et al. Clinical Practice Guideline for the Management of Candidiasis: 2016 Update by the IDSA. Clin Infect Dis. 2016;62(4):e1-e50.",
      doi: "https://doi.org/10.1093/cid/civ933",
    },
    {
      section: "Invasive Candidiasis",
      citation:
        "Clancy CJ, Nguyen MH. Finding the \"missing 50%\" of invasive candidiasis: how nonculture diagnostics will improve understanding of disease spectrum and transform patient care. Clin Infect Dis. 2013;56(9):1284-1292.",
      doi: "https://doi.org/10.1093/cid/cit006",
    },
    {
      section: "Invasive Candidiasis",
      citation:
        "Bassetti M, Giacobbe DR, Vena A, et al. Incidence and outcome of invasive candidiasis in intensive care units (EUCANDICU): a multinational prospective observational study. Crit Care. 2019;23:219.",
      doi: "https://doi.org/10.1186/s13054-019-2497-3",
    },
    {
      section: "Invasive Candidiasis",
      citation:
        "León C, Ruiz-Santana S, Saavedra P, et al. A bedside scoring system (Candida score) for early antifungal treatment in nonneutropenic critically ill patients with Candida colonization. Crit Care Med. 2006;34(3):730-737.",
      doi: "https://doi.org/10.1097/01.CCM.0000202208.37364.7D",
    },
    {
      section: "Invasive Candidiasis",
      citation:
        "Karageorgopoulos DE, Vouloumanou EK, Ntziora F, et al. beta-D-glucan assay for the diagnosis of invasive fungal infections: a meta-analysis. Clin Infect Dis. 2011;52(6):750-770.",
      doi: "https://doi.org/10.1093/cid/ciq206",
    },
    {
      section: "Invasive Candidiasis",
      citation:
        "Mikulska M, Calandra T, Sanguinetti M, Poulain D, Viscoli C. The use of mannan antigen and anti-mannan antibodies in the diagnosis of invasive candidiasis: recommendations from the 3rd European Conference on Infections in Leukemia. Crit Care. 2010;14(6):R222.",
      doi: "https://doi.org/10.1186/cc9365",
    },
    {
      section: "Invasive Candidiasis",
      citation:
        "Tang HJ, et al. The diagnostic accuracy of T2Candida to detect candidemia: a systematic review and meta-analysis. BMC Infect Dis. 2019;19:271.",
      doi: "https://doi.org/10.1186/s12879-019-4419-z",
    },
    {
      section: "Invasive Candidiasis",
      citation:
        "Avni T, Leibovici L, Paul M. PCR diagnosis of invasive candidiasis: systematic review and meta-analysis. J Clin Microbiol. 2011;49(2):665-670.",
      doi: "https://doi.org/10.1128/JCM.01602-10",
    },
    {
      section: "Invasive Candidiasis",
      citation:
        "Clancy CJ, Nguyen MH. Diagnosing Invasive Candidiasis. J Fungi (Basel). 2018;4(1):27.",
      doi: "https://doi.org/10.3390/jof4010027",
    },
    {
      section: "Invasive Mold Infection",
      citation:
        "Patterson TF, Thompson GR 3rd, Denning DW, et al. Practice Guidelines for the Diagnosis and Management of Aspergillosis: 2016 Update by the IDSA. Clin Infect Dis. 2016;63(4):e1-e60.",
      doi: "https://doi.org/10.1093/cid/ciw326",
    },
    {
      section: "Invasive Mold Infection",
      citation:
        "Donnelly JP, Chen SC, Kauffman CA, et al. Revision and Update of the Consensus Definitions of Invasive Fungal Disease from the EORTC/MSGERC. Clin Infect Dis. 2020;71(6):1367-1376.",
      doi: "https://doi.org/10.1093/cid/ciz1008",
    },
    {
      section: "Invasive Mold Infection",
      citation:
        "Cruciani M, Mengoli C, Loeffler J, et al. Polymerase chain reaction blood tests for the diagnosis of invasive aspergillosis in immunocompromised people. Cochrane Database Syst Rev. 2019;9:CD009551.",
      doi: "https://doi.org/10.1002/14651858.CD009551.pub4",
    },
    {
      section: "Invasive Mold Infection",
      citation:
        "Feys S, Almyroudi MP, Braspenning R, et al. A visual and comprehensive review on COVID-19-associated pulmonary aspergillosis (CAPA). Lancet Infect Dis. 2022;22(11):1621-1632.",
      doi: "https://doi.org/10.1016/S1473-3099(22)00044-8",
    },
    {
      section: "Invasive Mold Infection",
      citation:
        "Leeflang MMG, Debets-Ossenkopp YJ, Wang J, et al. Galactomannan detection for invasive aspergillosis in immunocompromised patients. Cochrane Database Syst Rev. 2015;12:CD007394.",
      doi: "https://doi.org/10.1002/14651858.CD007394.pub2",
    },
    {
      section: "Invasive Mold Infection",
      citation:
        "Heng SC, Morrissey O, Chen SCA, et al. Clinical utility of bronchoalveolar lavage fluid galactomannan in diagnosis of invasive pulmonary aspergillosis: a meta-analysis. Crit Rev Microbiol. 2015;41(1):124-134.",
      doi: "https://doi.org/10.3109/1040841X.2013.804033",
    },
    {
      section: "Invasive Mold Infection",
      citation:
        "Huang BG, Zhang YT, Zeng WT. Diagnostic value of beta-D-glucan in invasive aspergillosis: a systematic review and meta-analysis. Clin Respir J. 2024;18(2):e13760.",
      doi: "https://doi.org/10.1111/crj.13760",
    },
    {
      section: "Invasive Mold Infection",
      citation:
        "Zhang J, Yu Y, Yang C, et al. The role of aspergillus lateral flow assays in diagnosing invasive pulmonary aspergillosis: a systematic review and meta-analysis. Heliyon. 2024;10(17):e34569.",
      doi: "https://doi.org/10.1016/j.heliyon.2024.e34569",
    },
    {
      section: "Invasive Mold Infection",
      citation:
        "Avni T, Levy I, Sprecher H, et al. Diagnostic accuracy of PCR alone compared to galactomannan in bronchoalveolar lavage fluid for diagnosis of invasive pulmonary aspergillosis: a systematic review. J Clin Microbiol. 2012;50(11):3652-3658.",
      doi: "https://doi.org/10.1128/JCM.00942-12",
    },
    {
      section: "Invasive Mold Infection",
      citation:
        "Brown AC, Hennequin C, Alvarez-Moreno C, et al. Mucorales PCR in blood and bronchoalveolar lavage for diagnosis of mucormycosis: a systematic review and meta-analysis. Int J Infect Dis. 2025;153:107941.",
      doi: "https://doi.org/10.1016/j.ijid.2025.107941",
    },
    {
      section: "Invasive Mold Infection",
      citation:
        "Agarwal R, et al. The diagnostic performance of halo and reversed halo signs for invasive mold infections in compromised hosts: A systematic review and meta-analysis. Eur J Radiol. 2020;122:108843.",
      doi: "https://doi.org/10.1016/j.ejrad.2020.108843",
    },
    {
      section: "PJI",
      citation:
        "Parvizi J, Tan TL, Goswami K, et al. The 2018 Definition of Periprosthetic Hip and Knee Infection: An Evidence-Based and Validated Criteria. J Arthroplasty. 2018;33(5):1309-1314.e2.",
      doi: "https://doi.org/10.1016/j.arth.2018.09.028",
    },
    {
      section: "PJI",
      citation:
        "Cortes-Penfield NW, Kulkarni PA, Theel ES. Prosthetic Joint Infection: Diagnostic Challenges and New Developments. Clin Infect Dis. 2023;76(1):e181-e188.",
      doi: "https://doi.org/10.1093/cid/ciac992",
    },
    {
      section: "PJI",
      citation:
        "Tarabichi M, Shohat N, Goswami K, et al. C-Reactive Protein and Erythrocyte Sedimentation Rate Have Variable Sensitivity and Specificity for the Diagnosis of Periprosthetic Joint Infection in Total Knee Arthroplasty: A Clinical Study. J Arthroplasty. 2024.",
      doi: "https://doi.org/10.1016/j.arth.2024.02.030",
    },
    {
      section: "PJI",
      citation:
        "Paul S, et al. Utility of alpha-defensin in diagnosing periprosthetic joint infection: a systematic review and meta-analysis. J Bone Jt Infect. 2025;10:525-538.",
      doi: "https://doi.org/10.5194/jbji-10-525-2025",
    },
    {
      section: "PJI",
      citation:
        "Poursalehian M, et al. Diagnostic value of synovial fluid leucocyte esterase strip test in periprosthetic joint infection: a systematic review and meta-analysis. Arthroplasty. 2025;7:34.",
      doi: "https://doi.org/10.1186/s42836-025-00325-y",
    },
    {
      section: "PJI",
      citation:
        "Watanabe M, et al. Preoperative Synovial Fluid Culture, Intraoperative Tissue Culture, and Sonication Fluid Culture in Diagnosing Periprosthetic Joint Infection: A Diagnostic Accuracy Study and Meta-analysis. J Arthroplasty. 2024.",
      doi: "https://doi.org/10.1016/j.arth.2024.03.016",
    },
    {
      section: "PJI",
      citation:
        "Jun Y, Jiang Y, Xu Y, et al. Diagnostic Value of Synovial Fluid Polymerase Chain Reaction for Periprosthetic Joint Infection: A Meta-analysis. Surg Infect (Larchmt). 2018;19(7):683-691.",
      doi: "https://doi.org/10.1089/sur.2018.014",
    },
    {
      section: "PJI",
      citation:
        "Zhu Y, Zhang F, Chen W, et al. Risk factors for periprosthetic joint infection after total joint arthroplasty: a systematic review and meta-analysis. Int Wound J. 2016;13(6):1213-1221.",
      doi: "https://doi.org/10.1111/iwj.12465",
    },
    {
      section: "Active TB",
      citation:
        "van't Hoog AH, Langendam MW, Mitchell E, et al. Symptom- and chest-radiography screening for active pulmonary tuberculosis in HIV-negative adults and adolescents: a systematic review and meta-analysis. Cochrane Database Syst Rev. 2022;9:CD010890.",
      doi: "https://doi.org/10.1002/14651858.CD010890.pub2",
    },
    {
      section: "Active TB",
      citation:
        "Steingart KR, Schiller I, Horne DJ, Pai M, Boehme CC, Dendukuri N. Xpert MTB/RIF assay for pulmonary tuberculosis and rifampicin resistance in adults. Cochrane Database Syst Rev. 2014;CD009593.",
      doi: "https://doi.org/10.1002/14651858.CD009593.pub4",
    },
    {
      section: "Active TB",
      citation:
        "Liu C, Cui Y, Li L, et al. The Value of Xpert MTB/RIF in Bronchoalveolar Lavage Fluid in the Diagnosis of Pulmonary Tuberculosis: A Systematic Review and Meta-analysis. J Clin Microbiol. 2021;59(1):e02170-20.",
      doi: "https://doi.org/10.1128/JCM.02170-20",
    },
    {
      section: "Active TB",
      citation:
        "Davis JL, Cattamanchi A, Cuevas LE, Hopewell PC, Steingart KR. Diagnostic accuracy of same-day microscopy versus standard microscopy for pulmonary tuberculosis: a systematic review and meta-analysis. Lancet Infect Dis. 2013;13(2):147-154.",
      doi: "https://doi.org/10.1016/S1473-3099(12)70232-3",
    },
    {
      section: "Active TB",
      citation:
        "You L, Ma H, Lin S, et al. Performance of metagenomic next-generation sequencing versus conventional tests in pulmonary tuberculosis diagnosis: a systematic review and meta-analysis. Syst Rev. 2024;13:284.",
      doi: "https://doi.org/10.1186/s13643-024-02733-8",
    },
    {
      section: "Active TB",
      citation:
        "AlAlyani H, Alhaqbani M, Althomali O, et al. Evaluating Interferon-Gamma Release Assays for Diagnosing Active Tuberculosis in Adults: A Systematic Review and Meta-Analysis. Diagnostics (Basel). 2025;15(18):2343.",
      doi: "https://doi.org/10.3390/diagnostics15182343",
    },
    {
      section: "Active TB",
      citation:
        "Jeon CY, Murray MB. Diabetes mellitus increases the risk of active tuberculosis: a systematic review of 13 observational studies. PLoS Med. 2008;5(7):e152.",
      doi: "https://doi.org/10.1371/journal.pmed.0050152",
    },
    {
      section: "Active TB",
      citation:
        "Fox GJ, Barry SE, Britton WJ, Marks GB. Contact investigation for tuberculosis: a systematic review and meta-analysis. PLoS Med. 2013;10(11):e1001432.",
      doi: "https://doi.org/10.1371/journal.pmed.1001432",
    },
    {
      section: "Active TB",
      citation:
        "Cords O, Martinez L, Warren JL, et al. Incidence and prevalence of tuberculosis in incarcerated populations: a systematic review and meta-analysis. Lancet Public Health. 2021;6(5):e300-e308.",
      doi: "https://doi.org/10.1016/S2468-2667(21)00025-6",
    },
    {
      section: "Active TB",
      citation:
        "Beijer U, Wolf A, Fazel S. Prevalence of tuberculosis, hepatitis C virus, and HIV in homeless people: a systematic review and meta-analysis. Lancet Infect Dis. 2012;12(11):859-870.",
      doi: "https://doi.org/10.1016/S1473-3099(12)70177-9",
    },
    {
      section: "Active TB",
      citation:
        "World Health Organization. Global tuberculosis report 2024. Geneva: WHO; 2024.",
      doi: "https://www.who.int/publications/i/item/9789240101531",
    },
    {
      section: "Active TB",
      citation:
        "World Health Organization. WHO consolidated guidelines on tuberculosis. Module 3: Diagnosis – rapid diagnostics for tuberculosis detection, 2021 update.",
      doi: "https://www.who.int/publications/i/item/9789240029415",
    },
  ];

  const grouped = references.reduce<Record<string, Reference[]>>((acc, r) => {
    (acc[r.section] ??= []).push(r);
    return acc;
  }, {});

  const sectionOrder = ["General Methods", "Endocarditis", "CAP", "CDI", "UTI", "PJP", "Invasive Candidiasis", "Invasive Mold Infection", "PJI", "Active TB"];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-14 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl tracking-tight">
            <span className="font-extrabold text-[var(--foreground)]">ProbID</span>
            <span className="font-semibold text-[var(--foreground)]/80">
              {" "}
              References
            </span>
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--foreground)]/85 text-justify">
            Primary literature, guideline documents, and meta-analyses informing
            likelihood ratio estimates within ProbID.
            <span className="ml-2 text-[var(--muted)]">
              This list will expand as additional syndromes are curated.
            </span>
          </p>
        </div>

        <Link
          href="/probid/references"
          className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--cardHover)] transition"
        >
          ← Back
        </Link>
      </header>

      <section className="grid gap-6">
        {sectionOrder
          .filter((s) => grouped[s]?.length)
          .map((section) => (
            <SectionCard key={section} title={section}>
              {grouped[section].map((item, idx) => (
                <CitationEntry key={`${section}-${idx}`} item={item} />
              ))}
            </SectionCard>
          ))}

        {Object.keys(grouped)
          .filter((k) => !sectionOrder.includes(k))
          .sort()
          .map((section) => (
            <SectionCard key={section} title={section}>
              {grouped[section].map((item, idx) => (
                <CitationEntry key={`${section}-${idx}`} item={item} />
              ))}
            </SectionCard>
          ))}
      </section>

      <footer className="mt-16 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted)]">
        IDHub is an educational project focused on clinical teaching in Infectious Disease.

        Content is for learning purposes only and does not replace clinical judgment, institutional guidelines, or consultation with infectious diseases specialists.

        © 2026 IDHub
      </footer>
    </main>
  );
}
