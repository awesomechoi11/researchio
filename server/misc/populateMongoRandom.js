var { faker } = require("@faker-js/faker");
const { MongoClient } = require("mongodb");
const secrets = require("../secrets");

const { customAlphabet } = require("nanoid");

const randomId = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    16
);

const topics = [
    "Emergency Medicine Clinical Experience",
    "Clinical research program",
    "Physical Medicine and Rehabilitation Clinical Externship",
    "Oncology Clinical or Clinical Research Rotation",
    "Physical Medicine and Rehabilitation Research Experience",
    "Anesthesiology Research Fellowship",
    "Child / Adolescent Psychology Research Fellowship",
    "Child / Adolescent Psychology Research Fellowship",
    "Immunology Research Fellowship",
    "Neurology / Oncology Research Fellowship",
    "Oncology Research Fellowship",
    "Radiation Oncology Research Fellowship",
    "Underserved Populations Research Fellowship",
    "Endocrinology Research Program",
    "Neurology Research Scholarship",
    "Infectious Disease Clinical or Research Scholarship",
    "Primary Care Service-learning Program",
    "Community Health Service or Research Fellowship",
    "Dermatology Mentorship Program",
    "Nutrition Internship",
    "Hematology Research Experience",
    "Hematology Research Experience",
    "Neurological Surgery Research Fellowship",
    "Neurological Surgery Research Fellowship",
    "Pediatric Oncology Research Grant",
    "Addiction Medicine Experiential Institute",
    "Pediatric Oncology Research Fellowship",
    "Psychiatry Research Fellowship",
    "Family Medicine Clinical Preceptorship",
    "Research Internship",
    "Vision, Research, and Ophthalmology Research Internship",
    "Research Internship",
    "Research Program",
    "Research Training",
    "Research Fellowship",
    "Radiology Research Program",
    "Community Health Clinical Experience",
    "Oncology Research Fellowship",
    "Infectious Disease / Microbiology / Immunology Research Fellowship",
    "Oncology Research Fellowship",
    "Preventive Medicine Research Training",
    "Research Program",
    "Cardiology Research Grant",
    "Vulnerable Populations Research, Action, and Policy Program",
    "Urology Research Grant",
    "Cardiology / Hematology / Sleep Medicine / Pulmonology Research Internship",
    "Pediatrics Research Training",
    "Neurological Surgery Research Scholarship",
    "Radiation Oncology Clinical Experience",
    "Family Medicine Clinical Preceptorship",
    "Primary Care Clinical Preceptorship / Rural Practice Experience",
    "Oncology Research Fellowship",
    "Diabetes, Endocrinology, and Metabolism Research Training",
    "Nephrology Research Training",
    "Oncology Research Program",
    "Health Policy Internship",
    "Global Health Clinical Training Course",
    "Hematology Research",
    "Radiology/Radiation Oncology Research Grant Award",
];

const programTitles = [
    "Chicago Minority Medical Student Emergency Medicine (CMMSEM)",
    "Summer Clinical Research Volunteer Program",
    "Medical Student Summer Clinical Externship",
    "Medical Student Rotation for Underrepresented Populations",
    "Rehabilitation Research Experience for Medical Students",
    "The Medical Student Anesthesia Research Fellowship Summer Program",
    "Jeanne Spurlock Research Fellowship in Substance Abuse and Addiction for Minority Medical Students",
    "Summer Medical Student Fellowships in Child and Adolescent Psychiatry",
    "Gina M. Finzi Memorial Student Summer Fellowship Program",
    "Medical Student Summer Fellowship Program",
    "Medical Student Summer Fellowship Program",
    "ASTRO Minority Summer Fellowship Award",
    "The David E. Rogers Fellowship Program",
    "NIDDK Medical Student Research Program in Diabetes",
    "Medical Student Summer Research Scholarship",
    "Medical Scholars Program",
    "GE-NMF Primary Care Leadership Program",
    "Student Summer Fellowships",
    "Diversity Mentorship Program",
    "Clinical Nutrition Internship Program",
    "Hematology Opportunities for the Next Generation of Research Scientists",
    "Minority Medical Student Award Program (MMSAP)",
    "AANS Medical Student Summer Research Fellowship",
    "Medical Student Summer Fellowship in Socioeconomic Research",
    "Pediatric Oncology Student Training Program",
    "Summer Institute for Medical Students",
    "Summer Oncology Fellowship",
    "Summer Psychiatry Research Fellowship for Underrepresented Medical Students",
    "David and Ethel Platt Family Physician Summer Fellowship",
    "Summer Internship Program in Biomedical Research",
    "Diversity in Vision, Research, and Ophthalmology",
    "Visiting Research Internship Program",
    "Summer Research Trainee Program",
    "Summer Student Scholars Program",
    "Clinical and Basic Science Research Fellowships for Underrepresented Minority Medical Students",
    "Mallinckrodt Institute of Radiology Summer Research Program",
    "Summer SEARCH/COPC Program",
    "Summer Research Experience Program in Oncology",
    "Summer Research Fellowship Program",
    "Summer Fellowship Program",
    "Environmental and Occupational Health Summer Traineeships for First Year Medical Students",
    "Medical Student Summer Scholars Program",
    "Glorney-Raisbeck Student Research Grants in Cardiovascular Research",
    "The Margaret E. Mahoney Fellowship Program",
    "The Ferdinand C. Valentine Student Research Grants in Urology",
    "Heart, Lung and Blood (HLB) Summer Research Program",
    "National Student Injury Research Training Program",
    "Campagna Scholarship",
    "Simon Kramer Summer Externship",
    "Summer Preceptorship Program",
    "The Appalachian Preceptorship in Primary Care",
    "Pediatric Oncology Education Program",
    "Research Training Program in Diabetes, Endocrinology and Metabolism",
    "Student Research Training Program in Kidney Disease",
    "Summer Research Program for Medical Students",
    "Government Relations Advocacy Fellow",
    "Clinical Tropical Medicine and Traveler's Health",
    "URM Summer Research Fellowship in Benign Hematology, June-Aug 2021",
    "RSNA Research Medical Student Grant",
];

