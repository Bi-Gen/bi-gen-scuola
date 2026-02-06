import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  LayoutDashboard, Users, CreditCard, Utensils, School, FileText,
  Menu, X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Clock, Bus, BookOpen, GraduationCap, UserCheck, Euro, Calendar,
  ChevronRight
} from 'lucide-react';
import data from './data.json';

// Color palette - Emerald/Teal theme
const COLORS = {
  primary: '#10b981',
  primaryDark: '#059669',
  secondary: '#14b8a6',
  accent: '#f59e0b',
  danger: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  chart: ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#8b5cf6']
};

// Sidebar Component
function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Panoramica' },
    { path: '/studenti', icon: Users, label: 'Studenti' },
    { path: '/rette', icon: CreditCard, label: 'Rette' },
    { path: '/servizi', icon: Utensils, label: 'Servizi' },
    { path: '/classi', icon: School, label: 'Classi' },
    { path: '/reportistica', icon: FileText, label: 'Reportistica' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="p-6 border-b border-emerald-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="font-bold text-lg">{data.scuola.nome}</h1>
                <p className="text-xs text-emerald-300">{data.scuola.annoScolastico}</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? 'bg-emerald-700 text-white'
                    : 'text-emerald-200 hover:bg-emerald-700/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

// Header Component
function GlobalHeader({ onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-600" />
            <span className="font-semibold text-gray-800">{data.scuola.nome}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:block">{data.scuola.citta}</span>
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-emerald-600 font-semibold text-sm">SM</span>
          </div>
        </div>
      </div>
    </header>
  );
}

// KPI Card Component
function KPICard({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'emerald' }) {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-600',
    teal: 'bg-teal-50 text-teal-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className={`p-2 lg:p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="mt-3 lg:mt-4">
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

// Alert Card Component
function AlertCard({ type, title, description, count }) {
  const styles = {
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-500' },
    danger: { bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle, iconColor: 'text-red-500' },
    success: { bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle, iconColor: 'text-green-500' },
  };
  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 flex items-start gap-3`}>
      <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
          {count && <span className="text-sm font-semibold text-gray-700">{count}</span>}
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
}

// ============ PANORAMICA PAGE ============
function PanoramicaPage() {
  const stats = useMemo(() => {
    const studentiAttivi = data.studenti.filter(s => s.stato === 'attivo').length;
    const rettePagate = data.rette.filter(r => r.stato === 'pagata');
    const retteNonPagate = data.rette.filter(r => r.stato === 'non_pagata');
    const totaleIncassato = rettePagate.reduce((sum, r) => sum + r.importo, 0);
    const totaleInsoluto = retteNonPagate.reduce((sum, r) => sum + r.importo, 0);
    const tassoMorosita = ((retteNonPagate.length / data.rette.length) * 100).toFixed(1);

    const mensaAttivi = data.servizi.mensa.filter(m => m.attivo).length;
    const trasportoAttivi = data.servizi.trasporto.filter(t => t.attivo).length;
    const doposcuolaAttivi = data.servizi.doposcuola.filter(d => d.attivo).length;

    const revenueServizi =
      data.servizi.mensa.reduce((sum, m) => sum + m.costoMensile, 0) +
      data.servizi.trasporto.reduce((sum, t) => sum + t.costoMensile, 0) +
      data.servizi.doposcuola.reduce((sum, d) => sum + d.costoMensile, 0);

    return {
      studentiAttivi,
      totaleIncassato,
      totaleInsoluto,
      tassoMorosita,
      mensaAttivi,
      trasportoAttivi,
      doposcuolaAttivi,
      revenueServizi,
      retteNonPagate: retteNonPagate.length
    };
  }, []);

  const studentiPerLivello = useMemo(() => {
    const perLivello = {};
    data.studenti.forEach(s => {
      const classe = data.classi.find(c => c.id === s.classeId);
      if (classe) {
        perLivello[classe.livello] = (perLivello[classe.livello] || 0) + 1;
      }
    });
    return Object.entries(perLivello).map(([name, value]) => ({ name, value }));
  }, []);

  const trendIscrizioni = [
    { mese: 'Set', iscritti: 125 },
    { mese: 'Ott', iscritti: 128 },
    { mese: 'Nov', iscritti: 128 },
    { mese: 'Dic', iscritti: 129 },
    { mese: 'Gen', iscritti: 130 },
    { mese: 'Feb', iscritti: 130 },
  ];

  const trendIncassi = [
    { mese: 'Set', incassi: 52000 },
    { mese: 'Ott', incassi: 54000 },
    { mese: 'Nov', incassi: 53500 },
    { mese: 'Dic', incassi: 55000 },
    { mese: 'Gen', incassi: 56000 },
    { mese: 'Feb', incassi: 48000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Panoramica</h1>
        <span className="text-sm text-gray-500">Anno Scolastico {data.scuola.annoScolastico}</span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Studenti Iscritti"
          value={stats.studentiAttivi}
          subtitle="Totale attivi"
          icon={Users}
          trend="up"
          trendValue="+4%"
          color="emerald"
        />
        <KPICard
          title="Rette Incassate"
          value={`€${(stats.totaleIncassato / 1000).toFixed(1)}k`}
          subtitle="Anno corrente"
          icon={Euro}
          trend="up"
          trendValue="+8%"
          color="teal"
        />
        <KPICard
          title="Tasso Morosita"
          value={`${stats.tassoMorosita}%`}
          subtitle={`${stats.retteNonPagate} rate insolute`}
          icon={AlertTriangle}
          color="amber"
        />
        <KPICard
          title="Revenue Servizi"
          value={`€${(stats.revenueServizi / 1000).toFixed(1)}k`}
          subtitle="Mensile"
          icon={Utensils}
          color="blue"
        />
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AlertCard
          type="warning"
          title="Rette in Scadenza"
          description="Rate in scadenza nei prossimi 7 giorni"
          count="15"
        />
        <AlertCard
          type="danger"
          title="Pagamenti Insoluti"
          description="Studenti con rate non pagate"
          count={stats.retteNonPagate}
        />
        <AlertCard
          type="success"
          title="Frequenza Media"
          description="Tasso di presenza mensile"
          count="91%"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Iscrizioni */}
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Trend Iscrizioni</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendIscrizioni}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mese" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="iscritti"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuzione per Livello */}
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Studenti per Livello</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={studentiPerLivello}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {studentiPerLivello.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Incassi */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Trend Incassi Mensili</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trendIncassi}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="mese" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `€${v/1000}k`} />
            <Tooltip formatter={(value) => [`€${value.toLocaleString()}`, 'Incassi']} />
            <Bar dataKey="incassi" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Servizi Quick Stats */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Servizi Attivi</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg">
            <Utensils className="w-10 h-10 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.mensaAttivi}</p>
              <p className="text-sm text-gray-600">Iscritti Mensa</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-lg">
            <Bus className="w-10 h-10 text-teal-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.trasportoAttivi}</p>
              <p className="text-sm text-gray-600">Iscritti Trasporto</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <BookOpen className="w-10 h-10 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.doposcuolaAttivi}</p>
              <p className="text-sm text-gray-600">Iscritti Doposcuola</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ STUDENTI PAGE ============
function StudentiPage() {
  const [filterLivello, setFilterLivello] = useState('Tutti');
  const livelli = ['Tutti', ...new Set(data.classi.map(c => c.livello))];

  const studentiWithClasse = useMemo(() => {
    return data.studenti.map(s => {
      const classe = data.classi.find(c => c.id === s.classeId);
      return { ...s, classe };
    });
  }, []);

  const filteredStudenti = useMemo(() => {
    if (filterLivello === 'Tutti') return studentiWithClasse;
    return studentiWithClasse.filter(s => s.classe?.livello === filterLivello);
  }, [studentiWithClasse, filterLivello]);

  // Stats calcolate sui dati FILTRATI
  const stats = useMemo(() => {
    const maschi = filteredStudenti.filter(s => s.genere === 'M').length;
    const femmine = filteredStudenti.filter(s => s.genere === 'F').length;
    const nuoveIscrizioni2025 = filteredStudenti.filter(s => s.dataIscrizione.startsWith('2025')).length;
    return { maschi, femmine, nuoveIscrizioni2025, totale: filteredStudenti.length };
  }, [filteredStudenti]);

  const distribuzioneGenere = useMemo(() => [
    { name: 'Maschi', value: stats.maschi },
    { name: 'Femmine', value: stats.femmine },
  ], [stats]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Studenti</h1>
        <select
          value={filterLivello}
          onChange={(e) => setFilterLivello(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
        >
          {livelli.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Totale Studenti"
          value={stats.totale}
          icon={Users}
          color="emerald"
        />
        <KPICard
          title="Nuovi 2025"
          value={stats.nuoveIscrizioni2025}
          subtitle="Nuove iscrizioni"
          icon={UserCheck}
          trend="up"
          trendValue="+12%"
          color="teal"
        />
        <KPICard
          title="Maschi"
          value={stats.maschi}
          subtitle={`${((stats.maschi / stats.totale) * 100).toFixed(0)}%`}
          icon={Users}
          color="blue"
        />
        <KPICard
          title="Femmine"
          value={stats.femmine}
          subtitle={`${((stats.femmine / stats.totale) * 100).toFixed(0)}%`}
          icon={Users}
          color="amber"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Distribuzione per Genere</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={distribuzioneGenere}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#ec4899" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Studenti per Classe {filterLivello !== 'Tutti' ? `(${filterLivello})` : ''}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.classi
              .filter(c => filterLivello === 'Tutti' || c.livello === filterLivello)
              .map(c => ({
                nome: c.nome.replace(' Primaria', '').replace(' Secondaria', '').replace('Infanzia ', ''),
                studenti: filteredStudenti.filter(s => s.classeId === c.id).length,
                capienza: c.capienza
              }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="nome" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="studenti" fill={COLORS.primary} name="Iscritti" radius={[4, 4, 0, 0]} />
              <Bar dataKey="capienza" fill="#e5e7eb" name="Capienza" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Elenco Studenti ({filteredStudenti.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Studente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Classe</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Data Nascita</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Iscrizione</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudenti.slice(0, 20).map((studente) => (
                <tr key={studente.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        studente.genere === 'M' ? 'bg-blue-500' : 'bg-pink-500'
                      }`}>
                        {studente.nome[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{studente.nome} {studente.cognome}</p>
                        <p className="text-xs text-gray-500 sm:hidden">{studente.classe?.nome}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{studente.classe?.nome}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{studente.dataNascita}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{studente.dataIscrizione}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      studente.stato === 'attivo'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {studente.stato}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudenti.length > 20 && (
          <div className="p-4 border-t border-gray-100 text-center">
            <span className="text-sm text-gray-500">Mostrati 20 di {filteredStudenti.length} studenti</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ RETTE PAGE ============
function RettePage() {
  const [filterStato, setFilterStato] = useState('Tutti');

  const retteWithStudente = useMemo(() => {
    return data.rette.map(r => {
      const studente = data.studenti.find(s => s.id === r.studenteId);
      return { ...r, studente };
    });
  }, []);

  const filteredRette = useMemo(() => {
    if (filterStato === 'Tutti') return retteWithStudente;
    return retteWithStudente.filter(r => r.stato === filterStato);
  }, [retteWithStudente, filterStato]);

  // Stats globali (sempre su tutti i dati per avere il quadro completo)
  const globalStats = useMemo(() => {
    const pagate = data.rette.filter(r => r.stato === 'pagata');
    const nonPagate = data.rette.filter(r => r.stato === 'non_pagata');
    const totaleIncassato = pagate.reduce((sum, r) => sum + r.importo, 0);
    const totaleInsoluto = nonPagate.reduce((sum, r) => sum + r.importo, 0);
    const tassoIncasso = ((pagate.length / data.rette.length) * 100).toFixed(1);

    const oggi = new Date('2026-02-06');
    const fra7giorni = new Date(oggi);
    fra7giorni.setDate(fra7giorni.getDate() + 7);

    const inScadenza = data.rette.filter(r => {
      const scadenza = new Date(r.scadenza);
      return r.stato === 'non_pagata' && scadenza >= oggi && scadenza <= fra7giorni;
    }).length;

    return { pagate: pagate.length, nonPagate: nonPagate.length, totaleIncassato, totaleInsoluto, tassoIncasso, inScadenza };
  }, []);

  // Stats filtrate per i KPI dinamici
  const filteredStats = useMemo(() => {
    const pagate = filteredRette.filter(r => r.stato === 'pagata');
    const nonPagate = filteredRette.filter(r => r.stato === 'non_pagata');
    const totaleImporto = filteredRette.reduce((sum, r) => sum + r.importo, 0);
    const totaleIncassato = pagate.reduce((sum, r) => sum + r.importo, 0);
    const totaleInsoluto = nonPagate.reduce((sum, r) => sum + r.importo, 0);

    return {
      totale: filteredRette.length,
      pagate: pagate.length,
      nonPagate: nonPagate.length,
      totaleImporto,
      totaleIncassato,
      totaleInsoluto
    };
  }, [filteredRette]);

  const statusData = [
    { name: 'Pagate', value: globalStats.pagate },
    { name: 'Non Pagate', value: globalStats.nonPagate },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Gestione Rette</h1>
        <select
          value={filterStato}
          onChange={(e) => setFilterStato(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
        >
          <option value="Tutti">Tutti gli stati</option>
          <option value="pagata">Pagate</option>
          <option value="non_pagata">Non Pagate</option>
        </select>
      </div>

      {/* KPI - mostrano i dati filtrati */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={filterStato === 'Tutti' ? 'Totale Incassato' : filterStato === 'pagata' ? 'Importo Pagato' : 'Importo Insoluto'}
          value={`€${(filterStato === 'non_pagata' ? filteredStats.totaleInsoluto : filteredStats.totaleIncassato).toLocaleString()}`}
          subtitle={`${filteredStats.totale} rate ${filterStato !== 'Tutti' ? 'filtrate' : 'totali'}`}
          icon={Euro}
          trend={filterStato === 'Tutti' ? 'up' : undefined}
          trendValue={filterStato === 'Tutti' ? '+5%' : undefined}
          color="emerald"
        />
        <KPICard
          title="Totale Insoluto"
          value={`€${globalStats.totaleInsoluto.toLocaleString()}`}
          subtitle={`${globalStats.nonPagate} rate`}
          icon={AlertTriangle}
          color="red"
        />
        <KPICard
          title="Tasso Incasso"
          value={`${globalStats.tassoIncasso}%`}
          icon={CheckCircle}
          color="teal"
        />
        <KPICard
          title="In Scadenza"
          value={globalStats.inScadenza}
          subtitle="Prossimi 7 giorni"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Alerts for unpaid */}
      {globalStats.nonPagate > 0 && filterStato !== 'pagata' && (
        <AlertCard
          type="danger"
          title="Attenzione: Rate Insolute"
          description={`Ci sono ${globalStats.nonPagate} rate non pagate per un totale di €${globalStats.totaleInsoluto.toLocaleString()}`}
        />
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Stato Pagamenti</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill={COLORS.success} />
                <Cell fill={COLORS.danger} />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Incassi per Mese</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { mese: 'Gen', incassi: 3600, insoluti: 900 },
              { mese: 'Feb', incassi: 1350, insoluti: 900 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mese" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `€${v}`} />
              <Tooltip formatter={(value) => `€${value}`} />
              <Legend />
              <Bar dataKey="incassi" fill={COLORS.success} name="Incassati" radius={[4, 4, 0, 0]} />
              <Bar dataKey="insoluti" fill={COLORS.danger} name="Insoluti" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rette Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Elenco Rate ({filteredRette.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Studente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Mese</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Importo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Scadenza</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRette.map((retta) => (
                <tr key={retta.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {retta.studente?.nome} {retta.studente?.cognome}
                      </p>
                      <p className="text-xs text-gray-500 sm:hidden">{retta.mese}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{retta.mese}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">€{retta.importo}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{retta.scadenza}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      retta.stato === 'pagata'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {retta.stato === 'pagata' ? 'Pagata' : 'Non pagata'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ SERVIZI PAGE ============
function ServiziPage() {
  const [activeTab, setActiveTab] = useState('mensa');

  const stats = useMemo(() => {
    const mensaAttivi = data.servizi.mensa.filter(m => m.attivo).length;
    const mensaRevenue = data.servizi.mensa.reduce((sum, m) => sum + m.costoMensile, 0);
    const mensaPasti = data.servizi.mensa.reduce((sum, m) => sum + m.pasti, 0);

    const trasportoAttivi = data.servizi.trasporto.filter(t => t.attivo).length;
    const trasportoRevenue = data.servizi.trasporto.reduce((sum, t) => sum + t.costoMensile, 0);

    const doposcuolaAttivi = data.servizi.doposcuola.filter(d => d.attivo).length;
    const doposcuolaRevenue = data.servizi.doposcuola.reduce((sum, d) => sum + d.costoMensile, 0);
    const doposcuolaOre = data.servizi.doposcuola.reduce((sum, d) => sum + d.oreSett, 0);

    const totalRevenue = mensaRevenue + trasportoRevenue + doposcuolaRevenue;

    return {
      mensaAttivi, mensaRevenue, mensaPasti,
      trasportoAttivi, trasportoRevenue,
      doposcuolaAttivi, doposcuolaRevenue, doposcuolaOre,
      totalRevenue
    };
  }, []);

  const revenuePerServizio = [
    { name: 'Mensa', value: stats.mensaRevenue },
    { name: 'Trasporto', value: stats.trasportoRevenue },
    { name: 'Doposcuola', value: stats.doposcuolaRevenue },
  ];

  const trasportoPerTratta = useMemo(() => {
    const tratte = {};
    data.servizi.trasporto.filter(t => t.attivo).forEach(t => {
      tratte[t.tratta] = (tratte[t.tratta] || 0) + 1;
    });
    return Object.entries(tratte).map(([name, value]) => ({ name, value }));
  }, []);

  const tabs = [
    { id: 'mensa', label: 'Mensa', icon: Utensils },
    { id: 'trasporto', label: 'Trasporto', icon: Bus },
    { id: 'doposcuola', label: 'Doposcuola', icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Servizi Accessori</h1>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Revenue Totale"
          value={`€${stats.totalRevenue.toLocaleString()}`}
          subtitle="Mensile"
          icon={Euro}
          color="emerald"
        />
        <KPICard
          title="Mensa"
          value={stats.mensaAttivi}
          subtitle={`€${stats.mensaRevenue}/mese`}
          icon={Utensils}
          color="teal"
        />
        <KPICard
          title="Trasporto"
          value={stats.trasportoAttivi}
          subtitle={`€${stats.trasportoRevenue}/mese`}
          icon={Bus}
          color="blue"
        />
        <KPICard
          title="Doposcuola"
          value={stats.doposcuolaAttivi}
          subtitle={`€${stats.doposcuolaRevenue}/mese`}
          icon={BookOpen}
          color="amber"
        />
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Revenue per Servizio</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={revenuePerServizio}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: €${value}`}
              >
                {revenuePerServizio.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.chart[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `€${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Trasporto per Tratta</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trasportoPerTratta}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill={COLORS.secondary} name="Iscritti" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 lg:px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-4">
          {activeTab === 'mensa' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-700">{stats.mensaAttivi}</p>
                  <p className="text-sm text-emerald-600">Iscritti</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-700">{stats.mensaPasti}</p>
                  <p className="text-sm text-emerald-600">Pasti Erogati</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-700">€{stats.mensaRevenue}</p>
                  <p className="text-sm text-emerald-600">Revenue Mensile</p>
                </div>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Studente</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pasti</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.servizi.mensa.filter(m => m.attivo).map((m) => {
                    const studente = data.studenti.find(s => s.id === m.studenteId);
                    return (
                      <tr key={m.studenteId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{studente?.nome} {studente?.cognome}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{m.pasti}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">€{m.costoMensile}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'trasporto' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-teal-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-teal-700">{stats.trasportoAttivi}</p>
                  <p className="text-sm text-teal-600">Iscritti</p>
                </div>
                <div className="bg-teal-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-teal-700">€{stats.trasportoRevenue}</p>
                  <p className="text-sm text-teal-600">Revenue Mensile</p>
                </div>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Studente</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tratta</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.servizi.trasporto.filter(t => t.attivo).map((t) => {
                    const studente = data.studenti.find(s => s.id === t.studenteId);
                    return (
                      <tr key={t.studenteId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{studente?.nome} {studente?.cognome}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{t.tratta}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">€{t.costoMensile}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'doposcuola' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">{stats.doposcuolaAttivi}</p>
                  <p className="text-sm text-blue-600">Iscritti</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">{stats.doposcuolaOre}</p>
                  <p className="text-sm text-blue-600">Ore Settimanali</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">€{stats.doposcuolaRevenue}</p>
                  <p className="text-sm text-blue-600">Revenue Mensile</p>
                </div>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Studente</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ore/Sett</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.servizi.doposcuola.filter(d => d.attivo).map((d) => {
                    const studente = data.studenti.find(s => s.id === d.studenteId);
                    return (
                      <tr key={d.studenteId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{studente?.nome} {studente?.cognome}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{d.oreSett}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">€{d.costoMensile}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ CLASSI PAGE ============
function ClassiPage() {
  const [filterLivello, setFilterLivello] = useState('Tutti');
  const livelli = ['Tutti', ...new Set(data.classi.map(c => c.livello))];

  const classiWithStats = useMemo(() => {
    return data.classi.map(c => {
      const studenti = data.studenti.filter(s => s.classeId === c.id);
      const occupazione = ((studenti.length / c.capienza) * 100).toFixed(0);
      return { ...c, studenti: studenti.length, occupazione };
    });
  }, []);

  const filteredClassi = useMemo(() => {
    if (filterLivello === 'Tutti') return classiWithStats;
    return classiWithStats.filter(c => c.livello === filterLivello);
  }, [classiWithStats, filterLivello]);

  // Stats calcolate sui dati FILTRATI
  const stats = useMemo(() => {
    const totaleClassi = filteredClassi.length;
    const capienzaTotale = filteredClassi.reduce((sum, c) => sum + c.capienza, 0);
    const studentiTotali = filteredClassi.reduce((sum, c) => sum + c.studenti, 0);
    const occupazioneMedia = capienzaTotale > 0 ? ((studentiTotali / capienzaTotale) * 100).toFixed(0) : '0';

    // Docenti filtrati per livello
    const docentiLivello = filterLivello === 'Tutti'
      ? data.docenti
      : data.docenti.filter(d => d.livello === filterLivello || d.livello === 'Tutti');
    const totaleDocenti = docentiLivello.length;
    const rapportoStudentiDocenti = totaleDocenti > 0 ? (studentiTotali / totaleDocenti).toFixed(1) : '0';

    return { totaleClassi, totaleDocenti, occupazioneMedia, rapportoStudentiDocenti, studentiTotali };
  }, [filteredClassi, filterLivello]);

  // Occupazione per livello - usa i dati filtrati
  const occupazionePerLivello = useMemo(() => {
    const perLivello = {};
    filteredClassi.forEach(c => {
      if (!perLivello[c.livello]) {
        perLivello[c.livello] = { studenti: 0, capienza: 0 };
      }
      perLivello[c.livello].studenti += c.studenti;
      perLivello[c.livello].capienza += c.capienza;
    });
    return Object.entries(perLivello).map(([name, v]) => ({
      name,
      occupazione: ((v.studenti / v.capienza) * 100).toFixed(0)
    }));
  }, [filteredClassi]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Classi e Docenti</h1>
        <select
          value={filterLivello}
          onChange={(e) => setFilterLivello(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
        >
          {livelli.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Totale Classi"
          value={stats.totaleClassi}
          icon={School}
          color="emerald"
        />
        <KPICard
          title="Totale Docenti"
          value={stats.totaleDocenti}
          icon={GraduationCap}
          color="teal"
        />
        <KPICard
          title="Occupazione Media"
          value={`${stats.occupazioneMedia}%`}
          icon={Users}
          color="blue"
        />
        <KPICard
          title="Rapporto Studenti/Docente"
          value={stats.rapportoStudentiDocenti}
          icon={UserCheck}
          color="amber"
        />
      </div>

      {/* Occupazione Chart */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Occupazione per Livello</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={occupazionePerLivello} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="occupazione" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Classi Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClassi.map((classe) => (
          <div key={classe.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">{classe.nome}</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${
                parseInt(classe.occupazione) >= 90 ? 'bg-red-100 text-red-700' :
                parseInt(classe.occupazione) >= 70 ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }`}>
                {classe.occupazione}%
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Livello</span>
                <span className="text-gray-900">{classe.livello}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Studenti</span>
                <span className="text-gray-900">{classe.studenti} / {classe.capienza}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Aula</span>
                <span className="text-gray-900">{classe.aulaId}</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    parseInt(classe.occupazione) >= 90 ? 'bg-red-500' :
                    parseInt(classe.occupazione) >= 70 ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${classe.occupazione}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Docenti Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">
            Corpo Docente {filterLivello !== 'Tutti' ? `(${filterLivello})` : ''} ({stats.totaleDocenti})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Docente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Materia</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Livello</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ore/Sett</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.docenti
                .filter(d => filterLivello === 'Tutti' || d.livello === filterLivello || d.livello === 'Tutti')
                .map((docente) => (
                <tr key={docente.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-medium text-sm">
                          {docente.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{docente.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{docente.materia}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{docente.livello}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{docente.oreSett}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ REPORTISTICA PAGE ============
function ReportisticaPage() {
  const trendAnnuale = [
    { anno: '21/22', studenti: 115, rette: 495000, servizi: 85000 },
    { anno: '22/23', studenti: 120, rette: 520000, servizi: 92000 },
    { anno: '23/24', studenti: 125, rette: 545000, servizi: 98000 },
    { anno: '24/25', studenti: 128, rette: 560000, servizi: 105000 },
    { anno: '25/26', studenti: 130, rette: 585000, servizi: 112000 },
  ];

  const confrontoMensile = [
    { mese: 'Set', anno_corrente: 52000, anno_precedente: 48000 },
    { mese: 'Ott', anno_corrente: 54000, anno_precedente: 50000 },
    { mese: 'Nov', anno_corrente: 53500, anno_precedente: 49500 },
    { mese: 'Dic', anno_corrente: 55000, anno_precedente: 51000 },
    { mese: 'Gen', anno_corrente: 56000, anno_precedente: 52000 },
  ];

  const frequenzaPerLivello = [
    { livello: 'Infanzia', frequenza: 92 },
    { livello: 'Primaria', frequenza: 94 },
    { livello: 'Secondaria I', frequenza: 89 },
  ];

  const stats = useMemo(() => {
    const crescitaStudenti = (((130 - 115) / 115) * 100).toFixed(0);
    const crescitaRette = (((585000 - 495000) / 495000) * 100).toFixed(0);
    return { crescitaStudenti, crescitaRette };
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Reportistica e Trend</h1>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Crescita Studenti"
          value={`+${stats.crescitaStudenti}%`}
          subtitle="Ultimi 5 anni"
          icon={TrendingUp}
          color="emerald"
        />
        <KPICard
          title="Crescita Rette"
          value={`+${stats.crescitaRette}%`}
          subtitle="Ultimi 5 anni"
          icon={Euro}
          trend="up"
          trendValue="+18%"
          color="teal"
        />
        <KPICard
          title="Retention Rate"
          value="96%"
          subtitle="Re-iscrizioni"
          icon={UserCheck}
          color="blue"
        />
        <KPICard
          title="Frequenza Media"
          value="92%"
          subtitle="Anno corrente"
          icon={Calendar}
          color="amber"
        />
      </div>

      {/* Trend Storico */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Trend Storico (5 anni)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trendAnnuale}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="anno" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(v) => `€${v/1000}k`} />
            <Tooltip formatter={(value, name) => [
              name === 'studenti' ? value : `€${value.toLocaleString()}`,
              name === 'studenti' ? 'Studenti' : name === 'rette' ? 'Rette' : 'Servizi'
            ]} />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="studenti" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Studenti" />
            <Area yAxisId="right" type="monotone" dataKey="rette" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} name="Rette" />
            <Area yAxisId="right" type="monotone" dataKey="servizi" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} name="Servizi" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Confronto YoY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Confronto Incassi YoY</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={confrontoMensile}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mese" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `€${v/1000}k`} />
              <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="anno_precedente" fill="#94a3b8" name="24/25" radius={[4, 4, 0, 0]} />
              <Bar dataKey="anno_corrente" fill={COLORS.primary} name="25/26" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Frequenza per Livello</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={frequenzaPerLivello} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="livello" tick={{ fontSize: 12 }} width={100} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="frequenza" fill={COLORS.secondary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <h4 className="font-semibold mb-2">Punto di Forza</h4>
          <p className="text-sm opacity-90">Alta retention rate (96%) e crescita costante degli studenti negli ultimi 5 anni.</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
          <h4 className="font-semibold mb-2">Area di Attenzione</h4>
          <p className="text-sm opacity-90">Tasso di morosita in aumento. Monitorare i pagamenti e valutare piani rateali.</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h4 className="font-semibold mb-2">Opportunita</h4>
          <p className="text-sm opacity-90">Espandere i servizi accessori (doposcuola, attivita extra) per aumentare il revenue.</p>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN APP ============
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col lg:ml-0">
          <GlobalHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<PanoramicaPage />} />
              <Route path="/studenti" element={<StudentiPage />} />
              <Route path="/rette" element={<RettePage />} />
              <Route path="/servizi" element={<ServiziPage />} />
              <Route path="/classi" element={<ClassiPage />} />
              <Route path="/reportistica" element={<ReportisticaPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
