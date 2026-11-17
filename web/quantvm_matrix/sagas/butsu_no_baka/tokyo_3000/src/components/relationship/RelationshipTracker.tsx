import React from 'react';
import { StoryState } from '../../types/game';

interface RelationshipTrackerProps {
  storyState: StoryState;
  compact?: boolean;
}

export const RelationshipTracker: React.FC<RelationshipTrackerProps> = ({
  storyState,
  compact = false,
}) => {
  const { attachment, liberation } = storyState;

  // Determine current bond tendency
  let statusLabel = 'Equilibrio Inicial (0/0)';
  let statusColor = '#777B89';
  let endingTrajectory = 'Indeterminada (Define el lazo con tus elecciones)';

  if (attachment === 0 && liberation === 0) {
    statusLabel = 'Lazo Neutro · Inicio del Ciclo';
    statusColor = '#777B89';
  } else if (attachment > liberation + 8) {
    statusLabel = 'Apego Intenso · Miedo a la Pérdida';
    statusColor = '#62B8E8';
    endingTrajectory = 'Hacia Final I: El Vínculo (Eternidad sin Libertad)';
  } else if (liberation > attachment + 8) {
    statusLabel = 'Liberación Lúcida · Voluntad de Autonomía';
    statusColor = '#75F0D3';
    endingTrajectory = 'Hacia Final II: La Resistencia (Ruptura del Bucle)';
  } else {
    statusLabel = 'Tensión en Resonancia · Paradoja Abierta';
    statusColor = '#D34DAA';
    endingTrajectory = 'Hacia Final III: La Fractura (Colapso del Tiempo)';
  }

  if (compact) {
    return (
      <div className="bg-[#151722]/90 border border-[#62B8E8]/40 px-3 py-1.5 rounded-lg text-xs font-cyber flex items-center space-x-3 shadow-md">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#62B8E8]" />
          <span className="text-[#62B8E8]">Apego:</span>
          <span className="text-white font-bold tabular-nums">{attachment}</span>
        </div>
        <div className="w-px h-3 bg-[#252a3d]" />
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#75F0D3]" />
          <span className="text-[#75F0D3]">Liberación:</span>
          <span className="text-white font-bold tabular-nums">{liberation}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#090A0F] border border-[#252a3d] rounded-xl p-4 md:p-5 flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1f2334] pb-2">
        <div className="flex items-center space-x-2">
          <span className="text-base">⚖</span>
          <h4 className="font-display text-xs md:text-sm text-[#F1EEE8] tracking-wider uppercase">
            Sistema de Relación: Yūrei & Yokoi
          </h4>
        </div>
        <span
          className="text-[11px] font-cyber px-2.5 py-0.5 rounded font-bold"
          style={{ backgroundColor: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}50` }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Attachment Bar */}
      <div>
        <div className="flex justify-between items-center text-xs font-cyber mb-1">
          <span className="text-[#62B8E8] font-bold flex items-center space-x-1">
            <span>💙</span>
            <span>Apego Emocional (Yūrei)</span>
          </span>
          <span className="text-white font-bold tabular-nums">{attachment} / 100</span>
        </div>
        <div className="w-full h-2.5 bg-[#151722] rounded-full overflow-hidden border border-[#252a3d]">
          <div
            style={{ width: `${Math.min(100, Math.max(0, attachment))}%` }}
            className="h-full bg-gradient-to-r from-[#62B8E8] to-[#D34DAA] transition-all duration-500"
          />
        </div>
        <p className="text-[10px] text-[#777B89] mt-1 font-manga">
          Aumenta cuando validas el pavor de Yūrei al abandono o cuando Yokoi hace una elección de auto-sacrificio.
        </p>
      </div>

      {/* Liberation Bar */}
      <div>
        <div className="flex justify-between items-center text-xs font-cyber mb-1">
          <span className="text-[#75F0D3] font-bold flex items-center space-x-1">
            <span>🕊</span>
            <span>Liberación & Autonomía (Yokoi)</span>
          </span>
          <span className="text-white font-bold tabular-nums">{liberation} / 100</span>
        </div>
        <div className="w-full h-2.5 bg-[#151722] rounded-full overflow-hidden border border-[#252a3d]">
          <div
            style={{ width: `${Math.min(100, Math.max(0, liberation))}%` }}
            className="h-full bg-gradient-to-r from-[#75F0D3] to-[#62B8E8] transition-all duration-500"
          />
        </div>
        <p className="text-[10px] text-[#777B89] mt-1 font-manga">
          Aumenta cuando Yokoi afirma su independencia o cuando Yūrei reconoce su necesidad de libertad.
        </p>
      </div>

      {/* Trajectory / Ending influence */}
      <div className="p-3 bg-[#151722] rounded-lg border border-[#62B8E8]/30 flex flex-col space-y-1">
        <span className="text-[10px] font-cyber text-[#777B89] uppercase tracking-wider">
          Trayectoria de Desenlace Actual:
        </span>
        <span className="text-xs font-cyber font-bold text-[#F1EEE8]">
          {endingTrajectory}
        </span>
      </div>

      {/* Relationship Log History */}
      {storyState.relationshipEvents && storyState.relationshipEvents.length > 0 && (
        <div className="flex flex-col space-y-1.5 pt-1">
          <span className="text-[10px] font-cyber text-[#777B89] uppercase tracking-wider">
            Últimas Alteraciones del Lazo:
          </span>
          <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
            {storyState.relationshipEvents.slice(-4).reverse().map(evt => (
              <div
                key={evt.id}
                className="text-[11px] font-manga p-2 rounded bg-[#12141d] border-l-2 flex items-center justify-between"
                style={{ borderColor: evt.type === 'ATTACHMENT' ? '#62B8E8' : '#75F0D3' }}
              >
                <span className="text-[#F1EEE8]">{evt.reason}</span>
                <span
                  className="font-cyber font-bold ml-2 text-[10px]"
                  style={{ color: evt.type === 'ATTACHMENT' ? '#62B8E8' : '#75F0D3' }}
                >
                  +{evt.amount} {evt.type === 'ATTACHMENT' ? 'Apego' : 'Lib.'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
