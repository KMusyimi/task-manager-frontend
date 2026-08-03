import type { FormParams } from "../models/entity";


export const PRIORITY_SYMBOLS = { "HIGH": "FiChevronUp", "MEDIUM": "FiMinus", "LOW": "FiChevronDown" };
export const TAG_SUGGESTIONS = [
  "design", "frontend", "backend", "tokens", "refactor",
  "bug", "docs", "research", "api", "ux",
];
export const IconColors = {
  idle: "#6b7280",      // Gray
  selected: "#3b82f6",  // Blue
  uploading: "#f59e0b", // Amber/Orange
  success: "#10b981",   // Green
  error: "#ED3159"      // Red
};

export const getColumnCls = (columnName: string) => (columnName.split(' ').join('-').toLocaleLowerCase());


export function isValidInput(type: string, value: string)
{
  switch (type)
  {
    case 'email':
      return isValidEmail(value);
    case 'password':
      {
        const rgx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!.@$%^&*-]).{8,}$/
        return rgx.test(value);
      }
    default:
      return true;
  }
}


export function formatKenyanInternational(phoneNumber: string)
{
  // 1. Strip absolutely everything except numbers
  let digits = phoneNumber.replace(/\D/g, '');

  // 2. If it starts with local 07 or 01, swap the leading 0 for 254
  if (/^0[17]/.test(digits))
  {
    digits = '254' + digits.substring(1);
  }

  // 3. If the field is empty or just a zero, return it as-is so the user can type
  if (digits === '' || digits === '0')
  {
    return phoneNumber;
  }

  // 4. Force '254' prefix if they start typing core numbers directly (like '712...')
  if (!digits.startsWith('254'))
  {
    digits = '254' + digits;
  }

  // 5. Extract the 9 mobile core digits (skipping the '254' prefix at index 0,1,2)
  const coreNumbers = digits.substring(3, 12);

  const part1 = coreNumbers.substring(0, 3);
  const part2 = coreNumbers.substring(3, 6);
  const part3 = coreNumbers.substring(6, 9);

  // 6. Progressive assembly: builds the string step-by-step 
  // so partial numbers format cleanly while typing.
  let formatted = '+254';

  if (part1.length > 0)
  {
    formatted += ' ' + part1;
  }
  if (part2.length > 0)
  {
    formatted += ' ' + part2;
  }
  if (part3.length > 0)
  {
    formatted += ' ' + part3;
  }

  return formatted;
}


function isValidEmail(email: string): boolean
{
  const rgx = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  return rgx.test(email);
}

export function checkDueStatus(startDate: number | null,
  endDate: number | null)
{
  if (!endDate)
  {
    return 'no-deadline';
  }

  const currentDateTime = new Date();

  const endDateTime = new Date(endDate);

  if (isNaN(endDateTime.getTime()))
  {
    return 'no-deadline';
  }

  currentDateTime.setHours(0, 0, 0, 0);
  endDateTime.setHours(0, 0, 0, 0);

  if (endDateTime < currentDateTime)
  {
    return 'overdue';
  }

  if (endDateTime.getTime() === currentDateTime.getTime())
  {
    return 'today';
  }

  return 'upcoming';
}

export function capitalize(myStr: string)
{
  return myStr.charAt(0).toLocaleUpperCase() + myStr.slice(1,).toLocaleLowerCase()
}

export async function processFormData(request: Request): Promise<FormParams>
{
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const payload: FormParams = {};

  Object.keys(data).forEach(el =>
  {
    payload[el] = data[el] as string;
  });
  return payload;
}

