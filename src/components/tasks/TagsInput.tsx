import { CSSProperties, memo, useCallback, useState } from "react";
import { TAG_SUGGESTIONS } from "../../utils/utils";
import { Tag } from "../../models/DashboardModel";
import IconWrapper from "../general/IconWrapper";

interface TagsInputProps
{
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}


const tagsWrapperStyles: CSSProperties = {
  alignItems: 'center', gap: '.35em',
  flexFlow: 'row', flexWrap: 'wrap', marginBottom: '.385em'
}


function TagsInput({ tags, setTags }: TagsInputProps)
{
  const [tagName, setTagName] = useState('');
  const [colorInput, setColorInput] = useState('#3b82f6');
  const [suggestions, setSuggestions] = useState<string[]>();


  const onInput = useCallback((e: React.InputEvent<HTMLInputElement>) =>
  {
    const { value } = e.currentTarget;
    const regex = new RegExp(value, 'i');

    setTagName(value);
    setSuggestions(TAG_SUGGESTIONS.filter(tag => regex.test(tag)));
  }, []);


  const addTag = (tagName: string) =>
  {
    const cleanedText = tagName.trim().replace(/,/g, '');
    const isDuplicate = tags.some(tag => tag.name.toLowerCase() === cleanedText.toLowerCase());

    if (cleanedText && !isDuplicate)
    {
      const newTags = [...tags, { name: cleanedText, color: colorInput }];
      setTags(newTags);
      setTagName('');
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>
  {
    if (e.key === 'Enter' || e.key === ',')
    {
      e.preventDefault();

      addTag(tagName);
    } else if (e.key === 'Backspace' && !tagName && tags.length > 0)
    {
      removeTag(tags.length - 1);
    }
  };

  const removeTag = (indexToRemove: number) =>
  {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };


  return (
    <div className="input-wrapper tags-container">
      {!!tags.length &&
        <div className="selected-tags el-flx" style={tagsWrapperStyles}>

          {tags.map((tag, idx) => (
            <div className="tag-badge pill el-flx"
              key={`${tagName}-${idx.toString()}`}
              style={{
                backgroundColor: 'color-mix(in srgb, var(--primary-grey) 50%, transparent)'
              }}
            >
              <span className="badge-marker tag-marker" style={{ backgroundColor: tag.color }}></span>
              <span>{tag.name}</span>
              <button
                type="button"
                onClick={() => { removeTag(idx) }}
                style={{
                  background: "none",
                  border: "none",
                  fontWeight: "bold",
                  padding: "0 2px",
                  fontSize: "0.75rem",
                  color:'var(--text-color)',
                  display: "inline-flex",
                  alignItems: "center"
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      }
      <div className="tag-wrapper el-flx">
        <input
          type="color"
          name="tagColor"

          id={"tagColor"}
          className="tag-color-picker"
          value={colorInput}
          onChange={(e) => { setColorInput(e.target.value) }}
          title="Choose tag color"
        />
        <IconWrapper name="LuTag" />
        <input
          type="text"
          value={tagName}
          name="tagName"
          id={"tagName"}
          onInput={onInput}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Add tags..." : ""}
          className={'tag-text--input'}
        />
      </div>

      <div  className="el-flx" style={tagsWrapperStyles}>
        {tagName && suggestions?.map((suggestion) => (
          <button className="tag-badge pill" 
          key={suggestion} 
          type="button" 
          onClick={() => { addTag(suggestion) }}>{suggestion}</button>
        ))}
      </div>
    </div>)
}


export default memo(TagsInput);