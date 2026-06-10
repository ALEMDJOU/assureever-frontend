const stats = [
  { value: "25 680", label: "Assurés actifs",          suffix: "" },
  { value: "1 245",  label: "Médecins enregistrés",    suffix: "" },
  { value: "8 923",  label: "Consultations / mois",    suffix: "" },
  { value: "2,45",   label: "Millions FCFA remboursés",suffix: "M" },
];

export default function Stats() {
  return (
    <section className="py-14 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                {s.value}
                <span className="text-white/70 text-2xl">{s.suffix}</span>
              </div>
              <p className="text-white/70 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
