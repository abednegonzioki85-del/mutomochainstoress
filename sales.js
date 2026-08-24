// ===== SALES DASHBOARD JAVASCRIPT =====
(function() {
    "use strict";

    // ===== CHECK SESSION =====
    const user = sessionStorage.getItem('currentUser');
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const data = JSON.parse(user);
        if (data.role !== 'Sales') {
            window.location.href = 'dashboard-admin.html';
            return;
        }
        document.getElementById('salesName').textContent = data.name || 'Brian';
        document.querySelector('.avatar').textContent = (data.name || 'B')[0];
    } catch(e) {
        window.location.href = 'index.html';
        return;
    }

    // ===== LOGOUT - CLEAR SESSION =====
    document.getElementById('salesLogout').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('🚪 Are you sure you want to logout?')) {
            sessionStorage.removeItem('currentUser');
            localStorage.removeItem('mutomo_remember_username');
            window.location.href = 'index.html';
        }
    });

    // ===== DATA =====
    const products = ['Laptop', 'Phone', 'Tablet', 'Headphones', 'Charger', 'Smartwatch'];
    let sales = [];
    let activity = [];

    // Populate products
    const select = document.getElementById('productSelect');
    products.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = p;
        select.appendChild(opt);
    });

    // ===== FUNCTIONS =====
    function updateStats() {
        let count = 0, qty = 0, returns = 0, revenue = 0;
        sales.forEach(row => {
            count++;
            qty += parseInt(row.qty) || 0;
            returns += parseInt(row.ret) || 0;
            revenue += parseFloat(row.total) || 0;
        });
        document.getElementById('statSales').textContent = count;
        document.getElementById('statQty').textContent = qty;
        document.getElementById('statReturns').textContent = returns;
        document.getElementById('statRevenue').textContent = 'KSh ' + revenue.toFixed(2);
    }

    function renderTable() {
        const body = document.getElementById('salesBody');
        if (sales.length === 0) {
            body.innerHTML = '<div class="empty-row"><i class="fas fa-box-open"></i> No sales records yet</div>';
            return;
        }
        body.innerHTML = sales.map((row, i) => `
            <div class="table-row">
                <span>#${i+1}</span>
                <span class="product">${row.product}</span>
                <span>${row.qty}</span>
                <span>${row.ret}</span>
                <span>KSh ${parseFloat(row.total).toFixed(2)}</span>
                <span>
                    <button class="action-btn" onclick="editSale(${i})"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deleteSale(${i})"><i class="fas fa-trash"></i></button>
                </span>
            </div>
        `).join('');
        updateStats();
    }

    function addLog(msg) {
        const time = new Date().toLocaleTimeString();
        activity.unshift({ msg, time });
        const container = document.getElementById('activityLog');
        if (activity.length === 0) {
            container.innerHTML = '<div class="log-item" style="justify-content:center;color:rgba(255,255,255,0.1);">No activity yet</div>';
            return;
        }
        container.innerHTML = activity.slice(0, 10).map(log => `
            <div class="log-item">
                <span>${log.msg}</span>
                <span class="time">${log.time}</span>
            </div>
        `).join('');
    }

    // ===== ADD SALE =====
    document.getElementById('addSaleBtn').addEventListener('click', function() {
        const person = document.getElementById('salesPerson').value || 'Brian';
        const route = document.getElementById('route').value || 'CBD';
        const date = document.getElementById('date').value || '2026-08-24';
        const product = document.getElementById('productSelect').value;
        const qty = parseInt(document.getElementById('quantity').value) || 0;
        const ret = parseInt(document.getElementById('returnSold').value) || 0;
        const price = Math.random() * 500 + 100;
        const total = qty * price;

        if (qty <= 0) {
            alert('⚠️ Quantity must be greater than 0');
            return;
        }

        sales.push({ person, route, date, product, qty, ret, total });
        renderTable();
        addLog(`📦 Added ${qty} × ${product} (KSh ${total.toFixed(2)})`);
    });

    // ===== EDIT =====
    window.editSale = function(index) {
        const row = sales[index];
        document.getElementById('productSelect').value = row.product;
        document.getElementById('quantity').value = row.qty;
        document.getElementById('returnSold').value = row.ret;
        sales.splice(index, 1);
        renderTable();
        addLog(`✏️ Editing ${row.product}`);
    };

    // ===== DELETE =====
    window.deleteSale = function(index) {
        if (confirm('🗑️ Delete this record?')) {
            const row = sales[index];
            sales.splice(index, 1);
            renderTable();
            addLog(`🗑️ Deleted ${row.product}`);
        }
    };

    // ===== SAMPLE DATA =====
    function loadSample() {
        const sample = ['Laptop', 'Phone', 'Tablet', 'Headphones'];
        for (let i = 0; i < 4; i++) {
            const p = sample[i];
            const qty = Math.floor(Math.random() * 15) + 1;
            const price = Math.random() * 400 + 100;
            sales.push({
                person: 'Brian',
                route: 'CBD',
                date: '2026-08-24',
                product: p,
                qty: qty,
                ret: Math.floor(Math.random() * 2),
                total: qty * price
            });
        }
        renderTable();
        addLog('📊 Sample data loaded');
    }

    // Load sample on start
    loadSample();

    console.log('💼 Sales Dashboard loaded');
})();