const descriptions = [
    "The Chicago Minority Medical Student Emergency Medicine (CMMSEM) program is a city wide cohort designed to expose underrepresented minority (URM) and LGBTQ rising 2nd year medical students to careers in academic and community emergency medicine (EM). Highly qualified individuals will have the opportunity to get first-hand clinical experience in the emergency department (ED). This program will highlight areas in research, mentorship, and residency preparation needed to excel in the specialty of Emergency Medicine. The program will be composed of a 40 hours per week, spanning six weeks from June 12-July 21. Stipend offered based on availability. Sponsors: EMRA, ACEP, UIC Emergency Medicine, UIC HCOE, UIC UHP, Cook County Hospital, University of Chicago Emergency Medicine. ",
    "The Summer Clinical Research Program in Pediatrics at Hackensack University Medical Center offers pre-medical and medical students the opportunity to work closely with a faculty mentor on one or more research projects related to their specific sub-specialty. The primary focus of the volunteer program is clinical research and writing. Each departmental track of the program will grant admission to 1-2 students. These students will have the unique opportunity to join a faculty member in completing an ongoing research project and/or create a new project proposal with his or her mentor’s guidance. Research volunteers will also gain valuable insight into the publication process, including opportunities to participate in co-authorship of research projects in peer-reviewed pediatric journals. ",
    "This program aims to provide a wide range of inpatient and outpatient clinical exposure and to allow students to explore the human side of patient care and the psychosocial environments their patients face through an eight week summer externship with an attached stipend of $4,000. ",
    "The Medical Student Rotation for Underrepresented Populations (MSR) provides 8- to 10-week clinical or clinical research oncology rotations for U.S. medical students from populations underrepresented in medicine who are interested in pursuing oncology as a career. Recipients receive a $5,000 stipend for the rotation plus $1,500 for future travel to the ASCO Annual Meeting, An additional $2,000 will be provided to support the student’s mentor. ",
    "The RREMS has been developed for medical students with strong research interests. This program will provide an exciting and structured research experience while exposing the medical student to some of the most successful and respected faculty mentors in the field of PM&R. The RREMS will entail a minimum of an eight-week summer externship following the first year of medical school with an attached stipend of $4,000. ",
    "The Medical Student Anesthesia Research Fellowship Summer Program provides students with a challenging and rewarding experience that exposes them to the opportunities within the medical field of anesthesiology and research. ",
    "The AACAP Jeanne Spurlock Research Fellowship in Substance Abuse and Addiction offers a unique opportunity for minority medical students to explore a research career in substance abuse in relation to child and adolescent psychiatry, gain valuable work experience, and meet leaders in the child and adolescent psychiatry field. ",
    "The AACAP Summer Medical Student Fellowships offer a chance for medical students to explore a career in child and adolescent psychiatry, gain valuable work experience, and meet leaders in the child and adolescent psychiatry field. The fellowship opportunity provides up to $3,500 for 12 weeks of clinical or research training under a child and adolescent psychiatrist mentor. ",
    "The Gina M. Finzi Memorial Student Summer Fellowship Program fosters interest among students in the areas of basic, clinical, translational, epidemiological, or behavioral research relevant to lupus. The fellowship operates under the sponsorship and supervision of an established, tenure-track Principal Investigator who directs a laboratory dedicated, at least in part, to the investigation of lupus at a U.S. academic, medical, or research institution. ",
    "The Medical Student Summer Fellowships are $3,000 stipends grants to current medical students wishing to spend a summer conducting brain tumor research with esteemed scientist-mentors. The intent of this program is to motivate talented medical students to pursue a career in neuro-oncology research ",
    "The Medical Student Summer Fellowship Program is an eight-week research program at Memorial Sloan Kettering offered to medical students who are interested in a career as a physician-scientist in the field of oncology and/or related biomedical sciences. ",
    "In an effort to promote radiation oncology as a career choice, the fellowship will provide medical students with an experience designed to expose students to clinical, basic and translational research questions in radiation oncology. ",
    "The Rogers Fellowship is meant to enrich the educational experiences of medical and dental students through projects that bear on medicine and dentistry as they contribute to the health of communities, and to address the human needs of underserved or disadvantaged patients or populations.  The content of the Fellowship might include clinical investigation, public health/epidemiology, health policy analysis, activities linking biomedicine, the social infrastructure and human or community need. ",
    "The Medical Student Research Program helps students gain an improved understanding of career opportunities in biomedical research and a comprehensive understanding of diabetes, its clinical manifestations and its unsolved problems. ",
    "The intention of the scholarship is to provide research funding support to students with little or no prior research history. Therefore, preference will be given to beginning researchers. Projects already completed will not be considered. ",
    "An important part of IDSA’s mission is to promote the subspecialty of infectious diseases by attracting the best and brightest medical students to the field. To further this goal, the IDSA Education and Research Foundation offers scholarships to medical students in U.S. and Canadian medical schools with mentorship by an IDSA member or fellow. It is the responsibility of IDSA members and fellows to identify and solicit interested students. ",
    "This innovative service-learning program provides students with an opportunity to examine the challenges and rewards of primary care practice at community health centers (CHC) across the United States ",
    "The Student Summer Fellowship program offers opportunities for medical students to complete a research or service project related to community health. Projects must be focused on studying cultural competency issues, developing skills to become relationship-centered physicians, and addressing a public health need in an underserved community or population. ",
    "The Diversity Mentorship Program offers hands-on exposure to students who are interested in learning more about the specialty of dermatology through a one-on-one mentorship experience with a dermatologist of the student's choice.  ",
    "ASN offers nutrition internships for medical students via its Clinical Nutrition Internship Program. This program is designed to increase the role of nutrition in the practice of medicine, medical research, health promotion, and disease prevention by providing a unique combination of educational experiences to medical students. ",
    "The ASH HONORS Award will contribute to the development of the next generation of hematologists by supporting talented medical students and residents to conduct hematology research. Recipients may choose to conduct either a short research project for a maximum of three months, or a longer project between three and 12 months ",
    "The Minority Medical Student Award Program (MMSAP) is an 8- to 12-week research experience for students from the United States and Canada in their early years of medical school. As part of this experience, students collaborate with an ASH member who serves as their research mentor. Program participants are also paired with an ASH member who serves as a career-development mentor throughout the participants' medical schooling and residency. ",
    "The Neurosurgery Research and Education Foundation (NREF) is pleased to offer the Medical Student Summer Research Fellowship (MSSRF) program. Up to 20 fellowships in the amount of $2,500 will be awarded each year to medical students in the United States or Canada who have completed one or two years of medical school, and wish to spend a summer working in a neurosurgical laboratory, mentored by a neurosurgical investigator sponsor who is a member of the American Association of Neurological Surgeons (AANS). ",
    "The CSNS/CNS Medical Student Socioeconomic Fellowship supports a medical student conducting research on a socioeconomic issue impacting neurosurgical practice. It is funded and overseen by the Council of State Neurosurgical Societies and administered through the Fellowship Committee of the Congress of Neurological Surgeons. ",
    "ALSF is dedicated to funding pediatric oncology researchers at critical points in their careers.  The POST Program is designed for undergraduate, graduate and medical students who have an interest in pediatric oncology research and would like to experience the field first hand by working on a mentored research project during a school break (typically summer).  Students train with a pediatric oncology research mentor who is an ALSF grantee, Advisory Board member, or Review Board member.  Students may join a research project underway in a mentor’s lab or begin an original investigation with the mentor. ",
    "The SIMS program was designed to give students the opportunity to become a part of the Betty Ford Center experience for a week.  Instead of participation in a classroom setting, the students learn by integration into the daily life of either the patients currently in treatment or the participants in the family program of the Center. ",
    "This program is intended to provide the highest quality experience for first-year medical school students pursuing interests in oncology research. ",
    "The UCSD Psychiatry Research Residency Track will sponsor two paid 2014 Summer Psychiatry Research Fellows for an outstanding 12-week laboratory or clinical research experience in Psychiatry. Fellows will work directly with one Faculty Mentor and laboratory, to complete a specific summer-appropriate research project. ",
    "The David and Ethel Platt Family Physicians Summer Fellowship was established in the name of two exemplary family physicians to help create a way to excite first and second year medical students about family medicine. Four fellowships are offered each year for a four-week externship program where the chosen student will spend a week with various family physicians in Delaware. Most four-week cycles are during summer vacations, but other arrangements can be made as requested. ",
    "Summer programs at the National Institutes of Health (NIH) provide an opportunity to spend a summer working at the NIH side-by-side with some of the leading scientists in the world, in an environment devoted exclusively to biomedical research. ",
    "The DIVRO program offers each participant the opportunity to work closely with leading research scientists in the Division of Intramural Research and provides hands-on training in a research environment that will prepare them to continue their studies and advance their careers in basic and clinical research. ",
    "The Visiting Research Internship Program (VRIP) is an eight-week mentored, summer research program designed to enrich medical students' interest in research and health-related careers, particularly clinical/translational research careers. ",
    "The Summer Research Trainee Program is a mandatory eight weeks in length, from June 15 to August 6, 2015. Each student will be assigned to a specific Massachusetts General Hospital (MGH) laboratory, clinical site, health policy, or health services research area where they undertake an original research project under the mentorship and guidance of an MGH investigator. ",
    "As TUSM's largest clinical training site, we offer medical student education across all specialties.  Our 3rd-year clerkships are dedicated to TUSM students-we offer all of TUSM's required 3rd-year core clerkships. We also offer more than 40 4th-year electives that are open to students from TUSM and other accredited medical schools.  ",
    "The summer research fellowship was created through grants from the National Heart, Lung and Blood Institute (NHLBI) and Mayo Clinic. The comprehensive training program prepares underrepresented students for careers in clinical care and patient-oriented research ",
    "The Mallinckrodt Institute of Radiology (MIR) Summer Research Program offers undergraduate and medical students an excellent introduction to current radiological sciences research. ",
    "An opportunity to work with community partners to promote the health of an underserved population and to develop the skills and teamwork needed to enhance community health. ",
    "Through this internship experience, you will gain either first-hand research or clinical experience by working full-time on an independent clinical or scientific cancer-related research project. You are able choose and rank projects in the application process based on your research preference and interests. Your experience will take place in the collaborative environment of a cancer research laboratory or clinic headed by a world-renowned cancer researcher or clinician. ",
    "Our summer fellowship program offers rising second-year medical students the chance to conduct mentored, NIH-funded research in a faculty lab at UB or Roswell Park Cancer Institute. ",
    "The Medical Student Summer Fellowship Program is an eight-week research program at Memorial Sloan Kettering offered to medical students who are interested in a career as a physician-scientist in the field of oncology and/or related biomedical sciences. ",
    "The student works on a research project under the supervision of experienced faculty in occupational and environmental medicine, epidemiology, or toxicology. Emphasis is on learning methods of research and understanding the context of the research ",
    "The Carolinas HealthCare System Summer Research Scholars Program is a program of instruction in research for selected medical students and graduate or undergraduate students enrolled in accredited colleges and universities. Summer scholars work closely with mentors who are performing original research in the clinics or laboratories of Carolinas HealthCare System. ",
    "Preference will be given to M.D. candidates attending medical school or conducting research in the greater New York area (New York City, Long Island, Westchester County, or New Jersey). ",
    "The Margaret E. Mahoney Fellowship program provides stipends for outstanding medical, dental, public health, public policy, and graduate nursing students to conduct summer research projects on some aspect of health care delivery transformation for vulnerable populations and/or early childhood health and development, with an emphasis on policy implications. ",
    "Competition is open to M.D. candidates attending medical school or conducting research in the greater New York area (New York City, Long Island, Westchester County, or New Jersey). Funding will be provided for research projects lasting between ten (10) and twelve (12) weeks in the summer of the upcoming year, preferably between the first and second years of medical school, but medical students in any year of their education may apply. - See more at: http://www.nyam.org/grants/valentine-student.html#sthash.jX1H0vmB.dpuf ",
    "The Heart, Lung and Blood Summer Research Program is designed to engage 12 diverse undergraduates and 8 medical students in state-of-the art biomedical research in cardiovascular, pulmonary, hematological and sleep disorders research. ",
    "The goal of this program is to provide research training to future physician-investigators while introducing them to the field of injury research and prevention. ",
    "The scholarship supports a 10-week summer semester of research under the supervision of a neurosurgical mentor at Oregon Health & Science University (OHSU) and residence expenses in Portland, Oregon. ",
    "This externship was established for the purpose of exposing medical students to the discipline of radiation oncology and provides up to two students each year with the opportunity to spend six weeks in our Department working on a research project and participating in clinical and educational activities. ",
    "The Altoona Hospital is a 353-bed community hospital located in Central Pennsylvania. The facility serves as a community hospital for Altoona and Blair County and as a referral center and trauma center for much of the surrounding area. The hospital is equipped with the latest technology and the Medical Staff includes a broad range of specialists and subspecialists in addition to a strong core of primary care physicians. The hospital sponsors a Family Practice Residency, Altoona Family Physicians.  ",
    "The Appalachian Preceptorship is designed to expose medical students to rural primary care practiced in a manner sensitive to the culture. Students will participate in one week of didactic sessions on the ETSU campus and spend three weeks with a rural physician practicing in an Appalachian community. Students will benefit from the cross-cultural experience, whether they choose to practice in Appalachia, urban areas or other communities throughout the nation. ",
    "A primary goal of the program is to encourage students to pursue a career in cancer research, either as a laboratory-based scientist or a physician scientist. ",
    "The Vanderbilt Student Research Training Program (SRTP) is sposored by the National Institutes of Health and allows medical students to conduct research under the direction of an established scientist in the areas of diabetes, obesity, kidney disease, or digestive disease at Vanderbilt during the summer between the first and second year or second and third year of medical school. ",
    "The Vanderbilt Student Research Training Program in Kidney Disease (SRTP-KD) is sponsored by the National Institutes of Health and allows medical students to conduct research under the direction of an established scientist in the areas of Nephrology and/or Hypertension at Vanderbilt University during the summer between the first and second year, or the second and third year of medical school. ",
    "The purpose of the Summer Research Program for Medical Students is to provide participants with firsthand biomedical research experience in the basic or clinical sciences. Student projects are submitted by MD Anderson faculty mentors and will reflect the ongoing research efforts of the institution's clinics and laboratories. Individuals selected for the program will actively participate in both the technical aspects of their projects and the interpretation of experimental data. At the end of their summer experience, students will submit their research data in journal article format. Program trainees will be afforded the opportunity to acquire research skills and, through participation in institutional seminars and lectures, receive information that will be valuable in assessing their career goals related to research and patient care in oncology ",
    "The AMA Government Relations Advocacy Fellowship (GRAF) offers medical students a unique opportunity to experience firsthand the intersection of organized medicine and the federal government as it relates to advocacy and policy-making. ",
    "The course focuses on the imparting of essential skills and competencies in clinical tropical medicine, laboratory skills in a low-technology setting, epidemiology and disease control, and traveler's health. The didactic portion of the ASTMH course is conducted by both full-time and clinical faculty at WVU, and by visiting faculty from several American and foreign schools of medicine and public health. ",
    "Duke’s T32 Training Program in Hematology and Transfusion Medicine is providing an in-depth summer research training experience in non-malignant hematology for two medical/osteopathic students from underrepresented minority groups. Participating medical students will pursue mentored training in research areas of non-malignant hematology (sickle cell disorders, immunohematology, hemostasis & thrombosis, and/or transfusion medicine & apheresis) with preceptor faculty who have primary appointment in the Division of Hematology at Duke University Medical Center. The ideal candidate will demonstrate excellence in previous academic endeavors, commit to full-time (40 hours/week) research for a minimum of 8 weeks (12 weeks maximum) and be a United States citizen or permanent resident. Prior research experience helpful, but not necessary. The position provides a monthly salary as well as financial support to attend a national hematology meeting. Contact: arepa001@mc.duke.edu ",
    "Exposure to radiology research in medical school can ignite a passion for the specialty. With the support of a mentor and scientific advisor, a summer project can turn into a career-long pursuit of research and discover. The $3,000 grant award is matched by the sponsoring institution. The Research Medical Student Grant is an outstanding way to learn about this exciting specialty and gain valuable early research experience. Applicants Underrepresented in Medicine: The RSNA R&E Foundation will fund up to 10 additional medical student applicants through the Research Medical Student Grant UIM funding opportunity. This opportunity is designed to provide an early exposure for UIM medical students to the specialty and to academic research. Early exposure to the specialty is a critical first step in creating a more diverse and inclusive radiology workforce. ",
];

