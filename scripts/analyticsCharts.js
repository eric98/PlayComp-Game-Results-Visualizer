var sessionIdInput;
var spiderChart;
var barChart;


async function getJsonFromUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        return json;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function visualizeData() {
    
    sessionIdInput = document.getElementById('myInput').value;

    getJsonFromUrl("https://playcompprototype-default-rtdb.europe-west1.firebasedatabase.app/sessions/.json").then(data => {
        handleData(data);
    });
}

// Function to create the spider chart
async function createSpiderChart(df, sessionId, groupAverage) {
    // Filter session specific data
    let sessionSpecificData = df.filter(item => item.sessionId === sessionId);

    // Calculate scenePuntuationPercentage
    sessionSpecificData = sessionSpecificData.map(data => {
        data.scenePuntuationPercentage = data.scenePuntuation / data.maxScenePuntuation * 100;
        return data;
    });

    // Group by 'actualChapter' and calculate mean of 'scenePuntuationPercentage'
    let chapterGroupedSession = groupBy(sessionSpecificData, 'actualChapter', 'scenePuntuationPercentage');

    renameIndicatorProperties(chapterGroupedSession);

    // Prepare data for the chart
    let labels = Object.keys(chapterGroupedSession);
    let statsSession = calculateMeanOfObjectArrays(Object.values(chapterGroupedSession));
    let statsAll = Object.values(groupAverage); // Assuming groupAverage is already an array

    if (spiderChart) {
        spiderChart.destroy();
    }

    // Create spider chart using Chart.js
    var ctx = document.getElementById('spiderChart').getContext('2d');
    spiderChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sesión ' + sessionId,
                data: statsSession,
                backgroundColor: 'rgba(0, 0, 255, 0.5)',
                borderColor: 'blue',
                borderWidth: 2
            }, {
                label: 'Promedio Grupal',
                data: statsAll,
                backgroundColor: 'rgba(0, 255, 0, 0.5)',
                borderColor: 'green',
                borderWidth: 2,
                borderDash: [5, 5]
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Nivel de Indicadores para SessionId: ' + sessionId,
                },
            }
        }
    });
}

// Function to create the bar chart
function createBarChart(df, sessionId, groupAverage) {
    
    // Filter session specific data
    let sessionSpecificData = df.filter(item => item.sessionId === sessionId);

    // Calculate session duration per chapter
    let labels = Object.keys(groupAverage);

    // Calculate average duration per chapter
    let averageDurationPerChapter = groupBy(sessionSpecificData, 'actualChapter', 'sesionDurationInSec');

    renameIndicatorProperties(averageDurationPerChapter);

    let statsAll = calculateMeanOfObjectArrays(averageDurationPerChapter);

    if (barChart) {
        barChart.destroy();
    }

    // Create chart
    let ctx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Promedio Grupal',
                data: groupAverage,
                backgroundColor: 'rgba(8, 165, 168, 0.2)',
                borderColor: 'rgba(8, 165, 168, 1)',
                borderWidth: 1
            }, {
                label: 'Promedio ' + sessionId,
                data: statsAll,
                backgroundColor: 'rgba(255, 132, 31, 0.2)',
                borderColor: 'rgba(255, 132, 31, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    title: { // The title for the y-axis
                        display: true, // Whether to display the title
                        text: 'Duración Promedio (segundos)', // The text of the title
                        color: 'black', // The color of the title
                    }
                },
                x: {
                    title: { // The title for the x-axis
                        display: true, // Whether to display the title
                        text: 'Indicadores', // The text of the title
                        color: 'black', // The color of the title
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Tiempo Dedicado a Cada Indicador'
                }
            }
        }
    });
}

function loadAndTransformJson(jsonData) {

    // Create an array to store session data
    let dataRows = [];
    for (let sessionKey in jsonData) {
        let sessionInfo = jsonData[sessionKey];
        dataRows.push(sessionInfo);
    }


    // Convert data types
    let numericCols = ['maxScenePuntuation', 'scenePuntuation', 'sesionDurationInSec'];
    dataRows = dataRows.map(row => {
        numericCols.forEach(col => {
            row[col] = parseFloat(row[col]);
        });
        return row;
    });

    return dataRows;
}

async function handleData(data) {
    // Load and transform JSON data into an array
    let df = loadAndTransformJson(data);

    // Calculate group averages
    let groupAverageScene = groupCalculateMeanAndSort(df, 'actualChapter', 'scenePuntuation');
    let groupAverageDuration = groupCalculateMeanAndSort(df, 'actualChapter', 'sesionDurationInSec');

    // Check if session ID is in data
    if (df.some(item => item.sessionId === sessionIdInput)) {

        // Shows spinner
        var spinner = document.getElementById('spinner');
        spinner.style.animation = "spin 2s linear infinite, fadeOut 0.5s linear forwards";

        // Run analysis functions for the input session ID
        createSpiderChart(df, sessionIdInput, groupAverageScene);
        createBarChart(df, sessionIdInput, groupAverageDuration);
    } else {
        alert("Session ID not found. Please check the ID and try again.");
        console.log("Session ID not found. Please check the ID and try again.");
    }
}