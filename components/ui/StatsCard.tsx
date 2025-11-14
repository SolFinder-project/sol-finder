'use client';

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: string;
  color?: 'purple' | 'pink' | 'cyan' | 'green';
}

export default function StatsCard({ title, value, icon, trend, color = 'purple' }: StatsCardProps) {
  const colorClasses = {
    purple: 'from-neon-purple/20 to-neon-purple/5 border-neon-purple/30',
    pink: 'from-neon-pink/20 to-neon-pink/5 border-neon-pink/30',
    cyan: 'from-neon-cyan/20 to-neon-cyan/5 border-neon-cyan/30',
    green: 'from-neon-green/20 to-neon-green/5 border-neon-green/30',
  };

  return (
    <div className={`card-cyber bg-gradient-to-br ${colorClasses[color]} group hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold font-[family-name:var(--font-orbitron)] text-glow">{value}</p>
          {trend && (
            <p className="text-xs text-neon-green mt-1">↗ {trend}</p>
          )}
        </div>
        <div className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
      </div>
    </div>
  );
}