const departments = [
    "American Indian Studies",
    "Anthropology",
    "Archaeology",
    "Asian American Studies",
    "Communication",
    "Conservation IDP",
    "Economics",
    "Gender Studies",
    "Geography",
    "History",
    "Master of Social Science",
    "Military Science",
];

const websiteLinks = [
    "https://docs.google.com/forms/d/1qzxxD7P43JmdGASWHG-eitnti3XterymsJactgUtEtI/edit",
    "https://www.hackensackumc.org/services/pediatrics/pediatric-research-innovations/summer-clinical-research-volunteer-program-pediatrics/",
    "http://physiatry.site-ym.com/?page=MSSCE_students",
    "https://www.asco.org/research-guidelines/grants-awards/funding-opportunities/medical-student-rotation-underrepresented-populations",
    "http://physiatry.site-ym.com/?page=RREMS_students",
    "http://faer.org/programs/msarf-summer-program/",
    "https://www.aacap.org/aacap/Awards/Medical_Students_Awards/Spurlock_Research_Fellowship.aspx",
    "https://www.aacap.org/AACAP/Awards/Medical_Students_Awards/Summer_Medical_Student_Fellowships.aspx",
    "https://www.petersons.com/scholarship/gina-m-finzi-memorial-student-summer-fellowship-program-111_175697.aspx",
    "https://www.abta.org/medical-student-summer-fellowships/",
    "http://www.mskcc.org/education/students/summer-fellowship",
    "https://www.astro.org/minoritysummerfellowship/",
    "http://www.nyam.org/grants/rogers.html",
    "http://medicalstudentdiabetesresearch.org/",
    "http://tools.aan.com/science/awards/?fuseaction=home.info&id=58",
    "http://www.idsociety.org/Medical_Scholars_Program/",
    "http://www.nmfonline.org/pclp",
    "http://www.gold-foundation.org/programs/student-summer-fellowships/",
    "https://www.aad.org/members/leadership-institute/mentoring/find-a-mentor/diversity-mentorship-program",
    "https://nutrition.org/students/clinical-nutrition-internship-program/",
    "http://www.hematology.org/Awards/Next-Generation-Research-Scientists-Award/2627.aspx",
    "http://www.hematology.org/Awards/MMSAP/2624.aspx",
    "https://www.nref.org/MSSRF.aspx",
    "http://www.csnsonline.org/fellowship_student.php",
    "http://www.alexslemonade.org/grants/post",
    "http://www.bettyfordinstitute.org/education/summer-institute-for-medical-students.php",
    "http://www.chla.org/site/c.ipINKTOAJsG/b.4434829/k.8F5A/Summer_Oncology_Fellowship.htm",
    "https://medschool.ucsd.edu/som/psychiatry/education/research-programs/Pages/SummerPsychiatryResearchFellowship.aspx",
    "http://delfamdoc.org/the-david-and-ethel-platt-summer-fellowship-2/",
    "https://www.training.nih.gov/programs/sip",
    "https://nei.nih.gov/training/diversity_in_research",
    "https://mfdp.med.harvard.edu/dcp-programs/medicalgraduate/visiting-research-internship-program",
    "http://www.massgeneral.org/mao/education/internship.aspx?id=5",
    "https://www.umass.edu/sphhs/summer-student-scholars-program",
    "http://www.mayo.edu/msgme/diversity-programs/summer-research-fellowship",
    "http://www.mir.wustl.edu/education/internal.asp?NavID=95",
    "https://rwjms.rutgers.edu/departments/family-medicine/office-of-medical-student-education/summer-programs",
    "https://www.roswellpark.org/education/summer-programs",
    "http://medicine.buffalo.edu/education/md/curriculum/research-opportunities/summer-research-fellowship.html",
    "http://www.mskcc.org/education/students/summer-fellowship",
    "http://icahn.mssm.edu/departments-and-institutes/preventive-medicine/programs-and-services/environmental-and-occupational-health-summer-program",
    "https://www.carolinashealthcare.org/education/graduate-medical-education/Medical-Student-Summer-Scholars-Program",
    "http://www.nyam.org/grants/glorney-raisbeck-student.html",
    "https://nyam.org/awards-grants/student-grants/margaret-e-mahoney-fellowships/",
    "http://www.nyam.org/grants/valentine-student.html",
    "https://case.edu/medicine/admissions-programs/undergraduate-summer-research/heart-lung-and-blood-hlb-summer-research-program",
    "https://www.nationwidechildrens.org/cirp-national-student-injury-research-training-program",
    "http://www.ohsu.edu/xd/education/schools/school-of-medicine/departments/clinical-departments/neurosurgery/news-events/campagna-scholarship.cfm",
    "http://www.jefferson.edu/jmc/departments/radiation_oncology/education/Simon_Kramer_Externship.html",
    "https://www.altoonafp.org/residency-program/clerkships",
    "https://www.etsu.edu/com/familymed/rural/medical/preceptorship.php",
    "http://www.stjude.org/poe",
    "http://www.vanderbiltsrtp.org/",
    "https://www.vumc.org/diabetescenter/SRTP",
    "https://www.mdanderson.org/education-training/degrees-programs/summer-research-programs.html",
    "https://www.ama-assn.org/government-relations-advocacy-fellow",
    "http://medicine.hsc.wvu.edu/tropmed",
    "https://duke.qualtrics.com/jfe/form/SV_abolcnxxCs6UMp7",
    "https://www.rsna.org/research/funding-opportunities/research-grants/medical-student-research-grant",
];

const locations = [
    "inPerson",
    "inPerson",
    "inPerson",
    "remote",
    "inPerson",
    "inPerson",
];

