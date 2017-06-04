/*
HighCharts synchronized charts
*/

$(function () {
	
	var activity = {
		"xData": [2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018],
    "datasets": [
	{
        "name": "Ticket Revenue (Millions)",
        "data": [3.8,4.5,7.5,8.2,9,16.3,13.8,15.3,21.7,25,47.3,67.2,78.3,84.2,94.2,112.2,131.8],
        "unit": "m",
		"pref": "$",
        "type": "area",
        "valueDecimals": 1,
		"yint": 30,
		"notes": ["Second day added","First year on-site camping","First sellout crowd","Last Coachella to occur in May","Daft Punk plays","Third day added","Did not sell out for the first time since 2003","Festival moved back a week","No more single day tickets","Multiple infrastructure upgrades","Second weekend added","Highest grossing music festival in the world","Daft Punk returns","GA sells out in less than 20 mins","Expansion approved for 2017 (25k per day)","Rough Estimate","Projected"]
    }, {
        "name": "Average Ticket Price (Daily)",
        "data": [70,75,75,75,75,87.3357765918687,90.9894109424657,100.213536695388,96.46,111.083102222222,99.5452067825432,116.333333333333,135.233160621762,141.750841750842,158.585858585859,170,183],
        "unit": "",
		"pref": "$",
        "type": "area",
        "valueDecimals": 0,
		"yint" : 50,
		"notes": ["Second day added","First year on-site camping","First sellout crowd","Last Coachella to occur in May","Daft Punk plays","Third day added","Did not sell out for the first time since 2003","Festival moved back a week","No more single day tickets","Multiple infrastructure upgrades","Second weekend added","Highest grossing music festival in the world","Daft Punk returns","GA sells out in less than 20 mins","Expansion approved for 2017 (25k per day)","Rough Estimate","Projected"]
    },
	{
        "name": "Total Admissions (All Days)",
        "data": [55000,60000,100000,110000,120000,186636,151666,152962,225000,225000,475161,577650.429799427,579000,594000,594000,660000,720000],
        "unit": "people",
		"pref": "",
        "type": "area",
        "valueDecimals": 0,
		"yint": 250000,
		"notes": ["Second day added","First year on-site camping","First sellout crowd","Last Coachella to occur in May","Daft Punk plays","Third day added","Did not sell out for the first time since 2003","Festival moved back a week","No more single day tickets","Multiple infrastructure upgrades","Second weekend added","Highest grossing music festival in the world","Daft Punk returns","GA sells out in less than 20 mins","Expansion approved for 2017 (25k per day)","Rough Estimate","Projected"]
    }]
};

/**
 * In order to synchronize tooltips and crosshairs, override the
 * built-in events with handlers defined on the parent element.
 */
$('#container').bind('mousemove touchmove touchstart', function (e) {
    var chart,
        point,
        i,
        event;

    for (i = 0; i < Highcharts.charts.length; i = i + 1) {
        chart = Highcharts.charts[i];
        event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
        point = chart.series[0].searchPoint(event, true); // Get the hovered point

        if (point) {
            point.highlight(e);
        }
    }
});
/**
 * Override the reset function, we don't need to hide the tooltips and crosshairs.
 */
Highcharts.Pointer.prototype.reset = function () {
    return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function (event) {
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
    var thisChart = this.chart;

    if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.each(Highcharts.charts, function (chart) {
            if (chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) { // It is null while updating
                    chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
                }
            }
        });
    }
}

// Get the data. The contents of the data file can be viewed at
// https://github.com/highcharts/highcharts/blob/master/samples/data/activity.json
//    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=activity.json&callback=?', 
//function (activity) {
    $.each(activity.datasets, function (i, dataset) {

        // Add X values
        dataset.data = Highcharts.map(dataset.data, function (val, j) {
            return [activity.xData[j], val];
        });

        $('<div class="chart">')
            .appendTo('#container')
            .highcharts({
                chart: {
                    marginLeft: 70, // Keep all charts left aligned
                    spacingTop: 20,
                    spacingBottom: 20
                },
                title: {
                    text: dataset.name,
                    align: 'left',
                    margin: 0,
                    x: 30
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    crosshair: true,
                    events: {
                        setExtremes: syncExtremes
                    },
                    labels: {
                        format: '{value}'
                    },
					tickInterval: 1
                },
                yAxis: {
                    title: {
                        text: null
                    },
					tickInterval: dataset.yint
                },
                tooltip: {
/*                     positioner: function () {
                        return {
                            x: this.chart.chartWidth - this.label.width, // right aligned
                            y: 10 // align to title
                        };
                    }, */
                    borderWidth: 0,
                    backgroundColor: 'white',
                    pointFormat: '{point.y}',
					headerFormat: '',
                    shadow: true,
                    style: {
                        fontSize: '18px'
                    },
                    valueDecimals: dataset.valueDecimals
					/* formatter: function() {
						return 'The value for <b>' + this.x + '</b> is <b>' + this.y + '</b>, in series '+ this.point.name;
					} */
                },
                series: [{
                    data: dataset.data,
                    name: dataset.name,
                    type: dataset.type,
                    color: Highcharts.getOptions().colors[i],
                    fillOpacity: 0.3,
					tooltip: {
					 valuePrefix: dataset.pref,
					 valueSuffix: ' ' + dataset.unit
					}


					
                    
                }]
            });
    });
//});
});