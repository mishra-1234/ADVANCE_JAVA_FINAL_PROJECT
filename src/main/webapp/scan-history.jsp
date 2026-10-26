<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.*" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Scan History - CyberShield</title>
    <link rel="stylesheet" href="dashboard.css">
    <style>
        .history-container { max-width: 1200px; margin: 30px auto; padding: 20px; color: #f8fafc; }
        .history-header { display: flex; justify-content: space-between; align-items: center; background: #1e293b; padding: 20px; border-radius: 10px; border: 1px solid #334155; margin-bottom: 20px; }

        /* Summary Cards */
        .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
        .summary-card { background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155; text-align: center; }
        .summary-card h3 { font-size: 22px; margin: 5px 0 0 0; color: #3b82f6; }

        /* Filters Bar */
        .filters-bar { display: flex; gap: 10px; background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155; margin-bottom: 20px; flex-wrap: wrap; }
        .filters-bar input, .filters-bar select { background: #0f172a; border: 1px solid #334155; color: #fff; padding: 8px 12px; border-radius: 6px; font-size: 14px; }
        .filters-bar input { flex: 1; min-width: 200px; }

        /* Table Design */
        .table-box { background: #1e293b; border-radius: 10px; border: 1px solid #334155; overflow: hidden; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th, td { padding: 12px 15px; border-bottom: 1px solid #334155; font-size: 14px; }
        th { color: #94a3b8; background: #151c2c; }

        /* Badges */
        .badge { padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; display: inline-block; }
        .badge-safe { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .badge-suspicious { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
        .badge-malicious { background: rgba(220, 38, 38, 0.2); color: #dc2626; }

        /* Truncate long URLs */
        .url-text { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; vertical-align: middle; }

        /* Buttons & Actions */
        .action-btn { background: #2563eb; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600; text-decoration: none; margin-right: 5px; }
        .action-btn:hover { background: #1d4ed8; }
        .btn-danger { background: #dc2626; }
        .btn-danger:hover { background: #b91c1c; }

        /* Pagination */
        .pagination { display: flex; justify-content: center; gap: 5px; margin-top: 20px; }
        .page-btn { background: #1e293b; color: #fff; border: 1px solid #334155; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
        .page-btn.active { background: #2563eb; border-color: #2563eb; }
    </style>
</head>
<body style="background-color: #0f172a;">

<div class="history-container">
    <!-- Header -->
    <div class="history-header">
        <h2 style="margin:0;">Scan History</h2>
        <div>
            <button class="action-btn" onclick="exportCSV()">Export CSV</button>
            <button class="action-btn btn-danger" onclick="clearAllHistory()">Clear All</button>
        </div>
    </div>

    <!-- 1. Summary Cards -->
    <div class="summary-grid">
        <div class="summary-card">
            <span style="color: #94a3b8; font-size: 13px;">Total Scans</span>
            <h3>45</h3>
        </div>
        <div class="summary-card">
            <span style="color: #94a3b8; font-size: 13px;">Safe</span>
            <h3 style="color: #10b981;">30</h3>
        </div>
        <div class="summary-card">
            <span style="color: #94a3b8; font-size: 13px;">Suspicious</span>
            <h3 style="color: #f59e0b;">8</h3>
        </div>
        <div class="summary-card">
            <span style="color: #94a3b8; font-size: 13px;">Malicious</span>
            <h3 style="color: #dc2626;">7</h3>
        </div>
    </div>

    <!-- 2. Search aur Filters -->
    <div class="filters-bar">
        <input type="text" id="searchInput" placeholder="Search URL..." onkeyup="filterTable()">
        <select id="resultFilter" onchange="filterTable()">
            <option value="">Result: All</option>
            <option value="Safe">Safe</option>
            <option value="Suspicious">Suspicious</option>
            <option value="Malicious">Malicious</option>
        </select>
        <select id="typeFilter" onchange="filterTable()">
            <option value="">Type: All</option>
            <option value="URL Scan">URL Scan</option>
            <option value="Phishing Check">Phishing Check</option>
        </select>
        <select id="dateFilter">
            <option value="">Date: All Time</option>
            <option value="today">Today</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
        </select>
    </div>

    <!-- 3. History Table -->
    <div class="table-box">
        <table id="historyTable">
            <thead>
            <tr>
                <th>#</th>
                <th>URL / Input</th>
                <th>Scan Type</th>
                <th>Result</th>
                <th>Risk Score</th>
                <th>Scanned On</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>1</td>
                <td><span class="url-text" title="http://free-gift.xyz/claim-prize-now">http://free-gift.xyz/claim-prize-now</span></td>
                <td>URL Scan</td>
                <td><span class="badge badge-malicious">Malicious</span></td>
                <td>92%</td>
                <td>26-10-2026 15:10</td>
                <td>
                    <button class="action-btn" onclick="viewDetails('http://free-gift.xyz')">View</button>
                    <button class="action-btn btn-danger" onclick="deleteRow(this)">Delete</button>
                </td>
            </tr>
            <tr>
                <td>2</td>
                <td><span class="url-text" title="https://google.com">https://google.com</span></td>
                <td>URL Scan</td>
                <td><span class="badge badge-safe">Safe</span></td>
                <td>2%</td>
                <td>25-10-2025 11:42</td>
                <td>
                    <button class="action-btn" onclick="viewDetails('https://google.com')">View</button>
                    <button class="action-btn btn-danger" onclick="deleteRow(this)">Delete</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>

    <!-- 5. Pagination -->
    <div class="pagination">
        <button class="page-btn">&lt;</button>
        <button class="page-btn active">1</button>
        <button class="page-btn">2</button>
        <button class="page-btn">3</button>
        <button class="page-btn">&gt;</button>
    </div>
</div>

<script>
    // Simple Search / Filter Script
    function filterTable() {
        let input = document.getElementById("searchInput").value.toLowerCase();
        let resultFilter = document.getElementById("resultFilter").value.toLowerCase();
        let typeFilter = document.getElementById("typeFilter").value.toLowerCase();

        let table = document.getElementById("historyTable");
        let tr = table.getElementsByTagName("tr");

        for (let i = 1; i < tr.length; i++) {
            let urlTd = tr[i].getElementsByTagName("td")[1];
            let typeTd = tr[i].getElementsByTagName("td")[2];
            let resultTd = tr[i].getElementsByTagName("td")[3];

            if (urlTd && typeTd && resultTd) {
                let urlValue = urlTd.textContent || urlTd.innerText;
                let typeValue = typeTd.textContent || typeTd.innerText;
                let resultValue = resultTd.textContent || resultTd.innerText;

                let matchesSearch = urlValue.toLowerCase().indexOf(input) > -1;
                let matchesResult = resultFilter === "" || resultValue.toLowerCase().indexOf(resultFilter) > -1;
                let matchesType = typeFilter === "" || typeValue.toLowerCase().indexOf(typeFilter) > -1;

                if (matchesSearch && matchesResult && matchesType) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

    function deleteRow(btn) {
        if(confirm("Are you sure you want to delete this record?")) {
            let row = btn.closest("tr");
            row.remove();
        }
    }

    function clearAllHistory() {
        if(confirm("Are you sure you want to clear all scan history?")) {
            document.querySelector("#historyTable tbody").innerHTML = "";
            alert("History cleared successfully.");
        }
    }

    function exportCSV() {
        alert("CSV Exporting feature triggered. Downloading file...");
    }

    function viewDetails(url) {
        alert("Viewing full report and details for: " + url);
    }
</script>

</body>
</html>