const prereqs = [
    "None",
    "N/A",
    "introductory course in programming at college level",
    "Knowledge or strong interest in molecular biology, cell biology, and/or reproductive physiology is a plus.",
    "Students with an interest in genomics and bioinformatics. Having completed a molecular and cellular biology course is a benefit but not essential. Programming skills may be be benefit, but not essential.",
    "Research will involve development and/or application of physical models and numerical methods for simulation of complex phenomena (e.g. computational fluid dynamics, reactive flows, ablation, low-temperature plasma). Prerequisite courses: Strongly Recommended: Gas Dynamics (AME 323) or Introduction to Fluid Mechanics (AME 331)",
    "curiosity, coding",
    "programming skills are useful",
    "None",
    "None",
    "None",
    "Jr-Sr in good standing",
    "None",
    "Strong interest in ocean science and paleontology.",
    "library research skills Basic sciences",
    "desire to learn",
    "Organic chemistry",
    "None",
    "None",
    "None",
    "Not necessary.",
    "None",
    "The lab performs high-speed/hypersonic wind tunnel experiments. No hard prerequisites, at least 1 year of undergrad preferred.",
    "None",
    "Previous experience in a microbiology or chemistry lab preferred.",
    "None",
    "None",
    "Good hands on skills with solution based chemistry (general chemistry and/or organic chemistry). Interest in experimental research.",
    "Conservation, Citizen Science, Data Analytics, Data Visualization, Machine Learning, R Programming, Species Distribution Modeling",
    "Quantitative skills, computer skills, experimental skills",
    "preferred to have some background in dendrochronology",
    "Astro 170B1",
    "None",
    "None",
    "None",
    "Previous experience in a microbiology or chemistry lab preferred.",
    "None",
    "None",
    "None",
    "Calculus, Linear algebra, Statistics, Probability, A Program Language (e.g. R)",
    "None",
    "Basic knowledge of genetics. Focus on excellence. Ability to work well in teams. Fearlessness.",
    "None",
    "None",
    "None",
    "None",
    "None",
    "None",
    "Biology Chemistry",
    "Quantum physics, quantum optics basics.",

    "programming, command line, linux operating system",
    "None",
    "None",
    "None",
    "None",
    "None",
    "None",
    "Biology Chemistry",
    "Probability and statistics, basic programming, algorithms (CSC 588 is recommended but not required)",
    "Quantum physics, quantum optics basics.",
    "None",
    "n/a",
    "None",
    "Quantitative skills, computer skills, experimental skills",
    "preferred to have some background in dendrochronology",
    "None",
    "Conservation, Citizen Science, Data Analytics, Data Visualization, Machine Learning, R Programming, Species Distribution Modeling",
    "None",
    "None",
    "Good hands on skills with solution based chemistry (general chemistry and/or organic chemistry). Interest in experimental research.",
    "None",
    "None",
    "ECE 484 Antenna Theory and Design ECE 486 Microwave Engineering Knowledge in MATLAB, High Frequency Structure Simulator, Keysight Advanced Design System",
    "None",
    "None",
];

const opportunityTypes = [
    "paid",
    "volunteer",
    "credit",
    "workstudy",
    "contract",
];

