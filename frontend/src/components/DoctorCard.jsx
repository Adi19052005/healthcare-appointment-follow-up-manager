import Card from './ui/Card';
import { memo } from 'react';

function DoctorCardInner({ doctor, onSelect }) {
  return (
    <button onClick={() => onSelect?.(doctor)} className="w-full text-left">
      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-ink">{doctor?.name || "Doctor"}</h3>
            <p className="mt-1 text-sm text-body">{doctor?.specialization || "Specialist"}</p>
          </div>
          <span className="badge">Available</span>
        </div>
      </Card>
    </button>
  );
}

export default memo(DoctorCardInner);
