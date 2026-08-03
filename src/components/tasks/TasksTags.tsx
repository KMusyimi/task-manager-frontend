import { CSSProperties } from "react";
import { Tag } from "../../models/DashboardModel";

interface TagsParams
{
  tags: Tag[]
}

const tagsWrapperStyles: CSSProperties = {
  alignItems: 'center', gap: '.35em',
  flexFlow: 'row', flexWrap: 'wrap'
}

const tagsStyles: CSSProperties = {
  backgroundColor: 'var(--bg-secondary)',
  border: 'none',

}

export function Tags({ tags }: TagsParams)
{

  return (
    <>
      {!!tags.length && <div className="tags-wrapper el-flx" style={tagsWrapperStyles}>
        {tags.map((tag, index) => (
          <span className="tag-badge pill el-flx" key={`${tag.name}-${index.toString()}`}
            style={{ backgroundColor: tag.color, ...tagsStyles }}>
            <span className="badge-marker tag-marker" style={{ backgroundColor: tag.color }} />
            {tag.name}</span>
        ))}
      </div>}
    </>)
}