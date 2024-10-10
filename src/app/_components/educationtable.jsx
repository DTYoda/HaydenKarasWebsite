export default function EdcuationTable({ currentCategory, tableContent }) {
  return (
    <div>
      <table className="border-4 divide-y divide-gray-200 dark:divide-neutral-700 max-w-7xl w-[100vw] h-[90%]">
        <thead>
          {currentCategory == "coursework" && (
            <tr>
              <th className="w-[50%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">
                Class
              </th>
              <th className="w-[25%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">
                Year
              </th>
              <th className="w-[25%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">
                Grade
              </th>
            </tr>
          )}

          {currentCategory == "certifications" && (
            <tr>
              <th className="w-[50%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">
                Certification
              </th>
              <th className="w-[25%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">
                Year
              </th>
              <th className="w-[25%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">
                Company
              </th>
            </tr>
          )}

          {currentCategory == "courses" && (
            <tr>
              <th className="w-[50%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">
                Course
              </th>
              <th className="w-[25%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">
                Year
              </th>
              <th className="w-[25%] px-6 py-3 text-start text-xs font-medium uppercase text-neutral-500">
                Company
              </th>
            </tr>
          )}
        </thead>

        <tbody>
          {tableContent[currentCategory].map((row, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900 dark:text-neutral-400">
                {row[0]}
              </td>
              <td>{row[1]}</td>
              <td>{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
