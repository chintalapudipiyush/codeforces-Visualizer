const inputForm = document.getElementById("form")
inputForm.addEventListener("submit",handleSubmit)
const api_url="https://codeforces.com/api/"
let username = ''
let language = {}
let verdict = {}
let ratings={}
let tags={}

let max_attempted_prob="";
let solved=new Set();
let tried = new Set();
let attempts={};  //avg_attempts=new Map(); this also works
let max_attempt=0;
let problem_solved_count = {};
let max_ac=0;
let max_ac_name="";
let avg_attempts=0;
let heatmap = {}
let heatmapData = {}


    

async function handleSubmit(e){
    try{    
        e.preventDefault();
        const inputBox = document.getElementById("input-box")
        username = inputBox.value

        let response = await fetch(`${api_url}user.status?handle=${username}`)
    
        response = await response.json();
        console.log(response)
        // lloping over the submissions 
        for(let i = 0; i<response.result.length; i++)
        {
            // taking one submission into a avariable

            const submission = response.result[i];

            // adding verdict keys to the global object
            // triple = to compare
            if(verdict[submission.verdict] === undefined)
            {
                verdict[submission.verdict]=1
            }
            else
            {
                verdict[submission.verdict]+=1;
            }

            if(language[submission.programmingLanguage]===undefined)
            {
                language[submission.programmingLanguage]=1;
            }
            else
            {
                language[submission.programmingLanguage]+=1;
            }

            if(ratings[submission.problem.rating]===undefined)
            {
                ratings[submission.problem.rating]=1;
            }
            else
            {
                ratings[submission.problem.rating]+=1;
            }

            if(tags[submission.problem.tags[0]]===undefined)
            {
                tags[submission.problem.tags[0]]=1;
            }
            else{
                tags[submission.problem.tags[0]]+=1;
            }

            // tried part 
            let contestId = submission.problem.contestId
            let level = submission.problem.index
            let name = submission.problem.name

            let key=`${contestId}-${name}-${level}`
            tried.add(key);

            // solved
            if(submission.verdict === "OK"){
                solved.add(key);
            }

            // counting  attempts 
            if(attempts[key] === undefined)
            {
                attempts[key]=1;
            }
            else{
                attempts[key]+=1;
            }

            // max attempts will be there in attempts frequency
            if(attempts[key] > max_attempt)
            {
                max_attempt=attempts[key];
                max_attempted_prob = `${contestId}-${level}`;
            }

            // solved with one submission
            if(submission.verdict==="OK")
            {
                if(problem_solved_count[key] === undefined)
                {
                    problem_solved_count[key] = 1;
                }
                else{
                    problem_solved_count[key]+=1;
                }
            }

            // maximum accepted 
            if(problem_solved_count[key] > max_ac)
            {
                max_ac = problem_solved_count[key];
                max_ac_name = `${contestId}-${level}`;
            }

            // heatmapcalc
            const submissionTimeMs = submission.creationTimeSeconds * 1000
            const date = new Date(submissionTimeMs)
            date.setHours(0,0,0,0)
            // console.log("submissiondate :",date.valueOf())
            if(heatmap[date.valueOf()]===undefined)
            {
                heatmap[date.valueOf()]=1;
            }
            else{
                heatmap[date.valueOf()]+=1;
            }

        }
        // years = new Date(response.result[0].creationTimeSeconds * 1000).getFullYear() - new Date(response.result)
        
        // drawtagchart();
        drawratingschart();
        drawVerdictChart();
        drawLanguageChart();
        drawContestStatsTable();
        console.log(heatmap)
        console.log(verdict)
        console.log(language)
    
    }
    catch(err){
        console.log(err);
    }

}

// function drawHeatmap()
// {
//     const heatmapDiv = document.getElementById("heatmap")
//     const heatmapTable = []
//     for(const d in heatmap)
//     {
//         heatmapTable.push([new Date(d),heatmap[d]]);
//     }    

//     heatmapData = new 


// }

function drawContestStatsTable(){
    let contest_stats_div = document.getElementById("contest-stats")
    // to remove dnone when need


    const usernameTh = document.getElementById("usernameth")
    usernameTh.innerHTML =`${username}`
    contest_stats_div.style.display = "flex"

    console.log("contest_stats_div",contest_stats_div)
    console.log("class list of contest stats",contest_stats_div.classList)
    // contest_stats_div.classList.remove("d-none")

    let contest_stats_tbody = document.getElementById("contest-stats-table-body")
    let total_attempts=0;
    for(let q in attempts)
    {
        total_attempts+=attempts[q];
    }


    let probwithonesubmission=0;
    avg_attempts=(total_attempts/tried.size)
    let all_solved_count=0;
    for( let q in problem_solved_count)
    {
        if(problem_solved_count[q]>0 &&attempts[q]===1)
        {
            probwithonesubmission+=1;
        }
        all_solved_count+=problem_solved_count[q];
    }
    let percentageofonesubmission = probwithonesubmission/all_solved_count;
    percentageofonesubmission=percentageofonesubmission*100;

//  another way to iterate over object const a = Object.values(problem_solved_count).reduce(currentsum,value)
// const ans = Object.values(problem_solved_count).reduce((currentsum,vale)=>(currentsum+=value))

    contest_stats_tbody.innerHTML = `
    
    <tr>
        <td>Tried</td>
        <td class="value-td">${tried.size}</td>
       
    </tr>

    <tr>
        <td>Solved</td>
        <td class="value-td">${solved.size}</td>
       
    </tr>

    <tr>
        <td>Avg Attempts</td>
        <td class="value-td">${avg_attempts.toFixed(2)}</td>
       
    </tr>

    <tr>
        <td>Max Attempts</td>
        <td class="value-td">${max_attempt} (${max_attempted_prob})</td>
       
    </tr>

    <tr>
        <td>Solved with one submission</td>
        <td class="value-td">${probwithonesubmission} (${percentageofonesubmission.toFixed(2)}%)</td>
       
    </tr>

    <tr>
        <td>Max AC</td>
        <td class="value-td">${max_ac}-${max_ac_name}</td>
    
    </tr>

    `
}





