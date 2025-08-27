const InfoBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-1">
    <p className="text-xs">{label}</p>
    <div className="py-1 px-2 text-gray-700 rounded-md bg-gray-100 text-xs">
      {value}
    </div>
  </div>
)

export default InfoBadge
