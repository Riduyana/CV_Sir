// ===============================
// CONFIG
// ===============================

const BASE_API_URL = "http://127.0.0.1:8000";
// when deployed change to:
// const BASE_API_URL = "https://cv-sir.onrender.com";

let roleChart = null;


// ===============================
// JOB ROLES FOR AUTOCOMPLETE
// ===============================

const JOB_ROLES = [
"Data Analyst",
"Data Engineer",
"Business Analyst",
"Machine Learning Engineer",
"AI Engineer",
"Backend Developer",
"Frontend Developer",
"Full Stack Developer",
"DevOps Engineer",
"Cloud Engineer",
"Cyber Security Analyst",
"UI/UX Designer",
"Product Manager",
"QA Engineer",
"Mobile App Developer"
];


// ===============================
// STEP NAVIGATION
// ===============================

function goToStep(stepNumber){

document.querySelectorAll(".step-content").forEach(el=>{
el.classList.remove("active");
});

document.getElementById(`step${stepNumber}`).classList.add("active");

const steps=document.querySelectorAll(".step");

steps.forEach((step,index)=>{
step.classList.remove("active");

if(index<stepNumber){
step.classList.add("active");
}

});

}


// ===============================
// AUTOCOMPLETE DROPDOWN
// ===============================

const roleInput=document.getElementById("targetRole");
const suggestionsBox=document.getElementById("roleSuggestions");

if(roleInput){

roleInput.addEventListener("input",()=>{

const query=roleInput.value.toLowerCase().trim();

suggestionsBox.innerHTML="";

if(!query){
suggestionsBox.style.display="none";
return;
}

const matches=JOB_ROLES.filter(role=>
role.toLowerCase().includes(query)
);

if(matches.length===0){
suggestionsBox.style.display="none";
return;
}

matches.forEach(role=>{

const div=document.createElement("div");
div.className="suggestion-item";
div.textContent=role;

div.onclick=()=>{
roleInput.value=role;
suggestionsBox.style.display="none";
};

suggestionsBox.appendChild(div);

});

suggestionsBox.style.display="block";

});

}


// close dropdown if click outside

document.addEventListener("click",(e)=>{
if(!e.target.closest(".autocomplete-container")){
suggestionsBox.style.display="none";
}
});



// ===============================
// ANALYZE RESUME
// ===============================

async function analyze(event){

if(event) event.preventDefault();

const resumeFile=document.getElementById("resumeFile").files[0];
const targetRole=document.getElementById("targetRole").value;
const jdText=document.getElementById("jdText").value;
const experienceYears=document.getElementById("experienceYears")?.value || 0;
const projects=document.getElementById("projectsCount")?.value || 0;

if(!resumeFile){
alert("Please upload your resume");
return;
}

if(!targetRole){
alert("Please enter a job title");
return;
}

const formData=new FormData();

formData.append("resume",resumeFile);
formData.append("target_role",targetRole);
formData.append("experience_years",experienceYears);
formData.append("projects",projects);

if(jdText){
formData.append("job_description_text",jdText);
}

try{

const response=await fetch(`${BASE_API_URL}/analyze`,{
method:"POST",
body:formData
});

const data=await response.json();

renderResults(data);

}catch(err){

console.error("Analyze error:",err);
alert("Backend error");

}

}



// ===============================
// RENDER RESULTS
// ===============================

function renderResults(data){

document.getElementById("resTargetRole").textContent=data.target_role || "-";

document.getElementById("resRoleMatch").textContent=
data.role_match_percentage + "%";

document.getElementById("resJdMatch").textContent=
data.jd_match_percentage!==null
? data.jd_match_percentage+"%"
: "N/A";


renderList("roleMissingSkillsList",data.role_missing_skills);
renderList("roleExtraSkillsList",data.role_extra_skills);
renderList("jdMissingSkillsList",data.jd_missing_skills);


renderChart(data.role_matches || {});

renderRecommendedJobs(data);

}



// ===============================
// SKILL LIST RENDER
// ===============================

function renderList(id,items=[]){

const ul=document.getElementById(id);

if(!ul) return;

ul.innerHTML="";

if(!items || items.length===0){

ul.innerHTML="<li>No items 🎉</li>";
return;

}

items.forEach(skill=>{

const li=document.createElement("li");
li.textContent=skill;

ul.appendChild(li);

});

}



// ===============================
// ROLE MATCH CHART
// ===============================

function renderChart(roleMatches){

const labels=Object.keys(roleMatches);
const values=Object.values(roleMatches);

const canvas=document.getElementById("roleChart");

if(!canvas) return;

const ctx=canvas.getContext("2d");

if(roleChart) roleChart.destroy();

roleChart=new Chart(ctx,{
type:"bar",
data:{
labels,
datasets:[{
label:"Role Match %",
data:values,
backgroundColor:"#2563eb",
borderRadius:8
}]
},
options:{
responsive:true,
plugins:{
legend:{display:false}
},
scales:{
y:{
beginAtZero:true,
max:100
}
}
}
});

}



// ===============================
// JOB RECOMMENDATIONS
// ===============================

async function renderRecommendedJobs(data){

const container=document.getElementById("recommendedJobs");

container.innerHTML="";

const rankedRoles=Object.entries(data.career_profile || {})
.sort((a,b)=>b[1].score - a[1].score)
.slice(0,3);

for(const [role,profile] of rankedRoles){

const formData=new FormData();

formData.append("role",role);
formData.append("level",profile.level);

try{

const response=await fetch(
`${BASE_API_URL}/job-recommendations`,
{
method:"POST",
body:formData
}
);

const result=await response.json();

const card=document.createElement("div");
card.className="job-card";

card.innerHTML=`

<h4>${role}</h4>

<div class="job-meta">
<span><strong>Level:</strong> ${profile.level}</span>
<span><strong>Readiness:</strong> ${profile.score}%</span>
</div>

<div class="job-links">
<a href="${result.external_links.linkedin}" target="_blank">LinkedIn Jobs</a>
<a href="${result.external_links.indeed}" target="_blank">Indeed Jobs</a>
</div>

`;

container.appendChild(card);

}catch(err){

console.error("Recommendation error:",err);

}

}

}