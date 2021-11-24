$('document').ready(function () {
    let grid = undefined;
    grid = new gridjs.Grid({
        columns: [
            {
                id: "id",
                name: "id",
                hidden: true
            },
            {
                id: "title",
                name: "Title"
            }, {
                id: "hostname",
                name: "Host Name"
            },
            {
                id: "host_ip",
                name: "Host IP"
            },
            {
                id: "dest_address",
                name: "Destination IP"
            }, {
                id: "fqdn",
                name: "Target Domain"
            },
            {
                id: "pool_name",
                name: "Pool"
            }, {
                id: "crypto_url",
                name: "Crypto URL"
            }, {
                id: "port_number",
                name: "Port"
            }, {
                id: "crypto_name",
                name: "Crypto"
            }, {
                id: "abbreviation",
                name: "Abbreviation"
            }, {
                id: "protocol",
                name: "Protocol"
            }, {
                id: "datetime",
                name: "Detected At"
            }],
        server: {
            url: '/ui/alerts?sort=' + encodeURIComponent(JSON.stringify({ "datetime": "desc" })),
            then: out => {
                return out.data.map(row => {
                    return [
                        row["id"],
                        gridjs.html(`<a href="javascript:void(0);">${row["title"]}</a>`),
                        row["hostname"],
                        row["host_ip"],
                        row["dest_address"],
                        row["fqdn"],
                        row["pool_name"],
                        row["crypto_url"],
                        row["port_number"],
                        row["crypto_name"],
                        row["abbreviation"],
                        row["protocol"],
                        row["datetime"]];
                });
            },
            total: (data) => data.total
        },
        search: true,
        sort: true,
        resizable: true,
        fixedHeader: true,
        height: "350px",
        pagination: {
            enabled: true,
            limit: 10,
            summary: true
        },
        style: {
            footer: {
                "border-radius": "0 0 0 0"
            },
            container: {
                "border-radius": "0 0 0 0"
            },
            th: {
                "background-color": "#0064a2",
                "color": "#fff",
            },
            td: {
                "border-right": "none",
                "border-left": "none"
            },
            table: {
                width: "100%"
            }
        }
    }).render($("#grid")[0]);
    function insertButtonToTableHeader() {
        // create a button-wrapper
        const button_wrapper = document.createElement('div');

        // Insert buttons to button-wrapper
        function insertButtonToButtonWrapper(buttonName) {
            let button = document.createElement('a');
            button.innerText = buttonName;
            button.className = 'btn btn-primary btn-refresh';
            button_wrapper.appendChild(button);
            button.onclick = callRefresh;
        }
        insertButtonToButtonWrapper('Refresh');

        // add button-wrapper to table header
        const grid_js_head = document.querySelector('.gridjs-head');
        const gridjs_search = document.querySelector('.gridjs-search');
        grid_js_head.insertBefore(button_wrapper, gridjs_search);
    }
    function callRefresh() {
        grid.forceRender();
        insertButtonToTableHeader();
    }
    insertButtonToTableHeader();


    /**
     * Spark and Number of detection per day chart
     */
    let series_spark = [], labels_spark = [];
    $.getJSON("/ui/getalertsperday", function (data) {
        if (data) {
            data.forEach(element => {
                series_spark.push(element["count(*)"]);
                labels_spark.push(element["date(datetime)"]);
            });
        } else {
            $("line-detection-metrics").html("Failed to load due to server error");
        }
        let total = series_spark.reduce((prev, curr) => prev + curr);
        let spark1 = {
            chart: {
                id: 'sparkline1',
                group: 'sparklines',
                type: 'area',
                height: 210,
                sparkline: {
                    enabled: true
                },
            },
            stroke: {
                curve: 'smooth'
            },
            fill: {
                opacity: 1,
            },
            series: [{
                name: 'Total Detection/Day',
                data: series_spark
            }],
            labels: labels_spark,
            yaxis: {
                min: 0
            },
            xaxis: {
                type: 'datetime',
            },
            colors: ['#0064a2'],
            title: {
                text: `${total}`,
                offsetX: 30,
                style: {
                    "font-family": "Titillium Web, Arial, Helvetica, sans-serif",
                    fontSize: '24px',
                    cssClass: 'apexcharts-yaxis-title',
                    color: "#000"
                }
            },
            subtitle: {
                text: 'Total Detection in last 30 days',
                offsetX: 30,
                style: {
                    "font-family": "Titillium Web, Arial, Helvetica, sans-serif",
                    fontSize: '16px',
                    cssClass: 'apexcharts-yaxis-title',
                    color: "#000"
                }
            }
        }
        new ApexCharts(document.querySelector("#line-detection-metrics"), spark1).render();
    }).fail(() => {
        $("line-detection-metrics").html("Failed to load due to server error");
    });

    /**
     * Pie Chart Matched vs Non Matched
     */
    $.getJSON("/ui/matchedvsnot", function (data) {
        if (!data) {
            $("line-detection-metrics").html("Failed to load due to server error");
        }
        var pie = {
            series: [data.matched, data.not_matched],
            chart: {
                width: 375,
                type: 'pie',
                offsetX: 50
            },
            legend: {
                position: 'left',
                fontSize: '14px',
                color: "#000"
            },
            colors: ['rgb(85, 197, 255)', '#0064a2'],
            labels: ['Matched', 'Not Matched'],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 375
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };
        new ApexCharts(document.querySelector("#pie-chart-matched"), pie).render();
    }).fail(() => {
        $("line-detection-metrics").html("Failed to load due to server error");
    });
});