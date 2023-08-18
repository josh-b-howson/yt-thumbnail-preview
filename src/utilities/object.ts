export const deeplyCloneObject = (obj: Object) => {
  return JSON.parse(JSON.stringify(obj));
}