const principalInvestigators = [
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fbb679218-06b8-4a26-8124-b8a62d74e60b_alber.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "TEP Faculty Advisor",
        name: "Rebecca Alber",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F4c48de51-bfcb-47e6-97c7-6e570403ed8d_alkin.jpeg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Professor Emeritus",
        name: "Marvin C. Alkin",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F4e9cf51e-6390-4c8e-b6bb-c7b240b61c69_WalterAllenUCLA2015.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Distinguished Professor, Allan Murray Cartter Professor of Higher Education",
        name: "Walter Allen",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Ff2c21f79-ce98-48e9-a470-ba50633c11ca_melissaarias.jpeg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "TEP Faculty Advisor",
        name: "Melissa Sachi Arias",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F61deba7f-088e-4a95-a826-2b2b9dab34d2_diana_ascher.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Director, Information Studies Lab/Digital Instructional Support Librarian",
        name: "Diana Ascher",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fe205df9f-551b-4879-9fa3-4abd21d4d461_alexander-astin.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C4%2C200%2C250%26w%3D800%26h%3D1000&w=3840&q=75",
        title: "Allan M. Cartter Professor Emeritus",
        name: "Alexander (Sandy) Astin",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2FMzE1NzI5ZGQtMDRmMi00ODljLWJkMWEtZGY5ZTZlMzVlMjA0_ronaviastoramp_2020_raa.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Professor of Social Welfare",
        name: "Ron Avi Astor",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fc8655c0c-b773-4bdf-8a21-339dd1f86990_alison_bailey.jpeg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Professor",
        name: "Alison Louise Bailey",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F1919d6fd-5bfa-4957-bf46-238d8ba015d2_EvaBakerAMP2.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D420%2C0%2C867%2C1067%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Distinguished Research Professor",
        name: "Eva Baker",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fdb260943-dd4e-4d7f-99b9-11477bc3c29c_Sarah-Bang.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C2%2C200%2C246%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Education Lecturer; Director, UCLA TIE-INS",
        name: "Sarah Bang",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F1bdd0e94-e0b1-46f6-b045-2272679dcf66_BatesMarcia.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C1%2C224%2C276%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Professor Emerita",
        name: "Marcia J. Bates",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F18fe458f-b89d-40ec-8b92-c1b6d16f1f8a_Blanchetter%2BJeanfrancois.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C0%2C1140%2C1403%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Associate Professor",
        name: "Jean-François Blanchette",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fdc061996-a110-4eb8-a540-b3fa4b8d1847_Christine%2BBorgman%2B210512-ucla-2C1B0751_websize.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C48%2C1067%2C1313%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Distinguished Research Professor",
        name: "Christine L. Borgman",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F43523a7b-604c-4583-82ca-b940e0d0dfe5_Li%2BCai%2B210512-ucla-2C1B0802_websize.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Professor",
        name: "Li Cai",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Ffcb8532a-5c1e-4304-b54c-20cc1735767d_Cathy%2BCarbone.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D1501%2C0%2C3000%2C4000%26w%3D450%26h%3D600&w=3840&q=75",
        title: "Lecturer",
        name: "Kathy Carbone",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fe3b85dad-142e-4d5a-9564-8e4a923a0626_michelle_jp.jpeg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Chair, Department of Information Studies; Associate Professor",
        name: "Michelle Caswell",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F268b8d16-fa5a-423c-b684-8c0e1b9c4fb4_chang_mitchell.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D12%2C0%2C176%2C250%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Professor",
        name: "Mitchell Chang",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F1ff7dea4-a7b4-47f6-bfdc-a2aea1c2830f_tina-cristie.png%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C46%2C1082%2C1353%26w%3D800%26h%3D1000&w=3840&q=75",
        title: "Wasserman Dean, School of Education & Information Studies; Professor",
        name: "Christina A. Christie",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=%2Fimages%2Fperson.png&w=3840&q=75",
        title: "Professor Emerita",
        name: "Clara Chu",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fece98fb7-7910-493d-885d-02a6f1e4be53_SolCohen.jpeg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Professor Emeritus",
        name: "Sol Cohen",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=%2Fimages%2Fperson.png&w=3840&q=75",
        title: "Professor Emeritus",
        name: "Arthur Cohen",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F911c9d17-9ce2-423b-9397-6cc4b1c96550_eddie-r-cole.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D16%2C0%2C864%2C1080%26w%3D800%26h%3D1000&w=3840&q=75",
        title: "Associate Professor",
        name: "Eddie R. Cole",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F211828e3-4b51-4ae6-8405-2457654f76a9_Robert%2BCooper%2Bcrop%2B210512-ucla-2C1B0043_websize.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D52%2C0%2C632%2C778%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Associate Professor",
        name: "Robert Cooper",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F526c1504-99b3-4ba8-aa05-8db13a54ce3a_JayeDarby%2B%25281%2529.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C2%2C200%2C246%26w%3D650%26h%3D800&w=3840&q=75",
        title: "TEP Faculty Advisor",
        name: "Jaye Darby",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F07b4b6a7-b88c-4b20-893e-5996f7251582_Richard%2BDesjardins.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D12%2C0%2C176%2C250%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Professor",
        name: "Richard Desjardins",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fd1864381-b153-4b0e-8936-5ef77b777b91_jason_nunzio.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Education Lecturer",
        name: "Jason Nunzio Dorio",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fd7095a94-67c5-4b97-856d-9ef43a7cd8fd_202673_aimee.dorr.headshot.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C2%2C288%2C354%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Professor Emerita",
        name: "Aimée Dorr",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fcd3271a4-27b4-49ac-b2bb-89e0fb4444ae_Johanna%2BDrucker%2BGSE%2526IS-24.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D961%2C0%2C1300%2C1600%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Distinguished Professor",
        name: "Johanna Drucker",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fb3d5a333-afbb-46aa-9acf-47787b833eb9_2C1B0511_Preferred.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C0%2C4000%2C4000%26w%3D2000%26h%3D2000&w=3840&q=75",
        title: "Adjunct Professor",
        name: "Diane Durkin",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F12f06f6e-3b28-430a-bf3d-f3af7c862aee_eagan.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Associate Professor",
        name: "Kevin Eagan",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fedee9842-a76b-4a91-9221-29d84f392da0_frederick_erickson_sm.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D4%2C0%2C171%2C242%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Professor Emeritus",
        name: "Frederick Erickson",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=%2Fimages%2Fperson.png&w=3840&q=75",
        title: "Professor Emerita",
        name: "Norma Feshbach",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F67ed5589-7f84-49cd-b18a-e907c69bb34c_annamarie.jpeg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Executive Director, Center X",
        name: "Annamarie Francois",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F75ca602b-8e37-4ddb-b269-b88f98343736_megan.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Interim Chair, Department of Education; Professor",
        name: "Megan Franke",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F7f340727-c342-43c4-ab30-a21ca3c00c1c_Jonathan%2BFurner210512-ucla-2C1B0652_websize.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C132%2C1067%2C1334%26w%3D800%26h%3D1000&w=3840&q=75",
        title: "Professor",
        name: "Jonathan Furner",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F943d4bc5-ac07-4c61-b4ae-2bd2b04466e1_Patricia%252BGandara.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D166%2C0%2C347%2C492%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Research Professor",
        name: "Patricia Gandara",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fa37e32f4-8835-426a-8813-864fa68d4475_david.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Associate Professor",
        name: "David G. Garcia",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F70d09f6f-03d9-4a5a-8f03-4e9976175908_InmaculadaGarcia-SanchezAMP2020.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D40%2C0%2C706%2C1000%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Associate Professor",
        name: "Inmaculada M. García-Sánchez",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fce7cb310-98be-4e4c-8207-312c5a4cbf06_anne_g.jpeg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Professor",
        name: "Anne J. Gilliland",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F02f1f12f-35ef-4899-b286-4da4c8d52215_gomez_l-2012.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C0%2C2244%2C2805%26w%3D800%26h%3D1000&w=3840&q=75",
        title: "Professor",
        name: "Louis Gomez",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F33ca56d3-1059-4074-9b8b-e7d487dc0d1d_KimGomezAMP.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D170%2C0%2C409%2C580%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Professor",
        name: "Kim Gomez",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Ff08176f1-7182-4b41-be04-ee21ed73ceb4_SandraGrahamAMP-680x478.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D146%2C0%2C388%2C478%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Distinguished Professor",
        name: "Sandra Graham",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F1e53014f-82ea-4e1f-9986-ccbc11258647_GrammerJennie.png%3Fauto%3Dcompress%2Cformat%26rect%3D67%2C0%2C633%2C779%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Associate Professor",
        name: "Jennie Grammer",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F03b53bba-0d4e-4ec9-9f85-6e23d90d3c77_rachel%2Bgreen.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C65%2C480%2C591%26w%3D650%26h%3D800&w=3840&q=75",
        title: "TEP Faculty Advisor",
        name: "Rachel Green",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fb42cf17a-f4ec-45c4-9577-71ee4acfe3b6_Lorena%2BGuillen%2B210512-ucla-2C1B0228_websize.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C60%2C1067%2C1313%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Assistant Professor",
        name: "Lorena Guillén",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F86548f43-cc37-4b2c-a05a-33a8f1354073_gutierrez_kris.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D167%2C0%2C366%2C450%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Professor Emerita",
        name: "Kris Gutiérrez",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fed31ae61-86ec-4d72-a2e6-e33fa068a351_MarkHansenAMP.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C0%2C890%2C1112%26w%3D800%26h%3D1000&w=3840&q=75",
        title: "Associate Adjunct Professor",
        name: "Mark Hansen",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fde8c92ec-4ab0-4701-81d7-0b61f061d513_SandraHarding.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D61%2C0%2C559%2C688%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Distinguished Research Professor Emerita",
        name: "Sandra Harding",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F29ac61c7-58e5-4a36-a047-4b58d2531702_jessica_harris.png%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Assistant Professor",
        name: "Jessica C. Harris",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F08dd85ec-7beb-4c09-a30c-2b4e88104370_Robert_M._Hayes_%25282009%2529.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D158%2C0%2C913%2C1293%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Professor Emeritus",
        name: "Robert Hayes",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=%2Fimages%2Fperson.png&w=3840&q=75",
        title: "Professor Emeritus",
        name: "Charles Healy",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F4a02bd98-864b-4f3a-ac81-5e3e84518b88_Tyrone%2BHoward%2Bcrop2.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D43%2C0%2C455%2C569%26w%3D800%26h%3D1000&w=3840&q=75",
        title: "Professor",
        name: "Tyrone Howard",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fabe3ad31-3414-49e4-89fc-093e069b2431_carolees%2Bhowes.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D48%2C0%2C175%2C248%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Research Professor",
        name: "Carollee Howes",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2FNmYzODMwNDEtZTVkMy00ZWZmLTg2MWItNTEyYWFkYTQ4MzI0_sylviahurtadoamp1.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D268%2C0%2C1067%2C1259%26w%3D1067%26h%3D1259&w=3840&q=75",
        title: "Professor, Higher Education and Organization Change",
        name: "Sylvia Hurtado",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F6f31d674-3cd9-483a-bea6-57ad0b3bf459_joann_isken.png%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C116%2C680%2C837%26w%3D650%26h%3D800&w=3840&q=75",
        title: "PLI Lecturer/Field Supervisor",
        name: "Jo Ann Isken",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fe4eccf28-9b4d-4050-8e22-63fc9eac46b3_jaquette.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C19%2C600%2C738%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Associate Professor",
        name: "Ozan Jaquette",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fcdd39b89-13fb-4ef2-9987-bd9ef820902c_Minjeong%2BJeon.png%3Fauto%3Dcompress%2Cformat%26rect%3D7%2C0%2C467%2C575%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Associate Professor",
        name: "Minjeong Jeon",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F724803df-ca39-4bf4-a87c-9fd232d380e9_Connie-Kasari.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D172%2C0%2C406%2C500%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Distinguished Professor",
        name: "Connie Kasari",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F9c2d6575-e1c9-461e-b75c-613069868a9a_DKellnerJShare_Library0165-2.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D709%2C0%2C453%2C558%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Distinguished Research Professor",
        name: "Douglas Kellner",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F75246e87-01c1-4a2b-bc97-247f3ccd2f80_Kelty-author-photo-683x1024.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C26%2C683%2C968%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Professor",
        name: "Christopher Kelty",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F7a44cd8c-0c95-4e84-89de-c878f72cdf80_sara%2Bkerseyucla.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C0%2C452%2C640%26w%3D600%26h%3D850&w=3840&q=75",
        title: "TEP Faculty Advisor",
        name: "Sara Kersey",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F503393c2-f2b4-4342-b838-eb4db1455388_210512-ucla-2C1B0342_websize.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Director",
        name: "Lynn Kim-John",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=%2Fimages%2Fperson.png&w=3840&q=75",
        title: "Professor Emerita",
        name: "Marilyn Kourilsky",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fddca9140-a638-4c89-84a5-c89ff5faac60_cindy%2Bkratzner.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D12%2C0%2C176%2C250%26w%3D600%26h%3D850&w=3840&q=75",
        title: "ELP Lecturer",
        name: "Cindy Kratzer",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F249b3f70-2c8f-404b-bb92-6a08d560bb8f_SheilaLane.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D12%2C0%2C176%2C250%26w%3D600%26h%3D850&w=3840&q=75",
        title: "TEP Faculty Advisor",
        name: "Sheila Lane",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2FMzJmZGQxM2UtZGFjZS00ZWRjLWJkYTItZGE4NjQxNGFlZTli_glazo-portrait3-jpg.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Principal, UCLA Lab School",
        name: "Georgia Lazo",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F861a65b7-9e7a-45d6-8fc5-70fdf7189f7d_Leazer%2Bgreg.png%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C74%2C600%2C850%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Associate Professor",
        name: "Gregory Leazer",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F8d790963-4f9e-4038-a22e-e3eef1ccb609_DarleneLee.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D12%2C0%2C176%2C250%26w%3D600%26h%3D850&w=3840&q=75",
        title: "TEP Faculty Advisor",
        name: "Darlene Lee",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F807dee06-4ab3-40cb-8cd4-a2d199a4e336_Lievrouw%2Bhead%2Bshot%2B1.png%3Fauto%3Dcompress%2Cformat%26rect%3D127%2C0%2C1237%2C1522%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Professor",
        name: "Leah Lievrouw",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fba72d17b-3567-4edb-ba2c-078d82e0d873_Dee-Dee-Lonon_Cropped.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D14%2C0%2C212%2C301%26w%3D600%26h%3D850&w=3840&q=75",
        title: "PLI Lecturer/Field Supervisor",
        name: "Dee Dee Lonon",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fc6a6bbc8-cf2a-40fd-8227-280c6cf6cbaa_EduardoLopez.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C2%2C200%2C246%26w%3D650%26h%3D800&w=3840&q=75",
        title: "TEP Faculty Advisor",
        name: "Eduardo Lopez",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F64e2cb39-d96a-4c39-a9bd-cced57c53aa5_Catherin%2Blord.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D287%2C0%2C402%2C570%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Distinguished Professor",
        name: "Catherine Lord",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F94604d2e-a388-47c3-b57d-22baed265a69_BeverlyLynch.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D143%2C0%2C395%2C559%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Research Professor",
        name: "Beverly Lynch",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fb6376bd6-d114-452a-9ea4-95cddf279de8_Mary%2BNiles%2BMaack.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C0%2C763%2C1081%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Professor Emerita",
        name: "Mary Niles Maack",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F0a7dec58-b4c0-42d8-afe1-fb49cf3c3c92_Reynaldo%2BMacias.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C87%2C2048%2C2901%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Professor",
        name: "Reynaldo Macias",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F749472f8-0a41-4ebc-80fe-ce547ca9cd2a_nicole-manacevice.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C21%2C207%2C255%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Assistant Professor-in-Residence",
        name: "Nicole Mancevice",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F1af2deae-99ae-4439-a717-a18a25684f61_janemargolis.jpeg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Senior Researcher",
        name: "Jane Margolis",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F9d192bbd-bb1b-472e-9550-993656f54a7c_anandamarin.jpeg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Assistant Professor",
        name: "Ananda M. Marin",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F5916082c-e560-43d7-834b-267497e95463_AnnaMarkowitzAMP_2.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D7%2C0%2C793%2C991%26w%3D800%26h%3D1000&w=3840&q=75",
        title: "Assistant Professor",
        name: "Anna Markowitz",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F8e149cef-ac9a-4066-88fb-de1704b8300c_Martinez.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C41%2C300%2C369%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Associate Professor",
        name: "Jose-Felipe Martinez",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fe3873dd1-d68b-4361-8351-5ec8f6cf32a1_Teresa%252BMcCarty.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D124%2C0%2C565%2C800%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Professor",
        name: "Teresa L. McCarty",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F11a48ee4-3ae0-41d9-8c90-7c4ca46b0291_mcdonough.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D66%2C0%2C193%2C273%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Professor",
        name: "Patricia McDonough",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F73389803-8a4e-4a67-9427-78a86f786ffc_Peter%2BMclaren.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C17%2C400%2C567%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Professor Emeritus",
        name: "Peter McLaren",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F1c5aacba-33b8-416c-95b8-4e96a75b4b8c_JohnMcNeilAMP1-680x413.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D171%2C0%2C292%2C413%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Professor Emeritus",
        name: "John McNeil",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=%2Fimages%2Fperson.png&w=3840&q=75",
        title: "IS Lecturer",
        name: "Luiz Mendes",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F16d10516-0f01-4bf9-8c76-e6a047582be1_RashmitaMistry_0104%2B%25281%2529.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D183%2C0%2C347%2C427%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Vice Chair, Undergraduate Education; Professor",
        name: "Rashmita Mistry",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Ff3e8e2d4-2efe-432a-9ef5-d4fa68db07b2_RobMontoya_800px.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D220%2C0%2C666%2C833%26w%3D800%26h%3D1000&w=3840&q=75",
        title: "Assistant Professor",
        name: "Robert D. Montoya",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=%2Fimages%2Fperson.png&w=3840&q=75",
        title: "Professor Emeritus",
        name: "Bengt Muthen",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F8a98b560-39cd-4698-952b-652a38037a7c_Imelda%2BNava-Landeros.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C43%2C1067%2C1512%26w%3D600%26h%3D850&w=3840&q=75",
        title: "TEP Faculty Advisor",
        name: "Imelda Nava-Landeros",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2FOTZhZDAwZjctZTg5YS00NDY4LThiZDEtOTQwYmJlNmRkOTM3_safiyanobleampjohndavis2020.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Associate Professor, Gender Studies",
        name: "Safiya Umoja Noble",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Ff25ffc11-d342-4f35-9482-7c9b94e24440_Jeannie_Oakes_.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D385%2C0%2C2592%2C3672%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Presidential Professor Emerita in Educational Equity",
        name: "Jeannie Oakes",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F4572e42e-d2eb-4abc-a4b8-c3ca760ae6fb_Edith_Mukudi_Omwami_.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D26%2C0%2C326%2C426%26w%3D650%26h%3D850&w=3840&q=75",
        title: "Associate Professor",
        name: "Edith Mukudi Omwami",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fdedb964c-3469-46fd-8c33-4e64f4c7aa80_2C1B0471__Cropped_Preferred.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Assistant Director, Principal Leadership Institute; Director, Culture and Equity Project",
        name: "Tonikiaa Orange",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F45bc948b-a136-473c-aceb-8ebeacc4c221_MarjorieOrellana_Preferred.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Professor",
        name: "Marjorie Elaine Faulstich Orellana",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F9a8f207b-cf56-4607-9dcd-02836fb347d7_GaryOrfield.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Distinguished Research Professor",
        name: "Gary Orfield",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fbe639b79-9793-410b-a57b-62a2a83aec28_SusanOswald.jpeg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "TEP Field Supervisor",
        name: "Susan Oswald",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F78c5eb96-eb98-4da8-90b5-73b15f58df50_NancyParachini%2B%25281%2529.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D12%2C0%2C176%2C250%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Director, Principal Leadership Institute",
        name: "Nancy Parachini",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F2289bafd-e074-45a0-959a-9e8c9f06bf83_JaimePark.jpeg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "UCLA Teacher Education Program Faculty",
        name: "Jaime Park",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F9d5c007a-94f6-41ad-947b-b652975b05cb_EllenPearlstein.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D180%2C0%2C575%2C815%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Professor",
        name: "Ellen Pearlstein",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F94eb9de5-66af-43fd-90ad-85059863af6c_Faye%2BPeitzman.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D12%2C0%2C176%2C250%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Adjunct Professor",
        name: "Faye Peitzman",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F66124eb0-32b9-478a-8897-1cbab05156c4_MiriamPosner.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C165%2C1335%2C1669%26w%3D800%26h%3D1000&w=3840&q=75",
        title: "Assistant Professor",
        name: "Miriam Posner",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F02e74837-b863-4ca2-aa4b-51fdf386894f_MerlePrice.jpeg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "PLI Lecturer/Field Supervisor",
        name: "Merle Price",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fc0f2bce0-2bc9-4fcf-a7c3-5da88082b39c_Jody-Priselac%2B.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D51%2C0%2C247%2C350%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Associate Dean for Community Programs",
        name: "Jody Priselac",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F258afe78-4ef5-4696-a44f-1c59facc4836_William-Purdy.jpeg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Education Lecturer",
        name: "Bill Purdy",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fd8475d65-282a-49cd-90d1-1ea92400f96c_karenquartz.jpeg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Adjunct Professor; Director, UCLA Center for Community Schooling",
        name: "Karen Hunter Quartz",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fe39c15bc-fde4-4f80-b355-77b68a529ce0_Frederica-Raia.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D151%2C0%2C635%2C900%26w%3D600%26h%3D850&w=3840&q=75",
        title: "Associate Professor",
        name: "Federica Raia",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2F62b3cf12-d36d-4d81-b63a-ef730a952739_johnvrichardsonAMP.jpeg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C0%2C999%2C1230%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Professor Emeritus",
        name: "John Richardson",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2FNjRjNDU4NzktNGRiNy00MmVlLTk2MjctZjQyZjQxYzIxYWYz_ceciliarios-aguilaramp2.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D307%2C0%2C620%2C775%26w%3D800%26h%3D1000&w=3840&q=75",
        title: "Associate Dean of Equity, Diversity, and Inclusion; Professor",
        name: "Cecilia Rios-Aguilar",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2FYjQwMWUxN2YtNjUxNS00ODc2LWJmYjgtZGFjZDRiNDE1MWQx_sarahrobertsampstellakalinina-1.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D219%2C0%2C813%2C1000%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Associate Professor, Gender Studies",
        name: "Sarah Roberts",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fc30debda-45ec-4692-8be5-3f3f6fd40ba5_2C1B0739_Preferred.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C0%2C4000%2C3889%26w%3D1800%26h%3D1750&w=3840&q=75",
        title: "Professor",
        name: "John Rogers",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2Fc6dade52-3249-45c8-9f77-2043d4278747_KristenRohanna.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75",
        title: "Assistant Adjunct Professor",
        name: "Kristen Rohanna",
    },
    {
        img: "https://seis.ucla.edu/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fucla-seis%2FM2Y1YmNhOTQtNjZhYS00MGU2LTk4NzEtNTUxMDU2NzRlYzE3_mikerose2-e1362425832393-680x446.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D159%2C0%2C362%2C446%26w%3D650%26h%3D800&w=3840&q=75",
        title: "Research Professor",
        name: "Mike Rose",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Professor Emeritus",
        name: "Val Rust",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Resident Faculty Advisor & Director of Mathematics Instruction and Learning",
        name: "Theodore Ruiz Sagun",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Professor",
        name: "William Sandoval",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Associate Professor",
        name: "Lucrecia Santibañez",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Professor",
        name: "Linda J. Sax",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Director, Senior Fellows Program",
        name: "Brian E. C. Schottlaender",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Professor",
        name: "Michael Seltzer",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Lecturer",
        name: "Jeff Share",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Education Lecturer; Director, Community Schools Initiative",
        name: "Christine Shen",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Professor",
        name: "Daniel Solorzano",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Professor",
        name: "Ramesh Srinivasan",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Lecturer",
        name: "Ilene Straus",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Professor (Leave of Absence)",
        name: "Carola Suárez-Orozco",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Professor Emerita",
        name: "Elaine Svenonius",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Professor",
        name: "Robert Teranishi",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Clinical Faculty",
        name: "Glory Tobiason",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Distinguished Professor",
        name: "Carlos Alberto Torres",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Research Professor",
        name: "Concepcion Valadez",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Associate Professor",
        name: "Shawn VanCour",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Professor Emerita",
        name: "Virginia Walter",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Adjunct Professor; Senior Research Scientist",
        name: "Jia Wang",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Vice Chair, Department of Education; Professor",
        name: "Noreen Webb",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Professor Emeritus",
        name: "Wellford (Buzz) Wilms",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Professor-in-Residence",
        name: "Maryanne Wolf",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Professor",
        name: "Jeffrey Wood",
    },
    {
        img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        title: "Academic Director",
        name: "Mitsue Yokota",
    },
];