// function drawtagchart(){
//     const tagdiv = document.getElementById("tag-chart")

//     const tagdata = [["tag","count"]]
//     for(let t in tags)
//     {
//         tagdata.push([t,tags[t]]);
//     }
//     console.log("tag data array",tagdata)

//     tags = new google.visualization.arrayToDataTable(tagdata)


//     const tagchartoptions = {
//         height:500,
//         width:300,
//         title: `tags of ${username}`,
//         pieSliceText: "label",
//         fontName:"monospace",
//         backgroundColor: "white",
//         pieHole:0.4,
//         is3D: true
//     }

//     // const langChart = new google.visualization.PieChart(tagdiv);
//     // langChart.draw(tags, tagchartoptions);


//     const langChart = new google.visualization.PieChart(tagdiv);
//     langChart.draw(tags,tagchartoptions);
// }



function drawratingschart(){
    const ratingdiv = document.getElementById("Rating-chart")

    const ratingTable = []
    for(let rt in ratings){
        ratingTable.push([rt,ratings[rt]])
    }
    ratings= new google.visualization.DataTable();
    ratings.addColumn("string","Rating");
    ratings.addColumn("number", "Solved");
    ratings.addRows(ratingTable);

    const ratingChartOptions = {
        width: ratingdiv.getBoundingClientRect().width,
        height: 300,
        title: `problem rating os ${username}`,
        fontName: "monospace"
    };
    const ratingChart = new google.visualization.ColumnChart(ratingdiv);
    ratingChart.draw(ratings,ratingChartOptions);
}

function drawLanguageChart()
{
    const langDiv = document.getElementById("language-chart")
    const langData = [["Language","Count"]]

    for(let lang in language)
    {
        langData.push([lang,language[lang]])
    }

    console.log("Lang Data array",langData)

    language = new google.visualization.arrayToDataTable(langData);
    const languagechartoptions = {
        height:300,
        // width :300,
        title: `languages of ${username}`,
        pieSliceText: "label",
        fontName:"monospace",
        backgroundColor: "white",
        is3D: true
    }

    const langChart = new google.visualization.PieChart(langDiv);
    langChart.draw(language,languagechartoptions);

}



function drawVerdictChart() {
    const verdictDiv = document.getElementById("verdict-chart");

    var verTable = [ ["Verdict", "Count"] ];
    var verSliceColors = [];
    // beautiful names for the verdicts + colors
    
    //iterating verdicts
    for (var ver in verdict) {
        console.log(ver);
    if (ver == "OK") {
    verTable.push(["AC", verdict[ver]]);
    verSliceColors.push({ color: "#FFC3A0" });
    } else if (ver == "WRONG_ANSWER") {
    verTable.push(["WA", verdict[ver]]);
    verSliceColors.push({ color: "#FF677D" });
    } else if (ver == "TIME_LIMIT_EXCEEDED") {
    verTable.push(["TLE", verdict[ver]]);
    verSliceColors.push({ color: "#D4A5A5" });
    } else if (ver == "MEMORY_LIMIT_EXCEEDED") {
    verTable.push(["MLE", verdict[ver]]);
    verSliceColors.push({ color: "#392F5A" });
    } else if (ver == "RUNTIME_ERROR") {
    verTable.push(["RTE", verdict[ver]]);
    verSliceColors.push({ color: "#31A2AC" });
    } else if (ver == "COMPILATION_ERROR") {
    verTable.push(["CPE", verdict[ver]]);
    verSliceColors.push({ color: "#61C0BF" });
    } else if (ver == "SKIPPED") {
    verTable.push(["SKIPPED", verdict[ver]]);
    verSliceColors.push({ color: "#6B4226" });
    } else if (ver == "CLALLENGED") {
    verTable.push(["CLALLENGED", verdict[ver]]);
    verSliceColors.push({ color: "#D9BF77" });
    } else {
    verTable.push([ver, verdict[ver]]);
    verSliceColors.push({});
    }
    }

    // customisation of chart 
    verdict = new google.visualization.arrayToDataTable(verTable);
    var verOptions = {
    height: 300,
    // width: 300,
    title: "Verdict of " + username,
    legend: "none",
    pieSliceText: "label",
    slices: verSliceColors,
    fontName: "Menlo",
    backgroundColor: "white",
    titleTextStyle: { color: "#212529", fontSize: "16" },
    legend: {
        textStyle: {
        color: "#212529",
    },
    },
    is3D: true,
    };
    
    
    var verChart = new google.visualization.PieChart(verdictDiv);
    verChart.draw(verdict, verOptions);
}
