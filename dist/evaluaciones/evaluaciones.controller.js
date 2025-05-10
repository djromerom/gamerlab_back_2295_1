"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluacionesController = void 0;
const common_1 = require("@nestjs/common");
const evaluaciones_service_1 = require("./evaluaciones.service");
const ExcelJS = require("exceljs");
let EvaluacionesController = class EvaluacionesController {
    evaluacionesService;
    constructor(evaluacionesService) {
        this.evaluacionesService = evaluacionesService;
    }
    async getConsolidacionesTodosVideojuegos() {
        return this.evaluacionesService.listarConsolidacionesVideojuegos();
    }
    async getConsolidacionEvaluacion(id_videojuego) {
        return this.evaluacionesService.consolidarEvaluaciones(id_videojuego);
    }
    async getEvaluacionesVideojuego(id_videojuego) {
        return this.evaluacionesService.obtenerEvaluacionesVideojuego(id_videojuego);
    }
    async getJurados() {
        return this.evaluacionesService.obtenerJurados();
    }
    async getDashboard() {
        const consolidaciones = await this.evaluacionesService.listarConsolidacionesVideojuegos();
        const jurados = await this.evaluacionesService.obtenerJurados();
        const totalJurados = jurados.length;
        const ranking = [...consolidaciones].sort((a, b) => b.promedio_total - a.promedio_total);
        const criterios = Array.from(new Set(consolidaciones.flatMap(c => c.criterios.map(k => k.nombre))));
        const progreso = consolidaciones.map(c => ({
            id_videojuego: c.id_videojuego,
            nombre_videojuego: c.nombre_videojuego,
            jurados_evaluaron: c.total_evaluaciones,
            total_jurados: totalJurados,
            porcentaje_completado: Math.round((c.total_evaluaciones / totalJurados) * 100),
        }));
        return {
            title: 'Dashboard de Evaluaciones',
            consolidaciones,
            rankingVideojuegos: ranking,
            criterios,
            progresoEvaluaciones: progreso,
        };
    }
    async getDetalleEvaluacion(id) {
        return {
            title: 'Detalle de Evaluación',
            id_videojuego: id,
        };
    }
    async getAnalytics() {
        const consolidaciones = await this.evaluacionesService.listarConsolidacionesVideojuegos();
        const top3Videojuegos = [...consolidaciones]
            .sort((a, b) => b.promedio_total - a.promedio_total)
            .slice(0, 3)
            .map(vj => ({
            nombre: vj.nombre_videojuego,
            promedio: vj.promedio_total,
            equipo: vj.equipo,
        }));
        const materiasAgrupadas = consolidaciones.reduce((acc, curr) => {
            const nrcs = curr.nrc;
            if (!nrcs || nrcs.length === 0)
                return acc;
            nrcs.forEach(nrc => {
                if (!acc[nrc]) {
                    acc[nrc] = {
                        nrc: `NRC ${nrc}`,
                        promedioSum: 0,
                        cantidad: 0,
                    };
                }
                acc[nrc].promedioSum += curr.promedio_total;
                acc[nrc].cantidad += 1;
            });
            return acc;
        }, {});
        const distribucionPorMateria = Object.values(materiasAgrupadas).map(grupo => ({
            nrc: grupo.nrc,
            promedio: +(grupo.promedioSum / grupo.cantidad).toFixed(2),
            cantidad: grupo.cantidad,
        }));
        return {
            top3Videojuegos,
            distribucionPorMateria,
        };
    }
    async exportarExcel(res) {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Evaluaciones');
        const evaluaciones = await this.evaluacionesService.obtenerEvaluacionesConDetalle();
        const todosLosCriterios = Array.from(new Set(evaluaciones.flatMap(ev => ev.criterios.map(c => c.nombre))));
        const encabezados = [
            'Videojuego',
            'Jurado',
            ...todosLosCriterios,
            'Promedio',
            'Comentario',
            'Fecha',
        ];
        sheet.addRow(encabezados);
        sheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFEFEFEF' },
            };
        });
        for (const ev of evaluaciones) {
            const fila = [ev.videojuegoNombre, ev.juradoNombre];
            for (const nombreCriterio of todosLosCriterios) {
                const criterio = ev.criterios.find(c => c.nombre === nombreCriterio);
                let valor = '';
                if (criterio && criterio.valoracion !== undefined && !isNaN(Number(criterio.valoracion))) {
                    valor = parseFloat(criterio.valoracion).toFixed(2);
                }
                fila.push(valor);
            }
            const fechaFormateada = new Date(ev.fecha).toLocaleString();
            fila.push(ev.promedio, ev.comentario, fechaFormateada);
            sheet.addRow(fila);
        }
        sheet.columns.forEach((column) => {
            if (!column)
                return;
            let maxLength = 10;
            column.eachCell?.({ includeEmpty: true }, (cell) => {
                const text = cell.value ? cell.value.toString() : '';
                maxLength = Math.max(maxLength, text.length);
            });
            column.width = maxLength + 2;
        });
        const buffer = await workbook.xlsx.writeBuffer();
        res.end(buffer);
    }
    async exportarPDF(res) {
        const PDFDocument = require('pdfkit');
        const axios = require('axios');
        const fs = require('fs');
        const path = require('path');
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        doc.pipe(res);
        const fontPath = path.join(__dirname, '..', 'assets', 'fonts', 'OpenSans-Regular.ttf');
        if (fs.existsSync(fontPath)) {
            doc.registerFont('OpenSans', fontPath);
            doc.font('OpenSans');
        }
        try {
            doc.fontSize(20).text('Reporte de Evaluaciones', { align: 'center' });
            doc.moveDown(2);
            const evaluaciones = await this.evaluacionesService.obtenerEvaluacionesConDetalle();
            const distribucion = await this.evaluacionesService.obtenerDistribucionPorMateria();
            for (const ev of evaluaciones) {
                doc
                    .fontSize(12)
                    .text(`Videojuego: ${ev.videojuegoNombre}`)
                    .text(`Jurado: ${ev.juradoNombre}`);
                for (const criterio of ev.criterios) {
                    doc.text(`   • ${criterio.nombre}: ${criterio.valoracion}`);
                }
                doc
                    .text(`Promedio: ${ev.promedio}`)
                    .text(`Comentario: ${ev.comentario || '-'}`)
                    .text(`Fecha: ${new Date(ev.fecha).toLocaleString()}`)
                    .moveDown(1.5);
            }
            doc.moveDown(1);
            const ranking = [...evaluaciones]
                .sort((a, b) => parseFloat(b.promedio) - parseFloat(a.promedio))
                .slice(0, 3);
            doc.fontSize(16).text('Top 3 Videojuegos con Mejor Evaluación');
            doc.moveDown();
            ranking.forEach((r, i) => {
                doc.fontSize(12).text(`${i + 1}. ${r.videojuegoNombre} - Promedio: ${r.promedio}`);
            });
            doc.moveDown(2);
            try {
                const chartPromediosConfig = {
                    type: 'bar',
                    data: {
                        labels: evaluaciones.map(e => e.videojuegoNombre),
                        datasets: [{
                                label: 'Promedio',
                                data: evaluaciones.map(e => parseFloat(e.promedio)),
                                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                            }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 5,
                                title: { display: true, text: 'Promedio' }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: 'Promedios por Videojuego'
                            }
                        }
                    }
                };
                const chartUrl = `https://quickchart.io/chart?width=600&height=300&c=${encodeURIComponent(JSON.stringify(chartPromediosConfig))}`;
                const chartResponse = await axios.get(chartUrl, { responseType: 'arraybuffer' });
                if (chartResponse.data) {
                    doc.fontSize(16).text('Gráfico: Promedios por Videojuego');
                    doc.moveDown(0.5);
                    doc.image(chartResponse.data, {
                        fit: [500, 250],
                        align: 'center',
                        valign: 'center',
                    });
                    doc.moveDown(2);
                }
            }
            catch (error) {
                console.error('Error al cargar gráfico de promedios:', error.message);
                doc.fontSize(12).fillColor('red').text('❌ Error al cargar gráfico de promedios.');
            }
            if (Array.isArray(distribucion) && distribucion.length > 0) {
                try {
                    const chartDistribucionConfig = {
                        type: 'bar',
                        data: {
                            labels: distribucion.map(d => d.nrc),
                            datasets: [
                                {
                                    label: 'Promedio por NRC',
                                    data: distribucion.map(d => d.promedio),
                                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                                    yAxisID: 'y',
                                },
                                {
                                    label: 'Cantidad de Videojuegos',
                                    data: distribucion.map(d => d.cantidad),
                                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                                    yAxisID: 'y1',
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    position: 'left',
                                    max: 5,
                                    title: { display: true, text: 'Promedio' }
                                },
                                y1: {
                                    beginAtZero: true,
                                    position: 'right',
                                    grid: { drawOnChartArea: false },
                                    title: { display: true, text: 'Cantidad' }
                                }
                            },
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Distribución por Materia (NRC)',
                                }
                            }
                        }
                    };
                    const distribucionUrl = `https://quickchart.io/chart?width=600&height=300&c=${encodeURIComponent(JSON.stringify(chartDistribucionConfig))}`;
                    const distribucionChartResponse = await axios.get(distribucionUrl, { responseType: 'arraybuffer' });
                    if (distribucionChartResponse.data) {
                        doc.fontSize(16).text('Gráfico: Distribución por NRC');
                        doc.moveDown(0.5);
                        doc.image(distribucionChartResponse.data, {
                            fit: [500, 250],
                            align: 'center',
                            valign: 'center',
                        });
                    }
                }
                catch (error) {
                    console.error('Error al cargar gráfico NRC:', error.message);
                    doc.fontSize(12).fillColor('red').text('❌ Error al cargar gráfico de distribución NRC.');
                    doc.moveDown(1);
                    doc.fontSize(14).fillColor('black').text('Tabla: Distribución por Materia (NRC)');
                    distribucion.forEach(d => {
                        doc.fontSize(12).text(`- ${d.nrc}: Promedio ${d.promedio}, Cantidad ${d.cantidad}`);
                    });
                }
            }
            else {
                doc.fontSize(12).text('No hay datos de distribución por NRC para mostrar.');
            }
            doc.end();
        }
        catch (error) {
            console.error('Error general en exportarPDF:', error);
            doc.text('❌ Error generando el reporte PDF.');
            doc.end();
        }
    }
};
exports.EvaluacionesController = EvaluacionesController;
__decorate([
    (0, common_1.Get)('consolidacion'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EvaluacionesController.prototype, "getConsolidacionesTodosVideojuegos", null);
__decorate([
    (0, common_1.Get)('consolidacion/:id_videojuego'),
    __param(0, (0, common_1.Param)('id_videojuego', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EvaluacionesController.prototype, "getConsolidacionEvaluacion", null);
__decorate([
    (0, common_1.Get)('evaluaciones/:id_videojuego'),
    __param(0, (0, common_1.Param)('id_videojuego', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EvaluacionesController.prototype, "getEvaluacionesVideojuego", null);
__decorate([
    (0, common_1.Get)('jurados'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EvaluacionesController.prototype, "getJurados", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, common_1.Render)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EvaluacionesController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('detalle'),
    (0, common_1.Render)('evaluacion-detalle'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EvaluacionesController.prototype, "getDetalleEvaluacion", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EvaluacionesController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('exportar/excel'),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename=evaluaciones.xlsx'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EvaluacionesController.prototype, "exportarExcel", null);
__decorate([
    (0, common_1.Get)('exportar/pdf'),
    (0, common_1.Header)('Content-Type', 'application/pdf'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename=evaluaciones.pdf'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EvaluacionesController.prototype, "exportarPDF", null);
exports.EvaluacionesController = EvaluacionesController = __decorate([
    (0, common_1.Controller)('evaluaciones'),
    __metadata("design:paramtypes", [evaluaciones_service_1.EvaluacionesService])
], EvaluacionesController);
//# sourceMappingURL=evaluaciones.controller.js.map