const programDurations = ["1 month", "3 month", "6 months", "1 year"];

const facilities = [
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5135.png",
        facilityName: "Stanford University",
        recruiterId: "5135",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5143.png",
        facilityName: "University of California, Berkeley",
        recruiterId: "5143",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5147.png",
        facilityName: "University of California, Los Angeles",
        recruiterId: "5147",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5160.png",
        facilityName: "University of Southern California",
        recruiterId: "5160",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5151.png",
        facilityName: "University of California, San Diego",
        recruiterId: "5151",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5144.png",
        facilityName: "University of California, Davis",
        recruiterId: "5144",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5146.png",
        facilityName: "University of California, Irvine",
        recruiterId: "5146",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5020.png",
        facilityName: "California Institute of Technology",
        recruiterId: "5020",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5153.png",
        facilityName: "University of California, Santa Barbara",
        recruiterId: "5153",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5150.png",
        facilityName: "University of California, Riverside",
        recruiterId: "5150",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5154.png",
        facilityName: "University of California, Santa Cruz",
        recruiterId: "5154",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5152.png",
        facilityName: "University of California, San Francisco",
        recruiterId: "5152",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5114.png",
        facilityName: "San Diego State University",
        recruiterId: "5114",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5040.png",
        facilityName: "California State University, Northridge",
        recruiterId: "5040",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5121.png",
        facilityName: "San José State University",
        recruiterId: "5121",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5118.png",
        facilityName: "San Francisco State University",
        recruiterId: "5118",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5037.png",
        facilityName: "California State University, Long Beach",
        recruiterId: "5037",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5122.png",
        facilityName: "Santa Clara University",
        recruiterId: "5122",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5035.png",
        facilityName: "California State University, Fullerton",
        recruiterId: "5035",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5024.png",
        facilityName:
            "California Polytechnic State University, San Luis Obispo",
        recruiterId: "5024",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5159.png",
        facilityName: "University of San Francisco",
        recruiterId: "5159",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5106.png",
        facilityName: "Pepperdine University",
        recruiterId: "5106",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5046.png",
        facilityName: "Chapman University",
        recruiterId: "5046",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5029.png",
        facilityName: "California State Polytechnic University, Pomona",
        recruiterId: "5029",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5041.png",
        facilityName: "California State University, Sacramento",
        recruiterId: "5041",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5032.png",
        facilityName: "California State University, Chico",
        recruiterId: "5032",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5158.png",
        facilityName: "University of San Diego",
        recruiterId: "5158",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5086.png",
        facilityName: "Loyola Marymount University",
        recruiterId: "5086",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5074.png",
        facilityName: "Humboldt State University",
        recruiterId: "5074",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5042.png",
        facilityName: "California State University, San Bernardino",
        recruiterId: "5042",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5070.png",
        facilityName: "Harvey Mudd College",
        recruiterId: "5070",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5084.png",
        facilityName: "Loma Linda University",
        recruiterId: "5084",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5128.png",
        facilityName: "Sonoma State University",
        recruiterId: "5128",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5034.png",
        facilityName: "California State University, Fresno",
        recruiterId: "5034",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5148.png",
        facilityName: "University of California, Merced",
        recruiterId: "5148",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5110.png",
        facilityName: "Pomona College",
        recruiterId: "5110",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5011.png",
        facilityName: "Biola University",
        recruiterId: "5011",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5038.png",
        facilityName: "California State University, Los Angeles",
        recruiterId: "5038",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5043.png",
        facilityName: "California State University San Marcos",
        recruiterId: "5043",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5033.png",
        facilityName: "California State University, Dominguez Hills",
        recruiterId: "5033",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5162.png",
        facilityName: "University of the Pacific",
        recruiterId: "5162",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5007.png",
        facilityName: "ArtCenter College of Design",
        recruiterId: "5007",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5044.png",
        facilityName: "California State University, Stanislaus",
        recruiterId: "5044",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5036.png",
        facilityName: "California State University, East Bay",
        recruiterId: "5036",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5094.png",
        facilityName: "Naval Postgraduate School",
        recruiterId: "5094",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5098.png",
        facilityName: "Occidental College",
        recruiterId: "5098",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5009.png",
        facilityName: "Azusa Pacific University",
        recruiterId: "5009",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5108.png",
        facilityName: "Pitzer College",
        recruiterId: "5108",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5145.png",
        facilityName: "University of California, Hastings College of the Law",
        recruiterId: "5145",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/4998.png",
        facilityName: "Academy of Art University",
        recruiterId: "4998",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5049.png",
        facilityName: "Claremont Graduate University",
        recruiterId: "5049",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5093.png",
        facilityName: "National University",
        recruiterId: "5093",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5021.png",
        facilityName: "California Institute of the Arts",
        recruiterId: "5021",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5039.png",
        facilityName: "California State University, Monterey Bay",
        recruiterId: "5039",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5050.png",
        facilityName: "Claremont McKenna College",
        recruiterId: "5050",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5022.png",
        facilityName: "California Lutheran University",
        recruiterId: "5022",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5068.png",
        facilityName: "Golden Gate University",
        recruiterId: "5068",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5017.png",
        facilityName: "California College of the Arts",
        recruiterId: "5017",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5156.png",
        facilityName: "University of La Verne",
        recruiterId: "5156",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5134.png",
        facilityName: "Saint Mary's College of California",
        recruiterId: "5134",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5089.png",
        facilityName: "Mills College",
        recruiterId: "5089",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5019.png",
        facilityName: "California Institute of Integral Studies",
        recruiterId: "5019",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5157.png",
        facilityName: "University of Redlands",
        recruiterId: "5157",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5031.png",
        facilityName: "California State University Channel Islands",
        recruiterId: "5031",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5060.png",
        facilityName: "Dominican University of California",
        recruiterId: "5060",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5030.png",
        facilityName: "California State University, Bakersfield",
        recruiterId: "5030",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5109.png",
        facilityName: "Point Loma Nazarene University",
        recruiterId: "5109",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5099.png",
        facilityName: "Otis College of Art and Design",
        recruiterId: "5099",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5168.png",
        facilityName: "Whittier College",
        recruiterId: "5168",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5167.png",
        facilityName: "Westmont College",
        recruiterId: "5167",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5124.png",
        facilityName: "Scripps College",
        recruiterId: "5124",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5014.png",
        facilityName: "California Baptist University",
        recruiterId: "5014",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/7276.png",
        facilityName: "Alliant International University",
        recruiterId: "7276",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/7278.png",
        facilityName: "Western University of Health Sciences",
        recruiterId: "7278",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/9113.png",
        facilityName: "Keck Graduate Institute",
        recruiterId: "9113",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5057.png",
        facilityName: "Concordia University Irvine",
        recruiterId: "5057",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5116.png",
        facilityName: "San Francisco Art Institute",
        recruiterId: "5116",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/1167.png",
        facilityName: "Southwestern Law School",
        recruiterId: "1167",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5103.png",
        facilityName: "Pacific Union College",
        recruiterId: "5103",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5065.png",
        facilityName: "Fresno Pacific University",
        recruiterId: "5065",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5169.png",
        facilityName: "Woodbury University",
        recruiterId: "5169",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5023.png",
        facilityName: "California State University Maritime Academy",
        recruiterId: "5023",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5117.png",
        facilityName: "San Francisco Conservatory of Music",
        recruiterId: "5117",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5131.png",
        facilityName: "Southern California Institute of Architecture",
        recruiterId: "5131",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5127.png",
        facilityName: "Soka University of America",
        recruiterId: "5127",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5062.png",
        facilityName: "Fielding Graduate University",
        recruiterId: "5062",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5113.png",
        facilityName: "Samuel Merritt University",
        recruiterId: "5113",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/1694.png",
        facilityName: "West Coast University-Los Angeles",
        recruiterId: "1694",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5155.png",
        facilityName: "American Jewish University",
        recruiterId: "5155",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5140.png",
        facilityName: "Thomas Aquinas College",
        recruiterId: "5140",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/1680.png",
        facilityName: "Brandman University",
        recruiterId: "1680",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5088.png",
        facilityName: "Menlo College",
        recruiterId: "5088",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5138.png",
        facilityName: "The Master's University",
        recruiterId: "5138",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5045.png",
        facilityName: "California Western School of Law",
        recruiterId: "5045",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5081.png",
        facilityName: "La Sierra University",
        recruiterId: "5081",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5052.png",
        facilityName: "University of Silicon Valley",
        recruiterId: "5052",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5072.png",
        facilityName: "Holy Names University",
        recruiterId: "5072",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5080.png",
        facilityName: "John F. Kennedy University",
        recruiterId: "5080",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/7277.png",
        facilityName: "Thomas Jefferson School of Law",
        recruiterId: "7277",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/1694.png",
        facilityName: "University of St. Augustine for Health Sciences",
        recruiterId: "1694",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5163.png",
        facilityName: "Vanguard University of Southern California",
        recruiterId: "5163",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5101.png",
        facilityName: "Palo Alto University",
        recruiterId: "5101",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/1687.png",
        facilityName: "NewSchool of Architecture and Design",
        recruiterId: "1687",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5047.png",
        facilityName: "Charles R. Drew University of Medicine and Science",
        recruiterId: "5047",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5073.png",
        facilityName: "Hope International University",
        recruiterId: "5073",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5120.png",
        facilityName: "William Jessup University",
        recruiterId: "5120",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5463.png",
        facilityName: "The Chicago School of Professional Psychology",
        recruiterId: "5463",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5091.png",
        facilityName: "Mount Saint Mary's University",
        recruiterId: "5091",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5097.png",
        facilityName: "Notre Dame de Namur University",
        recruiterId: "5097",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5104.png",
        facilityName: "Pacifica Graduate Institute",
        recruiterId: "5104",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/7737.png",
        facilityName: "Life Pacific College",
        recruiterId: "7737",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5123.png",
        facilityName: "Saybrook University",
        recruiterId: "5123",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/1682.png",
        facilityName: "Columbia College Hollywood",
        recruiterId: "1682",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5112.png",
        facilityName: "Pardee RAND Graduate School",
        recruiterId: "5112",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/1692.png",
        facilityName: "Touro University California",
        recruiterId: "1692",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5000.png",
        facilityName: "American Film Institute Conservatory",
        recruiterId: "5000",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5125.png",
        facilityName: "Simpson University",
        recruiterId: "5125",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5130.png",
        facilityName: "Marshall B. Ketchum University",
        recruiterId: "5130",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/1686.png",
        facilityName: "Marymount California University",
        recruiterId: "1686",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5075.png",
        facilityName: "Humphreys University",
        recruiterId: "5075",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5048.png",
        facilityName: "San Diego Christian College",
        recruiterId: "5048",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/1694.png",
        facilityName: "University of the West",
        recruiterId: "1694",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5102.png",
        facilityName: "Pacific Oaks College",
        recruiterId: "5102",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/1685.png",
        facilityName: "Laguna College of Art and Design",
        recruiterId: "1685",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/1690.png",
        facilityName: "Sofia University",
        recruiterId: "1690",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5119.png",
        facilityName: "San Joaquin College of Law",
        recruiterId: "5119",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/1847.png",
        facilityName: "Dharma Realm Buddhist University",
        recruiterId: "1847",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5061.png",
        facilityName: "Dominican School of Philosophy & Theology",
        recruiterId: "5061",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/9106.png",
        facilityName: "The Wright Institute",
        recruiterId: "9106",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/1692.png",
        facilityName: "United States University",
        recruiterId: "1692",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/1685.png",
        facilityName: "John Paul the Great Catholic University",
        recruiterId: "1685",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5161.png",
        facilityName: "The University of West Los Angeles",
        recruiterId: "5161",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/1688.png",
        facilityName: "Providence Christian College",
        recruiterId: "1688",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/7736.png",
        facilityName: "Bethesda University",
        recruiterId: "7736",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/1511.png",
        facilityName:
            "Irell and Manella Graduate School of Biological Sciences",
        recruiterId: "1511",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5004.png",
        facilityName: "Antioch University Los Angeles",
        recruiterId: "5004",
    },
    {
        imageSrc: "https://www.4icu.org/i/logos-seals/5005.png",
        facilityName: "Antioch University Santa Barbara",
        recruiterId: "5005",
    },
];

