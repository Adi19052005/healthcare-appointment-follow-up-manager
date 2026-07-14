import Card from './ui/Card';

export default function DataTable({ headers, rows, renderRow }) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/5">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-medium text-slate-300">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((row, index) => (
              <tr key={index} className="bg-transparent hover:bg-white/5">
                {renderRow(row)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
