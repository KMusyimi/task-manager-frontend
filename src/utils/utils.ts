export const defaultColors = ['#89CFF0', "#6495ED", "#5D3FD3", '#CCCCFF', '#96DED1', '#F8C8DC', '#DC143C', '#D8BFD8', "#93C572", '#FFDEAD', "#E0115F", "#27907A"]



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