const memberChoices = [
    "1 - 5",
    "6 - 10",
    "11 - 20",
    "20 - 50",
    "50 - 100",
    "100+",
];

const roleChoices = [
    "hiring manager",
    "assistant",
    "office manager",
    "owner",
    "recruiter",
    "human resources",
    "other",
];

const statesList = [
    "California",
    "Louisiana",
    "Arkansas",
    "Pennsylvania",
    "Oklahoma",
    "Nevada",
];

const technicalSkills = [
    "Southern Blot",
    "Northern Blot",
    "Western Blot",
    "PCR",
    "DNA Extraction",
    "Protein Ex",
    "RNA Ex",
    "Gel Electrophoresis",
    "Spectroscopy",
    "Chromatography",
    "Flowcytometry",
    "Bioinformatics Tools",
];

const questionsList = [
    "Tell me a little about your interests.",
    "Why did you apply for this position?",
    "What do you know about our company?",
    "What do you consider your strongest skills?",
    "What skills do you feel you could improve on?",
    "How did you find out about this job?",
    "How do you see yourself fitting in with our company culture?",
    "Where do you see yourself in the future?",
    "How would this job help you achieve your career goals?",
    "How do your career goals align with our mission?",
    "What do you value in the company you work for?",
    "Do you have any questions about the job?",
];

