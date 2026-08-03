import { memo } from "react";
import Skeleton from "../skeleton/Skeleton";


const SkeletonsArray = Array.from({ length: 3 });

export const SubTasksSkeleton = memo(({ taskID }: { taskID?: number }) =>
{
  const prefix = taskID !== undefined ? String(taskID) : 'empty';
  return <div className="subtask-section el-flx" style={{ flexDirection: 'column', gap: '.5em', paddingInline: '.25em', marginBottom: '.75em' }}>
    {
      SkeletonsArray.map((_, idx) => (
        <div key={`sk-${prefix}-${String(idx)}`} className="el-flx" style={{ gap: ".75em", alignItems: "center"}}>
          <Skeleton type="box" width={16} height={16} />
          <Skeleton type="line" width={'100%'} height={'1em'} />
        </div>))
    }
  </div>;
})







SubTasksSkeleton.displayName = 'SubTasksSkeleton';