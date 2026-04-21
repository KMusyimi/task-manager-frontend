import type { FormParams } from "../models/entity";




export const IconColors = {
  idle: "#6b7280",      // Gray
  selected: "#3b82f6",  // Blue
  uploading: "#f59e0b", // Amber/Orange
  success: "#10b981",   // Green
  error: "#ef4444"      // Red
};

export function isValidInput(type: string, value: string) {
  switch (type) {
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

function isValidEmail(email: string): boolean {
  const rgx = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  return rgx.test(email);
}


export function capitalize(myStr: string) {
  return myStr.charAt(0).toLocaleUpperCase() + myStr.slice(1,)
}

export async function processFormData(request: Request): Promise<FormParams> {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const payload: FormParams = {};

  Object.keys(data).forEach(el => {
    payload[el] = data[el] as string;
  });
  return payload;
}

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) { return `${bytes.toFixed(1)} Bytes`; }
  else if (bytes < 1048576) { return (bytes / 1024).toFixed(1) + " KB"; }
  else { return (bytes / 1048576).toFixed(1) + " MB" };
};