function randomIntBetween(a, b) {
    return Math.floor(Math.random() * (b - a) + a);
}

function randomFromArray(arr) {
    const len = arr.length;
    const rand = randomIntBetween(0, len);
    return arr[rand];
}

function generateOpening() {
    let department = randomFromArray(departments);

    let opptype = randomFromArray(opportunityTypes);
    let opportunityType = { value: opptype, label: opptype };
    let remote = randomFromArray(locations);
    let availability = randomIntBetween(1, 5);
    // date
    // from 30 to 45 days in the future
    // to 90 to 120 days in the future
    let startend = [
        faker.date.soon(randomIntBetween(30, 45)),
        faker.date.soon(randomIntBetween(90, 120)),
    ];
    let deadline = faker.date.soon(randomIntBetween(15, 30));
    let address1 = faker.address.streetAddress();
    let address2 = faker.address.secondaryAddress();
    let city = faker.address.city();
    let state = randomFromArray(statesList);
    let zipCode = faker.address.zipCode();
    let description = randomFromArray(descriptions);
    let prerequisites = randomFromArray(prereqs);
    let majorsConsidered = [];
    for (let index = 0; index < randomIntBetween(1, 5); index++) {
        let owo = randomFromArray(departments);
        majorsConsidered.push({ value: owo, label: owo });
    }
    let desiredTechnicalSkills = [];
    for (let index = 0; index < randomIntBetween(0, 5); index++) {
        let owo = randomFromArray(technicalSkills);
        desiredTechnicalSkills.push({ value: owo, label: owo });
    }

    return {
        department,
        opportunityType,
        remote,
        availability,
        startend,
        deadline,
        address1,
        address2,
        city,
        state,
        zipCode,
        description,
        prerequisites,
        majorsConsidered,
        desiredTechnicalSkills,
    };
}

function generateProject() {
    let description = randomFromArray(descriptions);
    let title = randomFromArray(programTitles);
    let website = randomFromArray(websiteLinks);

    return {
        title,
        description,
        website,
    };
}

function generateListing(recruiterData) {
    let views = randomIntBetween(0, 1000);
    let applied = randomIntBetween(0, 32);

    let project = generateProject();
    let opening = generateOpening();

    location = {
        zipCode: faker.address.zipCode(),
        city: faker.address.city(),
        streetAddress: faker.address.streetAddress(),
        secondaryAddress: faker.address.secondaryAddress(),
        county: faker.address.county(),
        country: faker.address.country(),
        state: randomFromArray(statesList),
        timeZone: faker.address.timeZone(),
    };

    let majorsConsidered = [];
    for (let index = 0; index < randomIntBetween(1, 5); index++) {
        majorsConsidered.push(randomFromArray(departments));
    }
    let questions = [];
    for (let index = 0; index < randomIntBetween(0, 3); index++) {
        let question = randomFromArray(questionsList);
        questions.push({
            question,
            maxCount: 500,
            required: "required",
            type: {
                value: "freeResponse",
                label: "Free Response",
            },
            questionId: randomId(),
        });
    }

    let listingId = randomId();
    let userId = randomId();
    let projectId = randomId();

    let settings = {
        publishDate: faker.date.recent(randomIntBetween(1, 30)),
        expireDate: faker.date.recent(randomIntBetween(30, 60)),
        visibility: {
            value: "public",
            label: "Public",
        },
    };

    return {
        views,
        applied,
        listingId,
        userId,
        opening,
        project,
        ...project,
        projectId,
        questions,
        recruiter: recruiterData,
        settings,
    };
}

function generateRecruiter() {
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let nickname = "";
    let pronouns = "";

    let general = {
        firstName,
        lastName,
        nickname,
        pronouns,
        role: {
            value: "recruiter",
            label: "Principal Investigator",
        },
    };

    let education = [];
    let contact = {};
    let researchexperience = [];

    return {
        general,
        education,
        contact,
        researchexperience,
    };
}

function generateRecruiterAndListings() {
    // generate recruiter and its listings
    let recruiter = generateRecruiter();
    let listings = [];
    let newListings = [];
    for (let index = 0; index < randomIntBetween(3, 10); index++) {
        const listing = generateListing(recruiter);
        const listingId = listing.listingId;
        newListings.push(listing);

        listings.push(listingId);
    }

    return [recruiter, newListings];
}

async function main() {
    const uri = `mongodb+srv://awesomechoi11:${secrets.mongoPassword}@cluster0.42fbz.mongodb.net/Cluster0?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    await client.connect();

    const listingsCol = client.db("Cluster0").collection("listings");
    // const recruitersCol = client.db("Cluster0").collection("recruiters");
    // perform actions on the collection object
    let totalListings = [];
    // let totalRecruiters = [];
    for (let index = 0; index < 5000; index++) {
        const [newRecruiter, newListings] = generateRecruiterAndListings();
        totalListings = totalListings.concat(newListings);
        // totalRecruiters.push(newRecruiter);
    }

    // console.log(totalListings);
    await listingsCol.insertMany(totalListings);
    // await recruitersCol.insertMany(totalRecruiters);

    await client.close();
}

main();
