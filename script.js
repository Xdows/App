function calcularCuota() {
    // Obtener valores del formulario
    const monto = parseFloat(document.getElementById('monto').value);
    const frecuencia = document.getElementById('frecuencia').value;
    const plazo = parseInt(document.getElementById('plazo').value);
    const tasaMensual = parseFloat(document.getElementById('tasa').value) / 100;

    let divisorFrecuencia;
    if (frecuencia === 'semanal') {
        divisorFrecuencia = 4; // Cuatro semanas en un mes
    } else if (frecuencia === 'quincenal') {
        divisorFrecuencia = 2; // Dos quincenas en un mes
    } else if (frecuencia === 'mensual') {
        divisorFrecuencia = 1; // Un mes
    }

    // Cálculo de la cuota
    const cuota = (monto + (tasaMensual * monto * plazo / divisorFrecuencia)) / plazo;

    // Cálculo del Total de Interés
    const totalInteres = tasaMensual * monto * plazo / divisorFrecuencia;

    // Mostrar resultado de la cuota con la frase "La cuota es"
    document.getElementById('resultado').style.display = 'block';
    document.getElementById('resultado').innerHTML = `<strong>S/. ${cuota.toFixed(2)}</strong>`; 

    // Mostrar el Total de Interés con la frase "Total Intereses"
    document.getElementById('totalInteres').style.display = 'block';
    document.getElementById('totalInteres').innerHTML = `<strong>S/. ${totalInteres.toFixed(2)}</strong>`; 

    // Generar el cronograma de pagos
    generarCronograma(plazo, cuota, monto, totalInteres);
}

function generarCronograma(plazo, cuota, monto, totalInteres) {
    const cronogramaBody = document.getElementById('cronograma-body');
    cronogramaBody.innerHTML = ''; // Limpiar cronograma anterior

    let saldo = monto + totalInteres; // Saldo inicial

    for (let i = 1; i <= plazo; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td>S/. ${cuota.toFixed(2)}</td>
            <td>S/. ${Math.max(saldo - cuota, 0).toFixed(2)}</td>
        `;
        cronogramaBody.appendChild(row);
        saldo -= cuota; // Actualizar saldo para la siguiente cuota
    }

    // Asegurarse de que el último saldo sea cero
    if (plazo > 0) {
        const lastRow = cronogramaBody.lastElementChild;
        lastRow.lastElementChild.innerHTML = 'S/. 0.00'; // Ajustar el último saldo a cero
    }
}

function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Capturar los valores del simulador
    const monto = document.getElementById('monto').value;
    const frecuencia = document.getElementById('frecuencia').value;
    const plazo = document.getElementById('plazo').value;
    const tasa = document.getElementById('tasa').value;
    const cuotaTexto = document.getElementById('resultado').innerText;
    const cuota = cuotaTexto.trim();

    const totalInteresTexto = document.getElementById('totalInteres').innerText;
    const totalInteres = totalInteresTexto.trim();

    // Título centrado y en negritas
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('SIMULADOR DE CRÉDITOS FASTCAPITAL', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const lineHeight = 8;
    let y = 40;

    // Datos del simulador
    const marginX = 20; // Margen izquierdo
    const dataX = 70;   // Posición para los datos

    doc.setFont('helvetica', 'bold');
    doc.text('Monto:', marginX, y);
    doc.setFont('helvetica', 'normal');
    doc.text('S/.' + monto, dataX, y); 
    y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text('Frecuencia de Pago:', marginX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(frecuencia, dataX, y); 
    y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text('Plazo:', marginX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(plazo + ' meses', dataX, y); 
    y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text('Tasa de Interés:', marginX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(tasa + '%', dataX, y); 
    y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text('Cuota:', marginX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(cuota.replace(':', '').trim(), dataX, y); 
    y += lineHeight;

    doc.setFont('helvetica', 'bold');
    doc.text('Total Intereses:', marginX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(totalInteres, dataX, y); 

    // Título "PLAN DE PAGOS" centrado y en negritas
    doc.setFont('helvetica', 'bold');
    doc.text('PLAN DE PAGOS', doc.internal.pageSize.getWidth() / 2, y + 20, { align: 'center' });

    // Dibujar la tabla del Plan de Pagos
    const tabla = document.getElementById('cronograma');
    const filas = tabla.querySelectorAll('tr');

    y += 30;

    // Centrar el cuadro en la página
    const tableWidth = 150; 
    const startX = (doc.internal.pageSize.getWidth() - tableWidth) / 2;

    // Dibujar los títulos de la tabla
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Pago', startX, y);
    doc.text('Monto Cuota (S/)', startX + 50, y);
    doc.text('Saldo (S/)', startX + 100, y);

    y += lineHeight;
    doc.setFont('helvetica', 'normal');

    // Reducimos el espacio entre líneas del cuadro
    const cellHeight = 6; 
    let posY = y;
    filas.forEach((fila) => {
        const columnas = fila.querySelectorAll('td');
        let posX = startX;

        columnas.forEach((columna, index) => {
            doc.text(columna.innerText, posX, posY);
            posX += 50; 
        });

        posY += cellHeight;
    });

    // Guardar el PDF con un nombre específico
    doc.save('simulador_credito.pdf');
}
