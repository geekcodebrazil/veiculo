document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentYearSpan = document.getElementById('current-year');

    // Quick Access Fueling
    const quickAccessFuelingSection = document.getElementById('quick-access-fueling');
    const quickAddFuelForm = document.getElementById('quick-add-fuel-form');
    const quickFuelVehicleSelect = document.getElementById('quick-fuel-vehicle-select');
    const quickFuelKmInput = document.getElementById('quick-fuel-km');
    const quickFuelLitersInput = document.getElementById('quick-fuel-liters');
    const quickFuelValueInput = document.getElementById('quick-fuel-value');
    const quickFuelTypeInput = document.getElementById('quick-fuel-type');
    const lastConsumptionDisplay = document.getElementById('last-consumption-display');
    const lastConsumptionDetails = document.getElementById('last-consumption-details');


    // Vehicle Management
    const vehicleManagementSection = document.getElementById('vehicle-management');
    const addVehicleForm = document.getElementById('add-vehicle-form');
    const vehicleTypeInput = document.getElementById('vehicle-type');
    const vehicleMakeInput = document.getElementById('vehicle-make');
    const vehicleModelInput = document.getElementById('vehicle-model');
    const vehicleYearInput = document.getElementById('vehicle-year');
    const vehiclePlateInput = document.getElementById('vehicle-plate');
    const vehicleKmInput = document.getElementById('vehicle-km');
    const vehicleList = document.getElementById('vehicle-list');
    const vehicleListItemTemplate = document.getElementById('vehicle-list-item-template');

    // Vehicle Details
    const vehicleDetailsSection = document.getElementById('vehicle-details');
    const backToVehiclesButton = document.getElementById('back-to-vehicles');
    const selectedVehicleInfo = document.getElementById('selected-vehicle-info');
    const maintenanceAlertsList = document.getElementById('maintenance-alerts-list');
    const maintenanceNav = document.querySelector('.maintenance-nav');
    const maintenanceSections = document.querySelectorAll('.maintenance-section');

    // Fuel Log
    const addFuelForm = document.getElementById('add-fuel-form');
    const fuelDateInput = document.getElementById('fuel-date');
    const fuelKmInput = document.getElementById('fuel-km');
    const fuelTypeInput = document.getElementById('fuel-type');
    const fuelLitersInput = document.getElementById('fuel-liters');
    const fuelValueInput = document.getElementById('fuel-value');
    const fuelStationInput = document.getElementById('fuel-station');
    const fuelNotesInput = document.getElementById('fuel-notes');
    const fuelLogHistoryTableBody = document.getElementById('fuel-log-history');
    const fuelLogRowTemplate = document.getElementById('fuel-log-row-template');

    // Tire Log
    const addTireForm = document.getElementById('add-tire-form');
    const tireDateInput = document.getElementById('tire-date');
    const tireKmInput = document.getElementById('tire-km');
    const tireFrontPsiInput = document.getElementById('tire-front-psi');
    const tireRearPsiInput = document.getElementById('tire-rear-psi');
    const tireNotesInput = document.getElementById('tire-notes');
    const tireLogHistoryTableBody = document.getElementById('tire-log-history');
    const tireLogRowTemplate = document.getElementById('tire-log-row-template');

    // Oil Log
    const addOilForm = document.getElementById('add-oil-form');
    const oilDateInput = document.getElementById('oil-date');
    const oilKmInput = document.getElementById('oil-km');
    const oilTypeInput = document.getElementById('oil-type');
    const oilFilterInput = document.getElementById('oil-filter');
    const oilNextKmInput = document.getElementById('oil-next-km');
    const oilNextDateInput = document.getElementById('oil-next-date');
    const oilNotesInput = document.getElementById('oil-notes');
    const oilLogHistoryTableBody = document.getElementById('oil-log-history');
    const oilLogRowTemplate = document.getElementById('oil-log-row-template');

    // Revision Log
    const addRevisionForm = document.getElementById('add-revision-form');
    const revisionDateInput = document.getElementById('revision-date');
    const revisionKmInput = document.getElementById('revision-km');
    const revisionItemsInput = document.getElementById('revision-items');
    const revisionNextKmInput = document.getElementById('revision-next-km');
    const revisionNextDateInput = document.getElementById('revision-next-date');
    const revisionNotesInput = document.getElementById('revision-notes');
    const revisionLogHistoryTableBody = document.getElementById('revision-log-history');
    const revisionLogRowTemplate = document.getElementById('revision-log-row-template');

    // Dashboard
    const avgConsumptionDisplay = document.getElementById('avg-consumption');
    const avgKmMonthDisplay = document.getElementById('avg-km-month');
    const monthlySpendingDisplay = document.getElementById('monthly-spending');
    const yearlySpendingDisplay = document.getElementById('yearly-spending');
    let fuelConsumptionChartInstance = null;
    let spendingDistributionChartInstance = null;


    // --- STATE VARIABLES ---
    let vehicles = [];
    let selectedVehicleId = null;
    const STORAGE_KEYS = {
        VEHICLES: 'controleVeicular.vehicles',
        THEME: 'controleVeicular.theme'
    };

    // --- INITIALIZATION ---
    function init() {
        loadTheme();
        loadVehicles();
        renderVehicleList();
        renderQuickAccessVehicleSelect();
        updateCurrentYear();
        setupEventListeners();
        // Set today's date as default for date inputs
        setDefaultDates();
    }

    function setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        [fuelDateInput, tireDateInput, oilDateInput, revisionDateInput].forEach(input => {
            if (input) input.value = today;
        });
    }

    // --- THEME MANAGEMENT ---
    function loadTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        if (savedTheme) {
            document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        }
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }

    // --- DATA PERSISTENCE (localStorage) ---
    function saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function loadData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    function saveVehicles() {
        saveData(STORAGE_KEYS.VEHICLES, vehicles);
    }

    function loadVehicles() {
        vehicles = loadData(STORAGE_KEYS.VEHICLES) || [];
        // Ensure logs are arrays
        vehicles.forEach(v => {
            v.fuelLogs = v.fuelLogs || [];
            v.tireLogs = v.tireLogs || [];
            v.oilLogs = v.oilLogs || [];
            v.revisionLogs = v.revisionLogs || [];
        });
    }

    // --- UTILITY FUNCTIONS ---
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    function formatDate(dateString) {
        if (!dateString) return '--';
        const date = new Date(dateString);
         // Add one day to compensate for timezone issues if date appears one day off
        date.setDate(date.getDate() + 1);
        return date.toLocaleDateString('pt-BR');
    }

    function formatNumber(num, decimals = 2) {
        return num ? parseFloat(num).toFixed(decimals) : '0.00';
    }

    function getVehicleById(vehicleId) {
        return vehicles.find(v => v.id === vehicleId);
    }

    function updateVehicleCurrentKM(vehicleId, newKM) {
        const vehicle = getVehicleById(vehicleId);
        if (vehicle && newKM > (vehicle.currentKM || 0) ) {
            vehicle.currentKM = parseFloat(newKM);
            saveVehicles(); // Salva a alteração
            if (selectedVehicleId === vehicleId) { // Atualiza a exibição se for o veículo selecionado
                updateSelectedVehicleHeader(vehicle);
                renderVehicleList(); // Re-renderiza a lista para mostrar o KM atualizado
            }
        }
    }

    // --- UI NAVIGATION AND DISPLAY ---
    function showVehicleManagementSection() {
        vehicleManagementSection.classList.remove('hidden');
        quickAccessFuelingSection.classList.remove('hidden');
        vehicleDetailsSection.classList.add('hidden');
        selectedVehicleId = null;
        resetAllForms();
        renderQuickAccessVehicleSelect(); // Atualiza o select caso um veículo tenha sido adicionado/removido
    }

    function showVehicleDetailsSection(vehicle) {
        selectedVehicleId = vehicle.id;
        vehicleManagementSection.classList.add('hidden');
        quickAccessFuelingSection.classList.add('hidden');
        vehicleDetailsSection.classList.remove('hidden');

        updateSelectedVehicleHeader(vehicle);
        renderAllLogsForSelectedVehicle();
        updateMaintenanceAlerts();
        updateDashboardData();

        // Ativar a primeira aba (Abastecimento) por padrão
        maintenanceNav.querySelector('button[data-section="log-fuel"]').click();
    }

    function updateSelectedVehicleHeader(vehicle) {
        selectedVehicleInfo.innerHTML = `<i class="fas fa-car"></i> ${vehicle.make} ${vehicle.model} (${vehicle.plate}) - KM Atual: ${vehicle.currentKM}`;
    }

    function switchMaintenanceTab(event) {
        const button = event.target.closest('button');
        if (!button || !button.dataset.section) return;

        maintenanceNav.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        maintenanceSections.forEach(section => section.classList.add('hidden'));
        const targetSectionId = button.dataset.section;
        document.getElementById(targetSectionId).classList.remove('active', 'hidden'); // Remove hidden and ensure active
        
        // Se a aba Dashboard for ativada, renderizar os gráficos
        if (targetSectionId === 'log-dashboard') {
            renderCharts();
        }
    }
    
    function updateCurrentYear() {
        if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
    }

    function resetForm(formElement) {
        if (formElement) {
            formElement.reset();
            setDefaultDates(); // Restaura datas padrão após reset
        }
    }
    function resetAllForms() {
        [addVehicleForm, quickAddFuelForm, addFuelForm, addTireForm, addOilForm, addRevisionForm].forEach(form => resetForm(form));
    }


    // --- QUICK ACCESS FUELING ---
    function renderQuickAccessVehicleSelect() {
        quickFuelVehicleSelect.innerHTML = '<option value="">Selecione um veículo</option>';
        if (vehicles.length === 0) {
            quickFuelVehicleSelect.disabled = true;
            return;
        }
        quickFuelVehicleSelect.disabled = false;
        vehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.id;
            option.textContent = `${vehicle.make} ${vehicle.model} (${vehicle.plate})`;
            quickFuelVehicleSelect.appendChild(option);
        });

        // Se houver apenas um veículo, seleciona-o automaticamente
        if (vehicles.length === 1) {
            quickFuelVehicleSelect.value = vehicles[0].id;
            updateQuickAccessConsumptionInfo(vehicles[0].id);
        } else {
             updateQuickAccessConsumptionInfo(null); // Limpa info se nenhum ou múltiplos
        }
    }

    function handleQuickAccessFuelSubmit(event) {
        event.preventDefault();
        const vehicleId = quickFuelVehicleSelect.value;
        if (!vehicleId) {
            alert('Por favor, selecione um veículo.');
            return;
        }
        const vehicle = getVehicleById(vehicleId);
        if (!vehicle) return;

        const newLog = {
            id: generateId(),
            date: new Date().toISOString().split('T')[0], // Usa data atual para simplicidade
            km: parseFloat(quickFuelKmInput.value),
            type: quickFuelTypeInput.value || 'Gasolina Comum',
            liters: parseFloat(quickFuelLitersInput.value),
            value: parseFloat(quickFuelValueInput.value),
            station: '',
            notes: 'Registro rápido'
        };

        addGenericLog(vehicleId, 'fuelLogs', newLog, renderFuelLogHistory);
        updateVehicleCurrentKM(vehicleId, newLog.km);
        updateQuickAccessConsumptionInfo(vehicleId);
        resetForm(quickAddFuelForm);
        // Manter o veículo selecionado no select
        quickFuelVehicleSelect.value = vehicleId;
    }

    function updateQuickAccessConsumptionInfo(vehicleId) {
        if (!vehicleId) {
            lastConsumptionDisplay.textContent = '-- KM/L';
            lastConsumptionDetails.textContent = '(Selecione um veículo)';
            return;
        }
        const vehicle = getVehicleById(vehicleId);
        if (!vehicle || !vehicle.fuelLogs || vehicle.fuelLogs.length === 0) {
            lastConsumptionDisplay.textContent = '-- KM/L';
            lastConsumptionDetails.textContent = '(Nenhum abastecimento registrado para este veículo)';
            return;
        }

        const sortedLogs = [...vehicle.fuelLogs].sort((a, b) => new Date(b.date) - new Date(a.date) || b.km - a.km);
        const lastLog = sortedLogs[0];

        if (sortedLogs.length > 1) {
            const previousLog = sortedLogs[1];
            const consumption = calculateConsumption(lastLog.km, previousLog.km, lastLog.liters);
            if (consumption) {
                lastConsumptionDisplay.textContent = `${formatNumber(consumption)} KM/L`;
                lastConsumptionDetails.textContent = `Baseado no abastecimento de ${formatDate(lastLog.date)} (${lastLog.liters}L)`;
                return;
            }
        }
        lastConsumptionDisplay.textContent = 'N/D';
        lastConsumptionDetails.textContent = '(Necessário mais um abastecimento para calcular)';

    }

    // --- VEHICLE MANAGEMENT ---
    function handleAddVehicle(event) {
        event.preventDefault();
        const newVehicle = {
            id: generateId(),
            type: vehicleTypeInput.value,
            make: vehicleMakeInput.value.trim(),
            model: vehicleModelInput.value.trim(),
            year: parseInt(vehicleYearInput.value),
            plate: vehiclePlateInput.value.trim().toUpperCase(),
            currentKM: parseFloat(vehicleKmInput.value),
            fuelLogs: [],
            tireLogs: [],
            oilLogs: [],
            revisionLogs: []
        };
        vehicles.push(newVehicle);
        saveVehicles();
        renderVehicleList();
        renderQuickAccessVehicleSelect();
        resetForm(addVehicleForm);
    }

    function renderVehicleList() {
        vehicleList.innerHTML = ''; // Clear existing list
        if (vehicles.length === 0) {
            const placeholder = document.createElement('li');
            placeholder.className = 'placeholder';
            placeholder.textContent = 'Nenhum veículo cadastrado.';
            vehicleList.appendChild(placeholder);
            return;
        }

        vehicles.forEach(vehicle => {
            const item = vehicleListItemTemplate.content.cloneNode(true);
            const li = item.querySelector('li');
            li.dataset.vehicleId = vehicle.id;

            item.querySelector('.vehicle-name-plate').textContent = `${vehicle.make} ${vehicle.model} (${vehicle.plate})`;
            item.querySelector('.vehicle-details-small').textContent = `${vehicle.type} - Ano ${vehicle.year} - ${vehicle.currentKM || 0} KM`;
            
            const viewBtn = item.querySelector('.view-details-btn');
            viewBtn.addEventListener('click', () => showVehicleDetailsSection(vehicle));

            const deleteBtn = item.querySelector('.delete-vehicle-btn');
            deleteBtn.addEventListener('click', () => deleteVehicle(vehicle.id));
            
            vehicleList.appendChild(item);
        });
    }

    function deleteVehicle(vehicleId) {
        if (confirm('Tem certeza que deseja excluir este veículo e todos os seus registros?')) {
            vehicles = vehicles.filter(v => v.id !== vehicleId);
            saveVehicles();
            renderVehicleList();
            renderQuickAccessVehicleSelect();
            if (selectedVehicleId === vehicleId) { // Se o veículo excluído era o selecionado
                showVehicleManagementSection();
            }
        }
    }

    // --- LOG MANAGEMENT (Generic and Specific) ---

    function addGenericLog(vehicleId, logType, logData, renderFunction) {
        const vehicle = getVehicleById(vehicleId);
        if (vehicle) {
            vehicle[logType].push(logData);
            vehicle[logType].sort((a, b) => new Date(b.date) - new Date(a.date) || b.km - a.km); // Sort by date desc, then km desc
            updateVehicleCurrentKM(vehicleId, logData.km);
            saveVehicles();
            if (selectedVehicleId === vehicleId) {
                renderFunction(vehicleId);
                updateMaintenanceAlerts();
                updateDashboardData(); // Atualiza o dashboard
            }
        }
    }

    function deleteGenericLog(vehicleId, logType, logId, renderFunction) {
         if (!confirm('Tem certeza que deseja excluir este registro?')) return;
        const vehicle = getVehicleById(vehicleId);
        if (vehicle) {
            vehicle[logType] = vehicle[logType].filter(log => log.id !== logId);
            saveVehicles();
            if (selectedVehicleId === vehicleId) {
                renderFunction(vehicleId);
                updateMaintenanceAlerts();
                updateDashboardData();
            }
        }
    }

    // Fuel Logs
    function handleAddFuelLog(event) {
        event.preventDefault();
        const newLog = {
            id: generateId(),
            date: fuelDateInput.value,
            km: parseFloat(fuelKmInput.value),
            type: fuelTypeInput.value.trim(),
            liters: parseFloat(fuelLitersInput.value),
            value: parseFloat(fuelValueInput.value),
            station: fuelStationInput.value.trim(),
            notes: fuelNotesInput.value.trim()
        };
        addGenericLog(selectedVehicleId, 'fuelLogs', newLog, renderFuelLogHistory);
        updateQuickAccessConsumptionInfo(selectedVehicleId); // Atualiza info no acesso rápido tbm
        resetForm(addFuelForm);
    }

    function renderFuelLogHistory(vehicleId) {
        const vehicle = getVehicleById(vehicleId);
        fuelLogHistoryTableBody.innerHTML = '';
        if (!vehicle || !vehicle.fuelLogs || vehicle.fuelLogs.length === 0) return;

        const sortedLogs = [...vehicle.fuelLogs].sort((a, b) => new Date(b.date) - new Date(a.date) || b.km - a.km);

        sortedLogs.forEach((log, index) => {
            const row = fuelLogRowTemplate.content.cloneNode(true);
            const cells = row.querySelectorAll('td');
            cells[0].textContent = formatDate(log.date);
            cells[1].textContent = log.km;
            cells[2].textContent = log.type;
            cells[3].textContent = formatNumber(log.liters);
            cells[4].textContent = `R$ ${formatNumber(log.value)}`;

            let consumption = 'N/A';
            if (index < sortedLogs.length - 1) {
                const prevLog = sortedLogs[index + 1]; // O log anterior na ordem cronológica
                consumption = calculateConsumption(log.km, prevLog.km, log.liters);
                consumption = consumption ? formatNumber(consumption) : 'N/A';
            }
            cells[5].textContent = consumption;
            if (consumption !== 'N/A') {
                const consVal = parseFloat(consumption);
                if (consVal < 8) cells[5].classList.add('very-low');
                else if (consVal < 10) cells[5].classList.add('low');
            }

            cells[6].textContent = log.notes || '--';
            row.querySelector('.delete-log-btn').addEventListener('click', () => deleteGenericLog(vehicleId, 'fuelLogs', log.id, renderFuelLogHistory));
            fuelLogHistoryTableBody.appendChild(row);
        });
    }

    function calculateConsumption(currentKm, previousKm, liters) {
        if (liters > 0 && currentKm > previousKm) {
            return (currentKm - previousKm) / liters;
        }
        return null;
    }

    // Tire Logs
    function handleAddTireLog(event) {
        event.preventDefault();
        const newLog = {
            id: generateId(),
            date: tireDateInput.value,
            km: parseFloat(tireKmInput.value),
            frontPsi: parseFloat(tireFrontPsiInput.value),
            rearPsi: parseFloat(tireRearPsiInput.value),
            notes: tireNotesInput.value.trim()
        };
        addGenericLog(selectedVehicleId, 'tireLogs', newLog, renderTireLogHistory);
        resetForm(addTireForm);
    }

    function renderTireLogHistory(vehicleId) {
        const vehicle = getVehicleById(vehicleId);
        tireLogHistoryTableBody.innerHTML = '';
        if (!vehicle || !vehicle.tireLogs || vehicle.tireLogs.length === 0) return;
        vehicle.tireLogs.forEach(log => {
            const row = tireLogRowTemplate.content.cloneNode(true);
            const cells = row.querySelectorAll('td');
            cells[0].textContent = formatDate(log.date);
            cells[1].textContent = log.km;
            cells[2].textContent = formatNumber(log.frontPsi, 1);
            cells[3].textContent = formatNumber(log.rearPsi, 1);
            cells[4].textContent = log.notes || '--';
            row.querySelector('.delete-log-btn').addEventListener('click', () => deleteGenericLog(vehicleId, 'tireLogs', log.id, renderTireLogHistory));
            tireLogHistoryTableBody.appendChild(row);
        });
    }

    // Oil Logs
    function handleAddOilLog(event) {
        event.preventDefault();
        const newLog = {
            id: generateId(),
            date: oilDateInput.value,
            km: parseFloat(oilKmInput.value),
            type: oilTypeInput.value.trim(),
            filter: oilFilterInput.value.trim(),
            nextKm: oilNextKmInput.value ? parseFloat(oilNextKmInput.value) : null,
            nextDate: oilNextDateInput.value || null,
            notes: oilNotesInput.value.trim()
        };
        addGenericLog(selectedVehicleId, 'oilLogs', newLog, renderOilLogHistory);
        resetForm(addOilForm);
    }

    function renderOilLogHistory(vehicleId) {
        const vehicle = getVehicleById(vehicleId);
        oilLogHistoryTableBody.innerHTML = '';
        if (!vehicle || !vehicle.oilLogs || vehicle.oilLogs.length === 0) return;
        vehicle.oilLogs.forEach(log => {
            const row = oilLogRowTemplate.content.cloneNode(true);
            const cells = row.querySelectorAll('td');
            cells[0].textContent = formatDate(log.date);
            cells[1].textContent = log.km;
            cells[2].textContent = log.type || '--';
            cells[3].textContent = log.filter || '--';
            cells[4].textContent = log.nextKm || '--';
            cells[5].textContent = log.nextDate ? formatDate(log.nextDate) : '--';
            cells[6].textContent = log.notes || '--';
            row.querySelector('.delete-log-btn').addEventListener('click', () => deleteGenericLog(vehicleId, 'oilLogs', log.id, renderOilLogHistory));
            oilLogHistoryTableBody.appendChild(row);
        });
    }

    // Revision Logs
    function handleAddRevisionLog(event) {
        event.preventDefault();
        const newLog = {
            id: generateId(),
            date: revisionDateInput.value,
            km: parseFloat(revisionKmInput.value),
            items: revisionItemsInput.value.trim(),
            nextKm: revisionNextKmInput.value ? parseFloat(revisionNextKmInput.value) : null,
            nextDate: revisionNextDateInput.value || null,
            notes: revisionNotesInput.value.trim()
        };
        addGenericLog(selectedVehicleId, 'revisionLogs', newLog, renderRevisionLogHistory);
        resetForm(addRevisionForm);
    }

    function renderRevisionLogHistory(vehicleId) {
        const vehicle = getVehicleById(vehicleId);
        revisionLogHistoryTableBody.innerHTML = '';
        if (!vehicle || !vehicle.revisionLogs || vehicle.revisionLogs.length === 0) return;
        vehicle.revisionLogs.forEach(log => {
            const row = revisionLogRowTemplate.content.cloneNode(true);
            const cells = row.querySelectorAll('td');
            cells[0].textContent = formatDate(log.date);
            cells[1].textContent = log.km;
            cells[2].textContent = log.items;
            cells[3].textContent = log.nextKm || '--';
            cells[4].textContent = log.nextDate ? formatDate(log.nextDate) : '--';
            cells[5].textContent = log.notes || '--';
            row.querySelector('.delete-log-btn').addEventListener('click', () => deleteGenericLog(vehicleId, 'revisionLogs', log.id, renderRevisionLogHistory));
            revisionLogHistoryTableBody.appendChild(row);
        });
    }

    function renderAllLogsForSelectedVehicle() {
        if (!selectedVehicleId) return;
        renderFuelLogHistory(selectedVehicleId);
        renderTireLogHistory(selectedVehicleId);
        renderOilLogHistory(selectedVehicleId);
        renderRevisionLogHistory(selectedVehicleId);
    }

    // --- ALERTS & DASHBOARD ---
    function updateMaintenanceAlerts() {
        maintenanceAlertsList.innerHTML = '';
        const vehicle = getVehicleById(selectedVehicleId);
        if (!vehicle) {
             maintenanceAlertsList.innerHTML = '<li class="placeholder">Nenhum veículo selecionado.</li>';
             return;
        }

        let alertsFound = false;
        const today = new Date();
        today.setHours(0,0,0,0); // Normalizar para comparação de datas
        const currentKm = vehicle.currentKM || 0;

        // Alertas de Óleo
        if (vehicle.oilLogs && vehicle.oilLogs.length > 0) {
            const lastOilLog = vehicle.oilLogs[0]; // Já estão ordenados
            if (lastOilLog.nextKm && currentKm >= lastOilLog.nextKm - 500) { // Alerta 500km antes
                const kmRemaining = lastOilLog.nextKm - currentKm;
                const alertClass = kmRemaining <=0 ? 'alert-date' : 'alert-km'; // Vermelho se passou, azul se próximo
                addAlert(`Troca de óleo ${kmRemaining <= 0 ? 'vencida' : 'em'} ${Math.abs(kmRemaining)} KM (Próxima: ${lastOilLog.nextKm} KM)`, alertClass);
                alertsFound = true;
            }
            if (lastOilLog.nextDate) {
                const nextDate = new Date(lastOilLog.nextDate);
                nextDate.setDate(nextDate.getDate() + 1); // Ajuste de fuso
                const diffTime = nextDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays <= 7) { // Alerta 7 dias antes
                     const alertClass = diffDays <=0 ? 'alert-date' : 'alert-km';
                     addAlert(`Troca de óleo ${diffDays <= 0 ? 'vencida' : 'em'} ${Math.abs(diffDays)} dia(s) (Data: ${formatDate(lastOilLog.nextDate)})`, alertClass);
                     alertsFound = true;
                }
            }
        }

        // Alertas de Revisão
        if (vehicle.revisionLogs && vehicle.revisionLogs.length > 0) {
            const lastRevisionLog = vehicle.revisionLogs[0];
            if (lastRevisionLog.nextKm && currentKm >= lastRevisionLog.nextKm - 1000) { // Alerta 1000km antes
                const kmRemaining = lastRevisionLog.nextKm - currentKm;
                const alertClass = kmRemaining <=0 ? 'alert-date' : 'alert-km';
                addAlert(`Revisão ${kmRemaining <= 0 ? 'vencida' : 'em'} ${Math.abs(kmRemaining)} KM (Próxima: ${lastRevisionLog.nextKm} KM)`, alertClass);
                alertsFound = true;
            }
            if (lastRevisionLog.nextDate) {
                const nextDate = new Date(lastRevisionLog.nextDate);
                nextDate.setDate(nextDate.getDate() + 1); // Ajuste de fuso
                const diffTime = nextDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                 if (diffDays <= 15) { // Alerta 15 dias antes
                    const alertClass = diffDays <=0 ? 'alert-date' : 'alert-km';
                    addAlert(`Revisão ${diffDays <= 0 ? 'vencida' : 'em'} ${Math.abs(diffDays)} dia(s) (Data: ${formatDate(lastRevisionLog.nextDate)})`, alertClass);
                    alertsFound = true;
                }
            }
        }

        if (!alertsFound) {
            maintenanceAlertsList.innerHTML = '<li class="placeholder">Nenhum alerta ativo.</li>';
        }
    }

    function addAlert(message, typeClass = '') {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        if (typeClass) li.classList.add(typeClass);
        maintenanceAlertsList.appendChild(li);
    }


    function updateDashboardData() {
        const vehicle = getVehicleById(selectedVehicleId);
        if (!vehicle) {
            avgConsumptionDisplay.textContent = '-- KM/L';
            avgKmMonthDisplay.textContent = '-- KM';
            monthlySpendingDisplay.textContent = 'R$ --';
            yearlySpendingDisplay.textContent = 'R$ --';
            return;
        }

        // Consumo Médio Geral (simplificado - média de todos os consumos calculados)
        let totalConsumption = 0;
        let consumptionCount = 0;
        if (vehicle.fuelLogs && vehicle.fuelLogs.length > 1) {
            const sortedFuel = [...vehicle.fuelLogs].sort((a, b) => a.km - b.km);
            for (let i = 1; i < sortedFuel.length; i++) {
                const cons = calculateConsumption(sortedFuel[i].km, sortedFuel[i-1].km, sortedFuel[i].liters);
                if (cons) {
                    totalConsumption += cons;
                    consumptionCount++;
                }
            }
        }
        avgConsumptionDisplay.textContent = consumptionCount > 0 ? `${formatNumber(totalConsumption / consumptionCount)} KM/L` : '-- KM/L';

        // Gasto Total (Mês Atual e Ano Atual) - Simplificado, considera apenas abastecimentos
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentFullYear = now.getFullYear();
        let monthSpending = 0;
        let yearSpending = 0;

        if (vehicle.fuelLogs) {
            vehicle.fuelLogs.forEach(log => {
                const logDate = new Date(log.date);
                if (logDate.getFullYear() === currentFullYear) {
                    yearSpending += log.value || 0;
                    if (logDate.getMonth() === currentMonth) {
                        monthSpending += log.value || 0;
                    }
                }
            });
        }
        // Adicionar outros custos (óleo, revisão) se quiser um dashboard mais completo
        // ...

        monthlySpendingDisplay.textContent = `R$ ${formatNumber(monthSpending)}`;
        yearlySpendingDisplay.textContent = `R$ ${formatNumber(yearSpending)}`;

        // KM Médio / Mês (Mais complexo, precisa de histórico maior, placeholder)
        avgKmMonthDisplay.textContent = '-- KM'; // TODO: Implementar lógica mais robusta
    }

    function renderCharts() {
        const vehicle = getVehicleById(selectedVehicleId);
        if (!vehicle) return;

        // Destruir gráficos antigos se existirem
        if (fuelConsumptionChartInstance) fuelConsumptionChartInstance.destroy();
        if (spendingDistributionChartInstance) spendingDistributionChartInstance.destroy();

        // Lógica para popular dados dos gráficos (placeholder)
        // Isso exigiria agrupar dados por mês/tipo de gasto
        const fuelCtx = document.getElementById('fuel-consumption-chart').getContext('2d');
        fuelConsumptionChartInstance = new Chart(fuelCtx, {
            type: 'bar', // ou 'line'
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'], // Exemplo
                datasets: [{
                    label: 'Consumo Médio (KM/L)',
                    data: [10.5, 11.2, 10.8, 11.5, 10.2, 11.0], // Exemplo
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });

        const spendingCtx = document.getElementById('spending-distribution-chart').getContext('2d');
        spendingDistributionChartInstance = new Chart(spendingCtx, {
            type: 'pie', // ou 'doughnut'
            data: {
                labels: ['Combustível', 'Óleo/Filtros', 'Revisões', 'Pneus'], // Exemplo
                datasets: [{
                    label: 'Distribuição de Gastos',
                    data: [300, 50, 150, 80], // Exemplo
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
             options: { responsive: true, maintainAspectRatio: false }
        });
    }


    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        themeToggle.addEventListener('click', toggleTheme);
        
        addVehicleForm.addEventListener('submit', handleAddVehicle);
        quickAddFuelForm.addEventListener('submit', handleQuickAccessFuelSubmit);
        quickFuelVehicleSelect.addEventListener('change', (e) => updateQuickAccessConsumptionInfo(e.target.value));

        backToVehiclesButton.addEventListener('click', showVehicleManagementSection);
        maintenanceNav.addEventListener('click', switchMaintenanceTab);

        addFuelForm.addEventListener('submit', handleAddFuelLog);
        addTireForm.addEventListener('submit', handleAddTireLog);
        addOilForm.addEventListener('submit', handleAddOilLog);
        addRevisionForm.addEventListener('submit', handleAddRevisionLog);
    }

    // --- START THE APP ---
    init();
});