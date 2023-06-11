/** @format */
export const generrateCode = (value) => {
  let output = '';
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ')
    .forEach((item) => {
      output += item.charAt(1) + item.charAt(0);
    });
  return output.toUpperCase() + value.length;
};
// console.log(generrateCode('Xin chào việt nam'));
