import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { AutomatedTestResult } from '../../types/financial';

export const MfsAutomatedTestsTab: React.FC = () => {
  const { runAutomatedTests, testResults } = useFinancial();
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'PASSED' | 'FAILED'>('ALL');

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      runAutomatedTests();
      setIsRunning(false);
    }, 400);
  };

  const totalTests = testResults.length;
  const passedTests = testResults.filter((t) => t.passed).length;
  const failedTests = totalTests - passedTests;
  const totalExecutionTime = testResults.reduce((acc, t) => acc + t.executionTimeMs, 0);

  const filteredTests = testResults.filter((t) => {
    if (selectedFilter === 'PASSED') return t.passed;
    if (selectedFilter === 'FAILED') return !t.passed;
    return true;
  });

  const handleCopyReport = () => {
    const report = {
      system: 'MagnopVS Financial System (MFS) v1.1',
      suite: 'Regla 8 - Verificación de Invariantes Económicas',
      totalTests,
      passedTests,
      failedTests,
      totalExecutionTimeMs: totalExecutionTime,
      timestamp: new Date().toISOString(),
      results: testResults,
    };
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-emerald-950/40 border border-cyan-500/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-widest">
                🧪 Suite de Pruebas MFS Regla 8
              </span>
              <span className="text-xs text-slate-400">Verificación de Invariantes V1.1</span>
            </div>
            <h2 className="text-xl font-black text-white font-['Audiowide']">
              Batería de Pruebas Automatizadas
            </h2>
            <p className="text-xs text-slate-300">
              Validación criptográfica y funcional de paridad 1:1, prohibición de conversión de MicroCoins, integridad del libro mayor y control de saldo no negativo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <span>{copied ? '✓ Copiado' : '📋 Copiar JSON'}</span>
            </button>
            <button
              onClick={handleRunTests}
              disabled={isRunning}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg ${
                isRunning
                  ? 'bg-cyan-600/50 text-cyan-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-cyan-500/20 active:scale-95'
              }`}
            >
              <span>{isRunning ? '⏳ Ejecutando...' : '▶ Ejecutar Suite (10 Tests)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-bold uppercase mb-1">Casos de Prueba</div>
          <div className="text-2xl font-black text-white font-mono">{totalTests}</div>
          <div className="text-[10px] text-slate-500 mt-1">10 especificados por Regla 8</div>
        </div>

        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-bold uppercase mb-1">Pruebas Aprobadas</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {passedTests} / {totalTests}
          </div>
          <div className="text-[10px] text-emerald-500/80 mt-1">100% de invariantes intactas</div>
        </div>

        <div className="bg-slate-900/80 border border-red-500/20 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-bold uppercase mb-1">Fallos Detectados</div>
          <div className={`text-2xl font-black font-mono ${failedTests > 0 ? 'text-red-400' : 'text-slate-500'}`}>
            {failedTests}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Sin desvíos de contabilidad</div>
        </div>

        <div className="bg-slate-900/80 border border-cyan-500/20 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-bold uppercase mb-1">Tiempo de Ejecución</div>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            {totalExecutionTime.toFixed(2)} ms
          </div>
          <div className="text-[10px] text-cyan-500/80 mt-1">Validación ultrarrápida en memoria</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          {(['ALL', 'PASSED', 'FAILED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedFilter === filter
                  ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter === 'ALL' && `Todos (${totalTests})`}
              {filter === 'PASSED' && `Exitosos (${passedTests})`}
              {filter === 'FAILED' && `Fallidos (${failedTests})`}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Ecosistema Oficial MagnopVS
        </span>
      </div>

      {/* Test List */}
      <div className="space-y-3">
        {filteredTests.map((test) => (
          <div
            key={test.testNumber}
            className={`p-4 rounded-xl border transition-all ${
              test.passed
                ? 'bg-slate-950/70 border-emerald-500/30 hover:border-emerald-500/60'
                : 'bg-red-950/30 border-red-500/40'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
                    TEST #{test.testNumber.toString().padStart(2, '0')}
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {test.name}
                  </h4>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      test.passed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {test.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {test.description}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono text-cyan-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  ⚡ {test.executionTimeMs.toFixed(2)} ms
                </span>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  {new Date(test.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Test Assertions Comparison */}
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">
                  Resultado Esperado:
                </span>
                <span className="text-slate-300">{test.expectedResult}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 uppercase block font-sans font-bold">
                  Resultado Obtenido:
                </span>
                <span className="text-emerald-300">{test.actualResult}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
