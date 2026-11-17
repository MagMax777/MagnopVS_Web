import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { usePlayer } from '../../context/PlayerContext';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  UserCheck,
  FileText,
  Globe,
  AlertCircle,
  CheckCircle2,
  Key,
  Smartphone,
} from 'lucide-react';

export const MfsSecurityKycTab: React.FC = () => {
  const { kycProfile, submitKycApplication } = useFinancial();
  const { player, playSoundEffect } = usePlayer();

  const [fullName, setFullName] = useState<string>(kycProfile.fullName || player.name);
  const [documentType, setDocumentType] = useState<any>(kycProfile.documentType || 'NATIONAL_ID');
  const [documentNumber, setDocumentNumber] = useState<string>(kycProfile.documentNumber || '');
  const [country, setCountry] = useState<string>(kycProfile.country || 'COL');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const isVerified = kycProfile.status === 'VERIFIED';

  const handleSubmitKyc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !documentNumber.trim()) return;

    setIsSubmitting(true);
    playSoundEffect('quest');

    setTimeout(() => {
      submitKycApplication({
        fullName,
        documentType,
        documentNumber,
        country,
      });
      setIsSubmitting(false);
      setFeedback('¡Solicitud de verificación KYC aprobada y vinculada a tu cuenta!');
    }, 800);
  };

  return (
    <div className="space-y-6 font-orbitron animate-fade-in text-[#f8f9fa]">
      
      {/* Header Info */}
      <div className="p-4 bg-[#0a0d14] border border-[#1f2430] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#00f0ff] font-mono uppercase font-bold tracking-widest block">
            CUMPLIMIENTO & SEGURIDAD // KYC & AML
          </span>
          <h3 className="text-lg font-bold font-audiowide text-white">
            Verificación de Identidad & Seguridad Financiera
          </h3>
          <p className="text-xs text-[#a0a5b5] mt-0.5">
            Mantenemos un ecosistema libre de fraude y lavado de activos mediante verificación oficial.
          </p>
        </div>

        <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 ${
          isVerified
            ? 'bg-[#7fffd4]/15 border-[#7fffd4] text-[#7fffd4]'
            : 'bg-[#ffd700]/15 border-[#ffd700] text-[#ffd700]'
        }`}>
          {isVerified ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>ESTADO: {kycProfile.status}</span>
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-[#7fffd4]/15 border border-[#7fffd4] rounded-2xl text-xs font-mono text-[#7fffd4] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Verification Level & Limits Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-[#0a0d14] border border-[#1f2430] rounded-2xl space-y-1">
          <span className="text-[10px] text-[#a0a5b5] font-mono block">NIVEL DE CUMPLIMIENTO</span>
          <div className="text-base font-bold font-audiowide text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#00f0ff]" />
            <span>Nivel {kycProfile.verificationLevel} (Estándar)</span>
          </div>
        </div>

        <div className="p-4 bg-[#0a0d14] border border-[#1f2430] rounded-2xl space-y-1">
          <span className="text-[10px] text-[#a0a5b5] font-mono block">LÍMITE DIARIO DE RETIRO</span>
          <div className="text-base font-bold font-audiowide text-[#7fffd4] font-mono">
            ${kycProfile.dailyWithdrawalLimitUsd.toLocaleString()} USD
          </div>
        </div>

        <div className="p-4 bg-[#0a0d14] border border-[#1f2430] rounded-2xl space-y-1">
          <span className="text-[10px] text-[#a0a5b5] font-mono block">LÍMITE MENSUAL DE RETIRO</span>
          <div className="text-base font-bold font-audiowide text-[#7fffd4] font-mono">
            ${kycProfile.monthlyWithdrawalLimitUsd.toLocaleString()} USD
          </div>
        </div>
      </div>

      {/* KYC Form */}
      <div className="p-5 bg-[#0a0d14] border border-[#1f2430] rounded-2xl space-y-4">
        <span className="text-xs font-bold font-audiowide text-white flex items-center gap-2 border-b border-[#1f2430] pb-2">
          <FileText className="w-4 h-4 text-[#00f0ff]" />
          <span>Datos de Identificación del Titular</span>
        </span>

        <form onSubmit={handleSubmitKyc} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="sm:col-span-2">
            <label className="text-[10px] text-[#a0a5b5] block mb-1">NOMBRE COMPLETO (TAL COMO APARECE EN TU DOCUMENTO)</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-2.5 text-white rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#a0a5b5] block mb-1">TIPO DE DOCUMENTO</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full bg-[#05060a] border border-[#1f2430] p-2.5 text-white rounded-xl focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="NATIONAL_ID">Cédula de Ciudadanía / DNI</option>
              <option value="PASSPORT">Pasaporte Internacional</option>
              <option value="DRIVERS_LICENSE">Licencia de Conducción</option>
              <option value="TAX_ID">Identificación Fiscal / RUT / RFC</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-[#a0a5b5] block mb-1">NÚMERO DE DOCUMENTO</label>
            <input
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="Ej: 1098452310"
              required
              className="w-full bg-[#05060a] border border-[#1f2430] focus:border-[#00f0ff] p-2.5 text-white rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#a0a5b5] block mb-1">PAÍS DE RESIDENCIA</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-[#05060a] border border-[#1f2430] p-2.5 text-white rounded-xl focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="COL">Colombia (COL)</option>
              <option value="USA">Estados Unidos (USA)</option>
              <option value="MEX">México (MEX)</option>
              <option value="BRA">Brasil (BRA)</option>
              <option value="ESP">España (ESP)</option>
              <option value="ARG">Argentina (ARG)</option>
              <option value="CHL">Chile (CHL)</option>
              <option value="PER">Perú (PER)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 text-xs font-bold uppercase text-[#05060a] bg-gradient-to-r from-[#00f0ff] to-[#7fffd4] hover:opacity-90 rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              {isSubmitting ? 'Verificando con Proveedor...' : isVerified ? 'Actualizar Datos Verificados' : 'Enviar para Verificación'}
            </button>
          </div>
        </form>
      </div>

      {/* Security Policies Box */}
      <div className="p-4 bg-[#0a0d14] border border-[#1f2430] rounded-2xl flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-[#7fffd4]" />
          <div>
            <strong className="text-white block">Autenticación de Dos Factores (2FA)</strong>
            <span className="text-[10px] text-[#a0a5b5]">Protección criptográfica habilitada para transacciones y retiros.</span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#7fffd4]/15 border border-[#7fffd4] text-[#7fffd4]">
          ACTIVADO
        </span>
      </div>

    </div>
  );
};
